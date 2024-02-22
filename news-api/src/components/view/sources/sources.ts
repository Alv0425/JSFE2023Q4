import './sources.css';
import { ISource } from '../../auxiliary/interfaces';
import { isHTMLElement } from '../../auxiliary/checks';

interface ISources {
    draw: (data: ISource[]) => void;
}

class Sources implements ISources {
    draw(data : ISource[]) {
        const fragment = document.createDocumentFragment();
        const sourceItemTemp = document.querySelector('#sourceItemTemp');
        if (!(sourceItemTemp instanceof HTMLTemplateElement)) throw new Error(`sourceItemTemp is not HTMLTemplateElement`);
        data.forEach((item) => {
            const sourceClone = sourceItemTemp.content.cloneNode(true);
            if (!(sourceClone instanceof DocumentFragment)) throw new Error('sourceClone in not instance of DocumentFragment');
            const sourceItemName = isHTMLElement(sourceClone.querySelector('.source__item-name'));
            const sourceItem = isHTMLElement(sourceClone.querySelector('.source__item'));
            sourceItemName.textContent = item.name;
            sourceItem.setAttribute('data-source-id', item.id);

            fragment.append(sourceClone);
        });
        const sourcesElement  = isHTMLElement(document.querySelector('.sources'))
        sourcesElement.append(fragment);
    }
}

export default Sources;
