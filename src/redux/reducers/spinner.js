const SHOW_SPINNER = "mondrian/spinner/SHOW_SPINNER";
const HIDE_SPINNER = "mondrian/spinner/HIDE_SPINNER";

const initialState = {
  show: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SHOW_SPINNER:
      return {
        ...state,
        show: true
      };
    case HIDE_SPINNER:
      return {
        ...state,
        show: false
      };
    default:
      return state;
  }
}

export function showSpinner() {
  return {
    type: SHOW_SPINNER
  };
}

export function hideSpinner() {
  return {
    type: HIDE_SPINNER
  };
}
