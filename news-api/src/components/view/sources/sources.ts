import './sources.css';
import { Source } from '../../auxiliary/interfaces';
import { getElementOfType } from '../../auxiliary/checks';

interface SourcesInterface {
    draw: (data: Source[]) => void;
}

class Sources implements SourcesInterface {
    draw(data: Source[]) {
        const fragment = document.createDocumentFragment();
        const sourceItemTemp = getElementOfType(HTMLTemplateElement, document.querySelector('#sourceItemTemp'));

        data.forEach((item) => {
            const sourceClone = sourceItemTemp.content.cloneNode(true);
            if (!(sourceClone instanceof DocumentFragment))
                throw new Error('sourceClone in not instance of DocumentFragment');
            const sourceItemName = getElementOfType(HTMLElement, sourceClone.querySelector('.source__item-name'));
            const sourceItem = getElementOfType(HTMLElement, sourceClone.querySelector('.source__item'));
            sourceItemName.textContent = item.name;
            sourceItem.setAttribute('data-source-id', item.id);

            fragment.append(sourceClone);
        });
        const sourcesElement = getElementOfType(HTMLElement, document.querySelector('.sources'));
        sourcesElement.append(fragment);
    }
}

export default Sources;
