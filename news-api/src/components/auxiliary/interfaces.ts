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

export interface ResponceNews {
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
    sources?: string;
    domains?: string;
    excludeDomains?: string;
    from?: string;
    to?: string;
    language?: string;
    sortBy?: keyof typeof SortByOptions;
    pageSize?: number;
    page?: number;
}

export type SomeResponse = ResponceNews | ResponseSources;

export type CallbackOfType<T> = (param?: T) => void;

export interface TypeOfAncestor<T> {
    new (...params: unknown[]): T;
}
