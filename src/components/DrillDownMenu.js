import React from "react";

import { DropdownButton } from "react-bootstrap";

import { addDrilldown } from "../redux/reducers/aggregation";
import "../css/DrillDownMenu.css";

function levels(hierarchy, drillDowns, dispatch) {
  return (
    <ul className="dropdown-menu">
      {hierarchy.levels
        .slice(hierarchy.allMemberName === null ? 0 : 1)
        .map((l, li) =>
          <li key={li} onClick={() => dispatch(addDrilldown(l))}>
            <a>
              {drillDowns.find(dd => dd === l) ? "✓ " : " "}
              {l.name}
            </a>
          </li>
        )}
    </ul>
  );
}

export default function DrillDownMenu(props, context) {
  const { cube, drillDowns, dispatch } = props,
    dimensions = cube ? cube.dimensions : [];

  return (
    <DropdownButton
      bsSize="xsmall"
      title="Add Drilldown"
      id="dropdown-size-small"
      disabled={dimensions.length === 0}
      style={{ marginRight: "10px" }}
    >
      {dimensions.map((d, i) => {
        return (
          <li key={i} className="dropdown-submenu">
            <a tabIndex="-1">
              {d.name}
            </a>
            {d.hierarchies.length > 1
              ? <ul className="dropdown-menu">
                  {d.hierarchies.map((h, hi) =>
                    <li key={hi} className="dropdown-submenu">
                      <a>
                        {h.name}
                      </a>
                      {levels(h, drillDowns, dispatch)}
                    </li>
                  )}
                </ul>
              : levels(d.hierarchies[0], drillDowns, dispatch)}
          </li>
        );
      })}
    </DropdownButton>
  );
}
