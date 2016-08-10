import { fromPairs, omit, map, compact } from 'lodash';

import * as client from '../../lib/mondrian-client.js';

const DRILLDOWN_ADDED = 'mondrian/aggregation/DRILLDOWN_ADDED';
const DRILLDOWN_REMOVED = 'mondrian/aggregation/DRILLDOWN_REMOVED';
const DRILLDOWN_CLEAR_ALL = 'mondrian/aggregation/DRILLDOWN_CLEAR_ALL';
const AGGREGATION_LOADING = 'mondrian/aggregation/AGGREGATION_LOADING';
const AGGREGATION_LOADED = 'mondrian/aggregation/AGGREGATION_LOADED';
const AGGREGATION_FAIL = 'mondrian/aggregation/AGGREGATION_FAIL';
const AGGREGATION_CLEAR = 'mondrian/aggregation/AGGREGATION_CLEAR';
const MEASURE_SET = 'mondrian/aggregation/MEASURE_SET';
const MEASURE_CLEAR_ALL = 'mondrian/aggregation/MEASURE_CLEAR_ALL';

const initialState = {
    drillDowns: [],
    measures: {}
};

export default function reducer(state = initialState, action={}) {
    switch(action.type) {
        case DRILLDOWN_ADDED:
            return {
                ...state,
                // TODO: only concat() if not already contained in the list
                drillDowns: state.drillDowns.concat([action.level])
            };
        case DRILLDOWN_REMOVED:
            return {
                ...state,
                drillDowns: state.drillDowns.filter(l => l !== action.level)
            };
        case DRILLDOWN_CLEAR_ALL:
            return {
                ...state,
                drillDowns: [],
                data: null
            };
        case AGGREGATION_LOADING:
            return {
                ...state,
                loading: true
            };
        case AGGREGATION_LOADED:
            return {
                ...state,
                loading: false,
                loaded: true,
                error: null,
                data: action.aggregation
            };
        case AGGREGATION_CLEAR:
            return {
                ...state,
                data: null
            }
        case MEASURE_SET:
            return {
                ...state,
                measures: action.add ? Object.assign({}, state.measures, fromPairs([[action.measure.name, action.measure]])) : omit(state.measures, action.measure.name)
            };
        case MEASURE_CLEAR_ALL:
            return {
                ...state,
                measures: {}
            };
        default:
            return state;
    }
}

function clientCall(dispatch, getState) {
    const state = getState(),
          dds = compact(state.aggregation.drillDowns);

    if (dds.length === 0) {
        return null;
    }

    dispatch({
        type: AGGREGATION_LOADING
    });

    return client.getAggregation(state.cubes.currentCube,
                                 {
                                     drilldown: state.aggregation.drillDowns,
                                     // TODO: get dimensions from state
                                     measures: map(state.aggregation.measures),
                                     nonempty: true
                                 })
                 .then(data => {
                     dispatch({
                         type: AGGREGATION_LOADED,
                         aggregation: data
                     });
                 })
                 .catch(err => {
                     // TODO: undo optimistic add
                 });
};

export function addDrilldown(level) {
    return (dispatch, getState) => {
        dispatch({ // optimistic add
            type: DRILLDOWN_ADDED,
            level: level
        });
        clientCall(dispatch, getState);
    };
}

export function removeDrilldown(level) {
    return (dispatch, getState) => {
        dispatch({ // optimistic remove
            type: DRILLDOWN_REMOVED,
            level: level
        });

        if (getState().aggregation.drillDowns.length > 0) {
            clientCall(dispatch, getState);
        }
        else {
            dispatch({
                type: AGGREGATION_LOADED,
                aggregation: null
            });
        }
    };
}

export function clearDrildowns() {
    return {
        type: DRILLDOWN_CLEAR_ALL
    };
}

export function setMeasure(measure, add) {
    return (dispatch, getState) => {
        dispatch({ // optimistic set
            type: MEASURE_SET,
            measure: measure,
            add: add
        });
        clientCall(dispatch, getState);
    };
}

export function clearMeasures() {
    return {
        type: MEASURE_CLEAR_ALL
    };
}
