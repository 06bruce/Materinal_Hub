import React from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Clock, MapPin } from 'lucide-react';

export const CalendarContainer = styled.div`
  .react-calendar {
    width: 100%;
    border: none;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    padding: var(--spacing-4);
    background: var(--white);
    
    .react-calendar__tile {
      padding: 0.5em;
      position: relative;
      
      &.has-appointment::after {
        content: '';
        position: absolute;
        bottom: 4px;
        left: 50%;
        transform: translateX(-50%);
        width: 6px;
        height: 6px;
        background: var(--primary);
        border-radius: 50%;
      }
      
      &.has-appointment.upcoming::after {
        background: var(--success);
      }
    }
    
    .react-calendar__tile--active {
      background: var(--primary);
      color: white;
      
      &.has-appointment::after {
        background: white;
      }
    }
  }
  
  .appointment-details {
    margin-top: var(--spacing-4);
    background: var(--white);
    border-radius: var(--radius-lg);
    padding: var(--spacing-4);
    box-shadow: var(--shadow-sm);
    
    h4 {
      margin-bottom: var(--spacing-2);
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }
    
    .appointment-meta {
      display: flex;
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-2);
      font-size: var(--font-size-sm);
      color: var(--gray-600);
      
      div {
        display: flex;
        align-items: center;
        gap: var(--spacing-1);
      }
    }
  }
`;

export default function AppointmentCalendar({ appointments, onDateChange }) {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  
  const tileClassName = ({ date }) => {
    const dateStr = date.toISOString().split('T')[0];
    const hasAppointment = appointments.some(
      appt => new Date(appt.date).toISOString().split('T')[0] === dateStr
    );
    const isUpcoming = hasAppointment && date > new Date();
    
    return [
      hasAppointment ? 'has-appointment' : '',
      isUpcoming ? 'upcoming' : ''
    ].join(' ');
  };
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateChange && onDateChange(date);
  };
  
  const selectedAppointments = appointments.filter(
    appt => new Date(appt.date).toISOString().split('T')[0] === 
           selectedDate.toISOString().split('T')[0]
  );

  return (
    <CalendarContainer>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileClassName={tileClassName}
      />
      
      {selectedAppointments.length > 0 && (
        <div className="appointment-details">
          <h4>Appointments on {selectedDate.toLocaleDateString()}</h4>
          {selectedAppointments.map(appt => (
            <div key={appt.id} style={{ marginBottom: 'var(--spacing-3)' }}>
              <div className="appointment-meta">
                <div>
                  <Clock size={14} />
                  {appt.time}
                </div>
                <div>
                  <MapPin size={14} />
                  {appt.centerName}
                </div>
              </div>
              <div>Reason: {appt.reason.replace('_', ' ')}</div>
            </div>
          ))}
        </div>
      )}
    </CalendarContainer>
  );
}
