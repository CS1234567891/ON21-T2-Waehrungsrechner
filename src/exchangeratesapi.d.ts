export type Rates = {
    [key: string]: number
};

export type DateRates = {
    [date: string]: Rates
};

export type ResponseBase<T> = {
    success: boolean,
    timestamp: number,
    base: string,
    rates: T
};

export type ResponseLatest = ResponseBase<Rates> & {
    date: string
};

export type ResponseTimeseries = ResponseBase<DateRates> & {
    timeseries: boolean,
    startDate: string,
    endDate: string,
};

export type ResponseHistoricRates = ResponseBase<Rates> & {
    historical: boolean,
    date: string,
    rates: Rates
};


export type TimeseriesOptions = {
    startDate?: Date,
    dateOffset?: number
};

export type HistoricRatesOptions = {
    startDate?: Date,
    dateOffset?: number
};