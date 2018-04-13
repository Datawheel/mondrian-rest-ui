import React from "react";

import { DropdownButton } from "react-bootstrap";

import { addDrilldown } from "../redux/reducers/aggregation";
import "../css/DrillDownMenu.css";

import { HierarchyComponent } from "./HierarchyComponent";

export default function DrillDownMenu(props) {
  const { cube, dispatch } = props,
    dimensions = cube ? cube.dimensions : [];

  return (
    <DropdownButton
      bsSize="xsmall"
      title="Add Drilldown"
      id="dropdown-size-small"
      disabled={dimensions.length === 0}
      style={{ marginRight: "10px" }}
    >
      {dimensions.map((d, i) => (
        <li key={i} className="dropdown-submenu">
          <a tabIndex="-1">{d.name}</a>
          <ul className="dropdown-menu" key={d.name}>
            {d.hierarchies.map((hierarchy, hIdx) => (
              <HierarchyComponent
                hierarchy={hierarchy}
                key={hIdx}
                clickEvent={level => dispatch(addDrilldown(level))}
              />
            ))}
          </ul>
        </li>
      ))}
    </DropdownButton>
  );
}
