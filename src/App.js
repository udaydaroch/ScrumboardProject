// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import LoginPage from './LoginPage';
import Scrumboard from './Scrumboard';
import StaffList from './StaffList';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <Router>
            {isLoggedIn ? (
                <>
                    <Navbar onLogout={handleLogout} />
                    <Routes>
                        <Route path="/scrumboard" element={<Scrumboard />} />
                        <Route path="/stafflist" element={<StaffList />} />
                        <Route path="*" element={<Navigate to="/scrumboard" />} />
                    </Routes>
                </>
            ) : (
                <Routes>
                    <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            )}
        </Router>
    );
};

export default App;
