import axios from 'axios';


export async function getApi(): Promise<string> {
  const response = await axios.get('/api');
  return response.data;
}

export * from './auth';
