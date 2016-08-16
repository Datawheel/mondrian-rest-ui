import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { isNull } from 'lodash';

import { addDrilldown } from '../redux/reducers/aggregation';
import '../css/DrillDownMenu.css';

export default function DrillDownMenu(props, context) {
    const { cube } = props,
          { dispatch } = context.store,
    dimensions = cube ? cube.dimensions : [];

    return (
        <NavDropdown title="Add Drilldown" disabled={isNull(cube)}>
            {dimensions.map((d,i) =>
            <li key={i} className="dropdown-submenu">
                <a tabIndex="-1" href="#">{d.name}</a>
                <ul className="dropdown-menu">
                    {d.hierarchies[0]
                    .levels
                    .slice(1)
                      .map((l,j) => <li key={`${i}.${j}`} onClick={() => dispatch(addDrilldown(l))}><a tabIndex="-1" href="#">{l.name}</a></li>
                    )}
                </ul>
            </li>)
            }
        </NavDropdown>
    );
}

DrillDownMenu.contextTypes = {
    store: React.PropTypes.object.isRequired
};
