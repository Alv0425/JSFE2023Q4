import News from './news/news';
import Sources from './sources/sources';
import SearchBar from './layout/searchbar';
import { ResponseSources, ResponseNews } from '../auxiliary/interfaces';

interface AppViewInterface {
    drawNews: (data: ResponseNews) => void;
    drawSources: (data: ResponseSources) => void;
    drawSearchField: () => void;
}

export class AppView implements AppViewInterface {
    private news: News;
    private sources: Sources;
    private searchBar: SearchBar;

    constructor() {
        this.news = new News();
        this.sources = new Sources();
        this.searchBar = new SearchBar();
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
        const obj = this.searchBar.drawSearchBar();
        return obj;
    }
}

export default AppView;
