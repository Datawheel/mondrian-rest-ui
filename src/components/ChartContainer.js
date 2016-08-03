import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Well, FormGroup, InputGroup, FormControl, Glyphicon } from 'react-bootstrap';

import { partialRight, values, map, isNull, toPairs } from 'lodash';
import vl from 'vega-lite';
import vg from 'vega';

import * as bleh from 'vega-embed';

import { setSpecField } from '../redux/reducers/chartSpec';

const POSITIONAL = ['x', 'y', 'row', 'column'];
const MARKS = ['size', 'color', 'shape', 'detail', 'text'];

function VariableSelect(props) {
    return (
        <FormGroup>
            <InputGroup>
                <InputGroup.Addon>{props.field}</InputGroup.Addon>
                <FormControl componentClass="select" placeholder="select" onChange={props.onChange}>
                    <option value=""></option>
                    {props.dimensions.map((v,i) => <option key={i} value={v.name}>{v.caption}</option>)}
                    {props.measures.map((v,i) => <option key={i} value={v.name}>{v.caption}</option>)}
                </FormControl>
            </InputGroup>
        </FormGroup>
    );

};

class _ChartSpecForm extends Component {

    onFieldSelectorChange(event, field) {
        this.props.dispatch(setSpecField(field, event.target.value))
    }

    render() {
        const agg = this.props.currentAggregation;
        return (
            <Well>
                <h4>Positional</h4>
                {
                    POSITIONAL.map((p,i) =>
                        VariableSelect({
                            key: i,
                            field: p,
                            dimensions: agg.drillDowns || [],
                            measures: values(agg.measures) || [],
                            onChange: partialRight(this.onFieldSelectorChange, p).bind(this)
                        })
                    )
                }

                <h4>Marks</h4>
                {
                    MARKS.map((p,i) => (
                        VariableSelect({
                            key: i,
                            field: p,
                            dimensions: agg.drillDowns || [],
                            measures: values(agg.measures) || [],
                            onChange: partialRight(this.onFieldSelectorChange, p).bind(this)
                        })
                    ))
                }
            </Well>
        );
    }
}

const ChartSpecForm = connect(state => ({
    currentCube: state.cubes.currentCube,
    chartSpec: state.chartSpect,
    currentAggregation: state.aggregation
}))(_ChartSpecForm);

function Chart(props) {

    function toVegaLiteSpec() {
        // mark=point|x=Horsepower,Q|y=Acceleration,Q|shape=bin_Weight_in_lbs,Q|color=Origin,N
        const spec = props.spec || {},
              sh = map(_.filter(toPairs(spec), v => !isNull(v[1])),
                       (v) => `${v[0]}=${v[1]},Q`).join('|');


        return sh !== '' ? vl.shorthand.parse('mark=point|' + sh) : '';
    }

    const vls = toVegaLiteSpec();
    let vegaContainer;

    console.log("88888", bleh);

    if (vls !== '') {
        vl.parse.spec(vls,
                      chart => {

                      })
    }
    return (
        <div ref={(c) => vegaContainer = c}>
        </div>
    );

}

class _ChartContainer extends Component {

    render() {
        return (
            <div>
                <Col md={2}><ChartSpecForm /></Col>
                <Col md={10}><Chart data={[]} spec={this.props.chartSpec} /></Col>
            </div>

        );
    }
}


export const ChartContainer = connect((state) => (
    {
        currentCube: state.cubes.currentCube,
        chartSpec: state.chartSpec
    }
))(_ChartContainer);
