const API_KEY: string = 'eebfd55409060b990bf7277c0025634d';
const BASE_URL: string = 'http://api.exchangeratesapi.io/v1/';

export type ResponseLatest = {
  success: boolean,
  timestamp: number,
  base: string,
  date: string,
  rates: { [key: string]: number }
};

export type ResponseTimeseries = {
  success: boolean,
  timestamp: number,
  base: string,
  date: string,
  rates: { [key: string]: number }
};


export type TimeseriesOptions = {
  startDate: Date,
  dateOffset: number
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

function format(date: Date) {
  var day = ('0' + date.getDate()).slice(-2);
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var year = date.getFullYear();

  return year + '-' + month + '-' + day;
}

//Not possible, because it is not available in the free api
export function timeseriesAsync({ startDate, dateOffset }: TimeseriesOptions = { startDate: new Date(), dateOffset: 30 }): Promise<ResponseTimeseries> {
  startDate = startDate || new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() - dateOffset);

  return getAsync<ResponseTimeseries>('timeseries', new URLSearchParams({
    start_date: format(startDate),
    end_date: format(endDate)
  }));
}