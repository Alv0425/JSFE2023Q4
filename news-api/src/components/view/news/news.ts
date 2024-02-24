import './news.css';
import { Articles } from '../../auxiliary/interfaces';
import { getElementOfType } from '../../auxiliary/checks';

interface NewsInterface {
    draw: (data: Articles[]) => void;
}

class News implements NewsInterface {
    draw(data: Articles[]) {
        const news = data.length >= 10 ? data.filter((_item, idx) => idx < 10) : data;
        const fragment = document.createDocumentFragment();
        const newsItemTemp = getElementOfType(HTMLTemplateElement, document.querySelector('#newsItemTemp'));
        news.forEach((item, idx) => {
            const documFragment = getElementOfType(DocumentFragment, newsItemTemp.content);
            const newsClone = getElementOfType(DocumentFragment, documFragment.cloneNode(true));
            const newsItem = getElementOfType(HTMLElement, newsClone.querySelector('.news__item'));
            const newsMetaPhoto = getElementOfType(HTMLElement, newsClone.querySelector('.news__meta-photo'));
            const newsMetaAuthor = getElementOfType(HTMLElement, newsClone.querySelector('.news__meta-author'));
            const newsMetaDate = getElementOfType(HTMLElement, newsClone.querySelector('.news__meta-date'));
            const newsDescrTitle = getElementOfType(HTMLElement, newsClone.querySelector('.news__description-title'));
            const newsDescrSource = getElementOfType(HTMLElement, newsClone.querySelector('.news__description-source'));
            const newsDescrCont = getElementOfType(HTMLElement, newsClone.querySelector('.news__description-content'));
            const newsReadMore = getElementOfType(HTMLElement, newsClone.querySelector('.news__read-more a'));

            if (idx % 2) newsItem.classList.add('alt');
            newsMetaPhoto.style.backgroundImage = `url(${item.urlToImage || 'img/news_placeholder.jpg'})`;
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

        const newsElement = getElementOfType(HTMLElement, document.querySelector('.news'));
        newsElement.innerHTML = '';
        newsElement.appendChild(fragment);
    }
}

export default News;
