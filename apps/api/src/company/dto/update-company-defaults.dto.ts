import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RoleEnum } from '@prisma/client';

export class UpdateCompanyDefaultsDto {
  @IsOptional()
  @IsString()
  defaultDepartmentId?: string | null;

  @IsOptional()
  @IsString()
  defaultTeamId?: string | null;

  @IsOptional()
  @IsEnum(RoleEnum)
  defaultMemberRole?: RoleEnum;
}
