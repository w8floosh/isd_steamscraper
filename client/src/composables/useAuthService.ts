import { api as axios } from 'src/boot/axios';
import { UserCredentials } from './types';

export const useAuthService = () => {
  const auth_url = process.env.AUTH_ENDPOINT;
  const login = async (credentials: UserCredentials) => {
    // return await axios.post(auth_url, { credentials });
    return {
      name: 'me',
      email: credentials.email,
      token: 'ffff',
      nonce: '0123456789abcdef',
    };
  };

  return { login };
};

({
  name: 'me',
  email: 'me@gmail.com',
  token: 'ffff',
  nonce: '0123456789abcdef',
});
