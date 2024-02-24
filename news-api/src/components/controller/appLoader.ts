import Loader from './loader';

class AppLoader extends Loader {
    constructor() {
        if (typeof process.env.API_URL !== 'string') throw new Error('Cannot read API_URL');
        if (typeof process.env.API_KEY !== 'string') throw new Error('Cannot read API_KEY');
        super(process.env.API_URL, {
            apiKey: process.env.API_KEY,
        });
    }
}

export default AppLoader;
