import Container from '../components/Container.jsx';

export default function CarList() {
  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">Flota samochodów</h1>
      <p>
        lista samochodów 
        <code className="bg-slate-200 px-1 rounded text-xs ml-1">GET /api/cars</code>.
      </p>
    </Container>
  );
}
