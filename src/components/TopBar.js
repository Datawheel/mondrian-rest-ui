import React from 'react';
import { Nav, Navbar, NavItem, FormGroup } from 'react-bootstrap';
import { isNull } from 'lodash';

import CubeSelector from './CubeSelector';
import DrillDownMenu from './DrillDownMenu';
import CutMenu from './CutMenu';
import { showModal } from '../redux/reducers/modal';

export default function(props) {
    return (
        <Navbar>
            <Navbar.Header>
                <Navbar.Brand>
                    <a href="#">mondrian-rest</a>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav>
                    <Navbar.Form pullLeft>
                        <FormGroup>
                            <CubeSelector />
                        </FormGroup>
                        {' '}
                    </Navbar.Form>
                    <DrillDownMenu disabled={props.loading} drillDowns={props.drillDowns} cube={props.currentCube} />
                    <CutMenu disabled={props.loading} cube={props.currentCube} />
                </Nav>
                <Nav pullRight>
                    <NavItem disabled={props.loading || isNull(props.currentCube)} eventKey={1} href="#" onClick={() => props.dispatch(showModal())}>Debug</NavItem>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );

};
