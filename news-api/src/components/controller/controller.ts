import AppLoader from './appLoader';

import { ResponseNews, ResponseSources, CallbackOfType, RequestOptions } from '../auxiliary/interfaces';
import { getElementOfType } from '../auxiliary/helpers';
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

    public getCustomNews(reqOptions: RequestOptions, callback: CallbackOfType<ResponseNews | ResponseSources>) {
        super.getResp(
            {
                endpoint: Endpoint.everything,
                options: reqOptions,
            },
            callback
        );
    }

    public getNews(e: Event, callback: CallbackOfType<ResponseNews | ResponseSources>) {
        let target: EventTarget | null = e.target;
        const newsContainer: HTMLElement = getElementOfType(HTMLElement, e.currentTarget);
        while (target !== newsContainer) {
            if (getElementOfType(HTMLElement, target).classList.contains('source__item')) {
                const sourceId: string | null = getElementOfType(HTMLElement, target).getAttribute('data-source-id');
                getElementOfType(HTMLElement, target).classList.add('source__item_active');
                const curSourceId: string | null = newsContainer.getAttribute('data-source');
                if (curSourceId) {
                    getElementOfType(HTMLElement, document.getElementById(curSourceId)).classList.remove(
                        'source__item_active'
                    );
                }
                if (curSourceId == sourceId) {
                    newsContainer.setAttribute('data-source', '');
                    getElementOfType(HTMLElement, target).classList.remove('source__item_active');
                }
                let reqOptions: RequestOptions = {
                    q: 'cats',
                };
                if (curSourceId !== sourceId) {
                    reqOptions = {
                        sources: sourceId,
                    };
                    newsContainer.setAttribute('data-source', sourceId ?? '');
                }
                super.getResp(
                    {
                        endpoint: Endpoint.everything,
                        options: reqOptions,
                    },
                    callback
                );
                return;
            }
            target = getElementOfType(HTMLElement, target).parentNode;
        }
    }
}

export default AppController;
