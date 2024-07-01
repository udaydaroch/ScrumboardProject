import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate, useLocation} from 'react-router-dom';
import Navbar from './Pages/Navbar';
import LoginPage from './Pages/LoginPage';
import Scrumboard from './Pages/Scrumboard';
import StaffList from './Pages/StaffList';
import SetupBoard from './Pages/SetupBoard';
import useSessionStore from "./zustandStorage/UserSessionInfo";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdminLogged, setIsAdminLogged] = useState(false); // New state to check if the user is admin
    const { token, userId, isAdmin } = useSessionStore();

    useEffect(() => {
        if (token && userId) {
            setIsLoggedIn(true);
            setIsAdminLogged(isAdmin);
        }
    }, [token, userId, isAdmin]);

    const handleLogin = (isAdminLoggedIn) => {
        console.log("admin: " + isAdminLoggedIn);
        setIsLoggedIn(true);
        setIsAdminLogged(isAdminLoggedIn);
    };

    const handleLogout = () => {
        useSessionStore.getState().clearSession();
        setIsLoggedIn(false);
        setIsAdminLogged(false);
        sessionStorage.removeItem('lastRoute');
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={isLoggedIn ? <ProtectedRoutes onLogout={handleLogout} isAdminLogged={isAdminLogged} /> : <LoginPage onLogin={handleLogin} />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

const ProtectedRoutes = ({ onLogout, isAdminLogged }) => {
    const location = useLocation();
    const lastRoute = sessionStorage.getItem('lastRoute');

    useEffect(() => {
        sessionStorage.setItem('lastRoute', location.pathname);
    }, [location]);

    return (
        <>
            <Navbar onLogout={onLogout} isAdmin={isAdminLogged} />
            <Routes>
                <Route path="/scrumboard" element={<Scrumboard />} />
                <Route path="/stafflist" element={<StaffList />} />
                {isAdminLogged && <Route path="/setupboard" element={<SetupBoard />} />} {/* Admin route */}
                <Route path="*" element={<Navigate to={lastRoute || "/scrumboard"} />} />
            </Routes>
        </>
    );
};

export default App;
