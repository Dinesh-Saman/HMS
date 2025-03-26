import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaTachometerAlt, FaHotel, FaPlusCircle, 
  FaFileAlt, FaChartLine, FaSignOutAlt, FaHome 
} from 'react-icons/fa';
import Logo from '../Images/logo.png';

const SidebarContainer = styled.div`
  width: 220px;
  height: auto;
  background: url('https://img.freepik.com/free-vector/decorative-background-with-purple-damask-pattern_1048-3458.jpg') repeat;
  background-size: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  color: #ecf0f1;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.50); /* Increased darkness */
    z-index: 0;
  }
`;


const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
`;

const LogoImage = styled.img`
  width: 120px;
  height: auto;
  margin-bottom: 10px;
`;

const Menu = styled.div`
  flex-grow: 1;
  position: relative;
  z-index: 1;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 21px;
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #34495e;
    color: #fff;
  }
`;

const Icon = styled.div`
  margin-right: 15px;
  font-size: 20px;
`;

const SignOutContainer = styled.div`
  margin-top: auto;
  position: relative;
  z-index: 1;
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <LogoContainer>
        <LogoImage style={{ width: '180px' }} />
      </LogoContainer>
      <Menu>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaHome /></Icon>
            Home
          </MenuItem>
        </Link>
        <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaTachometerAlt /></Icon>
            Dashboard
          </MenuItem>
        </Link>
        <Link to="/view-hotels" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaHotel /></Icon>
            View Hotels
          </MenuItem>
        </Link>
        <Link to="/add-hotel" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaPlusCircle /></Icon>
            Add Hotel
          </MenuItem>
        </Link>
        <Link to="/hotel-report" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaFileAlt /></Icon>
            Hotel Report
          </MenuItem>
        </Link>

      </Menu>
      <SignOutContainer>
        <Link to="/main-dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaSignOutAlt /></Icon>
            Sign Out
          </MenuItem>
        </Link>
      </SignOutContainer>
    </SidebarContainer>
  );
};

export default Sidebar;
