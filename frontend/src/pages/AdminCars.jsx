import Container from '../components/Container.jsx';

export default function AdminCars() {
  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">Panel admina – samochody</h1>
      <p>
        Tabela z samochodami admin <code>/api/admin/cars</code>.
      </p>
    </Container>
  );
}
