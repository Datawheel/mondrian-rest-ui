import { fromPairs, omit, compact, reduce } from 'lodash';

import { client as mondrianClient } from '../../settings.js';
import Aggregation from '../../lib/aggregation.js';

const DRILLDOWN_ADDED = 'mondrian/aggregation/DRILLDOWN_ADDED';
const DRILLDOWN_REMOVED = 'mondrian/aggregation/DRILLDOWN_REMOVED';
const DRILLDOWN_CLEAR_ALL = 'mondrian/aggregation/DRILLDOWN_CLEAR_ALL';
const AGGREGATION_LOADING = 'mondrian/aggregation/AGGREGATION_LOADING';
const AGGREGATION_LOADED = 'mondrian/aggregation/AGGREGATION_LOADED';
const AGGREGATION_FAIL = 'mondrian/aggregation/AGGREGATION_FAIL';
const AGGREGATION_CLEAR = 'mondrian/aggregation/AGGREGATION_CLEAR';
const MEASURE_SET = 'mondrian/aggregation/MEASURE_SET';
const MEASURE_CLEAR_ALL = 'mondrian/aggregation/MEASURE_CLEAR_ALL';
const CUT_SET = 'mondrian/aggregation/CUT_SET';
const CUT_REMOVED = 'mondrian/aggregation/CUT_REMOVED';

const initialState = {
    drillDowns: [],
    cuts: {},
    measures: {}
};

export default function reducer(state = initialState, action={}) {
    switch(action.type) {
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
        case CUT_SET:
            const c = {};
            c[action.level.fullName] = {
                level: action.level,
                cutMembers: action.cutMembers
            };
            return {
                ...state,
                cuts: { ...state.cuts, ...c}
            };
        case CUT_REMOVED:
            return {
                ...state,
                cuts: omit(state.cuts, [action.level.fullName])
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

function memberKey(member) {
    return `[${member.level.hierarchy.dimension.name}].[${member.level.name}].&[${member.key}]`;
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

    // add measures
    let query = reduce(state.aggregation.measures,
                       (q, m, mn) => q.measure(m.name),
                       state.cubes.currentCube.query);

    // add drilldowns
    query = reduce(state.aggregation.drillDowns,
                   (q, dd) => q.drilldown(dd.hierarchy.dimension.name, dd.hierarchy.name, dd.name),
                   query);

    // add cuts
    query = reduce(state.aggregation.cuts,
                   (q, cut) => {
                       const cutExpr = (cut.cutMembers.length === 1) ? memberKey(cut.cutMembers[0]) : `{${cut.cutMembers.map(memberKey).join(',')}}`;
                       return q.cut(cutExpr)
                   },
                   query);

    // add options
    query = query.option('nonempty', true).option('debug', true);


    return mondrianClient.query(query)
                         .then(agg => {
                             dispatch({
                                 type: AGGREGATION_LOADED,
                                 aggregation: new Aggregation(agg),
                             })
                         })
                         .catch(err => dispatch({
                             type: AGGREGATION_FAIL,
                             error: err
                         }));
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

export function setCut(cutMembers, level) {
    return (dispatch, getState) => {
        dispatch({
            type: CUT_SET,
            cutMembers: cutMembers,
            level: level
        });
        clientCall(dispatch, getState);
    };
}

export function removeCut(level) {
    return (dispatch, getState) => {
        dispatch({
            type: CUT_REMOVED,
            level: level
        });
        clientCall(dispatch, getState);
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
