import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isNull, map } from 'lodash';

import { Grid, Row, Col, Nav, Navbar, NavItem, FormGroup,  Label, Glyphicon, Tabs, Tab } from 'react-bootstrap';

import CubeSelector from './components/CubeSelector';
import DrillDownMenu from './components/DrillDownMenu';
import CutMenu from './components/CutMenu';
import DataTable from './components/DataTable';
import MeasuresSelector from './components/MeasuresSelector';
import { ChartContainer } from './components/ChartContainer';
import DebugModal from './components/DebugModal';
import CutModal from './components/CutModal';

import { removeDrilldown, removeCut } from './redux/reducers/aggregation';
import { showModal } from './redux/reducers/modal';
import { showCutModal } from './redux/reducers/cutModal';

import './css/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <DebugModal />
        <CutModal />
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              mondrian-rest
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <Navbar.Form pullLeft>
                <FormGroup>
                  <CubeSelector />
                </FormGroup>
                {' '}
              </Navbar.Form>
            </Nav>
            <Nav pullRight>
              <NavItem disabled={this.props.loading || isNull(this.props.currentCube)} eventKey={1} href="#" onClick={() => this.props.dispatch(showModal())}>Debug</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="container" style={{position: 'relative'}}>
          <div className="loading-overlay" style={{visibility: this.props.loading ? 'visible' : 'hidden' }}>
            <div className="loader" />
          </div>
          <Grid>
            <Row style={{paddingTop: '5px', paddingBottom: '5px'}}>
              <Col md={1}>
                Drilldowns:
              </Col>
              <Col md={11}>
                <DrillDownMenu disabled={this.props.loading} drillDowns={this.props.drillDowns} cube={this.props.currentCube} />
                {this.props.drillDowns.map((dd, i) =>
                  <Label className="pill"
                         bsStyle="primary"
                         key={i}>{dd.hierarchy.dimension.name} / {dd.name}<Glyphicon className="remove" glyph="remove" style={{top: '2px', marginLeft: '5px'}} onClick={() => this.props.dispatch(removeDrilldown(dd))} /></Label>
                 )}
        
              </Col>
            </Row>
            <Row style={{paddingTop: '5px', paddingBottom: '5px'}}>
              <Col md={1}>
                Cuts:
              </Col>
              <Col md={11}>
                <CutMenu disabled={this.props.loading} cube={this.props.currentCube} />
                {map(this.props.cuts, (cut, level, i) =>
                  <Label className="pill"
                         bsStyle="primary"
                         key={level}
                         onClick={() => this.props.dispatch(showCutModal(cut.level))}>
                    {cut.level.hierarchy.dimension.name} / {cut.level.name}{ cut.cutMembers.length > 1 ? `(${cut.cutMembers.length})` : `: ${cut.cutMembers[0].caption}` }<Glyphicon className="remove" glyph="remove" style={{top: '2px', marginLeft: '5px'}} onClick={(e) => { this.props.dispatch(removeCut(cut.level)); e.stopPropagation(); }} /></Label>
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
                  <Tab eventKey={2} title="Chart"><ChartContainer /></Tab>
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
        drillDowns: state.aggregation.drillDowns,
        cuts: state.aggregation.cuts,
        loading: state.aggregation.loading
    }
))(App);

export default ConnectedApp;
