const PAGE_SET = "mondrian/dataTable/PAGE_SET";
const SORT_TOGGLE = "mondrian/dataTable/SORT_TOGGLE";

const initialState = {
  page: 1,
  sortIndex: null,
  sortAscending: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case PAGE_SET:
      return {
        ...state,
        page: action.page
      };
    case SORT_TOGGLE:
      return {
        ...state,
        sortIndex: action.index,
        sortAscending: !state.sortAscending
      };
    default:
      return state;
  }
}

export function setPage(page) {
  return {
    type: PAGE_SET,
    page: page
  };
}

export function sortToggle(index) {
  return {
    type: SORT_TOGGLE,
    index: index
  };
}
