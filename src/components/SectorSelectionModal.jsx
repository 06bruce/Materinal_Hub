import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Search } from 'lucide-react';
import { RWANDA_SECTORS, searchSectors } from '../data/rwandaSectors';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-4);
`;

const Modal = styled(motion.div)`
  background: var(--white);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-6);
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-6);
  
  h2 {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--gray-900);
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--gray-500);
  cursor: pointer;
  padding: var(--spacing-2);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--gray-100);
    color: var(--gray-700);
  }
`;

const SearchBox = styled.div`
  position: relative;
  margin-bottom: var(--spacing-4);
  
  input {
    width: 100%;
    padding: var(--spacing-3) var(--spacing-4);
    padding-left: var(--spacing-12);
    border: 2px solid var(--gray-200);
    border-radius: var(--radius-lg);
    font-size: var(--font-size-base);
    transition: all var(--transition-normal);
    
    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-light);
    }
  }
  
  svg {
    position: absolute;
    left: var(--spacing-3);
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-400);
  }
`;

const DistrictSection = styled.div`
  margin-bottom: var(--spacing-6);
  
  h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--gray-800);
    margin-bottom: var(--spacing-3);
    padding-bottom: var(--spacing-2);
    border-bottom: 2px solid var(--gray-200);
  }
`;

const SectorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--spacing-2);
`;

const SectorButton = styled.button`
  padding: var(--spacing-3);
  background: var(--white);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  color: var(--gray-700);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    border-color: var(--primary);
    color: var(--primary);
    background: var(--primary-light);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: var(--spacing-8);
  color: var(--gray-500);
`;

const SectorSelectionModal = ({ isOpen, onClose, onSelectSector }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filterSectors = () => {
    if (!searchTerm) return RWANDA_SECTORS;
    return searchSectors(searchTerm);
  };

  const handleSelectSector = (district, sector) => {
    onSelectSector({ district, sector });
    onClose();
  };

  const filteredSectors = filterSectors();
  const hasResults = Object.keys(filteredSectors).length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Modal
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Header>
              <h2>
                <MapPin size={24} />
                Select Your Sector
              </h2>
              <CloseButton onClick={onClose}>
                <X size={24} />
              </CloseButton>
            </Header>

            <SearchBox>
              <Search size={20} />
              <input
                type="text"
                placeholder="Search district or sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBox>

            {hasResults ? (
              Object.keys(filteredSectors).map(district => (
                <DistrictSection key={district}>
                  <h3>{district} District</h3>
                  <SectorGrid>
                    {filteredSectors[district].map(sector => (
                      <SectorButton
                        key={sector}
                        onClick={() => handleSelectSector(district, sector)}
                      >
                        {sector}
                      </SectorButton>
                    ))}
                  </SectorGrid>
                </DistrictSection>
              ))
            ) : (
              <NoResults>
                No sectors found matching "{searchTerm}"
              </NoResults>
            )}
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default SectorSelectionModal;
