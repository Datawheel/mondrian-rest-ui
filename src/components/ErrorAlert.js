import React, { Component } from "react";
import { connect } from "react-redux";
import { Alert } from "react-bootstrap";

import "../css/ErrorAlert.css";

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
    } else {
      this.setState({
        visible: false,
        error: null
      });
    }
  }

  renderError(error) {
    if (error instanceof Array) {
      return <pre>{error.join("\n")}</pre>;
    } else if (error instanceof String) {
      return <span>{error}</span>;
    }
  }

  render() {
    const { error } = this.props;

    if (this.state.visible) {
      return (
        <Alert
          className={"alert" + (this.state.showMore ? " showMore" : "")}
          bsStyle="danger"
          onDismiss={() => this.setState({ visible: false })}
        >
          <h5>
            Error: <tt>{error.message}</tt>
            <button
              className="moreless"
              onClick={() => this.setState({ showMore: !this.state.showMore })}
              style={{ visibility: error.error ? "visible" : "hidden" }}
            >
              [{this.state.showMore ? "less" : "more"}]
            </button>
          </h5>
          <div id="moreError">{this.renderError(this.props.error.error)}</div>
        </Alert>
      );
    }
    return null;
  }
}

export default connect(state => ({
  error: state.aggregation.present.error
}))(ErrorAlert);
