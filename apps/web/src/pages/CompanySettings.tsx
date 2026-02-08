import { useEffect, useState } from 'react';
import { fetchInviteCode, updateCompanyDefaults } from '../api/company';

interface Option {
  id: string;
  name: string;
}

interface CompanySettingsProps {
  departments: Option[];
  teams: Option[];
}

export const CompanySettings = ({ departments, teams }: CompanySettingsProps) => {
  const [inviteCode, setInviteCode] = useState<string>('');
  const [defaultDepartmentId, setDefaultDepartmentId] = useState<string | null>(null);
  const [defaultTeamId, setDefaultTeamId] = useState<string | null>(null);
  const [defaultMemberRole, setDefaultMemberRole] = useState<string>('MEMBER');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInviteCode()
      .then((response) => setInviteCode(response.inviteCode))
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load invite code.'));
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setStatus('Invite code copied.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to copy invite code.');
    }
  };

  const handleSave = async () => {
    setStatus(null);
    setError(null);

    try {
      await updateCompanyDefaults({
        defaultDepartmentId,
        defaultTeamId,
        defaultMemberRole,
      });
      setStatus('Defaults saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save defaults.');
    }
  };

  return (
    <div style={{ maxWidth: 520 }}>
      <h1>Company Settings</h1>
      <section>
        <h2>Invite Code</h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="text" value={inviteCode} readOnly style={{ flex: 1, padding: '8px' }} />
          <button type="button" onClick={handleCopy} disabled={!inviteCode}>
            Copy
          </button>
        </div>
      </section>

      <section style={{ marginTop: '24px' }}>
        <h2>Defaults</h2>
        <label>
          Default Department
          <select
            value={defaultDepartmentId ?? ''}
            onChange={(event) =>
              setDefaultDepartmentId(event.target.value ? event.target.value : null)
            }
          >
            <option value="">None</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'block', marginTop: '12px' }}>
          Default Team
          <select
            value={defaultTeamId ?? ''}
            onChange={(event) => setDefaultTeamId(event.target.value ? event.target.value : null)}
          >
            <option value="">None</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'block', marginTop: '12px' }}>
          Default Role
          <select
            value={defaultMemberRole}
            onChange={(event) => setDefaultMemberRole(event.target.value)}
          >
            <option value="MEMBER">Member</option>
          </select>
        </label>

        <button type="button" onClick={handleSave} style={{ marginTop: '16px' }}>
          Save Defaults
        </button>
      </section>

      {status && <p style={{ color: 'green' }}>{status}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};
