import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Well, FormGroup, InputGroup, FormControl, Glyphicon } from 'react-bootstrap';
import { forEach, has, values, map, fromPairs, keys, flatMap } from 'lodash';

import { setSpecField, setMarkType, clearSpecField } from '../../redux/reducers/chartSpec';

const FIELD_TYPES_FUNCS = {
    quantitative: [
        '', 'bin',
        'min', 'max',
        'mean', 'median',
        'sum', 'valid', 'missing',
        'distinct', 'modeskew',
        'q1', 'q3',
        'stdev', 'stdevp',
        'variance', 'variancep'
    ],
    temporal: [
        '', 'year',
        'quarter', 'month',
        'date','day',
        'hours', 'minutes',
        'seconds', 'milliseconds',
        'yearmonthdate', 'yearquarter',
        'yearmonth', 'yearmonthdatehours',
        'yearmonthdatehoursminutes',
        'yearmonthdatehoursminutesseconds',
        'hoursminutes', 'hoursminutesseconds',
        'minutesseconds', 'secondsmilliseconds'
    ],
    ordinal: null,
    nominal: null
};

// small panel that appears onmouseover
function FieldOptions(props, context) {
    const { dispatch } = context.store;
    const disabled = !props.fieldSpec;
    const functions = props.fieldSpec ? FIELD_TYPES_FUNCS[props.fieldSpec.vegaVariableType] : null;

    let funcSelector = null;

    if (functions) {
        funcSelector = (
            <div>
                <strong>function</strong>
                <br />
                <select onChange={ (e) =>
                    dispatch(setSpecField(props.field,
                                          {
                                              ...props.fieldSpec,
                                              vegaFunction: e.target.value
                                          },
                                          props.fieldSpec.variableType)) }>
                    { functions.map((f,i) => <option key={i} value={f}>{f}</option>) }
                </select>
            </div>
        );
    }

    return (
        <InputGroup.Addon
           style={
               {
                   padding: 0,
                   paddingRight: '5px',
                   pointerEvents: disabled ? 'none' : 'all',
                   opacity: disabled ? 0.1 : 1
               }}
           className="fieldOptionsButton">
            <Glyphicon glyph="option-vertical" />
            <div className="fieldOptions">
                <strong>type</strong>
                <br />
                <select value={props.fieldSpec ? props.fieldSpec.vegaVariableType : undefined}>
                    {keys(FIELD_TYPES_FUNCS).map((ft, i) => <option key={i} value={ft}>{ft}</option>)}
                </select>
                <br />
                {funcSelector}
            </div>
        </InputGroup.Addon>
    );
}

FieldOptions.contextTypes = {
    store: PropTypes.object.isRequired
};


function VariableSelect(props) {
    return (
        <FormGroup>
            <InputGroup className="fieldOptionsContainer">
                <FieldOptions field={props.field} fieldSpec={props.fieldSpec} />
                <InputGroup.Addon>{props.field}</InputGroup.Addon>
                <FormControl componentClass="select" placeholder="select" onChange={props.onChange}>
                    <option value=""></option>
                    {flatMap(props.dimensions, (v, i) => {
                         const dd = [<option key={i} value={'drillDown--'+v.name}>{v.hierarchy.dimension.caption} / {v.caption} (N)</option>];
                         if (has(props.properties, v.hierarchy.dimension.name)) {
                             forEach(props.properties, (p,j) => {
                                 dd.push(<option key={j} value={'property--'+v.name+'--'+p}>{v.hierarchy.dimension.caption} / {p} (N)</option>);
                             });
                         }
                         return dd;
                     })}
                    {props.measures.map((v,i) => <option key={i} value={'measure--'+v.name}>{v.caption} (#)</option>)}
                </FormControl>
            </InputGroup>
        </FormGroup>
    );
};

const markTypes = [
    'point', 'circle', 'square', 'text', 'tick', 'bar', 'line', 'area'
];

const positionalChannels = [
    'x', 'y', 'row', 'column'
];

const markChannels = [
    'size', 'color', 'shape', 'detail', 'text'
];

class _ChartSpecForm extends Component {


    onFieldSelectorChange(field, variable, variableType) {
        this.props.dispatch(setSpecField(field, variable, variableType))
    }

    render() {
        const agg = this.props.currentAggregation,
              chartSpec = this.props.chartSpec || {},
              fields = {
                  drillDown: fromPairs(map((agg.drillDowns || []).map(d => [d.name, d]))),
                  measure: agg.measures || {}
              };

        return (
            <Well>
                <h5>Positional</h5>
                {
                    positionalChannels.map((p,i) =>
                        <VariableSelect key={i}
                                        field={p}
                                        fieldSpec={chartSpec[p]}
                                        dimensions={agg.drillDowns || []}
                                        properties={agg.properties || {}}
                                        measures={values(agg.measures) || []}
                                        onChange={(e) => {
                                                if (e.target.value === "") {
                                                    this.props.dispatch(clearSpecField(p));
                                                }
                                                else {
                                                    const d = e.target.value.split('--');
                                                    this.onFieldSelectorChange(p, fields[d[0]][d[1]], d[0]);
                                                }
                                            }} />
                    )
                }

                <div className="markSelectorContainer">
                    <h5>Marks</h5>
                    <select onChange={e => this.props.dispatch(setMarkType(e.target.value))}>
                        {
                            markTypes.map((mt,i) =>
                                <option key={i} value={mt}>{mt}</option>
                            )
                        }
                    </select>
                </div>
                {
                    markChannels.map((p,i) => (
                        <VariableSelect key={i}
                                        field={p}
                                        fieldSpec={chartSpec[p]}
                                        dimensions={agg.drillDowns || []}
                                        properties={agg.properties || {}}
                                        measures={values(agg.measures) || []}
                                        onChange={(e) => {
                                                if (e.target.value === "") {
                                                    this.props.dispatch(clearSpecField(p));
                                                }
                                                else {
                                                    const d = e.target.value.split('--');
                                                    this.onFieldSelectorChange(p, fields[d[0]][d[1]], d[0]);
                                                }
                                            }} />

                    ))
                }
            </Well>
        );
    }
}

export default connect(state => ({
    currentCube: state.cubes.currentCube,
    chartSpec: state.chartSpec,
    currentAggregation: state.aggregation.present
}))(_ChartSpecForm);
