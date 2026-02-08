codex/implement-company-and-roles-system
import { Injectable, NotFoundException } from '@nestjs/common';

type Role = 'Owner' | 'HR' | 'Leader' | 'Employee';

type Company = {
  id: string;
  name: string;
  createdAt: Date;
};

type User = {
  id: string;
  email: string;
  role: Role;
  companyId?: string;
  departmentId?: string;
};

@Injectable()
export class CompanyService {
  private companies = new Map<string, Company>();
  private users = new Map<string, User>();

  getOrCreateUser(id: string, email: string): User {
    const existing = this.users.get(id);
    if (existing) {
      return existing;
    }
    const user: User = {
      id,
      email,
      role: 'Employee',
    };
    this.users.set(id, user);
    return user;
  }

  createCompany(name: string, userId: string, email: string) {
    const company: Company = {
      id: this.createId(),
      name,
      createdAt: new Date(),
    };
    this.companies.set(company.id, company);

    const user = this.getOrCreateUser(userId, email);
    user.companyId = company.id;
    user.role = 'Owner';

    return { company, user };
  }

  joinCompany(inviteCode: string, userId: string, email: string) {
    const company = this.companies.get(inviteCode);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const user = this.getOrCreateUser(userId, email);
    user.companyId = company.id;
    if (!user.role || user.role === 'Employee') {
      user.role = 'Employee';
    }

    return { company, user };
  }

  getCompanyForUser(userId: string) {
    const user = this.users.get(userId);
    if (!user || !user.companyId) {
      return { user: user ?? null, company: null };
    }

    const company = this.companies.get(user.companyId) ?? null;
    return { user, company };
  }

  setUserRole(userId: string, role: Role) {
    const user = this.users.get(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.role = role;
    return user;
  }

  private createId() {
    return `cmp_${Math.random().toString(36).slice(2, 10)}`;
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleEnum } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';
import { AuthenticatedUser } from '../common/interfaces';
import { UpdateCompanyDefaultsDto } from './dto/update-company-defaults.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async getInviteCode(user: AuthenticatedUser) {
    if (!user.companyId) {
      throw new BadRequestException('You are not assigned to a company.');
    }
    if (![RoleEnum.OWNER, RoleEnum.HR].includes(user.role)) {
      throw new ForbiddenException('Only Owners or HR can view the invite code.');
    }

    const company = await this.prisma.company.findUnique({
      where: { id: user.companyId },
      select: { inviteCode: true },
    });

    if (!company) {
      throw new NotFoundException('Company not found.');
    }

    return company;
  }

  async joinCompany(user: AuthenticatedUser, inviteCode: string) {
    if (user.companyId) {
      throw new BadRequestException('You are already assigned to a company.');
    }

    const company = await this.prisma.company.findUnique({
      where: { inviteCode },
      include: {
        defaultDepartment: true,
        defaultTeam: true,
      },
    });

    if (!company) {
      throw new NotFoundException('Invalid invite code.');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        companyId: company.id,
        role: company.defaultMemberRole ?? RoleEnum.MEMBER,
        departmentId: company.defaultDepartmentId ?? null,
        teamId: company.defaultTeamId ?? null,
      },
    });

    return {
      user: updatedUser,
      company: {
        id: company.id,
        name: company.name,
        team: company.defaultTeam,
        department: company.defaultDepartment,
      },
    };
  }

  async updateDefaults(user: AuthenticatedUser, dto: UpdateCompanyDefaultsDto) {
    if (!user.companyId) {
      throw new BadRequestException('You are not assigned to a company.');
    }

    const company = await this.prisma.company.findUnique({
      where: { id: user.companyId },
      select: { id: true },
    });

    if (!company) {
      throw new NotFoundException('Company not found.');
    }

    const { defaultDepartmentId, defaultTeamId } = dto;

    if (defaultDepartmentId) {
      const department = await this.prisma.department.findFirst({
        where: { id: defaultDepartmentId, companyId: company.id },
        select: { id: true },
      });
      if (!department) {
        throw new BadRequestException('Department does not belong to your company.');
      }
    }

    if (defaultTeamId) {
      const team = await this.prisma.team.findFirst({
        where: { id: defaultTeamId, companyId: company.id },
        select: { id: true },
      });
      if (!team) {
        throw new BadRequestException('Team does not belong to your company.');
      }
    }

    return this.prisma.company.update({
      where: { id: company.id },
      data: {
        defaultDepartmentId: defaultDepartmentId ?? null,
        defaultTeamId: defaultTeamId ?? null,
        defaultMemberRole: dto.defaultMemberRole ?? undefined,
      },
      select: {
        id: true,
        name: true,
        inviteCode: true,
        defaultMemberRole: true,
        defaultDepartment: true,
        defaultTeam: true,
      },
    });
main
  }
}
