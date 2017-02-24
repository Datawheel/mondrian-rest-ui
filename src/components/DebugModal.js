import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Modal, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

import { hideModal } from '../redux/reducers/modal';
import { toVegaShorthand, shortHandToVegaLite } from '../lib/vega-utils';

function DebugModal(props) {
    const { data } = props.aggregation,
    vSh = toVegaShorthand(props.chartSpec);
    return (
        <Modal show={props.modal.visible} onHide={() => props.dispatch(hideModal())}>
            <Modal.Header>
                <Modal.Title>Debug</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <FormGroup>
                        <ControlLabel>API URL</ControlLabel>
                        <FormControl type="text" value={data ? data.url : ''} readOnly style={{fontFamily: 'monospace', fontSize: '12px'}} />
                        {data ? <div style={{textAlign: 'right'}}><a href={data.url} target="_blank">Open in new window</a></div> : null}
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Generated MDX</ControlLabel>
                        <FormControl componentClass="textarea" value={data ? data.mdx : ''} readOnly style={{fontFamily: 'monospace', fontSize: '12px'}}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Vega Lite Shorthand</ControlLabel>
                        <FormControl type="text" value={vSh} readOnly style={{fontFamily: 'monospace', fontSize: '12px'}} />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Vega Lite JSON</ControlLabel>
                        <FormControl componentClass="textarea" value={JSON.stringify(shortHandToVegaLite(vSh), null, 2)} readOnly style={{fontFamily: 'monospace', fontSize: '12px'}}/>
                    </FormGroup>
                </form>
            </Modal.Body>

        </Modal>
    );
}

export default connect((state) => (
    {
        modal: state.modal,
        aggregation: state.aggregation,
        chartSpec: state.chartSpec
    }
))(DebugModal);
