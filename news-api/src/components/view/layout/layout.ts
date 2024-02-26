import './search.css';
import { createNode, getElementOfType } from '../../auxiliary/helpers';
//import { ResponseSources } from '../../auxiliary/interfaces';

class Layout {
    drawSearchBar() {
        const search: HTMLElement = createNode('form', ['search']) as HTMLFormElement;
        const searchContainer: HTMLElement = createNode('div', ['search__container']);
        const searchField: HTMLElement = createNode('div', ['search__field']);
        const searchIcon: HTMLElement = createNode('button', ['search__icon'], { type: 'submit' });
        const searchInput: HTMLInputElement = createNode('input', ['search__input'], {
            autofocus: 'true',
            type: 'search',
            autocomplete: 'off',
            placeholder: 'search...',
        }) as HTMLInputElement;
        const searchButton: HTMLButtonElement = createNode('button', ['search__cross'], {
            disabled: 'true',
        }) as HTMLButtonElement;
        search.append(searchContainer);
        searchContainer.append(searchField);
        searchField.append(searchIcon, searchInput, searchButton);
        const sourcesCont = getElementOfType(HTMLElement, document.querySelector('.scroll-container'));
        sourcesCont.after(search);
        console.log(search);
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
            searchButton: searchButton,
        };
    }
}

export default Layout;
