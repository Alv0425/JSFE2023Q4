import { CallbackOfType, IResponseNews, IResponseSources, IRequestOptions, IRequestApiKey } from '../utils/interfaces';
import { RespStatusCode, EndpointType } from '../utils/enums';

interface IFetchReq {
    endpoint: EndpointType;
    options?: IRequestOptions;
}

interface ILoaderInterface {
    getResp(FetchRespObj: IFetchReq, callback: CallbackOfType<IResponseNews | IResponseSources>): void;
}

class Loader implements ILoaderInterface {
    constructor(
        private baseLink: string,
        private options: IRequestApiKey
    ) {}

    private callbackGetResp = () => {
        console.error('No callback for GET response');
    };

    public getResp(
        { endpoint, options = {} }: IFetchReq,
        callback: CallbackOfType<IResponseNews | IResponseSources> = this.callbackGetResp
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

    private makeUrl(options: IRequestOptions, endpoint: EndpointType): URL {
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

    private async load<T extends IResponseNews | IResponseSources>(
        method: string,
        endpoint: EndpointType,
        callback: CallbackOfType<T>,
        options: IRequestOptions
    ) {
        try {
            const fetchResp: Response = await fetch(this.makeUrl(options, endpoint), { method });
            this.errorHandler(fetchResp);
            const data = (await fetchResp.json()) as T;
            if (!data.status) throw new Error('Cannot read status');
            if (data.status === 'error') {
                throw new Error(`Error code: ${data.code ?? ''}. Message: ${data.message ?? ''}`);
            }
            if (data.status === 'ok') callback(data);
        } catch (err) {
            console.error(err);
        }
    }
}

export default Loader;
