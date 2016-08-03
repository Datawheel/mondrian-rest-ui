import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormControl } from 'react-bootstrap';

import { loadCubes, selectCube } from '../redux/reducers/cubes';

class CubeSelector extends Component {

    componentDidMount() {
        let { dispatch } = this.props;
        dispatch(loadCubes());
    }

    onChange(event) {
        this.props.dispatch(selectCube(event.target.value));
    }

    render() {
        return (
            // <select onChange={this.onChange.bind(this)}>
            <FormControl componentClass="select"
                         placeholder="select"
                         onChange={this.onChange.bind(this)}>
                {this.props.cubes.map(c => <option key={c.name}>{c.name}</option>)}
            </FormControl>
        );
    }
}

export default connect((state) => (
    {
        cubes: state.cubes.cubes
    }
))(CubeSelector);
