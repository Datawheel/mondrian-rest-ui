import { combineReducers } from 'redux';
import cubes from './cubes';
import aggregation from './aggregation';
import chartSpec from './chartSpec';
import dataTable from './dataTable';
import modal from './modal';
import cutModal from './cutModal';

export default combineReducers({
    cubes: cubes,
    aggregation: aggregation,
    chartSpec: chartSpec,
    dataTable: dataTable,
    modal: modal,
    cutModal: cutModal
});
