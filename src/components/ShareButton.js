import React from "react";

import {
  Glyphicon,
  OverlayTrigger,
  Button,
  Popover,
  Tooltip
} from "react-bootstrap";
import ClipboardButton from "react-clipboard.js";

import { serializeAggregationParams, aggregationLink } from "../lib/url-utils";

export default function ShareButton(props) {
  const { currentCube, aggregation } = props;
  const url = aggregationLink(
    serializeAggregationParams(currentCube, aggregation)
  );

  const copiedTooltip = <Tooltip id="copiedTooltip">copied!</Tooltip>;

  const popover = (
    <Popover id="share-popover">
      <input type="text" value={url} readOnly={true} />
      <ClipboardButton data-clipboard-text={url} className="btn btn-link">
        <OverlayTrigger
          overlay={copiedTooltip}
          placement="bottom"
          trigger="click"
        >
          <Glyphicon glyph="copy" />
        </OverlayTrigger>
      </ClipboardButton>
    </Popover>
  );

  return (
    <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
      <Button bsStyle="link">
        <Glyphicon glyph="share" />
      </Button>
    </OverlayTrigger>
  );
}
