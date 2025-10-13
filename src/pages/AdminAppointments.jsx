import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Calendar,
  Edit,
  Trash2,
  Filter,
  Search,
  User,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
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
  }

  .filters {
    display: flex;
    gap: var(--spacing-3);
    align-items: center;
  }
`;

const SearchInput = styled.input`
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  min-width: 250px;

  &:focus {
    outline: none;
    border-color: var(--primary);
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

const AppointmentsGrid = styled.div`
  display: grid;
  gap: var(--spacing-4);
`;

const AppointmentCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-5);
  box-shadow: var(--shadow-md);
  border-left: 4px solid ${props =>
    props.status === 'upcoming' ? 'var(--success)' :
    props.status === 'completed' ? 'var(--primary)' :
    'var(--gray-300)'};
`;

const AppointmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: var(--spacing-3);

  .appointment-id {
    font-size: var(--font-size-sm);
    color: var(--gray-500);
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

  .user-email {
    font-size: var(--font-size-sm);
    color: var(--gray-600);
  }
`;

const AppointmentDetails = styled.div`
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

const AppointmentActions = styled.div`
  display: flex;
  gap: var(--spacing-2);
  justify-content: flex-end;

  button {
    padding: var(--spacing-2) var(--spacing-3);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    cursor: pointer;
    transition: all var(--transition-normal);

    &.edit {
      background: var(--primary-light);
      color: var(--primary);
      border: none;

      &:hover {
        background: var(--primary);
        color: var(--white);
      }
    }

    &.delete {
      background: var(--red-100);
      color: var(--red-600);
      border: none;

      &:hover {
        background: var(--red-600);
        color: var(--white);
      }
    }
  }
`;

const StatusBadge = styled.span`
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 500;
  text-transform: uppercase;

  &.upcoming {
    background: var(--success-light);
    color: var(--success);
  }

  &.completed {
    background: var(--primary-light);
    color: var(--primary);
  }

  &.cancelled {
    background: var(--gray-100);
    color: var(--gray-600);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--gray-200);
    border-top: 4px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.admin.appointments.getAll();
      setAppointments(response.data || []);
    } catch (err) {
      toast.error('Failed to load appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(appt =>
        appt.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.centerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appt => appt.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  };

  const handleDelete = async (appointmentId) => {
    // eslint-disable-next-line no-restricted-globals
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;

    try {
      await api.admin.appointments.delete(appointmentId);
      toast.success('Appointment deleted successfully');
      fetchAppointments();
    } catch (err) {
      toast.error('Failed to delete appointment');
    }
  };

  const getStatusBadge = (status) => {
    return <StatusBadge className={status}>{status}</StatusBadge>;
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          <div className="spinner" />
        </LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <h1>Appointment Management</h1>
        <div className="filters">
          <SearchInput
            type="text"
            placeholder="Search by user or center..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </FilterSelect>
        </div>
      </Header>

      <AppointmentsGrid>
        {filteredAppointments.map(appointment => (
          <AppointmentCard key={appointment.id} status={appointment.status}>
            <AppointmentHeader>
              <div className="appointment-id">#{appointment.id}</div>
              {getStatusBadge(appointment.status)}
            </AppointmentHeader>

            <UserInfo>
              <User size={20} color="var(--primary)" />
              <div>
                <div className="user-name">{appointment.userName}</div>
                <div className="user-email">{appointment.userEmail}</div>
              </div>
            </UserInfo>

            <AppointmentDetails>
              <div className="detail-item">
                <MapPin size={16} />
                <div>
                  <div className="label">Center</div>
                  <div className="value">{appointment.centerName}</div>
                </div>
              </div>

              <div className="detail-item">
                <Calendar size={16} />
                <div>
                  <div className="label">Date</div>
                  <div className="value">
                    {new Date(appointment.date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="detail-item">
                <Clock size={16} />
                <div>
                  <div className="label">Time</div>
                  <div className="value">{appointment.time}</div>
                </div>
              </div>

              <div className="detail-item">
                <AlertCircle size={16} />
                <div>
                  <div className="label">Reason</div>
                  <div className="value">{appointment.reason.replace('_', ' ')}</div>
                </div>
              </div>
            </AppointmentDetails>

            {appointment.notes && (
              <div style={{ marginBottom: 'var(--spacing-3)' }}>
                <div className="label">Notes:</div>
                <div style={{ color: 'var(--gray-600)', fontSize: 'var(--font-size-sm)' }}>
                  {appointment.notes}
                </div>
              </div>
            )}

            <AppointmentActions>
              <button className="edit">
                <Edit size={14} /> Edit
              </button>
              <button className="delete" onClick={() => handleDelete(appointment.id)}>
                <Trash2 size={14} /> Delete
              </button>
            </AppointmentActions>
          </AppointmentCard>
        ))}
      </AppointmentsGrid>

      {filteredAppointments.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-500)' }}>
          No appointments found matching your criteria.
        </div>
      )}
    </Container>
  );
};

export default AdminAppointments;
