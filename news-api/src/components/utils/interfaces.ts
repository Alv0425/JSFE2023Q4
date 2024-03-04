import { SortByOptions, Category } from './enums';

export interface Articles {
    id: string | null;
    name: string | null;
    source: {
        id: string | null;
        name: string | null;
    };
    author: string | null;
    title: string | null;
    description: string | null;
    url: string | null;
    urlToImage: string | null;
    publishedAt: string | null;
    content: string | null;
}

export interface Source {
    id: string;
    name: string;
    description: string;
    url: string;
    category: keyof typeof Category;
    language: string;
    country: string;
}

export interface ResponseNews {
    status: 'ok' | 'error';
    totalResults: number;
    articles: Articles[];
    message?: string;
    code?: string;
}

export interface ResponseSources {
    status: 'ok' | 'error';
    sources: Source[];
    message?: string;
    code?: string;
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
    country?: string;
}

export interface FilterObj {
    filter: HTMLFormElement;
    inputs: Partial<Record<keyof typeof Category, HTMLInputElement>>;
}

export interface SearchObj {
    search: HTMLElement;
    searchInput: HTMLInputElement;
    sourceReset: HTMLElement;
    sourceLabel: HTMLElement;
}

export type SomeResponse = ResponseNews | ResponseSources;

export type CallbackOfType<T> = (param: T) => void;
export type CallbackNews = CallbackOfType<ResponseNews>;
export type CallbackSources = CallbackOfType<ResponseSources>;
export type CallbackDefault = () => void;

export interface TypeOfAncestor<T> {
    new (...params: unknown[]): T;
}
