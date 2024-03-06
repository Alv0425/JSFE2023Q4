import AppController from '../controller/controller';
import { AppView } from '../view/appView';
import { getElementOfType, isResponseNews, isResponseSources } from '../utils/helpers';
import { IRequestOptions, ISearchObj } from '../utils/interfaces';

class App {
    private controller: AppController;
    private view: AppView;

    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    public start() {
        this.view.drawFilter();
        // draw search field and current source label
        const sourcesElement: HTMLElement = getElementOfType(HTMLElement, document.querySelector('.sources'));
        const searchField: ISearchObj = this.view.drawSearchField();
        const searchForm: HTMLFormElement = getElementOfType(HTMLFormElement, searchField.search);
        // set initial value of source label to 'all sources'
        searchField.sourceLabel.textContent = 'all sources';
        const sourceReset: HTMLButtonElement = searchField.sourceReset;
        sourceReset.onclick = () => {
            // handle click on 'reset lelected souce' button: hide it, and set default text,
            // then draw news with provided keyword in searchfield (or default value, 'cats', if input value == '')
            sourceReset.classList.remove('show');
            const curSouce: string | null = sourcesElement.getAttribute('data-source');
            searchField.sourceLabel.textContent = 'all sources';
            if (curSouce) {
                getElementOfType(HTMLButtonElement, document.getElementById(curSouce)).classList.remove(
                    'source__item_active'
                );
            }
            sourcesElement.setAttribute('data-source', '');
            const curValue: string = getElementOfType(HTMLInputElement, searchField.searchInput).value;
            this.controller.getCustomNews({ q: curValue || 'cats' }, (data) => {
                if (isResponseNews(data)) this.view.drawNews(data);
            });
        };
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // search form submit handler
            const curValue: string = getElementOfType(HTMLInputElement, searchField.searchInput).value;
            // set request options. If no search input value and source provided, set default value for keyword
            const reqOptions: IRequestOptions = {};
            const curSouce: string | null = sourcesElement.getAttribute('data-source');
            if (curValue) reqOptions.q = curValue;
            if (curSouce) reqOptions.sources = curSouce;
            if (!curSouce && !curValue) reqOptions.q = 'cats';
            this.controller.getCustomNews(reqOptions, (data) => {
                if (isResponseNews(data)) this.view.drawNews(data);
            });
        });
        // show default news onload
        this.controller.getCustomNews({ q: 'cats' }, (data) => {
            if (isResponseNews(data)) this.view.drawNews(data);
        });
        // handle click on sources elements
        sourcesElement.addEventListener('click', (e) => {
            // draw news for selected source; if value provided in search input, uplate query with keyword
            const keyword = getElementOfType(HTMLInputElement, searchField.searchInput).value;
            this.controller.getNews(e, keyword, (data) => {
                if (isResponseNews(data)) this.view.drawNews(data);
            });
            const curSouce: string | null = sourcesElement.getAttribute('data-source');
            // set current source label
            if (curSouce) {
                const textLabel: string | null | undefined = document
                    .getElementById(curSouce)
                    ?.querySelector('.source__item-name')?.textContent;
                if (textLabel) {
                    searchField.sourceLabel.textContent = textLabel;
                    sourceReset.classList.add('show');
                }
            } else {
                searchField.sourceLabel.textContent = 'all sources';
                sourceReset.classList.remove('show');
            }
        });
        this.controller.getSources((data) => {
            if (isResponseSources(data)) this.view.drawSources(data);
        });
    }
}

export default App;
