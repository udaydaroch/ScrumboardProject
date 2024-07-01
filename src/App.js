// App.js
import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './Pages/Navbar';
import LoginPage from './Pages/LoginPage';
import Scrumboard from './Pages/Scrumboard';
import StaffList from './Pages/StaffList';
import SetupBoard from './Pages/SetupBoard';
import useSessionStore from "./zustandStorage/UserSessionInfo";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdminLogged, setIsAdminLogged] = useState(false); // New state to check if the user is admin
    const {token, userId, isAdmin} = useSessionStore();
    const location = useLocation();

    useEffect(() => {
        if (token && userId) {
            setIsLoggedIn(true);
            setIsAdminLogged(isAdmin)
        }
    }, [token, userId, isAdmin]);

    useEffect(() => {
        if (isLoggedIn) {
            sessionStorage.setItem('lastRoute', location.pathname);
        }
    }, [location, isLoggedIn]);

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

    const lastRoute = sessionStorage.getItem('lastRoute');

    return (
        <Router>
            {isLoggedIn ? (
                <>
                    <Navbar onLogout={handleLogout} isAdmin={isAdminLogged} />
                    <Routes>
                        <Route path="/scrumboard" element={<Scrumboard />} />
                        <Route path="/stafflist" element={<StaffList />} />
                        {isAdmin && <Route path="/setupboard" element={<SetupBoard />} />} {/* Admin route */}
                        <Route path="*" element={<Navigate to={lastRoute || "/scrumboard"} />} />
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