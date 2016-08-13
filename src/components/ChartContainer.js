import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Well, FormGroup, InputGroup, FormControl } from 'react-bootstrap';

import { values, map, fromPairs,
         zipObject, property, flowRight } from 'lodash';
import vl from 'vega-lite';
import vegaEmbed from 'vega-embed';

import { setSpecField, setMarkType } from '../redux/reducers/chartSpec';
import { toVegaShorthand, normalizeFieldName, shortHandToVegaLite } from '../lib/vega-utils';

import '../css/ChartContainer.css';

function variableSelect(props) {
    return (
        <FormGroup>
            <InputGroup>
                <InputGroup.Addon>{props.field}</InputGroup.Addon>
                <FormControl componentClass="select" placeholder="select" onChange={props.onChange}>
                    <option></option>
                    {props.dimensions.map((v,i) => <option key={i} value={'drillDown--'+v.name}>{v.hierarchy.dimension.caption } / {v.caption} (N)</option>)}
                    {props.measures.map((v,i) => <option key={i} value={'measure--'+v.name}>{v.caption} (#)</option>)}
                </FormControl>
            </InputGroup>
        </FormGroup>
    );
};

class _ChartSpecForm extends Component {

    static markTypes = [
        'point', 'circle', 'square', 'text', 'tick', 'bar', 'line', 'area'
    ];

    static positionalChannels = [
        'x', 'y', 'row', 'column'
    ];

    static markChannels = [
        'size', 'color', 'shape', 'detail', 'text'
    ];

    onFieldSelectorChange(field, variable, variableType) {
        this.props.dispatch(setSpecField(field, variable, variableType))
    }

    render() {
        const agg = this.props.currentAggregation,
              fields = {
                  drillDown: fromPairs(map((agg.drillDowns || []).map(d => [d.name, d]))),
                  measure: agg.measures || {}
              };

        return (
            <Well>
                <h5>Positional</h5>
                {
                    _ChartSpecForm.positionalChannels.map((p,i) =>
                        variableSelect({
                            key: i,
                            field: p,
                            dimensions: agg.drillDowns || [],
                            measures: values(agg.measures) || [],
                            onChange: e => {
                                const d = e.target.value.split('--');
                                this.onFieldSelectorChange(p, fields[d[0]][d[1]], d[0]);
                            }
                        })
                    )
                }

                <div className="markSelectorContainer">
                    <h5>Marks</h5>
                    <select onChange={e => this.props.dispatch(setMarkType(e.target.value))}>
                        {
                            _ChartSpecForm.markTypes.map((mt,i) =>
                                <option key={i} value={mt}>{mt}</option>
                            )
                        }
                    </select>
                </div>
                {
                    _ChartSpecForm.markChannels.map((p,i) => (
                        variableSelect({
                            key: i,
                            field: p,
                            dimensions: agg.drillDowns || [],
                            measures: values(agg.measures) || [],
                            onChange: e => {
                                console.log('VALUE', e.target.value);
                                const d = e.target.value.split('--');
                                this.onFieldSelectorChange(p, fields[d[0]][d[1]], d[0]);
                            }
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

const transformForVega = (tidyData) => {
    const keys = tidyData.axes.map(flowRight(normalizeFieldName, property('level')))
                         .concat(tidyData.measures.map(flowRight(normalizeFieldName, property('name')))),
          nDrilldowns = tidyData.axes.length;
    return tidyData.data.map(
        (d) =>
            zipObject(keys,
                      d.slice(0,nDrilldowns).map(property('caption'))
                       .concat(d.slice(nDrilldowns)))
    );
};


class Chart extends Component {

    constructor(props) {
        super(props);
        this.state = { // yes, stateful.
            vis: null
        }
    }

    updateChart() {
        let vls = shortHandToVegaLite(toVegaShorthand(this.props.spec));

        // bail early if we can't generate a valid VL Spec
        if (vls === '') {
            return
        }

        vls = {
            ...vls,
            config: {
                cell: {
                    width: 400,
                    height: 400
                },
                facet: {
                    cell: {
                        width: 400,
                        height: 200
                    }
                }
            },
            mark: this.props.spec.mark,
            data: {
                values: transformForVega(this.props.aggregation.data.tidy())
            }
        };

        const vegaSpec = vl.compile(vls);



        vegaEmbed(this._vegaContainer,
                  {
                      mode: 'vega-lite',
                      spec: vls
                  });

    }

    componentDidUpdate() {
        this.updateChart();
    }

    render() {
        return (
            <div ref={(c) => this._vegaContainer = c}>
            </div>
        );
    }
}

class _ChartContainer extends Component {
    render() {
        return (
            <Grid>
                <br />
                <Row>
                    <Col md={3}><ChartSpecForm /></Col>
                    <Col md={9}><Chart aggregation={this.props.currentAggregation} spec={this.props.chartSpec} /></Col>
                </Row>
            </Grid>

        );
    }
}

export const ChartContainer = connect((state) => (
    {
        currentCube: state.cubes.currentCube,
        currentAggregation: state.aggregation,
        chartSpec: state.chartSpec
    }
))(_ChartContainer);
