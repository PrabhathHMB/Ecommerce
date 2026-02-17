export const storage = {
    setToken: (token: string) => {
        localStorage.setItem('jwt', token);
    },

    getToken: (): string | null => {
        return localStorage.getItem('jwt');
    },

    removeToken: () => {
        localStorage.removeItem('jwt');
    },

    setUser: (user: any) => {
        localStorage.setItem('user', JSON.stringify(user));
    },

    getUser: (): any | null => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    removeUser: () => {
        localStorage.removeItem('user');
    },

    clear: () => {
        localStorage.clear();
    },
};
