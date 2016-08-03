import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Navbar, FormGroup, FormControl, Label, Glyphicon, Tabs, Tab } from 'react-bootstrap';

import CubeSelector from './components/CubeSelector';
import DrillDownMenu from './components/DrillDownMenu';
import DataTable from './components/DataTable';
import MeasuresSelector from './components/MeasuresSelector';
import { ChartContainer } from './components/ChartContainer';

import { removeDrilldown } from './redux/reducers/aggregation';

class App extends Component {
  render() {
    return (
        <div className="App">
            <Navbar inverse>
                <Navbar.Brand>Cubierto</Navbar.Brand>
                <Navbar.Collapse>
                    <Navbar.Form pullLeft>
                        <FormGroup>
                            <CubeSelector />
                        </FormGroup>
                        {' '}
                    </Navbar.Form>
                </Navbar.Collapse>
            </Navbar>
            <div className="App-intro">
                <DrillDownMenu cube={this.props.currentCube}/>
                <div style={{fontSize: '14px'}}>
                    {this.props.drillDowns.map((dd, i) =>
                        <Label style={{fontSize: '14px', fontWeight: 'normal'}} bsStyle="primary" key={i}>{dd.hierarchy.dimension.name} / {dd.name}<Glyphicon glyph="remove" onClick={() => this.props.dispatch(removeDrilldown(dd))} /></Label>
                     )}
                </div>
                <MeasuresSelector />
                <Tabs defaultActiveKey={1} id="tabs">
                    <Tab eventKey={1} title="Data">
                        <DataTable />
                    </Tab>
                    <Tab eventKey={2} title="Chart"><ChartContainer /></Tab>
                </Tabs>
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
