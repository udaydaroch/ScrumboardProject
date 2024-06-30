import create from 'zustand';

interface SessionState {
    token: string | null;
    userId: number | null;
    isAdmin: boolean;
    setSession: (token: string, userId: number, isAdmin: boolean) => void;
    clearSession: () => void;
}

const getSessionStorageString = (key: string): string | null => {
    const value = window.sessionStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
};

const getSessionStorageNumber = (key: string): number | null => {
    const value = window.sessionStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
};

const getSessionStorageBoolean = (key: string): boolean => {
    const value = window.sessionStorage.getItem(key);
    return value !== null ? JSON.parse(value) : false;
};

const setSessionStorage = (key: string, value: string | number | boolean) => window.sessionStorage.setItem(key, JSON.stringify(value));

const useSessionStore = create<SessionState>((set) => ({
    token: getSessionStorageString('token'),
    userId: getSessionStorageNumber('userId'),
    isAdmin: getSessionStorageBoolean('isAdmin'),
    setSession: (token: string, userId: number, isAdmin: boolean) => set(() => {
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