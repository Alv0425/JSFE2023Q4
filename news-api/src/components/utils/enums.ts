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
    relevancy,
    popularity,
    publishedAt,
}

export enum Category {
    business,
    entertainment,
    general,
    health,
    science,
    sports,
    technology,
}
