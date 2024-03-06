import { SortByOptions, Category } from './enums';

export interface IArticles {
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

export interface ISource {
    id: string;
    name: string;
    description: string;
    url: string;
    category: keyof typeof Category;
    language: string;
    country: string;
}

export interface IResponseNews {
    status: 'ok' | 'error';
    totalResults: number;
    articles: IArticles[];
    message?: string;
    code?: string;
}

export interface IResponseSources {
    status: 'ok' | 'error';
    sources: ISource[];
    message?: string;
    code?: string;
}

export interface IRequestApiKey {
    apiKey: string;
}

export interface IRequestOptions {
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

export interface IFilterObj {
    filter: HTMLFormElement;
    inputs: Partial<Record<keyof typeof Category, HTMLInputElement>>;
}

export interface ISearchObj {
    search: HTMLElement;
    searchInput: HTMLInputElement;
    sourceReset: HTMLButtonElement;
    sourceLabel: HTMLElement;
}

export type CallbackOfType<T> = (param: T) => void;

export interface ITypeOfAncestor<T> {
    new (...params: unknown[]): T;
}
