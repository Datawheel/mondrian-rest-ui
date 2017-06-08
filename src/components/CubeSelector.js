import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormControl } from 'react-bootstrap';
import Select from 'react-select';

import { loadCubes, selectCube } from '../redux/reducers/cubes';

import 'react-select/dist/react-select.css';

class CubeSelector extends Component {

    componentDidMount() {
        this.props.dispatch(loadCubes());
    }

    onChange(cube) {
        this.props.dispatch(selectCube(cube.value));
    }

    render() {
        return (
            <li style={{width: '200px', height: '64px', position: 'relative', top: '15px'}}>
                <Select name="cube-select"
                        value={this.props.currentCube ? this.props.currentCube.name : null }
                        options={this.props.cubes.map(c => ({ value: c.name, label: c.name }))}
                        clearable={false}
                        placeholder="Select cube…"
                        onChange={this.onChange.bind(this)} />
            </li>
        );
    }
}

export default connect((state) => (
    {
        cubes: state.cubes.cubes,
        currentCube: state.cubes.currentCube
    }
))(CubeSelector);
