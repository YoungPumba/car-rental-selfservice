import { useEffect, useState } from 'react';
import Container from '../components/Container.jsx';
import axiosClient from '../api/axiosClient.js';

const SEGMENTS = ['economy', 'compact', 'standard', 'premium', 'suv', 'van'];

export default function AdminCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: '',
    segment: 'economy',
    dailyRate: '',
    registrationNumber: '',
    isAvailable: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadCars = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axiosClient.get('/admin/cars');
      setCars(res.data);
    } catch (err) {
      console.error('Admin get cars error:', err);
      setError(
        err.response?.data?.message ||
          'Nie udało się pobrać listy samochodów.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        year: Number(form.year),
        dailyRate: Number(form.dailyRate),
      };

      const res = await axiosClient.post('/admin/cars', payload);
      setInfo('Samochód został dodany.');
      setForm({
        brand: '',
        model: '',
        year: '',
        segment: 'economy',
        dailyRate: '',
        registrationNumber: '',
        isAvailable: true,
      });
      setCars((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error('Admin create car error:', err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          'Nie udało się dodać samochodu.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Na pewno usunąć ten samochód?')) return;

    setError('');
    setInfo('');
    setDeletingId(id);

    try {
      await axiosClient.delete(`/admin/cars/${id}`);
      setInfo('Samochód został usunięty.');
      setCars((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error('Admin delete car error:', err);
      setError(
        err.response?.data?.message ||
          'Nie udało się usunąć samochodu.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">Panel admina – samochody</h1>

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

      {/* Formularz dodawania auta */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h2 className="text-lg font-semibold mb-3">Dodaj nowy samochód</h2>
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-xs font-medium mb-1" htmlFor="brand">
              Marka
            </label>
            <input
              id="brand"
              name="brand"
              type="text"
              className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
              value={form.brand}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" htmlFor="model">
              Model
            </label>
            <input
              id="model"
              name="model"
              type="text"
              className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
              value={form.model}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" htmlFor="year">
              Rok produkcji
            </label>
            <input
              id="year"
              name="year"
              type="number"
              min="1980"
              className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
              value={form.year}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label
              className="block text-xs font-medium mb-1"
              htmlFor="segment"
            >
              Segment
            </label>
            <select
              id="segment"
              name="segment"
              className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
              value={form.segment}
              onChange={handleChange}
              required
            >
              {SEGMENTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="block text-xs font-medium mb-1"
              htmlFor="dailyRate"
            >
              Stawka dzienna [zł]
            </label>
            <input
              id="dailyRate"
              name="dailyRate"
              type="number"
              min="0"
              className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
              value={form.dailyRate}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label
              className="block text-xs font-medium mb-1"
              htmlFor="registrationNumber"
            >
              Numer rejestracyjny
            </label>
            <input
              id="registrationNumber"
              name="registrationNumber"
              type="text"
              className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
              value={form.registrationNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="isAvailable"
              name="isAvailable"
              type="checkbox"
              checked={form.isAvailable}
              onChange={handleChange}
            />
            <label
              htmlFor="isAvailable"
              className="text-xs font-medium text-slate-700"
            >
              Dostępny do rezerwacji
            </label>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:bg-slate-400 transition"
            >
              {submitting ? 'Dodawanie...' : 'Dodaj samochód'}
            </button>
          </div>
        </form>
      </div>

      {/* Lista aut */}
      <h2 className="text-lg font-semibold mb-2">Aktualna flota</h2>

      {loading ? (
        <p>Ładowanie listy samochodów...</p>
      ) : cars.length === 0 ? (
        <p>Brak samochodów w bazie.</p>
      ) : (
        <div className="space-y-3">
          {cars.map((car) => (
            <div
              key={car._id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {car.brand} {car.model}{' '}
                  <span className="text-xs text-slate-500">
                    ({car.registrationNumber})
                  </span>
                </p>
                <p className="text-xs text-slate-600">
                  Rok: {car.year} | Segment: {car.segment} | Stawka:{' '}
                  {car.dailyRate} zł/dzień
                </p>
                <p className="text-xs text-slate-600">
                  Dostępny:{' '}
                  <span className="font-semibold">
                    {car.isAvailable ? 'tak' : 'nie'}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                {/* tylko dodawanie i usuwanie, edycja została zaimplementowana tylko od strony backendu */}
                <button
                  onClick={() => handleDelete(car._id)}
                  disabled={deletingId === car._id}
                  className="px-3 py-2 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:bg-red-300 transition"
                >
                  {deletingId === car._id ? 'Usuwanie...' : 'Usuń'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
