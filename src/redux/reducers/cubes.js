import {
  setMeasure,
  clearMeasures,
  clearDrildowns,
  clearCuts
} from "./aggregation";
import { clearSpec } from "./chartSpec.js";

import { client } from "../../settings";

import { showSpinner, hideSpinner } from "./spinner.js";

const LOAD_CUBES = "mondrian/cubes/LOAD";
const LOAD_CUBES_SUCCESS = "mondrian/cubes/SUCCESS";
const LOAD_CUBES_FAIL = "mondrian/cubes/FAIL";
const SELECT_CUBE = "mondrian/cubes/SELECT";

const initialState = {
  cubes: [],
  currentCube: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
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
        cubes: action.result
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
      return {
        ...state,
        currentCube: state.cubes.find(c => c.name === action.name)
      };
    default:
      return state;
  }
}

export function loadCubes() {
  return dispatch => {
    dispatch({ type: LOAD_CUBES });
    dispatch(showSpinner());
    return client.cubes().then(cubes => {
      dispatch({ type: LOAD_CUBES_SUCCESS, result: cubes });
      dispatch(hideSpinner());
      return cubes;
    });
  };
}

export function selectCube(name) {
  return (dispatch, getState) => {
    dispatch(clearDrildowns());
    dispatch(clearMeasures());
    dispatch(clearSpec());
    dispatch(clearCuts());
    dispatch({
      type: SELECT_CUBE,
      name: name
    });
    // select first measure upon cube selection
    dispatch(setMeasure(getState().cubes.currentCube.measures[0], true));
  };
}
