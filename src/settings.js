import { Client } from 'mondrian-rest-client';

export const __API_ENDPOINT__ = window.__API_ENDPOINT__ || process.env.REACT_APP_API_URL || 'http://localhost:9292/';

export const client = new Client(__API_ENDPOINT__);
export const PAGE_SIZE = 40;

export const SITE_TITLE = window.__SITE_TITLE__ || process.env.SITE_TITLE || 'mondrian-rest-ui';
