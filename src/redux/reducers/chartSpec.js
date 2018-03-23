import fromPairs from "lodash/fromPairs";

const SPEC_FIELD_SET = "mondrian/chartspec/SPEC_FIELD_SET";
const SPEC_FIELD_CLEAR = "mondrian/chartspec/SPEC_FIELD_CLEAR";
const MARK_TYPE_SET = "mondrian/chartspec/MARK_TYPE_SET";
const SPEC_CLEAR = "mondrian/chartspec/SPEC_CLEAR";

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
  mark: "point"
};

const VT_TO_VEGAVT = {
  measure: "quantitative",
  drillDown: "nominal"
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SPEC_FIELD_SET:
      return {
        ...state,
        ...fromPairs([
          [
            action.key,
            {
              ...action.variable,
              variableType: action.variableType,
              vegaVariableType: VT_TO_VEGAVT[action.variableType]
            }
          ]
        ])
      };
    case SPEC_FIELD_CLEAR:
      const c = {};
      c[action.key] = null;
      return {
        ...state,
        ...c
      };
    case MARK_TYPE_SET:
      return {
        ...state,
        mark: action.markType
      };
    case SPEC_CLEAR:
      return {
        ...initialState
      };
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

export function clearSpecField(key) {
  return {
    type: SPEC_FIELD_CLEAR,
    key: key
  };
}

export function setMarkType(markType) {
  return {
    type: MARK_TYPE_SET,
    markType: markType
  };
}

export function clearSpec() {
  return {
    type: SPEC_CLEAR
  };
}
