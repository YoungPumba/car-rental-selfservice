import Container from '../components/Container.jsx';

export default function AdminReservations() {
  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">Panel admina – rezerwacje</h1>
      <p>
        zarządzanie rezerwacjami admin <code>/api/admin/reservations</code>.
      </p>
    </Container>
  );
}
