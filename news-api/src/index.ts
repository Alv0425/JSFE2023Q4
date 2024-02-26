import App from './components/app/app';
import './global.css';
import './assets/github.svg';
import './assets/rss.svg';
import './assets/search.svg';
import './assets/cross-icon.svg';

document.body.onload = () => {
    const app = new App();
    app.start();
};
