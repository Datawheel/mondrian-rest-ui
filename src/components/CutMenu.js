import React from 'react';
import { isNull } from 'lodash';
import PropTypes from 'prop-types';
import { NavDropdown } from 'react-bootstrap';

import { showCutModal } from '../redux/reducers/cutModal';
import '../css/DrillDownMenu.css';

export default function CutMenu(props, context) {
    const { cube } = props,
          { dispatch } = context.store,
    dimensions = cube ? cube.dimensions : [];

    return (
        <NavDropdown title="Add Cut" disabled={isNull(cube)}>
            {dimensions.map((d,i) =>
            <li key={i} className="dropdown-submenu">
                <a tabIndex="-1" href="#">{d.name}</a>
                <ul className="dropdown-menu">
                    {d.hierarchies[0]
                    .levels
                    .slice(1)
                      .map((l,j) =>
                          <li key={`${i}.${j}`}
                              onClick={() => dispatch(showCutModal(l))}>
                              <a tabIndex="-1" href="#">{l.name}</a>
                          </li>
                    )}
                </ul>
            </li>)
            }
        </NavDropdown>
    );
}

CutMenu.contextTypes = {
    store: PropTypes.object.isRequired
};
