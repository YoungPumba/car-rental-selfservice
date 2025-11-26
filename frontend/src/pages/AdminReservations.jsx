import { useEffect, useState } from 'react';
import Container from '../components/Container.jsx';
import axiosClient from '../api/axiosClient.js';

const STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [statusById, setStatusById] = useState({}); // { id: 'confirmed' }

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axiosClient.get('/admin/reservations');
      setReservations(res.data);

      // domyślne wartości selectów
      const initial = {};
      res.data.forEach((r) => {
        initial[r._id] = r.status;
      });
      setStatusById(initial);
    } catch (err) {
      console.error('Admin get reservations error:', err);
      setError(
        err.response?.data?.message ||
          'Nie udało się pobrać listy rezerwacji.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleStatusChangeLocal = (id, value) => {
    setStatusById((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleUpdateStatus = async (id) => {
    const newStatus = statusById[id];
    if (!newStatus) return;

    setError('');
    setInfo('');
    setUpdatingId(id);

    try {
      await axiosClient.patch(`/admin/reservations/${id}/status`, {
        status: newStatus,
      });
      setInfo('Status rezerwacji został zaktualizowany.');
      await loadReservations();
    } catch (err) {
      console.error('Admin update reservation status error:', err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          'Nie udało się zmienić statusu rezerwacji.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">Panel admina – rezerwacje</h1>

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

      {loading ? (
        <p>Ładowanie rezerwacji...</p>
      ) : reservations.length === 0 ? (
        <p>Brak rezerwacji w systemie.</p>
      ) : (
        <div className="space-y-3">
          {reservations.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-1">
                    {r.carId?.brand} {r.carId?.model}{' '}
                    <span className="text-xs text-slate-500">
                      ({r.carId?.registrationNumber})
                    </span>
                  </p>
                  <p className="text-xs text-slate-600 mb-1">
                    Klient:{' '}
                    <span className="font-semibold">
                      {r.userId?.firstName} {r.userId?.lastName}
                    </span>{' '}
                    ({r.userId?.email})
                  </p>
                  <p className="text-xs text-slate-600 mb-1">
                    Od: {formatDate(r.startDate)} | Do: {formatDate(r.endDate)}
                  </p>
                  <p className="text-xs text-slate-600 mb-1">
                    Kod odbioru:{' '}
                    <span className="font-mono">{r.pickupCode}</span>
                  </p>
                  <p className="text-xs text-slate-600">
                    Aktualny status:{' '}
                    <span className="font-semibold">{r.status}</span> | Cena:{' '}
                    <span className="font-semibold">{r.totalPrice} zł</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    className="border border-slate-300 rounded-md px-2 py-1 text-xs"
                    value={statusById[r._id] || r.status}
                    onChange={(e) =>
                      handleStatusChangeLocal(r._id, e.target.value)
                    }
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleUpdateStatus(r._id)}
                    disabled={updatingId === r._id}
                    className="px-3 py-2 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 disabled:bg-slate-400 transition"
                  >
                    {updatingId === r._id
                      ? 'Zapisywanie...'
                      : 'Zmień status'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
