import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { LayoutDashboard, Users, Heart, LogOut, Menu, X, UserPlus, Calendar } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--gray-50);
`;

const Sidebar = styled.aside`
  width: 260px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  color: var(--white);
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  
  @media (max-width: 768px) {
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.3s;
    z-index: 1000;
  }
`;

const SidebarHeader = styled.div`
  padding: var(--spacing-6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h2 {
    font-size: var(--font-size-xl);
    font-weight: 700;
    margin-bottom: var(--spacing-1);
  }
  
  p {
    font-size: var(--font-size-sm);
    opacity: 0.8;
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: var(--spacing-4);
  overflow-y: auto;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-lg);
  color: var(--white);
  text-decoration: none;
  margin-bottom: var(--spacing-2);
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.2);
    font-weight: 600;
  }
  
  svg {
    flex-shrink: 0;
  }
`;

const SidebarFooter = styled.div`
  padding: var(--spacing-4);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const LogoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: var(--radius-lg);
  color: var(--white);
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Main = styled.main`
  flex: 1;
  margin-left: 260px;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const TopBar = styled.div`
  background: var(--white);
  padding: var(--spacing-4) var(--spacing-6);
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .admin-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--white);
      font-weight: 600;
    }
    
    .details {
      .name {
        font-weight: 600;
        color: var(--gray-900);
        font-size: var(--font-size-sm);
      }
      
      .role {
        font-size: var(--font-size-xs);
        color: var(--gray-500);
      }
    }
  }
`;

const MenuButton = styled.button`
  display: none;
  padding: var(--spacing-2);
  background: none;
  border: none;
  color: var(--gray-700);
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Overlay = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

const Content = styled.div`
  padding: var(--spacing-6);
  min-height: calc(100vh - 72px);
`;

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Container>
      <Overlay isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      
      <Sidebar isOpen={sidebarOpen}>
        <SidebarHeader>
          <h2>Admin Panel</h2>
          <p>Maternal Health Hub</p>
        </SidebarHeader>

        <Nav>
          <NavItem to="/admin/dashboard" onClick={() => setSidebarOpen(false)}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavItem>
          
          <NavItem to="/admin/appointments" onClick={() => setSidebarOpen(false)}>
            <Calendar size={20} />
            <span>Appointments</span>
          </NavItem>
          
          {admin && admin.role === 'super_admin' && (
            <NavItem to="/admin/register" onClick={() => setSidebarOpen(false)}>
              <UserPlus size={20} />
              <span>Create Admin</span>
            </NavItem>
          )}
        </Nav>

        <SidebarFooter>
          <LogoutButton onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </LogoutButton>
        </SidebarFooter>
      </Sidebar>

      <Main>
        <TopBar>
          <MenuButton onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </MenuButton>
          
          {admin && (
            <div className="admin-info">
              <div className="avatar">{getInitials(admin.name)}</div>
              <div className="details">
                <div className="name">{admin.name}</div>
                <div className="role">{admin.role.replace('_', ' ')}</div>
              </div>
            </div>
          )}
        </TopBar>

        <Content>{children}</Content>
      </Main>
    </Container>
  );
};

export default AdminLayout;
