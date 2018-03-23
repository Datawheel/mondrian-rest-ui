import React from "react";
import { connect } from "react-redux";
import { FormGroup, Checkbox } from "react-bootstrap";
import partialRight from "lodash/partialRight";

import { setMeasure } from "../redux/reducers/aggregation";

function MeasuresSelector(props) {
  const measures = props.currentCube ? props.currentCube.measures : [];

  function onChange(event, measure) {
    props.dispatch(setMeasure(measure, event.target.checked));
  }

  return (
    <FormGroup>
      {measures.map((m, i) => (
        <Checkbox
          checked={m.name in props.selectedMeasures}
          key={i}
          onChange={partialRight(onChange, m)}
          inline
        >
          {m.caption}
        </Checkbox>
      ))}
    </FormGroup>
  );
}

export default connect(state => ({
  currentCube: state.cubes.currentCube,
  selectedMeasures: state.aggregation.present.measures
}))(MeasuresSelector);
