import React from 'react';
import { connect } from 'react-redux';

import { addDrilldown } from '../redux/reducers/aggregation';
import '../css/dropdown-menu.css';

export default function DrillDownMenu(props, context) {
    const { cube } = props,
          { dispatch } = context.store,
          dimensions = cube ? cube.dimensions : [];
    return (
        <ul className="ddmenu">
        <li>
        <a>Drilldown</a>
        <ul>
            {dimensions.map((d,i) =>
                <li key={i}>
                    <a>{d.name}</a>
                    <ul>
                        {d.hierarchies[0]
                          .levels
                          .slice(1)
                          .map((l,i) =>
                              <li key={i} onClick={() => dispatch(addDrilldown(l))}><a>{l.name}</a></li>
                          )}
                    </ul>
                </li>)}
        </ul>
        </li>
        </ul>
    );
}

DrillDownMenu.contextTypes = {
    store: React.PropTypes.object.isRequired
};
