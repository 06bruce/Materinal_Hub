import React, { useState } from 'react';
import styled from 'styled-components';
import { Calendar, Baby, Heart, Scale, Info } from 'lucide-react';
import { useUser } from '../context/UserContext';

const TrackerContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--spacing-4);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-8);
  
  h1 {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--spacing-4);
  }
  
  p {
    font-size: var(--font-size-lg);
    color: var(--gray-600);
  }
`;

const ProgressCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-6);
  box-shadow: var(--shadow-md);
  
  .progress-bar {
    width: 100%;
    height: 12px;
    background: var(--gray-200);
    border-radius: var(--radius-full);
    overflow: hidden;
    margin: var(--spacing-4) 0;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
    border-radius: var(--radius-full);
    transition: width 0.3s ease;
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
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  text-align: center;
  box-shadow: var(--shadow-sm);
  
  .icon {
    width: 48px;
    height: 48px;
    margin: 0 auto var(--spacing-3);
    background: var(--primary-light);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
  }
  
  .number {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--spacing-1);
  }
  
  .label {
    font-size: var(--font-size-sm);
    color: var(--gray-600);
  }
`;

const WeekInfo = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  
  h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--spacing-4);
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-4);
  }
  
  .info-item {
    padding: var(--spacing-4);
    background: var(--gray-50);
    border-radius: var(--radius-lg);
    
    h4 {
      font-weight: 600;
      color: var(--gray-900);
      margin-bottom: var(--spacing-2);
    }
    
    p {
      color: var(--gray-600);
      line-height: 1.6;
    }
  }
`;

const SetupForm = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  
  h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--spacing-4);
  }
  
  .form-group {
    margin-bottom: var(--spacing-4);
    
    label {
      display: block;
      font-weight: 500;
      color: var(--gray-700);
      margin-bottom: var(--spacing-2);
    }
    
    input {
      width: 100%;
      padding: var(--spacing-3);
      border: 2px solid var(--gray-200);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      
      &:focus {
        outline: none;
        border-color: var(--primary);
      }
    }
  }
  
  button {
    background: var(--primary);
    color: var(--white);
    border: none;
    padding: var(--spacing-3) var(--spacing-6);
    border-radius: var(--radius-lg);
    font-weight: 500;
    cursor: pointer;
    
    &:hover {
      background: var(--primary-dark);
    }
  }
`;

const PregnancyTracker = () => {
  const { preferences, setPregnancyDates, calculatePregnancyWeek, getDaysUntilDue } = useUser();
  const [startDate, setStartDate] = useState(preferences.pregnancyStartDate || '');
  const [dueDate, setDueDate] = useState(preferences.dueDate || '');

  const currentWeek = calculatePregnancyWeek() || preferences.currentWeek || 0;
  const daysUntilDue = getDaysUntilDue();
  const progressPercentage = Math.min((currentWeek / 40) * 100, 100);

  const handleSetup = () => {
    if (startDate && dueDate) {
      setPregnancyDates(startDate, dueDate);
    }
  };

  const weekInfo = {
    rw: {
      baby: "Umwana wawe afite uburebure bwa cm 2.5 kandi afite ibiro bya gram 28.",
      mother: "Ushobora kumva ububabare mu nda kandi ushobora kumva umwana akina.",
      tips: "Fata vitamini zawe buri munsi, unywa amazi menshi, kandi ujya kwa muganga."
    },
    en: {
      baby: "Your baby is about 2.5 cm long and weighs about 28 grams.",
      mother: "You may feel abdominal pain and you may feel the baby moving.",
      tips: "Take your vitamins daily, drink plenty of water, and see your doctor."
    }
  };

  const currentInfo = weekInfo.rw; // Default to Kinyarwanda

  if (!preferences.pregnancyStartDate) {
    return (
      <TrackerContainer>
        <Header>
          <h1>Pregnancy Tracker Setup</h1>
          <p>Set up your pregnancy dates to start tracking</p>
        </Header>
        
        <SetupForm>
          <h3>Enter Your Pregnancy Information</h3>
          <div className="form-group">
            <label>First Day of Last Period</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <button onClick={handleSetup}>Start Tracking</button>
        </SetupForm>
      </TrackerContainer>
    );
  }

  return (
    <TrackerContainer>
      <Header>
        <h1>Pregnancy Tracker</h1>
        <p>Week {currentWeek} of 40</p>
      </Header>

      <ProgressCard>
        <h3>Your Progress</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p>{Math.round(progressPercentage)}% Complete</p>
      </ProgressCard>

      <StatsGrid>
        <StatCard>
          <div className="icon">
            <Calendar size={24} />
          </div>
          <div className="number">{currentWeek}</div>
          <div className="label">Current Week</div>
        </StatCard>
        
        <StatCard>
          <div className="icon">
            <Baby size={24} />
          </div>
          <div className="number">{daysUntilDue || 'N/A'}</div>
          <div className="label">Days Until Due</div>
        </StatCard>
        
        <StatCard>
          <div className="icon">
            <Heart size={24} />
          </div>
          <div className="number">40</div>
          <div className="label">Total Weeks</div>
        </StatCard>
        
        <StatCard>
          <div className="icon">
            <Scale size={24} />
          </div>
          <div className="number">28g</div>
          <div className="label">Baby Weight</div>
        </StatCard>
      </StatsGrid>

      <WeekInfo>
        <h3>
          <Info size={20} />
          Week {currentWeek} Information
        </h3>
        <div className="info-grid">
          <div className="info-item">
            <h4>Baby Development</h4>
            <p>{currentInfo.baby}</p>
          </div>
          <div className="info-item">
            <h4>How You May Feel</h4>
            <p>{currentInfo.mother}</p>
          </div>
          <div className="info-item">
            <h4>Tips for This Week</h4>
            <p>{currentInfo.tips}</p>
          </div>
        </div>
      </WeekInfo>
    </TrackerContainer>
  );
};

export default PregnancyTracker;
