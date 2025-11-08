import { create } from 'zustand';

const getStoredAuth = () => {
  try {
    const auth = localStorage.getItem('auth');
    return auth ? JSON.parse(auth) : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
};

const useAuthStore = create((set) => ({
  token: getStoredAuth().token,
  user: getStoredAuth().user,
  login: (token, user) => {
    try {
      localStorage.setItem('auth', JSON.stringify({ token, user }));
      set({ token, user });
    } catch {
      // Silent fail - the app will still work without persistent auth
    }
  },
  logout: () => {
    try {
      localStorage.removeItem('auth');
      set({ token: null, user: null });
    } catch {
      // Silent fail - the app will still work without persistent auth
    }
  },
}));

export default useAuthStore;