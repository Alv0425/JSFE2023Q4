import { CallbackOfType, ResponseNews, ResponseSources, RequestOptions, RequestApiKey } from '../utils/interfaces';
import { Endpoint, RespStatusCode } from '../utils/enums';

interface FetchReq {
    endpoint: `${Endpoint}`;
    options?: RequestOptions;
}

interface LoaderInterface {
    getResp(IFetchRespObj: FetchReq, callback: CallbackOfType<ResponseNews | ResponseSources>): void;
}

class Loader implements LoaderInterface {
    constructor(
        private baseLink: string,
        private options: RequestApiKey
    ) {}

    private callbackGetResp = () => {
        console.error('No callback for GET response');
    };

    public getResp(
        { endpoint, options = {} }: FetchReq,
        callback: CallbackOfType<ResponseNews | ResponseSources> = this.callbackGetResp
    ): void {
        this.load('GET', endpoint, callback, options);
    }

    private errorHandler(res: Response): Response {
        if (!res.ok) {
            if (res.status === RespStatusCode.Unauthorized || res.status === RespStatusCode.NotFound)
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }
        return res;
    }

    private makeUrl(options: RequestOptions, endpoint: `${Endpoint}`): URL {
        const urlOptions = { ...this.options, ...options };
        let url = `${this.baseLink}${endpoint}?`;
        const allKeyValuePairs: [string, string | number | null][] = Object.entries(urlOptions);
        for (const keyValue of allKeyValuePairs) {
            const [key, value] = keyValue;
            const reqValue = value ? value : '';
            url += `${key}=${reqValue}&`;
        }
        return new URL(url.slice(0, -1));
    }

    private async load(
        method: string,
        endpoint: `${Endpoint}`,
        callback: CallbackOfType<ResponseNews | ResponseSources>,
        options: RequestOptions
    ) {
        try {
            const fetchResp = await fetch(this.makeUrl(options, endpoint), { method });
            this.errorHandler(fetchResp);
            const data = (await fetchResp.json()) as ResponseNews | ResponseSources;
            if (data.status === 'error')
                throw new Error(`Error code: ${data.code ?? ''}. Message: ${data.message ?? ''}`);
            callback(data);
        } catch (err) {
            console.error(err);
        }
    }
}

export default Loader;
