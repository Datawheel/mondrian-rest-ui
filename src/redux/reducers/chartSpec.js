import { fromPairs } from 'lodash';

const SPEC_FIELD_SET = 'mondrian/chartspec/SPEC_FIELD_SET';

const initialState = {
    x: null,
    y: null,
    row: null,
    column: null,
    size: null,
    color: null,
    shape: null,
    detail: null,
    text: null
};

export default function reducer(state = initialState, action={}) {
    switch(action.type) {
        case SPEC_FIELD_SET:
            return Object.assign({}, state, fromPairs([[action.key, action.value]]));
        default:
            return state;
    }
}

export function setSpecField(key, value) {
    return {
        type: SPEC_FIELD_SET,
        key: key,
        value: value
    };
}
