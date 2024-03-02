import './search.css';
import { createNode, getElementOfType } from '../../auxiliary/helpers';

class SearchBar {
    drawSearchBar() {
        const search: HTMLFormElement = createNode('form', ['search']);
        const sourceLabelCont: HTMLElement = createNode('div', ['search__source']);
        const sourceReset: HTMLButtonElement = createNode('button', ['search__source-button'], { type: 'button' });
        const sourceLabel: HTMLElement = createNode('h2', ['search__source-label']);
        sourceLabelCont.append(sourceReset, sourceLabel);
        const searchContainer: HTMLElement = createNode('div', ['search__container']);
        const searchField: HTMLElement = createNode('div', ['search__field']);
        const searchIcon: HTMLButtonElement = createNode('button', ['search__icon'], { type: 'submit' });
        const searchInput: HTMLInputElement = createNode('input', ['search__input'], {
            autofocus: 'true',
            type: 'search',
            autocomplete: 'off',
            placeholder: 'search...',
        });
        const searchButton: HTMLButtonElement = createNode('button', ['search__cross']);
        searchButton.disabled = true;
        search.append(sourceLabelCont, searchContainer);
        searchContainer.append(searchField);
        searchField.append(searchIcon, searchInput, searchButton);
        const sourcesCont: HTMLElement = getElementOfType(HTMLElement, document.querySelector('.scroll-container'));
        sourcesCont.after(search);
        searchInput.onkeyup = () => {
            if (searchInput.value) {
                searchButton.disabled = false;
            } else {
                searchButton.disabled = true;
            }
        };

        searchButton.onclick = (event) => {
            event.preventDefault();
            searchInput.value = '';
            searchButton.disabled = true;
            searchInput.focus();
        };

        return {
            search: search,
            searchInput: searchInput,
            sourceReset: sourceReset,
            sourceLabel: sourceLabel,
        };
    }
}

export default SearchBar;
