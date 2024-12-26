import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { signinDTO, signupDTO } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { Role } from 'src/utils/const';
import { EmailService } from 'src/email/email.service';
import { User } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
    private emailService: EmailService,
  ) {}

  async signup(dto: signupDTO) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { phone: dto.phone },
          { userName: dto.userName },
        ],
      },
    });
    if (existingUser) {
      if (existingUser.email === dto.email) {
        throw new ForbiddenException('Email already taken');
      } else if (existingUser.phone === dto.phone) {
        throw new ForbiddenException('Phone number already taken');
      } else if (existingUser.userName === dto.userName) {
        throw new ForbiddenException('UserName already taken');
      }
    }
    const hash = await argon.hash(dto.password);
    const token = await argon.hash(dto.email);
    const newToken = token.replaceAll('/', '');
    const userRole = await this.prisma.role.findUnique({
      where: {
        name: Role.USER,
      },
    });
    if (!userRole) {
      throw new NotFoundException('Role not found');
    }
    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hash,
        roleId: userRole.id,
        token: token,
      },
    });

    await this.emailService.accountConfirmation(user, newToken);
  }
  async activateAccount(token: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: { token: token },
    });
    if (!existingUser) {
      throw new ForbiddenException('Not found user');
    }
    await this.prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        token: null,
        isActive: true,
      },
    });
    return { message: 'Account validate' };
  }
  async signToken(
    user: string,
    role: string,
    time: string,
  ): Promise<{ connexion_token: string; message: string }> {
    const payload = {
      sub: user,
      role: role,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: time,
      secret: secret,
    });
    return {
      connexion_token: token,
      message: 'Connexion successfully',
    };
  }
  async signin(dto: signinDTO) {
    const existingIdentifier = await this.prisma.user.findFirst({
      where: {
        OR: [{ userName: dto.identifiant }, { email: dto.identifiant }],
      },
      include: {
        role: true,
      },
    });
    if (!existingIdentifier) {
      throw new ForbiddenException('Crendential invalid');
    }
    const isValidPassword = await argon.verify(
      existingIdentifier.password,
      dto.password,
    );
    if (isValidPassword) {
      if (existingIdentifier.isActive === false) {
        throw new ForbiddenException(
          'Your account is not activate. Check your mail',
        );
      }
      return await this.signToken(
        existingIdentifier.id,
        existingIdentifier.role.name,
        '30d',
      );
    } else {
      throw new ForbiddenException('Crendential invalid');
    }
  }
}
