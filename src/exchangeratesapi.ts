const API_KEY: string = 'eebfd55409060b990bf7277c0025634d';
const BASE_URL: string = 'http://api.exchangeratesapi.io/v1/';

export type ResponseLatest = {
  success: boolean,
  timestamp: number,
  base: string,
  date: string,
  rates: { [key: string]: number }
};

async function getAsync<T>(ep: string, params?: URLSearchParams): Promise<T> {
  params = params || new URLSearchParams();
  params.append('access_key', API_KEY);
  const response = await fetch(`${BASE_URL}${ep}?${params}`, {
    mode: 'cors',
    method: 'GET',
  })
  const res = await response.json()
  if (response.ok) {
    return Promise.resolve<T>(res);
  }

  return Promise.reject(new Error(JSON.stringify(res.error) || 'unknown'))
}

export function latestAsync(): Promise<ResponseLatest> {
  return getAsync<ResponseLatest>('latest');
}