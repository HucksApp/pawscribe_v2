import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App.js';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from './contexts/ThemeProvider.jsx';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ConfigProvider>
        <App />
    </ConfigProvider>
  </ThemeProvider>
  </React.StrictMode>
);