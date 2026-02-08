import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AuthenticatedUser } from '../common/interfaces';
import { CompanyService } from './company.service';
import { JoinCompanyDto } from './dto/join-company.dto';
import { UpdateCompanyDefaultsDto } from './dto/update-company-defaults.dto';

@Controller('company')
@UseGuards(RolesGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('invite')
  @Roles('OWNER', 'HR')
  getInviteCode(@Req() request: Request) {
    const user = request.user as AuthenticatedUser;
    return this.companyService.getInviteCode(user);
  }

  @Post('join')
  joinCompany(@Req() request: Request, @Body() body: JoinCompanyDto) {
    const user = request.user as AuthenticatedUser;
    return this.companyService.joinCompany(user, body.inviteCode);
  }

  @Put('defaults')
  @Roles('OWNER', 'HR')
  updateDefaults(@Req() request: Request, @Body() body: UpdateCompanyDefaultsDto) {
    const user = request.user as AuthenticatedUser;
    return this.companyService.updateDefaults(user, body);
  }
}
