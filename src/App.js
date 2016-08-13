import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isNull } from 'lodash';

import { Grid, Row, Col, Nav, Navbar, NavItem, FormGroup, FormControl, Label, Glyphicon, Tabs, Tab, NavDropdown, MenuItem } from 'react-bootstrap';

import CubeSelector from './components/CubeSelector';
import DrillDownMenu from './components/DrillDownMenu';
import DataTable from './components/DataTable';
import MeasuresSelector from './components/MeasuresSelector';
import { ChartContainer } from './components/ChartContainer';
import DebugModal from './components/DebugModal';

import { removeDrilldown } from './redux/reducers/aggregation';
import { showModal } from './redux/reducers/modal';

class App extends Component {
  render() {
    return (
        <div className="App">
            <DebugModal />
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#">mondrian-rest</a>
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
                        <DrillDownMenu cube={this.props.currentCube}/>
                    </Nav>
                    <Nav pullRight>
                        <NavItem disabled={isNull(this.props.currentCube)} eventKey={1} href="#" onClick={() => this.props.dispatch(showModal())}>Debug</NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <div className="container">
                <Grid>
                    <Row>
                        <Col md={1}>
                            Drilldowns:
                        </Col>
                        <Col md={11}>
                            {this.props.drillDowns.map((dd, i) =>
                                <Label style={{fontSize: '14px', fontWeight: 'normal'}} bsStyle="primary" key={i}>{dd.hierarchy.dimension.name} / {dd.name}<Glyphicon glyph="remove" style={{top: '2px', marginLeft: '5px'}} onClick={() => this.props.dispatch(removeDrilldown(dd))} /></Label>
                             )}
                        </Col>
                    </Row>
                    <Row>
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
        drillDowns: state.aggregation.drillDowns
    }
))(App);

export default ConnectedApp;
