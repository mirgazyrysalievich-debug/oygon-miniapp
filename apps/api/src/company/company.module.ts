import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
codex/implement-company-and-roles-system

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
import { PrismaService } from '../db/prisma.service';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, PrismaService],
  exports: [CompanyService],
main
})
export class CompanyModule {}
