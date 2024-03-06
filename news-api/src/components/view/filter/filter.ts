import './filter.css';
import { createNode, getElementOfType } from '../../utils/helpers';
import { Category } from '../../utils/enums';
import { IFilterObj } from '../../utils/interfaces';

class Filter {
    private inputs: Partial<Record<keyof typeof Category, HTMLInputElement>>;
    private categories: (keyof typeof Category)[];
    constructor() {
        this.inputs = {};
        this.categories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
    }
    public drawFilter(): IFilterObj {
        const filter = createNode('form', ['filter']);
        const inputs: [HTMLInputElement, HTMLLabelElement][] = this.categories.map((category) => {
            const input = createNode('input', ['filter__input'], {
                id: category,
                type: 'checkbox',
                value: category,
            });
            input.checked = true;
            const label: HTMLLabelElement = createNode('label', ['filter__label'], {
                for: category,
            });
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
    private filterSources(sourcesCont: HTMLElement) {
        const sourcesButtons = sourcesCont.querySelectorAll<HTMLButtonElement>('button.source__item');
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
