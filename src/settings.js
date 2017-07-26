import { Client } from 'mondrian-rest-client';


//export const __API_ENDPOINT__ = 'https://api.spendview.nerdpower.org/';
//export const __API_ENDPOINT__ = 'https://mondrian-rest.jazzido.com/';
//export const __API_ENDPOINT__ = 'http://hermes:5000/';
export const __API_ENDPOINT__ = 'http://localhost:9292/';
export const client = new Client(__API_ENDPOINT__);
export const PAGE_SIZE = 40;

export const SITE_TITLE = 'mondrian-rest-ui';

