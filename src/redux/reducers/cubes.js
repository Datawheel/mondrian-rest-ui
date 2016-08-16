import urljoin from 'url-join';

import { setMeasure, clearMeasures, clearDrildowns } from './aggregation';

const LOAD_CUBES = 'mondrian/cubes/LOAD';
const LOAD_CUBES_SUCCESS = 'mondrian/cubes/SUCESS';
const LOAD_CUBES_FAIL = 'mondrian/cubes/FAIL';
const SELECT_CUBE = 'mondrian/cubes/SELECT';

import { __API_ENDPOINT__ } from '../../settings';

const initialState = {
    cubes: [],
    currentCube: null,
};

export default function reducer(state = initialState, action = {}) {
    switch(action.type) {
        case LOAD_CUBES:
            return {
                ...state,
                loading: true
            };
        case LOAD_CUBES_SUCCESS:
            return {
                ...state,
                loading: false,
                loaded: true,
                error: null,
                cubes: action.result.cubes
            };
        case LOAD_CUBES_FAIL:
            return {
                ...state,
                loading: false,
                loaded: false,
                error: action.error,
                cubes: []
            };
        case SELECT_CUBE:
            let cc = state.cubes.find(c => c.name === action.name);
            // add references to parent elements
            cc.dimensions.forEach(d => {
                d.hierarchies.forEach(h => {
                    h.dimension = d;
                    h.levels.forEach(l => l.hierarchy = h); // eslint-disable-line no-return-assign
                })
            });
            return {
                ...state,
                currentCube: cc
            };
        default:
            return state;
    }
}

export function loadCubes() {
    return {
        types: [LOAD_CUBES, LOAD_CUBES_SUCCESS, LOAD_CUBES_FAIL],
        promise: (client) => {
            return client.get(urljoin(__API_ENDPOINT__, 'cubes'));
        }
    };
}

export function selectCube(name) {
    return (dispatch, getState) => {
        dispatch(clearDrildowns());
        dispatch(clearMeasures());
        dispatch({
            type: SELECT_CUBE,
            name: name
        });
        // select first measure upon cube selection
        dispatch(setMeasure(getState().cubes.currentCube.measures[0], true));
    };
}
