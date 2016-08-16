import fetch from 'isomorphic-fetch';
import { Promise } from 'bluebird';
import formurlencoded from 'form-urlencoded';

const methods = ['get', 'post', 'put', 'patch', 'del'];

class ApiFetcher2 {
    constructor() {
        methods.forEach((method) => // eslint-disable-line no-return-assign
            // eslint-disable-next-line
            this[method] = (path, { params, data } = {}) => {
                            let opts = { method: method };
                            if (params) {
                                path += '?' + formurlencoded(params);
                            }

                            if (data) {
                                opts = { ...opts, body: data };
                            }

                            return new Promise((rslv, rjct) => {
                                fetch(path, opts)
                                    .then(response => {
                                        if (response.status >= 200 && response.status < 300) {
                                            rslv(response.json());
                                        }
                                        else {
                                            const t = response ? response.text() : '';
                                            rjct(t);
                                        }
                                    });
                            });
            });
    }
}


export default function fetcherMiddleware({dispatch, getState}) {
    const fetcher = new ApiFetcher2();
    return next => action => {
        if (typeof action === 'function') {
            return action(dispatch, getState);
        }

        const { promise, types, ...rest } = action; // eslint-disable-line no-redeclare
        if (!promise) {
            return next(action);
        }

        const [REQUEST, SUCCESS, FAILURE] = types;
        next({...rest, type: REQUEST});
        return promise(fetcher).then(
            (response) => next({...rest, 'result': response, 'response': response, type: SUCCESS}),
            (error) => next({...rest, error, type: FAILURE})
        ).catch((error)=> {
            console.error('FETCHING MIDDLEWARE ERROR:', error);
            next({...rest, error, type: FAILURE});
        });
    };
}
