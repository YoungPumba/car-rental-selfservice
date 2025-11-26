import { useEffect, useState } from 'react';
import Container from '../components/Container.jsx';
import axiosClient from '../api/axiosClient.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function CarList() {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reservationInfo, setReservationInfo] = useState('');
  const [reservationError, setReservationError] = useState('');
  const [reservationLoadingId, setReservationLoadingId] = useState(null);
  const [formByCar, setFormByCar] = useState({}); // { carId: { startDate, endDate } }

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/cars');
        setCars(res.data);
      } catch (err) {
        console.error('Get cars error:', err);
        setError(
          err.response?.data?.message ||
            'Nie udało się pobrać listy samochodów.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleFormChange = (carId, field, value) => {
    setFormByCar((prev) => ({
      ...prev,
      [carId]: {
        ...(prev[carId] || { startDate: '', endDate: '' }),
        [field]: value,
      },
    }));
  };

  const handleReserve = async (carId) => {
    if (!user) {
      setReservationError('Musisz być zalogowany, aby dokonać rezerwacji.');
      return;
    }

    const form = formByCar[carId] || {};
    const { startDate, endDate } = form;

    if (!startDate || !endDate) {
      setReservationError('Podaj daty początku i końca rezerwacji.');
      return;
    }

    setReservationError('');
    setReservationInfo('');
    setReservationLoadingId(carId);

    try {
      const res = await axiosClient.post('/reservations', {
        carId,
        startDate,
        endDate,
      });

      setReservationInfo(
        `Rezerwacja utworzona. Kod odbioru: ${res.data.pickupCode}, status: ${res.data.status}.`
      );
    } catch (err) {
      console.error('Create reservation error:', err);
      setReservationError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          'Nie udało się utworzyć rezerwacji.'
      );
    } finally {
      setReservationLoadingId(null);
    }
  };

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">Flota samochodów</h1>

      {error && (
        <div className="mb-3 rounded-md bg-red-100 border border-red-300 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      {reservationError && (
        <div className="mb-3 rounded-md bg-red-100 border border-red-300 px-3 py-2 text-sm text-red-800">
          {reservationError}
        </div>
      )}

      {reservationInfo && (
        <div className="mb-3 rounded-md bg-emerald-100 border border-emerald-300 px-3 py-2 text-sm text-emerald-800">
          {reservationInfo}
        </div>
      )}

      {loading ? (
        <p>Ładowanie listy samochodów...</p>
      ) : cars.length === 0 ? (
        <p>Brak dostępnych samochodów.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {cars.map((car) => {
            const form = formByCar[car._id] || {
              startDate: '',
              endDate: '',
            };

            return (
              <div
                key={car._id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold mb-1">
                    {car.brand} {car.model}
                  </h2>
                  <p className="text-sm text-slate-600 mb-1">
                    Rok: {car.year} | Segment: {car.segment}
                  </p>
                  <p className="text-sm text-slate-600 mb-1">
                    Nr rej.: {car.registrationNumber}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    Stawka dzienna: {car.dailyRate} zł
                  </p>
                </div>

                <div className="mt-3 border-t border-slate-200 pt-3">
                  {user ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="block text-xs font-medium mb-1">
                            Od
                          </label>
                          <input
                            type="date"
                            className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
                            value={form.startDate}
                            onChange={(e) =>
                              handleFormChange(
                                car._id,
                                'startDate',
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">
                            Do
                          </label>
                          <input
                            type="date"
                            className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
                            value={form.endDate}
                            onChange={(e) =>
                              handleFormChange(
                                car._id,
                                'endDate',
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleReserve(car._id)}
                        disabled={reservationLoadingId === car._id}
                        className="w-full inline-flex items-center justify-center px-3 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:bg-slate-400 transition"
                      >
                        {reservationLoadingId === car._id
                          ? 'Tworzenie rezerwacji...'
                          : 'Zarezerwuj'}
                      </button>
                    </>
                  ) : (
                    <p className="text-xs text-slate-600">
                      Aby zarezerwować ten samochód, zaloguj się lub utwórz
                      konto.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
}
