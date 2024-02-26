import './filter.css';
import { createNode, getElementOfType } from '../../auxiliary/helpers';
import { Category } from '../../auxiliary/enums';
import { FilterObj } from '../../auxiliary/interfaces';

class Filter {
    drawFilter(): FilterObj {
        const filter: HTMLFormElement = createNode('form', ['filter']) as HTMLFormElement;
        const categories: (keyof typeof Category)[] = [
            'business',
            'entertainment',
            'general',
            'health',
            'science',
            'sports',
            'technology',
        ];
        const inputs: [HTMLInputElement, HTMLLabelElement][] = categories.map((category) => {
            const input = createNode('input', ['filter__input'], {
                id: category,
                type: 'checkbox',
                value: category,
            }) as HTMLInputElement;
            input.checked = true;
            const label = createNode('label', ['filter__label'], { for: category }) as HTMLLabelElement;
            label.textContent = category;
            return [input, label];
        });
        filter.append(...inputs.flat());
        getElementOfType(HTMLElement, document.querySelector('.scroll-container')).before(filter);
        return {
            filter: filter,
            inputs: inputs,
        };
    }
    // filterSources(sourcesCont: HTMLElement) {
    //     const sourcesButtons = sourcesCont.querySelectorAll<HTMLElement>('button.source__item');
    //     if (sourcesButtons.length === 0)
    //     for (const btn of sourcesButtons) {
    //       btn
    //     }
    // };
}

export default Filter;
