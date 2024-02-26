import './news.css';
import { Articles } from '../../auxiliary/interfaces';
import { getElementOfType } from '../../auxiliary/helpers';

interface NewsInterface {
    draw: (data: Articles[]) => void;
}

class News implements NewsInterface {
    public draw(data: Articles[]) {
        const news: Articles[] = data.length >= 10 ? data.filter((_item, idx) => idx < 10) : data;
        const fragment: DocumentFragment = document.createDocumentFragment();
        const newsItemTemp: HTMLTemplateElement = getElementOfType(
            HTMLTemplateElement,
            document.querySelector('#newsItemTemp')
        );
        news.forEach((item, idx) => {
            const documFragment: DocumentFragment = getElementOfType(DocumentFragment, newsItemTemp.content);
            const newsClone: DocumentFragment = getElementOfType(DocumentFragment, documFragment.cloneNode(true));
            const newsItem: HTMLElement = getElementOfType(HTMLElement, newsClone.querySelector('.news__item'));
            const newsMetaPhoto: HTMLElement = getElementOfType(
                HTMLElement,
                newsClone.querySelector('.news__meta-photo')
            );
            const newsMetaAuthor: HTMLElement = getElementOfType(
                HTMLElement,
                newsClone.querySelector('.news__meta-author')
            );
            const newsMetaDate: HTMLElement = getElementOfType(
                HTMLElement,
                newsClone.querySelector('.news__meta-date')
            );
            const newsDescrTitle: HTMLElement = getElementOfType(
                HTMLElement,
                newsClone.querySelector('.news__description-title')
            );
            const newsDescrSource: HTMLElement = getElementOfType(
                HTMLElement,
                newsClone.querySelector('.news__description-source')
            );
            const newsDescrCont: HTMLElement = getElementOfType(
                HTMLElement,
                newsClone.querySelector('.news__description-content')
            );
            const newsReadMore: HTMLElement = getElementOfType(
                HTMLElement,
                newsClone.querySelector('.news__read-more a')
            );

            if (idx % 2) newsItem.classList.add('alt');
            newsMetaPhoto.style.backgroundImage = `url(${item.urlToImage || './assets/placeholder.png'})`;
            newsMetaAuthor.textContent = item.author || item.source.name;
            newsMetaDate.textContent = item.publishedAt
                ? item.publishedAt.slice(0, 10).split('-').reverse().join('-')
                : '';
            newsDescrTitle.textContent = item.title;
            newsDescrSource.textContent = item.source.name;
            newsDescrCont.textContent = item.description || '';
            newsReadMore.setAttribute('href', item.url || '#');
            fragment.append(newsClone);
        });

        const newsElement: HTMLElement = getElementOfType(HTMLElement, document.querySelector('.news'));
        newsElement.innerHTML = '';
        newsElement.appendChild(fragment);
    }
}

export default News;
