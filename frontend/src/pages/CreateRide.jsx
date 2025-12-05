import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rideService } from '../services/api';
import { Car, Bike, Share2, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import './CreateRide.css';

const CreateRide = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'CAR',
    origin: 'IFRS Campus Porto Alegre',
    destination: '',
    meetingPoint: '',
    departureTime: '',
    availableSeats: 1,
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const rideTypes = [
    { value: 'CAR', label: 'Carro', icon: <Car size={24} />, description: 'Carona de automóvel' },
    { value: 'MOTORCYCLE', label: 'Moto', icon: <Bike size={24} />, description: 'Carona de motocicleta' },
    { value: 'SHARED_UBER', label: 'Uber Compartilhado', icon: <Share2 size={24} />, description: 'Dividir um Uber' },
    { value: 'GROUP', label: 'Grupo a Pé', icon: <Users size={24} />, description: 'Deslocamento coletivo' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTypeChange = (type) => {
    setFormData({
      ...formData,
      type,
      availableSeats: type === 'GROUP' ? null : (formData.availableSeats || 1)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!formData.destination.trim()) {
      setError('Destino é obrigatório');
      return;
    }

    if (!formData.meetingPoint.trim()) {
      setError('Ponto de encontro é obrigatório');
      return;
    }

    if (!formData.departureTime) {
      setError('Horário de partida é obrigatório');
      return;
    }

    const departureDate = new Date(formData.departureTime);
    if (departureDate <= new Date()) {
      setError('O horário de partida deve ser no futuro');
      return;
    }

    if (formData.type !== 'GROUP' && (!formData.availableSeats || formData.availableSeats < 1)) {
      setError('Número de vagas deve ser maior que 0');
      return;
    }

    try {
      setLoading(true);
      const dataToSend = {
        ...formData,
        availableSeats: formData.type === 'GROUP' ? undefined : parseInt(formData.availableSeats)
      };
      
      await rideService.create(dataToSend);
      navigate('/minhas-caronas');
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Erro ao criar carona');
    } finally {
      setLoading(false);
    }
  };

  // Gerar datetime-local min (agora)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <>
      <Navbar />
      <div className="create-container">
        <div className="create-header">
          <h1>Criar Nova Carona</h1>
          <p>Preencha os detalhes da sua carona</p>
        </div>

        <div className="create-card">
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-section">
              <h3>Tipo de Carona</h3>
              <div className="ride-types-grid">
                {rideTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`ride-type-option ${formData.type === type.value ? 'active' : ''}`}
                    onClick={() => handleTypeChange(type.value)}
                  >
                    <div className="ride-type-icon">{type.icon}</div>
                    <h4>{type.label}</h4>
                    <p>{type.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>Rota</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="origin">Origem</label>
                  <input
                    type="text"
                    id="origin"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    placeholder="Ponto de partida"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="destination">Destino *</label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Ex: Estação Uruguai, Bairro Floresta..."
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Detalhes</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="meetingPoint">Ponto de Encontro *</label>
                  <input
                    type="text"
                    id="meetingPoint"
                    name="meetingPoint"
                    value={formData.meetingPoint}
                    onChange={handleChange}
                    placeholder="Ex: Portaria Principal"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="departureTime">Horário de Partida *</label>
                  <input
                    type="datetime-local"
                    id="departureTime"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleChange}
                    min={getMinDateTime()}
                    required
                  />
                </div>
              </div>

              {formData.type !== 'GROUP' && (
                <div className="form-group">
                  <label htmlFor="availableSeats">
                    Vagas Disponíveis * 
                    <span className="label-hint">(Quantas pessoas podem ir além de você)</span>
                  </label>
                  <input
                    type="number"
                    id="availableSeats"
                    name="availableSeats"
                    value={formData.availableSeats}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    required
                  />
                </div>
              )}

              {formData.type === 'GROUP' && (
                <div className="info-box">
                  ℹ️ Caronas do tipo "Grupo a Pé" não têm limite de vagas. Todos podem participar!
                </div>
              )}

              <div className="form-group">
                <label htmlFor="description">
                  Descrição (Opcional)
                  <span className="label-hint">Adicione informações extras sobre a carona</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Ex: Tenho ar condicionado, aceito parada no caminho, etc."
                  rows="4"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate(-1)} className="btn-cancel">
                Cancelar
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Criando...' : 'Criar Carona'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateRide;