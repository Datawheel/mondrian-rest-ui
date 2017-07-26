import React, { Component } from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash';

import { Grid, Row, Col, Label, Glyphicon, Tabs, Tab, DropdownButton, MenuItem } from 'react-bootstrap';

import DrillDownMenu from './components/DrillDownMenu';
import CutMenu from './components/CutMenu';
import DataTable from './components/DataTable';
import MeasuresSelector from './components/MeasuresSelector';
import ChartContainer from './components/ChartContainer';
import DebugModal from './components/DebugModal';
import CutModal from './components/CutModal';
import ErrorAlert from './components/ErrorAlert';
import Nav from './components/Nav.js';

import { removeDrilldown, removeCut, addDrilldown, setMeasure, clearMeasures } from './redux/reducers/aggregation';
import { showCutModal } from './redux/reducers/cutModal';
import { loadCubes, selectCube } from './redux/reducers/cubes';

import { serializeAggregationParams } from './lib/url-utils';

import './css/App.css';

function ShareButton(props) {
  const { currentCube, aggregation } = props;
  const hash = serializeAggregationParams(currentCube, aggregation);

  const { origin, pathname } = window.location;

  return (
    <DropdownButton  onSelect={() => null} id="download-dropdownbutton" bsSize="small" title={<Glyphicon glyph="share"/>} bsStyle="link">
      <MenuItem><input type="text" value={`${origin}${pathname}/#${hash}`}/></MenuItem>
    </DropdownButton>
  );
}

class App extends Component {

  hashChange() {
    const urlState = JSON.parse(atob(window.location.hash.slice(1)));

    const { dispatch } = this.props;

    dispatch(loadCubes())
      .then(cubes => dispatch(selectCube(urlState.cube)))
      .then(() => {
        const { currentCube } = this.props;

        // drilldown on the provided levels
        urlState.drillDowns.forEach(([dimName, hierName, lvlName]) => {
          const level = currentCube
                            .dimensionsByName[dimName]
                            .getHierarchy(hierName)
                            .getLevel(lvlName);
          dispatch(addDrilldown(level, false));
        });

        // select the provided measures
        dispatch(clearMeasures());
        urlState.measures.forEach(msrName => {
          dispatch(setMeasure(currentCube.findMeasure(msrName), true, false));
        });

        // set the provided cuts
      });
  }

  componentDidMount() {
    window.addEventListener("hashchange", this.hashChange, false);
    if (window.location.hash !== "") {
      this.hashChange();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.hashChange, false);
  }

  render() {

    const { loading, currentCube, dispatch, aggregation } = this.props,
    { drillDowns, cuts } = aggregation;

    return (
      <div className="App">
        <DebugModal />
        <CutModal />
        <Nav loading={loading} currentCube={currentCube} dispatch={dispatch} />
        <div className="container" style={{position: 'relative'}}>
          <div className="loading-overlay" style={{visibility: loading ? 'visible' : 'hidden' }}>
            <div className="loader" />
          </div>
          <Grid>
            <Row>
              <ErrorAlert />
            </Row>
            <Row style={{paddingTop: '5px', paddingBottom: '5px'}}>
              <Col md={1}>
                Drilldowns:
              </Col>
              <Col md={10}>
                <DrillDownMenu disabled={loading} drillDowns={drillDowns} cube={currentCube} dispatch={dispatch} />
                {drillDowns.map((dd, i) =>
                  <Label className="pill"
                         bsStyle="primary"
                         key={i}>{dd.hierarchy.dimension.name} / {dd.name}<Glyphicon className="remove" glyph="remove" style={{top: '2px', marginLeft: '5px'}} onClick={() => dispatch(removeDrilldown(dd))} /></Label>
                 )}
              </Col>
              <Col md={1}>
                <ShareButton currentCube={currentCube} aggregation={aggregation} />
              </Col>
            </Row>
            <Row style={{paddingTop: '5px', paddingBottom: '5px'}}>
              <Col md={1}>
                Cuts:
              </Col>
              <Col md={11}>
                <CutMenu disabled={loading} cube={currentCube} />
                {map(cuts, (cut, level, i) =>
                  <Label className="pill"
                         bsStyle="primary"
                         key={level}
                         onClick={() => dispatch(showCutModal(cut.level))}>
                    {cut.level.hierarchy.dimension.name} / {cut.level.name}{ cut.cutMembers.length > 1 ? `(${cut.cutMembers.length})` : `: ${cut.cutMembers[0].caption}` }<Glyphicon className="remove" glyph="remove" style={{top: '2px', marginLeft: '5px'}} onClick={(e) => { dispatch(removeCut(cut.level)); e.stopPropagation(); }} /></Label>
                 )}
              </Col>
            </Row>
            <Row style={{paddingTop: '5px', paddingBottom: '5px'}}>
              <Col md={1}>
                Measures:
              </Col>
              <Col md={11}>
                <MeasuresSelector />
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Tabs defaultActiveKey={1} id="tabs" animation={false}>
                  <Tab eventKey={1} title="Data">
                    <DataTable />
                  </Tab>
                  <Tab eventKey={2} title="Chart">
                    <ChartContainer />
                  </Tab>
                </Tabs>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

const ConnectedApp = connect((state) => (
  {
    currentCube: state.cubes.currentCube,
    aggregation: state.aggregation.present,
    drillDowns: state.aggregation.present.drillDowns,
    cuts: state.aggregation.present.cuts,
    loading: state.spinner.show,
  }
))(App);

export default ConnectedApp;
