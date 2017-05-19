import React from 'react';
import { isNull } from 'lodash';
import PropTypes from 'prop-types';

import { NavDropdown } from 'react-bootstrap';

import { addDrilldown } from '../redux/reducers/aggregation';
import '../css/DrillDownMenu.css';

export default function DrillDownMenu(props, context) {
    const { cube, drillDowns } = props,
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
                      .map((l,j) =>
                          <li key={`${i}.${j}`}
                              onClick={() => dispatch(addDrilldown(l))}>
                              <a tabIndex="-1" href="#">{ drillDowns.find(dd => dd === l) ? '✓ ' : ' ' }{l.name}</a>
                          </li>
                    )}
                </ul>
            </li>)
            }
        </NavDropdown>
    );
}

DrillDownMenu.contextTypes = {
    store: PropTypes.object.isRequired
};
