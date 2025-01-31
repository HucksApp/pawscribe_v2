import React from 'react';
import '../css/logo.css';
import lightLogo from '../images/logo_light.svg';
import darkLogo from '../images/logo_dark.svg';
import { useNavigate } from 'react-router-dom';
import { useTheme } from "../contexts/ThemeProvider";


const Logo = () => {
  const navigate = useNavigate();
  const { themeMode } = useTheme(); // Use the theme context

  const handleClick = (event) => {
    event.stopPropagation(); // Prevent the event from affecting parent components
    navigate('/');
  };

  return (
    <div  className="logo">
      <div onClick={handleClick}>
      <img src={ themeMode === "light" ? lightLogo : darkLogo } alt="pawscribe" className="logo_image" />
      <div>PAWSCRIBE</div>
      </div>
    </div>
  );
};

export default Logo;
