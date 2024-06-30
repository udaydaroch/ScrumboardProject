import create from 'zustand';

interface SessionState {
    token: string | null;
    userId: number | null;
    setSession: (token: string, userId: number) => void;
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
const setSessionStorage = (key: string, value: string | number) => window.sessionStorage.setItem(key, JSON.stringify(value));

const useSessionStore = create<SessionState>((set) => ({
    token: getSessionStorageString('token'),
    userId: getSessionStorageNumber('userId'),
    setSession: (token: string, userId: number) => set(() => {
        setSessionStorage('token', token);
        setSessionStorage('userId', userId);
        return { token, userId };
    }),
    clearSession: () => set(() => {
        window.sessionStorage.clear();
        return { token: null, userId: null };
    })
}));

export default useSessionStore;