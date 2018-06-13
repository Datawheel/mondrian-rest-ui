import React, { Component } from "react";
import { connect } from "react-redux";

import {
  Modal,
  FormGroup,
  ControlLabel,
  FormControl,
  Button
} from "react-bootstrap";

import { setCut } from "../redux/reducers/aggregation";
import { hideCutModal } from "../redux/reducers/cutModal";

class CutModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMembers: []
    };
  }

  onMembersChange = event => {
    const { members } = this.props.cutModal;
    const options = Array.prototype.slice.call(event.target.selectedOptions);

    this.setState({
      selectedMembers: members.filter(m =>
        // (make linter shut up about the ==)
        // eslint-disable-next-line
        options.find(sm => sm.value == m.key.toString())
      )
    });
  };

  onCutSet = () => {
    this.props.dispatch(
      setCut(this.state.selectedMembers, this.props.cutModal.level)
    );
    this.onHide();
  };

  onHide = () => {
    this.props.dispatch(hideCutModal());
    this.setState({
      selectedMembers: []
    });
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.cutModal.level) return;
    if (!nextProps.aggregation.cuts[nextProps.cutModal.level.fullName]) return;

    const cutMembers =
      nextProps.aggregation.cuts[nextProps.cutModal.level.fullName].cutMembers;

    this.setState({
      selectedMembers: cutMembers
    });
  }

  render() {
    const { visible, members, level } = this.props.cutModal;
    if (!visible) return null;

    return (
      <Modal show={visible} onHide={this.onHide}>
        <Modal.Header>
          <Modal.Title>
            Cut by {level.hierarchy.dimension.caption}.{level.caption}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <FormGroup controlId="selectMembers">
              <ControlLabel>Select members</ControlLabel>
              <FormControl
                componentClass="select"
                multiple
                size="10"
                value={this.state.selectedMembers.map(sm => sm.key)}
                onChange={this.onMembersChange}
              >
                {members.map(m => (
                  <option key={m.key} value={m.key}>
                    {m.caption}
                  </option>
                ))}
              </FormControl>
            </FormGroup>
            <Button onClick={this.onCutSet}>Submit</Button>
            <Button>Clear</Button>
          </form>
        </Modal.Body>
      </Modal>
    );
  }
}

export default connect(state => ({
  cutModal: state.cutModal,
  aggregation: state.aggregation.present
}))(CutModal);
