export interface IArticles {
  id: string,
  name: string,
  source: {
    id: string;
    name: string;
  },
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export interface IResponce {
  status: 'ok' | 'error';
  totalResults: number;
  sources: IArticles[];
}