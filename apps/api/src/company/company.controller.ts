import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CompanyService } from './company.service';

type CreateCompanyBody = {
  name: string;
};

type JoinCompanyBody = {
  inviteCode: string;
};

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  createCompany(@Body() body: CreateCompanyBody, @Req() req: Request) {
    const { userId, email } = this.getCurrentUser(req);
    return this.companyService.createCompany(body.name, userId, email);
  }

  @Post('join')
  joinCompany(@Body() body: JoinCompanyBody, @Req() req: Request) {
    const { userId, email } = this.getCurrentUser(req);
    return this.companyService.joinCompany(body.inviteCode, userId, email);
  }

  @Get('me')
  getMyCompany(@Req() req: Request) {
    const { userId, email } = this.getCurrentUser(req);
    const user = this.companyService.getOrCreateUser(userId, email);
    const { company } = this.companyService.getCompanyForUser(userId);
    return {
      company,
      role: user.role,
    };
  }

  private getCurrentUser(req: Request) {
    const userIdHeader = req.headers['x-user-id'];
    const emailHeader = req.headers['x-user-email'];
    const userId = Array.isArray(userIdHeader) ? userIdHeader[0] : userIdHeader;
    const email = Array.isArray(emailHeader) ? emailHeader[0] : emailHeader;

    return {
      userId: userId ?? 'demo-user',
      email: email ?? 'demo@example.com',
    };
  }
}
