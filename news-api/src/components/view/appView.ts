import News from './news/news';
import Sources from './sources/sources';
import SearchBar from './searchbar/searchbar';
import Filter from './filter/filter';
import { IResponseSources, IResponseNews, IFilterObj, ISearchObj } from '../utils/interfaces';

interface IAppViewInterface {
    drawNews: (data: IResponseNews) => void;
    drawSources: (data: IResponseSources) => void;
    drawSearchField: () => ISearchObj;
    drawFilter: () => IFilterObj;
}

export class AppView implements IAppViewInterface {
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

    public drawNews(data: IResponseNews): void {
        const values = data?.articles ? data?.articles : [];
        this.news.draw(values);
    }

    public drawSources(data: IResponseSources): void {
        const values = data?.sources ? data?.sources : [];
        this.sources.draw(values);
    }

    public drawSearchField(): ISearchObj {
        const searchObj = this.searchBar.drawSearchBar();
        return searchObj;
    }

    public drawFilter(): IFilterObj {
        const filterObj: IFilterObj = this.filter.drawFilter();
        return filterObj;
    }
}

export default AppView;
