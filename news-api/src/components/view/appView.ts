import News from './news/news';
import Sources from './sources/sources';
import { ResponseSources, ResponseNews } from '../auxiliary/interfaces';

interface AppViewInterface {
    drawNews: (data: ResponseNews) => void;
    drawSources: (data: ResponseSources) => void;
}

export class AppView implements AppViewInterface {
    private news: News;
    private sources: Sources;

    constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    public drawNews(data: ResponseNews): void {
        const values = data?.articles ? data?.articles : [];
        this.news.draw(values);
    }

    public drawSources(data: ResponseSources): void {
        const values = data?.sources ? data?.sources : [];
        this.sources.draw(values);
    }
}

export default AppView;
