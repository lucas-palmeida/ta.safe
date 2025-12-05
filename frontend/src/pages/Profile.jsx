import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api';
import { User, Mail, Briefcase, Edit2, Save, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    course: user?.course || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('Nome não pode ser vazio');
      return;
    }

    try {
      setLoading(true);
      const response = await userService.updateProfile(formData);
      updateUser(response.data.data);
      setSuccess('Perfil atualizado com sucesso!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      course: user?.course || ''
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <h1>Meu Perfil</h1>
          <p>Gerencie suas informações pessoais</p>
        </div>

        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="profile-badge">
              {user?.role === 'STUDENT' ? 'Aluno(a)' : 'Servidor(a)'}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {!isEditing ? (
            <div className="profile-info">
              <div className="info-item">
                <div className="info-icon">
                  <User size={20} />
                </div>
                <div>
                  <label>Nome Completo</label>
                  <p>{user?.name}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Mail size={20} />
                </div>
                <div>
                  <label>Email Institucional</label>
                  <p>{user?.email}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Briefcase size={20} />
                </div>
                <div>
                  <label>Curso / Área</label>
                  <p>{user?.course || 'Não informado'}</p>
                </div>
              </div>

              <button onClick={() => setIsEditing(true)} className="btn-edit">
                <Edit2 size={18} />
                Editar Perfil
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Nome Completo *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Institucional</label>
                <input
                  type="email"
                  id="email"
                  value={user?.email}
                  disabled
                />
                <small>O email não pode ser alterado</small>
              </div>

              <div className="form-group">
                <label htmlFor="course">Curso / Área</label>
                <input
                  type="text"
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="Ex: ADS - 3º Semestre"
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCancel} className="btn-cancel">
                  <X size={18} />
                  Cancelar
                </button>
                <button type="submit" className="btn-save" disabled={loading}>
                  <Save size={18} />
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;