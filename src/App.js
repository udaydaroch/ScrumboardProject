// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Pages/Navbar';
import LoginPage from './Pages/LoginPage';
import Scrumboard from './Pages/Scrumboard';
import StaffList from './Pages/StaffList';
import SetupBoard from './Pages/SetupBoard';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // New state to check if the user is admin

    const handleLogin = (username) => {
        setIsLoggedIn(true);
        console.log(username);
        setIsAdmin(username === 'admin'); // Set admin status based on the username
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setIsAdmin(false);
    };

    return (
        <Router>
            {isLoggedIn ? (
                <>
                    <Navbar onLogout={handleLogout} isAdmin={isAdmin} />
                    <Routes>
                        <Route path="/scrumboard" element={<Scrumboard />} />
                        <Route path="/stafflist" element={<StaffList />} />
                        {isAdmin && <Route path="/setupboard" element={<SetupBoard />} />} {/* Admin route */}
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
