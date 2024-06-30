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
    setSession: (token, userId, isAdmin) => set(() => {
        setSessionStorage('token', token);
        setSessionStorage('userId', userId);
        setSessionStorage('isAdmin', isAdmin);
        return { token, userId, isAdmin };
    }),
    clearSession: () => set(() => {
        window.sessionStorage.clear();
        return { token: null, userId: null, isAdmin: false };
    })
}));

export default useSessionStore;