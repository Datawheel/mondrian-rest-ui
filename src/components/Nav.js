import React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { isNull } from 'lodash';

import CubeSelector from './CubeSelector';
import { showModal } from '../redux/reducers/modal';

export default function(props) {

  return (
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          mondrian-rest
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullLeft>
          <CubeSelector />
          {' '}
        </Nav>
        <Nav pullRight>
          <NavItem disabled={props.loading || isNull(props.currentCube)} eventKey={1} href="#" onClick={() => props.dispatch(showModal())}>Debug</NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
