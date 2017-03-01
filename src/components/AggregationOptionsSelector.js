import React from 'react';
import { FormGroup, Checkbox } from 'react-bootstrap';
import { partialRight } from 'lodash';
import { connect } from 'react-redux';

import { setOption } from '../redux/reducers/aggregation';

const opts = [
    'nonempty',
    'distinct',
    'parents'
];

function AggregationOptionsSelector(props) {

    function onChange(event, measure) {
        props.dispatch(setOption(measure, event.target.checked));
    }

    return (
        <FormGroup>
            {opts.map(o =>
                <Checkbox checked={props.options[o]}
                          key={o}
                          onChange={partialRight(onChange, o)}
                          inline>{o}</Checkbox>
             )}
        </FormGroup>
    );
}

export default connect((state) => (
    {
        options: state.aggregation.options
    }

))(AggregationOptionsSelector);
