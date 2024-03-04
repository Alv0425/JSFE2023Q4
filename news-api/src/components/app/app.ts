import AppController from '../controller/controller';
import { AppView } from '../view/appView';
import { getElementOfType, isResponseNews, isResponseSources } from '../utils/helpers';
import { RequestOptions, SearchObj } from '../utils/interfaces';

class App {
    private controller: AppController;
    private view: AppView;

    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    public start() {
        const sourcesElement: HTMLElement = getElementOfType(HTMLElement, document.querySelector('.sources'));
        const searchField: SearchObj = this.view.drawSearchField();
        const searchForm: HTMLFormElement = getElementOfType(HTMLFormElement, searchField.search);
        searchField.sourceLabel.textContent = 'all sources';
        const sourceReset: HTMLButtonElement = getElementOfType(HTMLButtonElement, searchField.sourceReset);
        sourceReset.onclick = () => {
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
        this.view.drawFilter();
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const curValue: string = getElementOfType(HTMLInputElement, searchField.searchInput).value;
            const reqOptions: RequestOptions = {};
            const curSouce: string | null = sourcesElement.getAttribute('data-source');
            if (curValue) reqOptions.q = curValue;
            if (curSouce) reqOptions.sources = curSouce;
            if (!curSouce && !curValue) reqOptions.q = 'cats';
            this.controller.getCustomNews(reqOptions, (data) => {
                if (isResponseNews(data)) this.view.drawNews(data);
            });
        });
        this.controller.getCustomNews({ q: 'cats' }, (data) => {
            if (isResponseNews(data)) this.view.drawNews(data);
        });
        sourcesElement.addEventListener('click', (e) => {
            const keyword = getElementOfType(HTMLInputElement, searchField.searchInput).value;
            this.controller.getNews(e, keyword, (data) => {
                if (isResponseNews(data)) this.view.drawNews(data);
            });
            const curSouce: string | null = sourcesElement.getAttribute('data-source');
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
