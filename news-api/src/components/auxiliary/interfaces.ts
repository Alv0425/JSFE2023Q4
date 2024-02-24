import { SortByOptions } from './enums';

export interface Articles {
    id: string;
    name: string;
    source: {
        id: string | null;
        name: string;
    };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}

export interface Source {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
}

export interface ResponseNews {
    status: 'ok' | 'error';
    totalResults: number;
    articles: Articles[];
}

export interface ResponseSources {
    status: 'ok' | 'error';
    sources: Source[];
}

export interface RequestApiKey {
    apiKey: string;
}

export interface RequestOptions {
    q?: string;
    searchin?: string;
    sources?: string | null;
    domains?: string;
    excludeDomains?: string;
    from?: string;
    to?: string;
    language?: string;
    sortBy?: keyof typeof SortByOptions;
    pageSize?: number;
    page?: number;
}

export type SomeResponse = ResponseNews | ResponseSources;

export type CallbackOfType<T> = (param: T) => void;
export type CallbackNews = CallbackOfType<ResponseNews>;
export type CallbackSources = CallbackOfType<ResponseSources>;
export type CallbackDefault = () => void;

export interface TypeOfAncestor<T> {
    new (...params: unknown[]): T;
}

// export interface MyProcessEnv {
//   API_URL: string;
//   API_KEY: string;
// }

// declare global {
//   namespace NodeJS {
//     interface ProcessEnv extends MyProcessEnv {}
//   }
// }
