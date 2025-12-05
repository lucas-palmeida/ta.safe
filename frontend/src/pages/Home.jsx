import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { rideService } from '../services/api';
import { Search, Filter, MapPin, Clock, Users, Car, Bike, Share2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import './Home.css';

const rideTypeIcons = {
  CAR: <Car size={20} />,
  MOTORCYCLE: <Bike size={20} />,
  SHARED_UBER: <Share2 size={20} />,
  GROUP: <Users size={20} />
};

const rideTypeLabels = {
  CAR: 'Carro',
  MOTORCYCLE: 'Moto',
  SHARED_UBER: 'Uber Compartilhado',
  GROUP: 'Grupo a Pé'
};

const Home = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    destination: '',
    date: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async (filterParams = {}) => {
    try {
      setLoading(true);
      const response = await rideService.list(filterParams);
      setRides(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar caronas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = () => {
    const activeFilters = {};
    if (filters.type) activeFilters.type = filters.type;
    if (filters.destination) activeFilters.destination = filters.destination;
    if (filters.date) activeFilters.date = filters.date;
    loadRides(activeFilters);
  };

  const handleClearFilters = () => {
    setFilters({ type: '', destination: '', date: '' });
    loadRides();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="home-header">
          <h1>Caronas Disponíveis</h1>
          <p>Encontre ou ofereça caronas com segurança</p>
        </div>

        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-item">
              <label>
                <Filter size={18} />
                Tipo de Carona
              </label>
              <select name="type" value={filters.type} onChange={handleFilterChange}>
                <option value="">Todos os tipos</option>
                <option value="CAR">Carro</option>
                <option value="MOTORCYCLE">Moto</option>
                <option value="SHARED_UBER">Uber Compartilhado</option>
                <option value="GROUP">Grupo a Pé</option>
              </select>
            </div>

            <div className="filter-item">
              <label>
                <MapPin size={18} />
                Destino
              </label>
              <input
                type="text"
                name="destination"
                placeholder="Ex: Floresta, Uruguai..."
                value={filters.destination}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-item">
              <label>
                <Clock size={18} />
                Data
              </label>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={handleSearch} className="btn-search">
              <Search size={18} />
              Buscar
            </button>
            <button onClick={handleClearFilters} className="btn-clear">
              Limpar Filtros
            </button>
          </div>
        </div>

        <div className="rides-section">
          {loading ? (
            <div className="loading">Carregando caronas...</div>
          ) : rides.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma carona disponível no momento</p>
              <button onClick={() => navigate('/criar-carona')} className="btn-primary">
                Seja o primeiro a oferecer!
              </button>
            </div>
          ) : (
            <div className="rides-grid">
              {rides.map((ride) => (
                <div key={ride.id} className="ride-card" onClick={() => navigate(`/carona/${ride.id}`)}>
                  <div className="ride-card-header">
                    <div className="ride-type">
                      {rideTypeIcons[ride.type]}
                      <span>{rideTypeLabels[ride.type]}</span>
                    </div>
                    {ride.type !== 'GROUP' && ride.availableSeats && (
                      <div className="ride-seats">
                        <Users size={16} />
                        {ride.availableSeats} {ride.availableSeats === 1 ? 'vaga' : 'vagas'}
                      </div>
                    )}
                  </div>

                  <div className="ride-route">
                    <div className="route-item">
                      <MapPin size={18} className="icon-origin" />
                      <div>
                        <small>Origem</small>
                        <p>{ride.origin}</p>
                      </div>
                    </div>
                    <div className="route-arrow">→</div>
                    <div className="route-item">
                      <MapPin size={18} className="icon-destination" />
                      <div>
                        <small>Destino</small>
                        <p>{ride.destination}</p>
                      </div>
                    </div>
                  </div>

                  <div className="ride-details">
                    <div className="detail-item">
                      <Clock size={16} />
                      <span>{formatDate(ride.departureTime)}</span>
                    </div>
                    <div className="detail-item">
                      <MapPin size={16} />
                      <span>{ride.meetingPoint}</span>
                    </div>
                  </div>

                  {ride.description && (
                    <p className="ride-description">{ride.description}</p>
                  )}

                  <div className="ride-footer">
                    <div className="driver-info">
                      <div className="driver-avatar">
                        {ride.driver.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="driver-name">{ride.driver.name}</p>
                        <small>{ride.driver.course || ride.driver.role}</small>
                      </div>
                    </div>
                    <button className="btn-view">Ver Detalhes</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;