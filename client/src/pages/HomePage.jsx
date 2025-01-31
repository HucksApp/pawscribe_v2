import React, { useState } from 'react';
import '../css/home.css';
import Logo from '../components/Logo';
import LoginModal from '../components/Login';
import SignupModal from '../components/Signup';
import { CheckCircleOutlined } from '@ant-design/icons';
const HomePage = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <div className="home">
      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <SignupModal open={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
      <div className="head">
        <Logo />
      </div>
      <div className="title">
        <div className="block1">
          Welcome Back to Pawscribe! Vscode in the cloud.
        </div>
        <div className="block_others">
          <div className="block2">
            <p className="question">Quick Access</p>
            <p className="p1">
              <CheckCircleOutlined /> Access all your files in one place.
            </p>
            <p className="p2">
              <CheckCircleOutlined /> View project shared with you by others.
            </p>
            <p className="p3">
              <CheckCircleOutlined /> Software development IDE.
            </p>
            <p className="p4">
              <CheckCircleOutlined /> Coding collaborations and pair
              programming.
            </p>
          </div>
          <div className="block3">
            <p className="question">User Tips</p>
            <p className="p1">
              <CheckCircleOutlined /> Organize files with folders.
            </p>
            <p className="p2">
              <CheckCircleOutlined /> Control files with permission settings.
            </p>
          </div>
        </div>
      </div>
      <div className="buttons">
        <button onClick={() => setIsLoginOpen(true)} className="login_button">
          Login
        </button>
        <button onClick={() => setIsSignupOpen(true)} className="signup_button">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default HomePage;
