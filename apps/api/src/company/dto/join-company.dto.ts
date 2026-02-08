import { IsNotEmpty, IsString } from 'class-validator';

export class JoinCompanyDto {
  @IsString()
  @IsNotEmpty()
  inviteCode: string;
}
