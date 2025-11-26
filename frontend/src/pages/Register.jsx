import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Container from '../components/Container.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { user, registerUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  if (user) {
    // zalogowany user nie trafi w to miejsce
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setSubmitting(true);

    const result = await registerUser(form);

    setSubmitting(false);

    if (result.success) {
      setInfo('Konto zostało utworzone. Możesz się teraz zalogować.');
      // możliwość dalszego przekierowania
      navigate('/login', { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">Rejestracja</h1>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="firstName">
              Imię
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="lastName">
              Nazwisko
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="phone">
            Telefon
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Hasło
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:bg-slate-400 transition"
        >
          {submitting ? 'Rejestrowanie...' : 'Utwórz konto'}
        </button>
      </form>
    </Container>
  );
}
