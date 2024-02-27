import './filter.css';
import { createNode, getElementOfType } from '../../auxiliary/helpers';
import { Category } from '../../auxiliary/enums';
import { FilterObj } from '../../auxiliary/interfaces';

class Filter {
    private inputs: Partial<Record<keyof typeof Category, HTMLInputElement>>;
    private categories: (keyof typeof Category)[];

    constructor() {
        this.inputs = {};
        this.categories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
    }
    drawFilter(): FilterObj {
        const filter: HTMLFormElement = createNode('form', ['filter']) as HTMLFormElement;

        const inputs: [HTMLInputElement, HTMLLabelElement][] = this.categories.map((category) => {
            const input = createNode('input', ['filter__input'], {
                id: category,
                type: 'checkbox',
                value: category,
            }) as HTMLInputElement;
            input.checked = true;
            const label: HTMLLabelElement = createNode('label', ['filter__label'], {
                for: category,
            }) as HTMLLabelElement;
            label.textContent = category;
            return [input, label];
        });
        filter.append(...inputs.flat());
        getElementOfType(HTMLElement, document.querySelector('.scroll-container')).before(filter);
        inputs.forEach((pair, i) => {
            this.inputs[this.categories[i]] = pair[0];
        });
        filter.oninput = () => {
            this.filterSources(getElementOfType(HTMLElement, document.querySelector('.sources')));
        };
        return {
            filter: filter,
            inputs: this.inputs,
        };
    }
    filterSources(sourcesCont: HTMLElement) {
        const sourcesButtons = sourcesCont.querySelectorAll<HTMLElement>('button.source__item');
        if (sourcesButtons.length === 0) return;
        for (const btn of sourcesButtons) {
            btn.classList.add('source__item_hidden');
            const curSource = btn.getAttribute('data-category') as keyof typeof Category;
            if (this.categories.includes(curSource)) {
                if (this.inputs[curSource]?.checked) {
                    btn.classList.remove('source__item_hidden');
                }
            }
        }
    }
}

export default Filter;
