import axios from 'axios';
import { User } from 'types';

interface Credentials {
  email: string;
  password: string;
}

export async function logIn(credentials: Credentials): Promise<User> {
  const response = await axios.post<User>('/api/auth/login', credentials);
  return response.data;
}

export async function logOut(): Promise<void> {
  await axios.post('/api/auth/logout');
}

export async function signUp(credentials: Credentials): Promise<User> {
  const response = await axios.post<User>('/api/auth/signup', credentials);

  return response.data;
}

