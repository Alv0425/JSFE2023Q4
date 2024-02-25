import AppLoader from './appLoader';

import { ResponseNews, ResponseSources, CallbackOfType } from '../auxiliary/interfaces';
import { getElementOfType } from '../auxiliary/checks';
import { Endpoint } from '../auxiliary/enums';

class AppController extends AppLoader {
    public getSources(callback: CallbackOfType<ResponseNews | ResponseSources>) {
        super.getResp(
            {
                endpoint: Endpoint.sources,
            },
            callback
        );
    }

    public getRandomNews(callback: CallbackOfType<ResponseNews | ResponseSources>) {
        super.getResp(
            {
                endpoint: Endpoint.everything,
                options: {},
            },
            callback
        );
    }

    public getNews(e: Event, callback: CallbackOfType<ResponseNews | ResponseSources>) {
        let target = e.target;
        const newsContainer = getElementOfType(HTMLElement, e.currentTarget);
        while (target !== newsContainer) {
            if (getElementOfType(HTMLElement, target).classList.contains('source__item')) {
                const sourceId = getElementOfType(HTMLElement, target).getAttribute('data-source-id');
                if (newsContainer.getAttribute('data-source') !== sourceId) {
                    newsContainer.setAttribute('data-source', sourceId ?? '');
                    getElementOfType(HTMLElement, target).focus();
                    super.getResp(
                        {
                            endpoint: Endpoint.everything,
                            options: {
                                sources: sourceId,
                            },
                        },
                        callback
                    );
                }
                return;
            }
            target = getElementOfType(HTMLElement, target).parentNode;
        }
    }
}

export default AppController;
