import News from './news/news';
import Sources from './sources/sources';
import SearchBar from './searchbar/searchbar';
import Filter from './filter/filter';
import { ResponseSources, ResponseNews, FilterObj, SearchObj } from '../auxiliary/interfaces';

interface AppViewInterface {
    drawNews: (data: ResponseNews) => void;
    drawSources: (data: ResponseSources) => void;
    drawSearchField: () => SearchObj;
    drawFilter: () => FilterObj;
}

export class AppView implements AppViewInterface {
    private news: News;
    private sources: Sources;
    private searchBar: SearchBar;
    private filter: Filter;

    constructor() {
        this.news = new News();
        this.sources = new Sources();
        this.searchBar = new SearchBar();
        this.filter = new Filter();
    }

    public drawNews(data: ResponseNews): void {
        const values = data?.articles ? data?.articles : [];
        this.news.draw(values);
    }

    public drawSources(data: ResponseSources): void {
        const values = data?.sources ? data?.sources : [];
        this.sources.draw(values);
    }

    public drawSearchField(): SearchObj {
        const searchObj = this.searchBar.drawSearchBar();
        return searchObj;
    }

    public drawFilter(): FilterObj {
        const filterObj: FilterObj = this.filter.drawFilter();
        return filterObj;
    }
}

export default AppView;
