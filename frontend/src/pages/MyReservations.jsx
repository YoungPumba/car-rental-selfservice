import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Container from '../components/Container.jsx';
import axiosClient from '../api/axiosClient.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function MyReservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [cancelLoadingId, setCancelLoadingId] = useState(null);

  if (!user) {
    // niezalogowany nie ma tu czego szukać
    return <Navigate to="/login" replace />;
  }

  const loadReservations = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/reservations/my');
      setReservations(res.data);
    } catch (err) {
      console.error('Get my reservations error:', err);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (id) => {
    setError('');
    setInfo('');
    setCancelLoadingId(id);

    try {
      await axiosClient.delete(`/reservations/${id}`);
      setInfo('Rezerwacja została anulowana.');
      await loadReservations();
    } catch (err) {
      console.error('Cancel reservation error:', err);
      setError(
        err.response?.data?.message ||
          'Nie udało się anulować rezerwacji.'
      );
    } finally {
      setCancelLoadingId(null);
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
      <h1 className="text-2xl font-bold mb-4">Moje rezerwacje</h1>

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
        <p>Nie masz jeszcze żadnych rezerwacji.</p>
      ) : (
        <div className="space-y-3">
          {reservations.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <p className="text-sm text-slate-700 mb-1">
                  <span className="font-semibold">
                    {r.carId?.brand} {r.carId?.model}
                  </span>{' '}
                  ({r.carId?.registrationNumber})
                </p>
                <p className="text-xs text-slate-600 mb-1">
                  Od: {formatDate(r.startDate)} | Do: {formatDate(r.endDate)}
                </p>
                <p className="text-xs text-slate-600 mb-1">
                  Kod odbioru: <span className="font-mono">{r.pickupCode}</span>
                </p>
                <p className="text-xs text-slate-600">
                  Status:{' '}
                  <span className="font-semibold">
                    {r.status}
                  </span>{' '}
                  | Cena: <span className="font-semibold">{r.totalPrice} zł</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {r.status === 'pending' ? (
                  <button
                    onClick={() => handleCancel(r._id)}
                    disabled={cancelLoadingId === r._id}
                    className="px-3 py-2 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:bg-red-300 transition"
                  >
                    {cancelLoadingId === r._id
                      ? 'Anulowanie...'
                      : 'Anuluj rezerwację'}
                  </button>
                ) : (
                  <span className="text-xs text-slate-500">
                    Tę rezerwację można już tylko podejrzeć.
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
