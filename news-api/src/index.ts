import './global.css';
import App from './components/app/app';
import './assets/github.svg';
import './assets/rss.svg';
import './assets/search.svg';
import './assets/cross-icon.svg';
import './assets/circle-xmark-solid.svg';

document.body.onload = () => {
    const app = new App();
    app.start();
};
