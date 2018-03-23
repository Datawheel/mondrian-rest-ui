import { client as mondrianClient } from "../../settings.js";

const CUT_MODAL_SHOW = "mondrian/cutModal/MODAL_SHOW";
const CUT_MODAL_HIDE = "mondrian/cutModal/MODAL_HIDE";

const initialState = {
  visible: false,
  members: [],
  level: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CUT_MODAL_SHOW:
      return {
        ...state,
        visible: true,
        level: action.level,
        members: action.members
      };
    case CUT_MODAL_HIDE:
      return {
        ...state,
        visible: false,
        level: null,
        members: []
      };
    default:
      return state;
  }
}

export function showCutModal(level) {
  return dispatch => {
    mondrianClient.members(level).then(members => {
      dispatch({
        type: CUT_MODAL_SHOW,
        level: level,
        members: members.map(m => ({ ...m, level: level }))
      });
    });
  };
}

export function hideCutModal() {
  return {
    type: CUT_MODAL_HIDE
  };
}
