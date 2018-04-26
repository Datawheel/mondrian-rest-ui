import React from "react";
import PropTypes from "prop-types";
import { DropdownButton } from "react-bootstrap";

import { showCutModal } from "../redux/reducers/cutModal";
import "../css/DrillDownMenu.css";
import { HierarchyComponent } from "./HierarchyComponent";

export default function CutMenu(props, context) {
  const { cube } = props,
    { dispatch } = context.store,
    dimensions = cube ? cube.dimensions : [];

  return (
    <DropdownButton
      id="cutmenu-dropdown"
      title="Add Cut"
      bsSize="xsmall"
      disabled={cube === null}
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
                clickEvent={level => dispatch(showCutModal(level))}
              />
            ))}
          </ul>
        </li>
      ))}
    </DropdownButton>
  );
}

CutMenu.contextTypes = {
  store: PropTypes.object.isRequired
};
