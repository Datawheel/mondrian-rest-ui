const BUTTON_CLICKED = 'testingapp/BUTTON_CLICKED';

const initialState = {
    timesClicked: 0
};

export default function reducer(state = initialState, action = {}) {
    switch(action.type) {
    case BUTTON_CLICKED:
        return {
            ...state,
            timesClicked: state.timesClicked+1
        };
        default:
            return state;
    }
}

export function clickButton() {
    return {
        type: BUTTON_CLICKED
    };
}
