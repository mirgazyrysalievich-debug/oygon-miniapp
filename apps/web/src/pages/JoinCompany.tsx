import { useState } from 'react';
import { joinCompany } from '../api/company';

export const JoinCompany = () => {
  const [inviteCode, setInviteCode] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    setStatus(null);
    setError(null);

    try {
      const response = await joinCompany(inviteCode.trim());
      const teamName = response.company.team?.name ?? '-';
      const departmentName = response.company.department?.name ?? '-';
      setStatus(
        `Joined ${response.company.name}. Team: ${teamName}. Department: ${departmentName}.`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to join company.');
    }
  };

  return (
    <div style={{ maxWidth: 420 }}>
      <h1>Join Company</h1>
      <p>Enter the invite code provided by your company.</p>
      <input
        type="text"
        value={inviteCode}
        onChange={(event) => setInviteCode(event.target.value)}
        placeholder="Invite code"
        style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
      />
      <button type="button" onClick={handleJoin} disabled={!inviteCode.trim()}>
        Join
      </button>
      {status && <p style={{ color: 'green' }}>{status}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};
