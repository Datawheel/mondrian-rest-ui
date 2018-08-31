import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Grid,
  Row,
  Col,
  Well,
  FormGroup,
  InputGroup,
  FormControl,
  Glyphicon
} from "react-bootstrap";

import values from "lodash/values";
import map from "lodash/map";
import fromPairs from "lodash/fromPairs";
import keys from "lodash/keys";

import vegaEmbed from "vega-embed";

import {
  setSpecField,
  setMarkType,
  clearSpecField
} from "../redux/reducers/chartSpec";
import { specToVegaLite, transformForVega } from "../lib/vega-utils";

import "../css/ChartContainer.css";

const FIELD_TYPES_FUNCS = {
  quantitative: [
    "",
    "bin",
    "min",
    "max",
    "mean",
    "median",
    "sum",
    "valid",
    "missing",
    "distinct",
    "modeskew",
    "q1",
    "q3",
    "stdev",
    "stdevp",
    "variance",
    "variancep"
  ],
  temporal: [
    "",
    "year",
    "quarter",
    "month",
    "date",
    "day",
    "hours",
    "minutes",
    "seconds",
    "milliseconds",
    "yearmonthdate",
    "yearquarter",
    "yearmonth",
    "yearmonthdatehours",
    "yearmonthdatehoursminutes",
    "yearmonthdatehoursminutesseconds",
    "hoursminutes",
    "hoursminutesseconds",
    "minutesseconds",
    "secondsmilliseconds"
  ],
  ordinal: null,
  nominal: null
};

// small panel that appears onmouseover
function FieldOptions(props, context) {
  const { dispatch } = context.store;
  const disabled = !props.fieldSpec;
  const functions = props.fieldSpec
    ? FIELD_TYPES_FUNCS[props.fieldSpec.vegaVariableType]
    : null;

  let funcSelector = null;

  if (functions) {
    funcSelector = (
      <div>
        <strong>function</strong>
        <br />
        <select
          onChange={e =>
            dispatch(
              setSpecField(
                props.field,
                {
                  ...props.fieldSpec,
                  vegaFunction: e.target.value
                },
                props.fieldSpec.variableType
              )
            )
          }
        >
          {functions.map((f, i) => (
            <option key={i} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <InputGroup.Addon
      style={{
        padding: 0,
        paddingRight: "5px",
        pointerEvents: disabled ? "none" : "all",
        opacity: disabled ? 0.1 : 1
      }}
      className="fieldOptionsButton"
    >
      <Glyphicon glyph="option-vertical" />
      <div className="fieldOptions">
        <strong>type</strong>
        <br />
        <select
          value={props.fieldSpec ? props.fieldSpec.vegaVariableType : undefined}
        >
          {keys(FIELD_TYPES_FUNCS).map((ft, i) => (
            <option key={i} value={ft}>
              {ft}
            </option>
          ))}
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
        <FormControl
          componentClass="select"
          placeholder="select"
          onChange={props.onChange}
        >
          <option value="" />
          {props.dimensions.map((v, i) => (
            <option key={i} value={"drillDown--" + v.name}>
              {v.hierarchy.dimension.caption} / {v.caption} (N)
            </option>
          ))}
          {props.measures.map((v, i) => (
            <option key={i} value={"measure--" + v.name}>
              {v.caption} (#)
            </option>
          ))}
        </FormControl>
      </InputGroup>
    </FormGroup>
  );
}

class _ChartSpecForm extends Component {
  static markTypes = [
    "point",
    "circle",
    "square",
    "text",
    "tick",
    "bar",
    "line",
    "area"
  ];

  static positionalChannels = ["x", "y", "row", "column"];

  static markChannels = ["size", "color", "shape", "detail", "text"];

  onFieldSelectorChange(field, variable, variableType) {
    this.props.dispatch(setSpecField(field, variable, variableType));
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
        {_ChartSpecForm.positionalChannels.map((p, i) => (
          <VariableSelect
            key={i}
            field={p}
            fieldSpec={chartSpec[p]}
            dimensions={agg.drillDowns || []}
            measures={values(agg.measures) || []}
            onChange={e => {
              if (e.target.value === "") {
                this.props.dispatch(clearSpecField(p));
              } else {
                const d = e.target.value.split("--");
                this.onFieldSelectorChange(p, fields[d[0]][d[1]], d[0]);
              }
            }}
          />
        ))}

        <div className="markSelectorContainer">
          <h5>Marks</h5>
          <select
            onChange={e => this.props.dispatch(setMarkType(e.target.value))}
          >
            {_ChartSpecForm.markTypes.map((mt, i) => (
              <option key={i} value={mt}>
                {mt}
              </option>
            ))}
          </select>
        </div>
        {_ChartSpecForm.markChannels.map((p, i) => (
          <VariableSelect
            key={i}
            field={p}
            fieldSpec={chartSpec[p]}
            dimensions={agg.drillDowns || []}
            measures={values(agg.measures) || []}
            onChange={e => {
              if (e.target.value === "") {
                this.props.dispatch(clearSpecField(p));
              } else {
                const d = e.target.value.split("--");
                this.onFieldSelectorChange(p, fields[d[0]][d[1]], d[0]);
              }
            }}
          />
        ))}
      </Well>
    );
  }
}

const ChartSpecForm = connect(state => ({
  currentCube: state.cubes.currentCube,
  chartSpec: state.chartSpec,
  currentAggregation: state.aggregation.present
}))(_ChartSpecForm);

class Chart extends Component {
  updateChart() {
    if (this.props.aggregation.data === null) {
      return;
    }

    let vls = specToVegaLite(this.props.spec);
    vls = {
      ...vls,
      mark: this.props.spec.mark,
      width: this._vegaContainer.offsetWidth,
      data: {
        values: transformForVega(this.props.aggregation.data.tidy())
      }
    };

    vegaEmbed(
      this._vegaContainer,
      vls,
      {
        mode: "vega-lite"
      }
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.spec !== nextProps.spec;
  }

  componentDidUpdate() {
    this.updateChart();
  }

  render() {
    return (
      <div>
        <div ref={c => (this._vegaContainer = c)} />
        <div id="vis-tooltip" className="vg-tooltip" />
      </div>
    );
  }
}

function _ChartContainer(props, context) {
  return (
    <Grid>
      <br />
      <Row>
        <Col md={3}>
          <ChartSpecForm />
        </Col>
        <Col md={9}>
          <Chart
            aggregation={props.currentAggregation}
            spec={props.chartSpec}
          />
        </Col>
      </Row>
    </Grid>
  );
}

export default connect(state => ({
  currentAggregation: state.aggregation.present,
  chartSpec: state.chartSpec
}))(_ChartContainer);
