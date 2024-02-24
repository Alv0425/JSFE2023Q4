import AppController from '../controller/controller';
import { AppView } from '../view/appView';
import { getElementOfType, isResponseNews, isResponseSources } from '../auxiliary/checks';

class App {
    controller: AppController;
    view: AppView;

    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    start() {
        const sourcesElement = getElementOfType(HTMLElement, document.querySelector('.sources'));
        this.controller.getRandomNews((data) => {
            if (isResponseNews(data)) this.view.drawNews(data);
        });
        sourcesElement.addEventListener('click', (e) =>
            this.controller.getNews(e, (data) => {
                if (isResponseNews(data)) this.view.drawNews(data);
            })
        );
        this.controller.getSources((data) => {
            if (isResponseSources(data)) this.view.drawSources(data);
        });
    }
}

export default App;
