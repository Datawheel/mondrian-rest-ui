import { fromPairs } from 'lodash';

const SPEC_FIELD_SET = 'mondrian/chartspec/SPEC_FIELD_SET';
const MARK_TYPE_SET = 'mondrian/chartspec/MARK_TYPE_SET';

const initialState = {
    x: null,
    y: null,
    row: null,
    column: null,
    size: null,
    color: null,
    shape: null,
    detail: null,
    text: null,
    mark: 'point'
};

const VT_TO_VEGAVT = {
    measure: 'quantitative',
    drillDown: 'nominal'
}

export default function reducer(state = initialState, action={}) {
    switch(action.type) {
        case SPEC_FIELD_SET:
            return Object.assign({},
                                 state,
                                 fromPairs([
                                     [
                                         action.key,
                                         {
                                             ...action.variable,
                                             variableType: action.variableType,
                                             vegaVariableType: VT_TO_VEGAVT[action.variableType]
                                         }
                                     ]
                                 ]));
        case MARK_TYPE_SET:
            return {
                ...state,
                mark: action.markType
            }
        default:
            return state;
    }
}

export function setSpecField(key, variable, variableType) {
    return {
        type: SPEC_FIELD_SET,
        key: key,
        variable: variable,
        variableType: variableType
    };
}

export function setMarkType(markType) {
    return {
        type: MARK_TYPE_SET,
        markType: markType
    };
}
