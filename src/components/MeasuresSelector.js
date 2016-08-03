import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormGroup, Checkbox } from 'react-bootstrap';
import { partialRight } from 'lodash';

import { setMeasure } from '../redux/reducers/aggregation';

class MeasuresSelector extends Component {

    onChange(event, measure) {
        this.props.dispatch(setMeasure(measure, event.target.checked));
    }

    render() {
        const measures = this.props.currentCube ? this.props.currentCube.measures : [];

        return (
            // <select onChange={this.onChange.bind(this)}>
            <FormGroup>
                <br /><br /><br /><br /><br /><br />
                {measures.map((m,i) =>
                    <Checkbox checked={m.name in this.props.selectedMeasures} key={i} onChange={partialRight(this.onChange, m).bind(this)} inline>{m.caption}</Checkbox>
                 )}
            </FormGroup>
        );
    }
}

export default connect((state) => (
    {
        currentCube: state.cubes.currentCube,
        selectedMeasures: state.aggregation.measures
    }
))(MeasuresSelector);
