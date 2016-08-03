import urljoin from 'url-join';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';

import Cube from './cube';
import Aggregation from './aggregation';
import { aggregationQS } from './mondrian-utils';

import { __API_ENDPOINT__ } from '../settings';

/* small API client for mondrian-rest */

export function getCubes() {
    return fetch(urljoin(__API_ENDPOINT__, 'cubes'))
        .then(resp => resp.json())
        .then(json => json.cubes.map(c => new Cube(c)));
}

export function getCube(cubeId) {
    return fetch(urljoin(__API_ENDPOINT__, 'cubes', cubeId))
        .then(resp => (resp.json()))
        .then(json => new Cube(json));
}

export function getAggregation(cube, params) {
    const qs = _.isObject(params) ? aggregationQS(params) : params,
          url = urljoin(__API_ENDPOINT__,
                        `/cubes/${cube.name}/aggregate?${qs}`);

    return fetch(url)
        .then(resp => (resp.json()))
        .then(json => new Aggregation(
            {
                ...json,
                url: url,
                params: _.omit(params, ['cube'])
            }
        ));
}

export function getMember(cubeId, memberFullName) {
    const url = urljoin(__API_ENDPOINT__,
                        `/cubes/${cubeId}/members?full_name=${encodeURIComponent(memberFullName)}`);
    return fetch(url)
        .then(resp => resp.json());
}
