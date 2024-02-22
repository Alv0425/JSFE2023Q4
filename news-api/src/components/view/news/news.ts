import './news.css';
import { IArticles } from '../../auxiliary/interfaces';
import { isHTMLElement } from '../../auxiliary/checks';

interface INews {
    draw: (data: IArticles[]) => void;
}

class News implements INews{
    draw(data: IArticles[]) {
        const news = data.length >= 10 ? data.filter((_item, idx) => idx < 10) : data;
        const fragment = document.createDocumentFragment();
        
        // function isHTMLElement(element: unknown) : HTMLElement {
        //     if (!(element instanceof HTMLElement)) throw new Error(`element is not instance of HTMLElement`);
        //     return element;
        // }
    
        const newsItemTemp = document.querySelector('#newsItemTemp');
        if (!(newsItemTemp instanceof HTMLTemplateElement)) throw new Error(`newsItemTemp is not HTMLTemplateElement`);
        news.forEach((item, idx) => {
            const newsClone = newsItemTemp.content.cloneNode(true);
            if (!(newsClone instanceof DocumentFragment)) throw new Error('newsClone in not instance of DocumentFragment');

            const newsItem = isHTMLElement(newsClone.querySelector('.news__item'));
            const newsMetaPhoto = isHTMLElement(newsClone.querySelector('.news__meta-photo'));
            const newsMetaAuthor = isHTMLElement(newsClone.querySelector('.news__meta-author'));
            const newsMetaDate = isHTMLElement(newsClone.querySelector('.news__meta-date'));
            const newsDescrTitle = isHTMLElement(newsClone.querySelector('.news__description-title'));
            const newsDescrSource = isHTMLElement(newsClone.querySelector('.news__description-source'));
            const newsDescrCont = isHTMLElement(newsClone.querySelector('.news__description-content'));
            const newsReadMore = isHTMLElement(newsClone.querySelector('.news__read-more a'))

            if (idx % 2) newsItem.classList.add('alt');      
            newsMetaPhoto.style.backgroundImage = `url(${item.urlToImage || 'img/news_placeholder.jpg'})`;
            newsMetaAuthor.textContent = item.author || item.source.name;
            newsMetaDate.textContent = item.publishedAt
                .slice(0, 10)
                .split('-')
                .reverse()
                .join('-');
            newsDescrTitle.textContent = item.title;
            newsDescrSource.textContent = item.source.name;
            newsDescrCont.textContent = item.description;
            newsReadMore.setAttribute('href', item.url);

            fragment.append(newsClone);
        });

        const newsElement = isHTMLElement(document.querySelector('.news'));
        newsElement.innerHTML = '';
        newsElement.appendChild(fragment);
    }
}

export default News;
