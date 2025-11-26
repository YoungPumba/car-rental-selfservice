import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import CarList from './pages/CarList.jsx';
import MyReservations from './pages/MyReservations.jsx';
import AdminCars from './pages/AdminCars.jsx';
import AdminReservations from './pages/AdminReservations.jsx';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<CarList />} />
          <Route path="/my-reservations" element={<MyReservations />} />
          <Route path="/admin/cars" element={<AdminCars />} />
          <Route path="/admin/reservations" element={<AdminReservations />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <footer className="bg-slate-200 py-3 text-center text-xs text-slate-600">
        Aplikacja demo – praca inżynierska Arkadiusz Mokicki 49522 &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;
