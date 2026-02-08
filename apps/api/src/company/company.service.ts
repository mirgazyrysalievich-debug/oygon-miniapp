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
  }
}
