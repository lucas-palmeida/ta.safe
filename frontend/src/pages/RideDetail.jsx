import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { rideService, requestService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Clock, Users, Car, Bike, Share2, ArrowLeft, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import './RideDetail.css';

const rideTypeIcons = {
  CAR: <Car size={24} />,
  MOTORCYCLE: <Bike size={24} />,
  SHARED_UBER: <Share2 size={24} />,
  GROUP: <Users size={24} />
};

const rideTypeLabels = {
  CAR: 'Carro',
  MOTORCYCLE: 'Moto',
  SHARED_UBER: 'Uber Compartilhado',
  GROUP: 'Grupo a Pé'
};

const RideDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestMessage, setRequestMessage] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadRide();
  }, [id]);

  const loadRide = async () => {
    try {
      setLoading(true);
      const response = await rideService.getById(id);
      setRide(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar carona:', error);
      setError('Erro ao carregar detalhes da carona');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    if (!requestMessage.trim()) {
      setError('Digite uma mensagem para o motorista');
      return;
    }

    try {
      setRequesting(true);
      setError('');
      await requestService.create({
        rideId: ride.id,
        message: requestMessage
      });
      setSuccess('Solicitação enviada com sucesso!');
      setRequestMessage('');
      setTimeout(() => {
        navigate('/minhas-caronas');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Erro ao solicitar carona');
    } finally {
      setRequesting(false);
    }
  };

  const getWhatsAppLink = (phone) => {
    // Extrai o email do motorista e usa como base
    // Em produção, você teria o número de telefone do usuário
    const email = ride.driver.email;
    const message = `Olá! Vi sua carona no TáSafe de ${ride.origin} para ${ride.destination}. Podemos conversar sobre os detalhes?`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
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

  const isMyRide = ride?.driverId === user?.id;
  const hasRequested = ride?.requests?.some(req => req.userId === user?.id);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="detail-container">
          <div className="loading">Carregando...</div>
        </div>
      </>
    );
  }

  if (!ride) {
    return (
      <>
        <Navbar />
        <div className="detail-container">
          <div className="error-state">Carona não encontrada</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="detail-container">
        <button onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeft size={20} />
          Voltar
        </button>

        <div className="detail-card">
          <div className="detail-header">
            <div className="ride-type-badge">
              {rideTypeIcons[ride.type]}
              <span>{rideTypeLabels[ride.type]}</span>
            </div>
            {ride.type !== 'GROUP' && ride.availableSeats && (
              <div className="seats-badge">
                <Users size={20} />
                {ride.availableSeats} {ride.availableSeats === 1 ? 'vaga disponível' : 'vagas disponíveis'}
              </div>
            )}
            {ride.type === 'GROUP' && (
              <div className="seats-badge unlimited">
                <Users size={20} />
                Vagas ilimitadas
              </div>
            )}
          </div>

          <div className="route-section">
            <div className="route-point origin">
              <MapPin size={24} />
              <div>
                <small>Origem</small>
                <h3>{ride.origin}</h3>
              </div>
            </div>

            <div className="route-line"></div>

            <div className="route-point destination">
              <MapPin size={24} />
              <div>
                <small>Destino</small>
                <h3>{ride.destination}</h3>
              </div>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <Clock size={20} />
              <div>
                <small>Horário de Partida</small>
                <p>{formatDate(ride.departureTime)}</p>
              </div>
            </div>

            <div className="info-item">
              <MapPin size={20} />
              <div>
                <small>Ponto de Encontro</small>
                <p>{ride.meetingPoint}</p>
              </div>
            </div>
          </div>

          {ride.description && (
            <div className="description-section">
              <h4>Detalhes</h4>
              <p>{ride.description}</p>
            </div>
          )}

          <div className="driver-section">
            <h4>Motorista</h4>
            <div className="driver-card">
              <div className="driver-avatar-large">
                {ride.driver.name.charAt(0).toUpperCase()}
              </div>
              <div className="driver-info-detail">
                <h3>{ride.driver.name}</h3>
                <p>{ride.driver.course || ride.driver.role}</p>
                <p className="driver-email">{ride.driver.email}</p>
              </div>
            </div>
          </div>

          {!isMyRide && (
            <div className="action-section">
              {hasRequested ? (
                <div className="info-message">
                  ✓ Você já solicitou esta carona. Aguarde a resposta do motorista.
                </div>
              ) : (
                <>
                  <h4>Solicitar Carona</h4>
                  {error && <div className="error-message">{error}</div>}
                  {success && <div className="success-message">{success}</div>}
                  
                  <textarea
                    placeholder="Envie uma mensagem para o motorista (ex: 'Olá! Posso ir na sua carona? Moro próximo ao destino.')"
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    rows={4}
                  />
                  
                  <div className="action-buttons">
                    <button 
                      onClick={handleRequest} 
                      className="btn-request"
                      disabled={requesting}
                    >
                      {requesting ? 'Enviando...' : 'Solicitar Carona'}
                    </button>
                    
                    <a 
                      href={getWhatsAppLink()} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-whatsapp"
                    >
                      <MessageCircle size={20} />
                      Chamar no WhatsApp
                    </a>
                  </div>
                </>
              )}
            </div>
          )}

          {isMyRide && ride.requests && ride.requests.length > 0 && (
            <div className="requests-section">
              <h4>Solicitações Recebidas ({ride.requests.length})</h4>
              <div className="requests-list">
                {ride.requests.map((request) => (
                  <div key={request.id} className="request-item">
                    <div className="request-user">
                      <div className="user-avatar">
                        {request.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="user-name">{request.user.name}</p>
                        <small>{request.user.email}</small>
                      </div>
                    </div>
                    {request.message && (
                      <p className="request-message">"{request.message}"</p>
                    )}
                    <div className="request-status">
                      Status: <strong>{request.status === 'PENDING' ? 'Pendente' : request.status === 'ACCEPTED' ? 'Aceita' : 'Rejeitada'}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RideDetail;