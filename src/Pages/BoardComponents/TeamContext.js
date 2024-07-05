import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import useSessionStore from "../../zustandStorage/UserSessionInfo";

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
    const { teamId, token } = useSessionStore();
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const response = await axios.get(`https://scrumboard-project-back-end.vercel.app/getTeamByTeamId/${teamId}`, {
                    headers: {
                        'X-Authorization': token
                    }
                });
                setTeamMembers(response.data);
            } catch (error) {
                console.error('Error fetching team members:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamMembers();
    }, [teamId, token]);

    return (
        <TeamContext.Provider value={{ teamMembers, loading }}>
            {children}
        </TeamContext.Provider>
    );
};

export const useTeam = () => useContext(TeamContext);
