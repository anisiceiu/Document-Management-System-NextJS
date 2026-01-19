export const TOKEN_KEY = 'access_token';
export const USER_KEY = 'user_name';

export const setAuth = (token: string, fullName: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, fullName);
   document.cookie = `access_token=${token}; path=/; SameSite=Strict`;
};

export const getToken = () =>
  typeof window !== 'undefined'
    ? localStorage.getItem(TOKEN_KEY)
    : null;

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = 'access_token=; Max-Age=0; path=/';
};
