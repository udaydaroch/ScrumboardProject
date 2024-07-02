// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Pages/Navbar';
import LoginPage from './Pages/LoginPage';
import Scrumboard from './Pages/Scrumboard';
import StaffList from './Pages/StaffList';
import SetupBoard from './Pages/SetupBoard';
import useSessionStore from "./zustandStorage/UserSessionInfo";
import axios from "axios";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdminLogged, setIsAdminLogged] = useState(false); // New state to check if the user is admin
    const { token, userId, isAdmin } = useSessionStore();
    const [currentPage, setCurrentPage] = useState("Scrumboard");

    useEffect(() => {
        if (token && userId) {
            setIsLoggedIn(true);
            setIsAdminLogged(isAdmin)
        }
    }, [token, userId, isAdmin]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    const handleLogin = (isAdminLoggedIn) => {
        setIsLoggedIn(true);
        setIsAdminLogged(isAdminLoggedIn);
    };



    const handleLogout = () => {
        useSessionStore.getState().clearSession();
        axios.post(`https://scrumboard-project-back-end.vercel.app/logout`, {
            header : {
                'X-Authorization': token
            }
        });
        setIsLoggedIn(false);
        setIsAdminLogged(false);
        setCurrentPage("Scrumboard")
    };

    return (
        <div className = "app">
        <Router>
            <Navbar onPageChange={handlePageChange} onLogout={handleLogout} isLoggedIn={isLoggedIn} isAdmin={isAdminLogged} />
            <Routes>
                <Route path="/scrumboard" element={<Scrumboard />} />
                <Route path="/scrumboard/:id" element={<Scrumboard />} />
                <Route path="/stafflist" element={<StaffList />} />
                {isAdminLogged && <Route path="/setupboard" element={<SetupBoard />} />}
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="*" element={<Scrumboard />} />
                <Route path="/" element={<Scrumboard />} />
            </Routes>
        </Router>
        </div>
    );
}

export default App;
