export interface CompanyDefaultsPayload {
  defaultDepartmentId?: string | null;
  defaultTeamId?: string | null;
  defaultMemberRole?: string;
}

export interface CompanyInviteResponse {
  inviteCode: string;
}

export interface JoinCompanyResponse {
  company: {
    name: string;
    team?: { name: string } | null;
    department?: { name: string } | null;
  };
}

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }

  return response.json() as Promise<T>;
};

export const fetchInviteCode = () => request<CompanyInviteResponse>('/company/invite');

export const joinCompany = (inviteCode: string) =>
  request<JoinCompanyResponse>('/company/join', {
    method: 'POST',
    body: JSON.stringify({ inviteCode }),
  });

export const updateCompanyDefaults = (payload: CompanyDefaultsPayload) =>
  request('/company/defaults', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
