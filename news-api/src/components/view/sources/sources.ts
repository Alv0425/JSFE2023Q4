import './sources.css';
import { ISource } from '../../utils/interfaces';
import { getElementOfType, clearNode } from '../../utils/helpers';

interface ISourcesInterface {
    draw: (data: ISource[]) => void;
}

class Sources implements ISourcesInterface {
    public draw(data: ISource[]) {
        const fragment: DocumentFragment = document.createDocumentFragment();
        const sourceItemTemp: HTMLTemplateElement = getElementOfType(
            HTMLTemplateElement,
            document.querySelector('#sourceItemTemp')
        );
        const sourcesElement: HTMLElement = getElementOfType(HTMLElement, document.querySelector('.sources'));
        clearNode(sourcesElement);
        data.forEach((item: ISource) => {
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
