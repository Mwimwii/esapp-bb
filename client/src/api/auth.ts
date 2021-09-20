import axios from 'axios';
import { User } from 'types';

interface Credentials {
  email: string;
  password: string;
  uuid?: string;
}

interface ContactInfo {
  firstName: string;
  lastName: string;
  phoneNumber: number;
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

export async function userExists(email: string): Promise<boolean> {
  const response = await axios.post<boolean>('/api/auth-checks/user-exists', { email });

  return response.data;
}

export async function contactExists(contactInfo: ContactInfo): Promise<boolean|string> {
  const response = await axios.post<boolean|string>('/api/auth-checks/contact-exists', contactInfo);

  return response.data;
}
