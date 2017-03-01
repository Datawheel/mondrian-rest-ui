import React from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash';

import { Grid, Row, Col, Label, Glyphicon, Tabs, Tab } from 'react-bootstrap';

import DataTable from './components/DataTable';
import MeasuresSelector from './components/MeasuresSelector';
import { ChartContainer } from './components/ChartContainer';
import DebugModal from './components/DebugModal';
import CutModal from './components/CutModal';
import TopBar from './components/TopBar';
import AggregationOptionsSelector from './components/AggregationOptionsSelector';

import { removeDrilldown, removeCut } from './redux/reducers/aggregation';
import { showCutModal } from './redux/reducers/cutModal';

import './css/App.css';

function App(props, context) {
    return (
        <div className="App">
            <DebugModal />
            <CutModal />
            <TopBar {...props} />
            <div className="container" style={{position: 'relative'}}>
                <div className="loading-overlay" style={{visibility: props.loading ? 'visible' : 'hidden' }}>
                    <div className="loader" />
                </div>
                <Grid>
                    <Row>
                        <Col md={10}>
                            <Row>
                                <Col md={1}>
                                    Drilldowns:
                                </Col>
                                <Col md={9}>
                                    {props.drillDowns.map((dd, i) =>
                                        <Label className="pill"
                                               bsStyle="primary"
                                               key={i}>{dd.hierarchy.dimension.name} / {dd.name}<Glyphicon className="remove" glyph="remove" style={{top: '2px', marginLeft: '5px'}} onClick={() => props.dispatch(removeDrilldown(dd))} /></Label>
                                     )}
                                </Col>
                            </Row>
                            <Row>
                                <Col md={1}>
                                    Cuts:
                                </Col>
                                <Col md={9}>
                                    {map(props.cuts, (cut, level, i) =>
                                        <Label className="pill"
                                               bsStyle="primary"
                                               key={level}
                                               onClick={() => props.dispatch(showCutModal(cut.level))}>
                                            {cut.level.hierarchy.dimension.name} / {cut.level.name}{ cut.cutMembers.length > 1 ? `(${cut.cutMembers.length})` : `: ${cut.cutMembers[0].caption}` }<Glyphicon className="remove" glyph="remove" style={{top: '2px', marginLeft: '5px'}} onClick={(e) => { props.dispatch(removeCut(cut.level)); e.stopPropagation(); }} /></Label>
                                     )}
                                </Col>
                            </Row>
                            <Row>
                                <Col md={1}>
                                    Measures:
                                </Col>
                                <Col md={9}>
                                    <MeasuresSelector />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <Tabs defaultActiveKey={1} id="tabs" animation={false}>
                                        <Tab eventKey={1} title="Data">
                                            <DataTable />
                                        </Tab>
                                        <Tab eventKey={2} title="Chart"><ChartContainer /></Tab>
                                    </Tabs>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={2}>
                            <AggregationOptionsSelector />
                        </Col>
                    </Row>
                </Grid>
            </div>
        </div>
    );
}

const ConnectedApp = connect((state) => (
    {
        currentCube: state.cubes.currentCube,
        drillDowns: state.aggregation.drillDowns,
        cuts: state.aggregation.cuts,
        loading: state.aggregation.loading
    }
))(App);

export default ConnectedApp;
