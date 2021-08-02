import { FC, createContext, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { useSnackbar } from "@hooks/useSnackbar";

import api from "@services/api";
import handleAxiosError from "@utils/handleAxiosError";

type User = {
  name: string;
  username: string;
};

type SignInCredentials = {
  username: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: SignInCredentials, errorCb?: (err: any) => void): void;
  signOut(): void;
  user: User | undefined;
  isAuthenticated: boolean;
};

export const AuthContext = createContext({} as AuthContextData);

const AuthProvider: FC = (props) => {
  const { children } = props;

  const history = useHistory();
  const { addSnackbar } = useSnackbar();

  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    const userJson = localStorage.getItem('asahi.user');

    if (userJson) {
      const user = JSON.parse(userJson) as User;
      setUser(user);
    }

    const accessToken = localStorage.getItem('asahi.accessToken');

    if (accessToken) {
      api.defaults.headers.authorization = `Bearer ${accessToken}`;
    }
  }, []);

  const signIn = ({ username, password }: SignInCredentials, errorCb: (err: any) => void) => {
    api.post('sessions', { username, password })
      .then((res) => {
        const { user, accessToken, refreshToken } = res.data;

        api.defaults.headers.authorization = `Bearer ${accessToken}`;

        localStorage.setItem('asahi.user', JSON.stringify(user));
        localStorage.setItem('asahi.accessToken', accessToken);
        localStorage.setItem('asahi.refreshToken', refreshToken);

        setUser(user);

        history.push('/')
      })
      .catch((err) => {
        console.log(err);
        // handleAxiosError(err, addSnackbar);
        if (errorCb) errorCb(err);
      });
  };

  const signOut = () => {
    const refreshToken = localStorage.getItem('asahi.refreshToken');

    localStorage.removeItem('asahi.user');
    localStorage.removeItem('asahi.accessToken');
    localStorage.removeItem('asahi.refreshToken');
    setUser(undefined);

    if (refreshToken) {
      api.delete('sessions', { data: { refreshToken } })
        .then(() => {
          history.push('/signin');
        })
        .catch((err) => {
          handleAxiosError(err, addSnackbar);
        });
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
};

export default AuthProvider;