import News from './news/news';
import Sources from './sources/sources';
import Layout from './layout/layout';
import { ResponseSources, ResponseNews } from '../auxiliary/interfaces';

interface AppViewInterface {
    drawNews: (data: ResponseNews) => void;
    drawSources: (data: ResponseSources) => void;
    drawSearchField: () => void;
}

export class AppView implements AppViewInterface {
    private news: News;
    private sources: Sources;
    private layout: Layout;

    constructor() {
        this.news = new News();
        this.sources = new Sources();
        this.layout = new Layout();
    }

    public drawNews(data: ResponseNews): void {
        const values = data?.articles ? data?.articles : [];
        this.news.draw(values);
    }

    public drawSources(data: ResponseSources): void {
        const values = data?.sources ? data?.sources : [];
        this.sources.draw(values);
    }

    public drawSearchField(): Record<string, HTMLElement> {
        const obj = this.layout.drawSearchBar();
        return obj;
    }
}

export default AppView;
