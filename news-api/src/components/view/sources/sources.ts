import './sources.css';
import { Source } from '../../utils/interfaces';
import { getElementOfType, clearNode } from '../../utils/helpers';

interface SourcesInterface {
    draw: (data: Source[]) => void;
}

class Sources implements SourcesInterface {
    public draw(data: Source[]) {
        const fragment: DocumentFragment = document.createDocumentFragment();
        const sourceItemTemp: HTMLTemplateElement = getElementOfType(
            HTMLTemplateElement,
            document.querySelector('#sourceItemTemp')
        );
        const sourcesElement: HTMLElement = getElementOfType(HTMLElement, document.querySelector('.sources'));
        clearNode(sourcesElement);
        data.forEach((item: Source) => {
            const sourceClone: Node = sourceItemTemp.content.cloneNode(true);
            if (!(sourceClone instanceof DocumentFragment))
                throw new Error('sourceClone is not instance of DocumentFragment');
            const sourceItemName: HTMLElement = getElementOfType(
                HTMLElement,
                sourceClone.querySelector('.source__item-name')
            );
            const sourceItem: HTMLElement = getElementOfType(HTMLElement, sourceClone.querySelector('.source__item'));
            sourceItemName.textContent = item.name;
            sourceItem.setAttribute('data-source-id', item.id);
            sourceItem.setAttribute('data-category', item.category);
            sourceItem.setAttribute('id', item.id);
            fragment.append(sourceClone);
        });
        sourcesElement.append(fragment);
    }
}

export default Sources;
