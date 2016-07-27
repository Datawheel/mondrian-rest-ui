import React, { Component } from 'react';

export default class ClickerButton extends Component {
    render() {
        return <button onClick={this.props.onClick}>{this.props.children}</button>
    }
}
