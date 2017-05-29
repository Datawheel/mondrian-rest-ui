import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';

import '../css/ErrorAlert.css';

class ErrorAlert extends Component {

    constructor(props) {
        super();
        this.state = {
            visible: false,
            error: null,
            showMore: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({
                visible: true,
                error: nextProps.error
            });
        }
        else {
            this.setState({
                visible: false,
                error: null
            });
        }
    }


    render() {
        if (this.state.visible) {
            return (
                <Alert className={'alert' + (this.state.showMore ? ' showMore' : '')}
                       bsStyle="danger"
                       onDismiss={() => this.setState({visible: false})}>
                  <h5>Error: <tt>{this.props.error.message}</tt><button className="moreless" onClick={() => this.setState({showMore: !this.state.showMore})}>[{this.state.showMore ? 'less' : 'more'}]</button></h5>
                  <p>Sed diam. Fusce sagittis, libero non molestie mollis, magna orci ultrices dolor, at vulputate neque nulla lacinia eros.</p>
                </Alert>);
        }
        return null;
    }
}

export default connect((state) => (
    {
        error: state.aggregation.present.error
    }
))(ErrorAlert);
