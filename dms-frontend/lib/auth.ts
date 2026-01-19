export const TOKEN_KEY = 'access_token';
export const USER_KEY = 'user_name';

export const setAuth = (token: string, fullName: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, fullName);
};

export const getToken = () =>
  typeof window !== 'undefined'
    ? localStorage.getItem(TOKEN_KEY)
    : null;

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
