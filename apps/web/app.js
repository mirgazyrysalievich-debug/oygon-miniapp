const { useEffect, useMemo, useState } = React;

const defaultHeaders = {
  'Content-Type': 'application/json',
  'x-user-id': 'demo-user',
  'x-user-email': 'demo@example.com',
};

function usePath() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const navigate = (next) => {
    window.history.pushState({}, '', next);
    setPath(next);
  };

  return [path, navigate];
}

function Layout({ children, navigate }) {
  return React.createElement(
    'div',
    { className: 'layout' },
    React.createElement(
      'nav',
      { className: 'nav' },
      React.createElement('button', { onClick: () => navigate('/company/create') }, 'Create Company'),
      React.createElement('button', { onClick: () => navigate('/company/join') }, 'Join Company'),
      React.createElement('button', { onClick: () => navigate('/profile') }, 'Profile')
    ),
    React.createElement('main', { className: 'main' }, children)
  );
}

function CreateCompanyPage() {
  const [name, setName] = useState('');
  const [result, setResult] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult(null);
    const response = await fetch('http://localhost:3000/company', {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    setResult(data);
  };

  return React.createElement(
    'section',
    { className: 'card' },
    React.createElement('h1', null, 'Create a company'),
    React.createElement(
      'form',
      { onSubmit },
      React.createElement('label', null, 'Company name'),
      React.createElement('input', {
        value: name,
        onChange: (event) => setName(event.target.value),
        placeholder: 'Acme Inc',
        required: true,
      }),
      React.createElement('button', { type: 'submit' }, 'Create')
    ),
    result &&
      React.createElement(
        'p',
        { className: 'note' },
        `Created ${result.company?.name || ''}. Invite code: ${result.company?.id || ''}.`
      )
  );
}

function JoinCompanyPage() {
  const [inviteCode, setInviteCode] = useState('');
  const [result, setResult] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult(null);
    const response = await fetch('http://localhost:3000/company/join', {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ inviteCode }),
    });
    const data = await response.json();
    setResult(data);
  };

  return React.createElement(
    'section',
    { className: 'card' },
    React.createElement('h1', null, 'Join a company'),
    React.createElement(
      'form',
      { onSubmit },
      React.createElement('label', null, 'Invite code'),
      React.createElement('input', {
        value: inviteCode,
        onChange: (event) => setInviteCode(event.target.value),
        placeholder: 'cmp_123abc',
        required: true,
      }),
      React.createElement('button', { type: 'submit' }, 'Join')
    ),
    result &&
      React.createElement(
        'p',
        { className: 'note' },
        `Joined ${result.company?.name || ''}. Role: ${result.user?.role || ''}.`
      )
  );
}

function ProfilePage() {
  const [profile, setProfile] = useState({ company: null, role: 'Employee' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch('http://localhost:3000/company/me', { headers: defaultHeaders })
      .then((response) => response.json())
      .then((data) => {
        if (mounted) {
          setProfile(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return React.createElement('p', { className: 'note' }, 'Loading profile...');
  }

  return React.createElement(
    'section',
    { className: 'card' },
    React.createElement('h1', null, 'Profile'),
    React.createElement('p', null, `Company: ${profile.company?.name || 'None'}`),
    React.createElement('p', null, `Role: ${profile.role || 'Employee'}`)
  );
}

function App() {
  const [path, navigate] = usePath();
  const page = useMemo(() => {
    if (path === '/company/create') {
      return React.createElement(CreateCompanyPage);
    }
    if (path === '/company/join') {
      return React.createElement(JoinCompanyPage);
    }
    return React.createElement(ProfilePage);
  }, [path]);

  return React.createElement(Layout, { navigate }, page);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
