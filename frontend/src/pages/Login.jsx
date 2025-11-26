import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Container from '../components/Container.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { user, login, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // jeśli już zalogowany, nie przeniesie
  if (user) {
    return <Navigate to={isAdmin ? '/admin/cars' : '/cars'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setSubmitting(true);

    const result = await login(email, password);

    setSubmitting(false);

    if (result.success) {
      setInfo('Zalogowano pomyślnie.');
      navigate(result.user.role === 'admin' ? '/admin/cars' : '/cars', {
        replace: true,
      });
    } else {
      setError(result.message);
    }
  };

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">Logowanie</h1>

      {error && (
        <div className="mb-3 rounded-md bg-red-100 border border-red-300 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}
      {info && (
        <div className="mb-3 rounded-md bg-emerald-100 border border-emerald-300 px-3 py-2 text-sm text-emerald-800">
          {info}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Hasło
          </label>
          <input
            id="password"
            type="password"
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:bg-slate-400 transition"
        >
          {submitting ? 'Logowanie...' : 'Zaloguj'}
        </button>
      </form>
    </Container>
  );
}
