import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CreateRide from './pages/CreateRide';
import RideDetail from './pages/RideDetail';
import Profile from './pages/Profile';
import MyRides from './pages/MyRides';
import './App.css';

// Componente para proteger rotas privadas
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// Componente para redirecionar usuários autenticados
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return user ? <Navigate to="/" /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/cadastro" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />

      {/* Rotas Privadas */}
      <Route path="/" element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      } />
      <Route path="/criar-carona" element={
        <PrivateRoute>
          <CreateRide />
        </PrivateRoute>
      } />
      <Route path="/carona/:id" element={
        <PrivateRoute>
          <RideDetail />
        </PrivateRoute>
      } />
      <Route path="/perfil" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />
      <Route path="/minhas-caronas" element={
        <PrivateRoute>
          <MyRides />
        </PrivateRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;