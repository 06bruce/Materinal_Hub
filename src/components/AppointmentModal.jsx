import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Calendar, Clock, User, MapPin, Info, AlertCircle } from 'lucide-react';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: var(--radius-xl);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--gray-500);
  transition: color 0.2s;

  &:hover {
    color: var(--gray-700);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--gray-700);
  }
  
  input, select, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--gray-300);
    border-radius: var(--radius-md);
    font-size: 1rem;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: var(--gray-200);
    transform: translateY(-1px);
  }
`;

const SubmitButton = styled.button`
  flex: 1;
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: var(--gray-300);
    cursor: not-allowed;
    transform: none;
  }
`;

const SlotInfo = styled.div`
  background: var(--blue-50);
  border: 1px solid var(--blue-200);
  border-radius: var(--radius-md);
  padding: 1rem;
  margin-bottom: 1rem;
  
  .info-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--blue-700);
  }
  
  .info-content {
    font-size: 0.875rem;
    color: var(--blue-600);
    line-height: 1.4;
  }
`;

const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
  
  .slot-item {
    padding: 0.5rem;
    border: 1px solid var(--gray-300);
    border-radius: var(--radius-sm);
    text-align: center;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
    
    &:hover {
      border-color: var(--primary);
      background: var(--primary-50);
    }
    
    &.selected {
      border-color: var(--primary);
      background: var(--primary);
      color: white;
    }
    
    &.unavailable {
      background: var(--gray-100);
      color: var(--gray-400);
      cursor: not-allowed;
      border-color: var(--gray-200);
    }
  }
`;

const ErrorMessage = styled.div`
  background: var(--red-50);
  border: 1px solid var(--red-200);
  border-radius: var(--radius-md);
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--red-700);
  font-size: 0.875rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid var(--gray-300);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const AppointmentModal = ({ 
  centerId, 
  centerName, 
  onClose, 
  onSuccess 
}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('prenatal');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [slotInfo, setSlotInfo] = useState(null);
  const [error, setError] = useState(null);
  
  // Load appointment types on component mount
  useEffect(() => {
    const loadAppointmentTypes = async () => {
      try {
        const response = await api.appointments.getTypes();
        setAppointmentTypes(response.data.appointmentTypes || []);
      } catch (err) {
        console.error('Failed to load appointment types:', err);
      }
    };
    loadAppointmentTypes();
  }, []);
  
  const fetchSlots = async (selectedDate, appointmentType = reason) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.appointments.getSlots(centerId, selectedDate, appointmentType);
      setAvailableSlots(response.data.slots || []);
      setSlotInfo(response.data.slotInfo);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch available slots';
      setError(errorMessage);
      setAvailableSlots([]);
      setSlotInfo(null);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    setTime(''); // Reset time when date changes
    if (selectedDate) {
      fetchSlots(selectedDate, reason);
    }
  };

  const handleReasonChange = (e) => {
    const newReason = e.target.value;
    setReason(newReason);
    setTime(''); // Reset time when appointment type changes
    if (date) {
      fetchSlots(date, newReason);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || !date || !time) return;

    setLoading(true);
    try {
      await api.appointments.book({
        centerId,
        date,
        time,
        reason,
        notes: notes.trim() || undefined
      });
      toast.success('Appointment booked successfully!');
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error('Booking failed:', err);
      toast.error(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="Close modal">
          <X size={24} />
        </CloseButton>
        
        <h2 style={{ 
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <MapPin size={20} />
          Book at {centerName}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <ErrorMessage>
              <AlertCircle size={16} />
              {error}
            </ErrorMessage>
          )}

          <FormGroup>
            <label htmlFor="appointment-reason">
              <User size={16} style={{ marginRight: '0.5rem' }} />
              Reason for Visit
            </label>
            <select 
              id="appointment-reason"
              value={reason}
              onChange={handleReasonChange}
              required
              disabled={loading}
            >
              {appointmentTypes.length > 0 ? (
                appointmentTypes.map(type => (
                  <option key={type.type} value={type.type}>
                    {type.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} ({type.duration}min)
                  </option>
                ))
              ) : (
                <>
                  <option value="prenatal">Prenatal Checkup</option>
                  <option value="postpartum">Postpartum Visit</option>
                  <option value="vaccination">Vaccination</option>
                  <option value="mental_health">Mental Health Consultation</option>
                  <option value="emergency">Emergency</option>
                  <option value="therapy">Therapy</option>
                </>
              )}
            </select>
          </FormGroup>

          <FormGroup>
            <label htmlFor="appointment-date">
              <Calendar size={16} style={{ marginRight: '0.5rem' }} />
              Date
            </label>
            <input 
              type="date" 
              id="appointment-date"
              value={date}
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]}
              required 
              disabled={loading}
            />
          </FormGroup>
          
          {slotInfo && (
            <SlotInfo>
              <div className="info-header">
                <Info size={16} />
                Appointment Information
              </div>
              <div className="info-content">
                <strong>Duration:</strong> {slotInfo.duration} minutes<br/>
                <strong>Type:</strong> {slotInfo.description}<br/>
                {slotInfo.requiresSpecialist && <><strong>Note:</strong> Specialist consultation required</>}
              </div>
            </SlotInfo>
          )}
          
          <FormGroup>
            <label htmlFor="appointment-time">
              <Clock size={16} style={{ marginRight: '0.5rem' }} />
              Available Time Slots
              {loading && <LoadingSpinner style={{ marginLeft: '0.5rem' }} />}
            </label>
            
            {availableSlots.length > 0 ? (
              <SlotGrid>
                {availableSlots.map(slot => (
                  <div
                    key={slot}
                    className={`slot-item ${time === slot ? 'selected' : ''}`}
                    onClick={() => setTime(slot)}
                  >
                    {slot}
                  </div>
                ))}
              </SlotGrid>
            ) : date && !loading ? (
              <div style={{ 
                padding: '1rem', 
                textAlign: 'center', 
                color: 'var(--gray-500)',
                background: 'var(--gray-50)',
                borderRadius: 'var(--radius-md)'
              }}>
                No available slots for this date and appointment type
              </div>
            ) : null}
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="appointment-notes">
              Additional Notes (Optional)
            </label>
            <textarea 
              id="appointment-notes"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requirements or notes for the doctor..."
              disabled={loading}
            />
          </FormGroup>
          
          <ButtonGroup>
            <CancelButton 
              type="button" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </CancelButton>
            <SubmitButton 
              type="submit" 
              disabled={loading || !date || !time}
            >
              {loading ? 'Processing...' : `Book ${reason.replace('_', ' ')} Appointment`}
            </SubmitButton>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AppointmentModal;