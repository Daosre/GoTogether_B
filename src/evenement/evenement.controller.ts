import { Controller } from '@nestjs/common';
import { EvenementService } from './evenement.service';

@Controller('evenement')
export class EvenementController {
  constructor(private readonly evenementService: EvenementService) {}
}
