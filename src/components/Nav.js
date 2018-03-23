import React from "react";
import { Nav, Navbar, NavItem } from "react-bootstrap";

import CubeSelector from "./CubeSelector";
import { showModal } from "../redux/reducers/modal";
import { SITE_TITLE } from "../settings";

function NavMenu(props) {
  return (
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>{SITE_TITLE}</Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullLeft>
          <CubeSelector />{" "}
        </Nav>
        <Nav pullRight>
          <NavItem
            disabled={props.loading || props.currentCube === null}
            eventKey={1}
            href="#"
            onClick={() => props.dispatch(showModal())}
          >
            Debug
          </NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavMenu;
