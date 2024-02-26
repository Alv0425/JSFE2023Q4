export enum Endpoint {
    everything = 'everything',
    sources = 'sources',
    topheadlines = 'top-headlines',
}

export type EndpointType = `${Endpoint}`;

export enum RespStatusCode {
    OK = 200,
    BadReq = 400,
    Unauthorized = 401,
    NotFound = 404,
    TooManyReq = 429,
    ServerError = 500,
}

export enum SortByOptions {
    relevancy = 'relevancy',
    popularity = 'popularity',
    publishedAt = 'publishedAt',
}

export enum ReqOptionsKeys {
    apiKey,
    q,
    searchin,
    sources,
    domains,
    excludeDomains,
    from,
    to,
    language,
    sortBy,
    pageSize,
    page,
    country,
}
