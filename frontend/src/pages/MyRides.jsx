import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { rideService, requestService } from '../services/api';
import { Car, Bike, Share2, Users, MapPin, Clock, Trash2, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import './MyRides.css';

const rideTypeIcons = {
  CAR: <Car size={18} />,
  MOTORCYCLE: <Bike size={18} />,
  SHARED_UBER: <Share2 size={18} />,
  GROUP: <Users size={18} />
};

const MyRides = () => {
  const [activeTab, setActiveTab] = useState('offered');
  const [offeredRides, setOfferedRides] = useState([]);
  const [requestedRides, setRequestedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [offered, requested] = await Promise.all([
        rideService.getMyOffered(),
        requestService.getMy()
      ]);
      setOfferedRides(offered.data.data);
      setRequestedRides(requested.data.data);
    } catch (error) {
      console.error('Erro ao carregar caronas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja cancelar esta carona?')) return;

    try {
      await rideService.delete(id);
      setOfferedRides(offeredRides.filter(ride => ride.id !== id));
    } catch (error) {
      alert('Erro ao cancelar carona');
    }
  };

  const handleCancelRequest = async (id) => {
    if (!confirm('Tem certeza que deseja cancelar esta solicitação?')) return;

    try {
      await requestService.cancel(id);
      setRequestedRides(requestedRides.filter(req => req.id !== id));
    } catch (error) {
      alert('Erro ao cancelar solicitação');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      ACTIVE: { label: 'Ativa', class: 'status-active' },
      FULL: { label: 'Lotada', class: 'status-full' },
      COMPLETED: { label: 'Concluída', class: 'status-completed' },
      CANCELLED: { label: 'Cancelada', class: 'status-cancelled' },
      PENDING: { label: 'Pendente', class: 'status-pending' },
      ACCEPTED: { label: 'Aceita', class: 'status-accepted' },
      REJECTED: { label: 'Rejeitada', class: 'status-rejected' }
    };
    
    const statusInfo = statusMap[status] || { label: status, class: '' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  return (
    <>
      <Navbar />
      <div className="myrides-container">
        <div className="myrides-header">
          <h1>Minhas Caronas</h1>
          <p>Gerencie suas caronas oferecidas e solicitadas</p>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'offered' ? 'active' : ''}`}
            onClick={() => setActiveTab('offered')}
          >
            Caronas Oferecidas ({offeredRides.length})
          </button>
          <button
            className={`tab ${activeTab === 'requested' ? 'active' : ''}`}
            onClick={() => setActiveTab('requested')}
          >
            Solicitações Feitas ({requestedRides.length})
          </button>
        </div>

        <div className="tab-content">
          {loading ? (
            <div className="loading">Carregando...</div>
          ) : activeTab === 'offered' ? (
            offeredRides.length === 0 ? (
              <div className="empty-state">
                <p>Você ainda não ofereceu nenhuma carona</p>
                <button onClick={() => navigate('/criar-carona')} className="btn-primary">
                  Criar Primeira Carona
                </button>
              </div>
            ) : (
              <div className="rides-list">
                {offeredRides.map((ride) => (
                  <div key={ride.id} className="ride-item">
                    <div className="ride-item-header">
                      <div className="ride-type-mini">
                        {rideTypeIcons[ride.type]}
                      </div>
                      {getStatusBadge(ride.status)}
                    </div>

                    <div className="ride-item-route">
                      <div className="route-text">
                        <MapPin size={16} />
                        <span>{ride.origin}</span>
                      </div>
                      <span className="route-arrow">→</span>
                      <div className="route-text">
                        <MapPin size={16} />
                        <span>{ride.destination}</span>
                      </div>
                    </div>

                    <div className="ride-item-time">
                      <Clock size={16} />
                      {formatDate(ride.departureTime)}
                    </div>

                    {ride._count?.requests > 0 && (
                      <div className="ride-item-requests">
                        {ride._count.requests} solicitaç{ride._count.requests === 1 ? 'ão' : 'ões'} aceita{ride._count.requests === 1 ? '' : 's'}
                      </div>
                    )}

                    <div className="ride-item-actions">
                      <button onClick={() => navigate(`/carona/${ride.id}`)} className="btn-view-small">
                        <Eye size={16} />
                        Ver Detalhes
                      </button>
                      {ride.status === 'ACTIVE' && (
                        <button onClick={() => handleDelete(ride.id)} className="btn-delete-small">
                          <Trash2 size={16} />
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            requestedRides.length === 0 ? (
              <div className="empty-state">
                <p>Você ainda não solicitou nenhuma carona</p>
                <button onClick={() => navigate('/')} className="btn-primary">
                  Ver Caronas Disponíveis
                </button>
              </div>
            ) : (
              <div className="rides-list">
                {requestedRides.map((request) => (
                  <div key={request.id} className="ride-item">
                    <div className="ride-item-header">
                      <div className="ride-type-mini">
                        {rideTypeIcons[request.ride.type]}
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    <div className="ride-item-route">
                      <div className="route-text">
                        <MapPin size={16} />
                        <span>{request.ride.origin}</span>
                      </div>
                      <span className="route-arrow">→</span>
                      <div className="route-text">
                        <MapPin size={16} />
                        <span>{request.ride.destination}</span>
                      </div>
                    </div>

                    <div className="ride-item-time">
                      <Clock size={16} />
                      {formatDate(request.ride.departureTime)}
                    </div>

                    <div className="ride-item-driver">
                      Motorista: <strong>{request.ride.driver.name}</strong>
                    </div>

                    {request.message && (
                      <div className="ride-item-message">
                        Sua mensagem: "{request.message}"
                      </div>
                    )}

                    <div className="ride-item-actions">
                      <button onClick={() => navigate(`/carona/${request.ride.id}`)} className="btn-view-small">
                        <Eye size={16} />
                        Ver Detalhes
                      </button>
                      {request.status === 'PENDING' && (
                        <button onClick={() => handleCancelRequest(request.id)} className="btn-delete-small">
                          <Trash2 size={16} />
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default MyRides;