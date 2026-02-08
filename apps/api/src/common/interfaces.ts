import { RoleEnum } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  role: RoleEnum;
  companyId?: string | null;
}
