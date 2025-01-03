export const enum Role {
  USER = 'User',
  ADMIN = 'Admin',
}
export type userJwt = {
  id: string;
  isActive: boolean;
  role: { name: string };
};
