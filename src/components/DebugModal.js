import React from "react";
import { connect } from "react-redux";

import keys from "lodash/keys";
import map from "lodash/map";

import SyntaxHighlighter, {
  registerLanguage
} from "react-syntax-highlighter/dist/light";
import js from "react-syntax-highlighter/dist/languages/javascript";
import docco from "react-syntax-highlighter/dist/styles/docco";

import { Modal, FormGroup, ControlLabel, FormControl } from "react-bootstrap";

import { hideModal } from "../redux/reducers/modal";
import { cutExpression } from "../redux/reducers/aggregation.js";

registerLanguage("javascript", js);

function ClientCodeExample(props) {
  const objId = "cube.query";
  const indent = "\n" + " ".repeat(objId.length);

  const { cuts, drillDowns, measures } = props.aggregation;
  const dds = drillDowns
    .map(
      level =>
        `.drilldown("${level.hierarchy.dimension.name}", "${
          level.hierarchy.name
        }", "${level.name}")`
    )
    .join(indent);
  const cts = map(cuts, cut => `.cut("${cutExpression(cut)}")`).join(indent);
  const msrs = keys(measures)
    .map(measure => `.measure("${measure}")`)
    .join(indent);
  return (
    <SyntaxHighlighter language="javascript" style={docco}>
      {objId + dds + indent + msrs + indent + cts}
    </SyntaxHighlighter>
  );
}

function DebugModal(props) {
  const { cuts, data, drillDowns, measures } = props.aggregation;
  let logiclayer = {
    drilldowns: null,
    measures: null
  };

  measures &&
    Object.keys(measures).length > 0 &&
    (logiclayer.measures = Object.keys(measures).join());

  drillDowns &&
    drillDowns.length > 0 &&
    (logiclayer.drilldowns = drillDowns.map(d => d.name).join());

  if (cuts && Object.keys(cuts).length > 0) {
    Object.keys(cuts).map(key => {
      const name = cuts[key].level.name;
      const members = cuts[key].cutMembers.map(h => h.key).join();
      logiclayer[name] = members;
    });
  }

  logiclayer = Object.keys(logiclayer)
    .reduce((all, d) => {
      if (logiclayer[d]) all.push(d + "=" + logiclayer[d]);
      return all;
    }, [])
    .join("&");

  return (
    <Modal
      show={props.modal.visible}
      onHide={() => props.dispatch(hideModal())}
    >
      <Modal.Header>
        <Modal.Title>Debug</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <FormGroup>
            <ControlLabel>API URL</ControlLabel>
            <FormControl
              type="text"
              value={data ? data.url : ""}
              readOnly
              style={{ fontFamily: "monospace", fontSize: "12px" }}
            />
            {data ? (
              <div style={{ textAlign: "right" }}>
                <a href={data.url} target="_blank" rel="noopener noreferrer">
                  Open in new window
                </a>
              </div>
            ) : null}
          </FormGroup>

          <FormGroup>
            <ControlLabel>LOGICLAYER URL</ControlLabel>
            <FormControl
              type="text"
              value={data ? "/api/data?" + logiclayer : ""}
              readOnly
              style={{ fontFamily: "monospace", fontSize: "12px" }}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              <a
                href="https://github.com/Datawheel/mondrian-rest-client"
                target="_blank"
                rel="noopener noreferrer"
              >
                <tt>mondrian-rest-client</tt>
              </a>{" "}
              call
            </ControlLabel>
            <ClientCodeExample aggregation={props.aggregation} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Generated MDX</ControlLabel>
            <FormControl
              componentClass="textarea"
              value={data ? data.mdx : ""}
              readOnly
              style={{ fontFamily: "monospace", fontSize: "12px" }}
            />
          </FormGroup>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default connect(state => ({
  modal: state.modal,
  aggregation: state.aggregation.present,
  chartSpec: state.chartSpec
}))(DebugModal);
