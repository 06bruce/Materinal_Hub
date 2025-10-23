import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  AlertTriangle,
  Trash2,
  User,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  Building2
} from 'lucide-react';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-6);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);

  h1 {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--gray-900);
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
  }

  .filters {
    display: flex;
    gap: var(--spacing-3);
    align-items: center;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
`;

const StatCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-sm);
  border-left: 4px solid ${props => props.color || 'var(--primary)'};

  .stat-label {
    font-size: var(--font-size-sm);
    color: var(--gray-600);
    margin-bottom: var(--spacing-2);
  }

  .stat-value {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--gray-900);
  }
`;

const FilterSelect = styled.select`
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const EmergenciesGrid = styled.div`
  display: grid;
  gap: var(--spacing-4);
`;

const EmergencyCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-5);
  box-shadow: var(--shadow-md);
  border-left: 4px solid ${props =>
    props.status === 'pending' ? 'var(--error)' :
    props.status === 'responded' ? 'var(--warning)' :
    props.status === 'resolved' ? 'var(--success)' :
    'var(--gray-300)'};
`;

const EmergencyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: var(--spacing-3);

  .emergency-id {
    font-size: var(--font-size-sm);
    color: var(--gray-500);
    font-family: monospace;
  }
`;

const StatusBadge = styled.span`
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 600;
  
  &.pending {
    background: var(--error-bg);
    color: var(--error);
  }
  
  &.responded {
    background: var(--warning-bg);
    color: var(--warning);
  }
  
  &.resolved {
    background: var(--success-bg);
    color: var(--success);
  }
  
  &.cancelled {
    background: var(--gray-200);
    color: var(--gray-700);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-3);

  .user-name {
    font-weight: 600;
    color: var(--gray-900);
  }

  .user-phone {
    font-size: var(--font-size-sm);
    color: var(--gray-600);
  }
`;

const EmergencyDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-4);

  .detail-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);

    .label {
      font-size: var(--font-size-sm);
      color: var(--gray-600);
    }

    .value {
      font-weight: 500;
      color: var(--gray-900);
    }
  }
`;

const HospitalsList = styled.div`
  margin-top: var(--spacing-3);
  padding: var(--spacing-3);
  background: var(--gray-50);
  border-radius: var(--radius-md);

  h4 {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--gray-700);
    margin-bottom: var(--spacing-2);
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }

  .hospital-item {
    padding: var(--spacing-2);
    font-size: var(--font-size-sm);
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    
    &.responded {
      background: var(--success-bg);
      border-radius: var(--radius-sm);
      margin: var(--spacing-1) 0;
      padding: var(--spacing-2);
    }
  }
`;

const EmergencyActions = styled.div`
  display: flex;
  gap: var(--spacing-2);
  justify-content: flex-end;
  margin-top: var(--spacing-4);

  button {
    padding: var(--spacing-2) var(--spacing-3);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    cursor: pointer;
    transition: all var(--transition-normal);
    display: flex;
    align-items: center;
    gap: var(--spacing-2);

    &.resolve {
      background: var(--success);
      color: var(--white);
      border: none;

      &:hover {
        background: var(--success-dark);
      }
    }

    &.delete {
      background: var(--error-light);
      color: var(--error);
      border: none;

      &:hover {
        background: var(--error);
        color: var(--white);
      }
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-8);
  color: var(--gray-600);
`;

const LoadingState = styled.div`
  text-align: center;
  padding: var(--spacing-8);
  color: var(--gray-600);
`;

const AdminEmergencies = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchEmergencies = useCallback(async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await api.admin.emergencies.getAll(params);
      setEmergencies(response.data.emergencies);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching emergencies:', error);
      toast.error('Failed to load emergencies');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchEmergencies();
  }, [fetchEmergencies]);

  const handleResolve = async (emergencyId) => {
    try {
      await api.admin.emergencies.update(emergencyId, { status: 'resolved' });
      toast.success('Emergency marked as resolved');
      fetchEmergencies();
    } catch (error) {
      console.error('Error resolving emergency:', error);
      toast.error('Failed to resolve emergency');
    }
  };

  const handleDelete = async (emergencyId) => {
    if (!window.confirm('Are you sure you want to delete this emergency record?')) {
      return;
    }

    try {
      await api.admin.emergencies.delete(emergencyId);
      toast.success('Emergency deleted successfully');
      fetchEmergencies();
    } catch (error) {
      console.error('Error deleting emergency:', error);
      toast.error('Failed to delete emergency');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSince = (dateString) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffMinutes = Math.floor((now - created) / 1000 / 60);
    
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return `${Math.floor(diffMinutes / 1440)} days ago`;
  };

  return (
    <Container>
      <Header>
        <h1>
          <AlertTriangle size={32} />
          Emergency Alerts
        </h1>
        <div className="filters">
          <FilterSelect value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="responded">Responded</option>
            <option value="resolved">Resolved</option>
            <option value="cancelled">Cancelled</option>
          </FilterSelect>
        </div>
      </Header>

      {stats && (
        <StatsGrid>
          <StatCard color="var(--primary)">
            <div className="stat-label">Total Emergencies</div>
            <div className="stat-value">{stats.total}</div>
          </StatCard>
          <StatCard color="var(--error)">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{stats.pending}</div>
          </StatCard>
          <StatCard color="var(--warning)">
            <div className="stat-label">Responded</div>
            <div className="stat-value">{stats.responded}</div>
          </StatCard>
          <StatCard color="var(--success)">
            <div className="stat-label">Resolved</div>
            <div className="stat-value">{stats.resolved}</div>
          </StatCard>
        </StatsGrid>
      )}

      {loading ? (
        <LoadingState>Loading emergencies...</LoadingState>
      ) : emergencies.length === 0 ? (
        <EmptyState>
          <AlertTriangle size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
          <p>No emergency alerts found</p>
        </EmptyState>
      ) : (
        <EmergenciesGrid>
          {emergencies.map((emergency) => (
            <EmergencyCard key={emergency._id} status={emergency.status}>
              <EmergencyHeader>
                <div>
                  <div className="emergency-id">{emergency.emergencyId}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-500)', marginTop: '4px' }}>
                    {getTimeSince(emergency.createdAt)}
                  </div>
                </div>
                <StatusBadge className={emergency.status}>
                  {emergency.status.toUpperCase()}
                </StatusBadge>
              </EmergencyHeader>

              <UserInfo>
                <User size={20} />
                <div>
                  <div className="user-name">{emergency.userData?.name || emergency.userId?.name || 'Unknown'}</div>
                  <div className="user-phone">
                    <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    {emergency.userData?.phone || emergency.userId?.phone || 'N/A'}
                  </div>
                </div>
              </UserInfo>

              <EmergencyDetails>
                <div className="detail-item">
                  <Clock size={16} />
                  <div>
                    <div className="label">Created At</div>
                    <div className="value">{formatDate(emergency.createdAt)}</div>
                  </div>
                </div>
                {emergency.location && (
                  <div className="detail-item">
                    <MapPin size={16} />
                    <div>
                      <div className="label">Location</div>
                      <div className="value">
                        {emergency.location.lat.toFixed(4)}, {emergency.location.lng.toFixed(4)}
                      </div>
                    </div>
                  </div>
                )}
                {emergency.respondedHospital && (
                  <div className="detail-item">
                    <Building2 size={16} />
                    <div>
                      <div className="label">Responded By</div>
                      <div className="value">{emergency.respondedHospital.name}</div>
                    </div>
                  </div>
                )}
              </EmergencyDetails>

              {emergency.hospitals && emergency.hospitals.length > 0 && (
                <HospitalsList>
                  <h4>
                    <Building2 size={16} />
                    Alerted Hospitals ({emergency.hospitals.length})
                  </h4>
                  {emergency.hospitals.map((hospital, index) => (
                    <div 
                      key={hospital.hospitalId || index}
                      className={`hospital-item ${emergency.respondedHospital?.hospitalId === hospital.hospitalId ? 'responded' : ''}`}
                    >
                      {emergency.respondedHospital?.hospitalId === hospital.hospitalId && (
                        <CheckCircle size={16} color="var(--success)" />
                      )}
                      {hospital.name} - {hospital.emergencyPhone}
                      {hospital.distance && ` (${hospital.distance.toFixed(1)} km)`}
                    </div>
                  ))}
                </HospitalsList>
              )}

              <EmergencyActions>
                {emergency.status !== 'resolved' && emergency.status !== 'cancelled' && (
                  <button className="resolve" onClick={() => handleResolve(emergency._id)}>
                    <CheckCircle size={16} />
                    Mark as Resolved
                  </button>
                )}
                {(emergency.status === 'resolved' || emergency.status === 'cancelled') && (
                  <button className="delete" onClick={() => handleDelete(emergency._id)}>
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}
              </EmergencyActions>
            </EmergencyCard>
          ))}
        </EmergenciesGrid>
      )}
    </Container>
  );
};

export default AdminEmergencies;
