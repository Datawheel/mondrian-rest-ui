import { combineReducers } from "redux";
import cubes from "./cubes";
import aggregation from "./aggregation";
import chartSpec from "./chartSpec";
import dataTable from "./dataTable";
import modal from "./modal";
import cutModal from "./cutModal";
import spinner from "./spinner";

import undoable from "redux-undo";

export default combineReducers({
  cubes: cubes,
  aggregation: undoable(aggregation),
  chartSpec: chartSpec,
  dataTable: dataTable,
  modal: modal,
  cutModal: cutModal,
  spinner: spinner
});
