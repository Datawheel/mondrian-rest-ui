import { combineReducers } from 'redux';
import cubes from './cubes';
import aggregation from './aggregation';
import chartSpec from './chartSpec';

export default combineReducers({
    cubes: cubes,
    aggregation: aggregation,
    chartSpec: chartSpec
});
