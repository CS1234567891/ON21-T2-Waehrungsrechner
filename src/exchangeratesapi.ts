import { format } from "./dateformat";
import { HistoricRatesOptions, ResponseHistoricRates, ResponseLatest, ResponseTimeseries, TimeseriesOptions } from "./exchangeratesapi.d";

const API_KEY: string = 'eebfd55409060b990bf7277c0025634d';
const BASE_URL: string = 'http://api.exchangeratesapi.io/v1/';

async function getAsync<T>(ep: string, params?: URLSearchParams): Promise<T> {
  params = params || new URLSearchParams();
  params.append('access_key', API_KEY);
  const response = await fetch(`${BASE_URL}${ep}?${params}`, {
    mode: 'cors',
    method: 'GET',
  })
  const res = await response.json();
  if (response.ok) {
    return Promise.resolve<T>(res);
  }

  return Promise.reject(new Error(JSON.stringify(res.error) || 'unknown'))
}

export function latestAsync(): Promise<ResponseLatest> {
  return getAsync<ResponseLatest>('latest');
}

export async function historicRatesAsync({ startDate, dateOffset }: HistoricRatesOptions): Promise<ResponseHistoricRates[]> {
  const date = new Date(startDate || new Date());
  const response: ResponseHistoricRates[] = [];
  for (let i = 0; i < (dateOffset || 5); i++) {
    response.push(await getAsync<ResponseHistoricRates>(format(date)));
    date.setDate(date.getDate() - 1);
  }
  return response;
}

//Not possible, because it is not available in the free api
export function timeseriesAsync({ startDate, dateOffset }: TimeseriesOptions): Promise<ResponseTimeseries> {
  startDate = startDate || new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() - (dateOffset || 30));

  return getAsync<ResponseTimeseries>('timeseries', new URLSearchParams({
    start_date: format(startDate),
    end_date: format(endDate)
  }));
}