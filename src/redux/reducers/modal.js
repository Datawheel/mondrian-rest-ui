const MODAL_SHOW = "mondrian/modal/MODAL_SHOW";
const MODAL_HIDE = "mondrian/modal/MODAL_HIDE";

const initialState = {
  visible: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case MODAL_SHOW:
      return {
        ...state,
        visible: true
      };
    case MODAL_HIDE:
      return {
        ...state,
        visible: false
      };
    default:
      return state;
  }
}

export function showModal() {
  return {
    type: MODAL_SHOW
  };
}

export function hideModal() {
  return {
    type: MODAL_HIDE
  };
}
