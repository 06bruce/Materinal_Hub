import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Calendar, Clock, User, MapPin } from 'lucide-react';
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
  
  const fetchSlots = async (selectedDate) => {
    try {
      setLoading(true);
      const response = await api.appointments.getSlots(centerId, selectedDate);
      setAvailableSlots(response.data.slots || []);
    } catch (err) {
      toast.error('Failed to fetch available slots');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    setTime(''); // Reset time when date changes
    if (selectedDate) {
      fetchSlots(selectedDate);
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
          
          <FormGroup>
            <label htmlFor="appointment-time">
              <Clock size={16} style={{ marginRight: '0.5rem' }} />
              Time Slot
            </label>
            <select 
              id="appointment-time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              disabled={!date || availableSlots.length === 0 || loading}
            >
              <option value="">{availableSlots.length ? 'Select a time' : 'No slots available'}</option>
              {availableSlots.map(slot => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="appointment-reason">
              <User size={16} style={{ marginRight: '0.5rem' }} />
              Reason for Visit
            </label>
            <select 
              id="appointment-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              disabled={loading}
            >
              <option value="prenatal">Prenatal Checkup</option>
              <option value="postpartum">Postpartum Visit</option>
              <option value="vaccination">Vaccination</option>
              <option value="mental_health">Mental Health Consultation</option>
              <option value="other">Other</option>
            </select>
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
              {loading ? 'Processing...' : 'Confirm Appointment'}
            </SubmitButton>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AppointmentModal;