import create from 'zustand';

const getSessionStorageString = (key) => {
    const value = window.sessionStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
};

const getSessionStorageNumber = (key) => {
    const value = window.sessionStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
};

const getSessionStorageBoolean = (key) => {
    const value = window.sessionStorage.getItem(key);
    return value !== null ? JSON.parse(value) : false;
};

const setSessionStorage = (key, value) => window.sessionStorage.setItem(key, JSON.stringify(value));

const useSessionStore = create((set) => ({
    token: getSessionStorageString('token'),
    userId: getSessionStorageNumber('userId'),
    isAdmin: getSessionStorageBoolean('isAdmin'),
    teamId: getSessionStorageNumber('teamId'), // Added teamId
    setSession: (token, userId, isAdmin, teamId) => set(() => { // Added teamId
        setSessionStorage('token', token);
        setSessionStorage('userId', userId);
        setSessionStorage('isAdmin', isAdmin);
        setSessionStorage('teamId', teamId); // Added teamId
        return { token, userId, isAdmin, teamId }; // Added teamId
    }),
    clearSession: () => set(() => {
        window.sessionStorage.clear();
        return { token: null, userId: null, isAdmin: false, teamId: null }; // Added teamId
    })
}));

export default useSessionStore;