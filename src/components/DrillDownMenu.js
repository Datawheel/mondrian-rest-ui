import React from 'react';

import { DropdownButton } from 'react-bootstrap';

import { addDrilldown } from '../redux/reducers/aggregation';
import '../css/DrillDownMenu.css';

export default function DrillDownMenu(props, context) {
  const { cube, drillDowns, dispatch } = props,
  dimensions = cube ? cube.dimensions : [];

  return (
    <DropdownButton bsSize="xsmall" title="Add Drilldown" id="dropdown-size-small" disabled={dimensions.length === 0} style={{marginRight: '10px' }}>
      {dimensions.map((d,i) =>
        <li key={i} className="dropdown-submenu">
          <a tabIndex="-1">{d.name}</a>
          <ul className="dropdown-menu">
            {d.hierarchies[0]
              .levels
              .slice(d.hierarchies[0].allMemberName ? 1 : 0)
              .map((l,j) =>
                <li key={`${i}.${j}`}
                    onClick={() => dispatch(addDrilldown(l))}>
                  <a tabIndex="-1">{ drillDowns.find(dd => dd === l) ? '✓ ' : ' ' }{l.name}</a>
                </li>
              )}
          </ul>
        </li>)
      }
    </DropdownButton>
  );
}
