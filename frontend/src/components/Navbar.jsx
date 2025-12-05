import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Home, Car, Plus } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🚗 TáSafe
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            <Home size={20} />
            Início
          </Link>

          <Link to="/minhas-caronas" className="navbar-link">
            <Car size={20} />
            Minhas Caronas
          </Link>

          <Link to="/criar-carona" className="navbar-link btn-create">
            <Plus size={20} />
            Criar Carona
          </Link>

          <div className="navbar-user">
            <Link to="/perfil" className="navbar-link">
              <User size={20} />
              {user?.name?.split(' ')[0] || 'Perfil'}
            </Link>
            
            <button onClick={handleLogout} className="navbar-link btn-logout">
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;