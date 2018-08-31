import React from "react";
import { connect } from "react-redux";
import {
  Grid,
  Row,
  Col,
  Table,
  DropdownButton,
  MenuItem,
  Glyphicon
} from "react-bootstrap";

import { Pagination } from "@react-bootstrap/pagination";

import sortBy from "lodash/sortBy";
import reverse from "lodash/reverse";

import { PAGE_SIZE } from "../settings";
import { setPage, sortToggle } from "../redux/reducers/dataTable";

import "../css/DataTable.css";

function DownloadMenu(props) {
  return (
    <DropdownButton
      id="download-dropdownbutton"
      bsSize="large"
      title={<Glyphicon glyph="download" />}
      bsStyle="link"
    >
      <MenuItem
        eventKey="1"
        href={props.aggregation.url.replace("/aggregate", "/aggregate.csv")}
      >
        CSV
      </MenuItem>
      <MenuItem
        eventKey="2"
        href={props.aggregation.url.replace("/aggregate", "/aggregate.xls")}
      >
        Excel
      </MenuItem>
    </DropdownButton>
  );
}

function SortDirection(props) {
  const { columnIndex, sortIndex, sortAscending } = props;
  if (columnIndex !== sortIndex) return null;
  else {
    return (
      <Glyphicon glyph={"triangle-" + (sortAscending ? "top" : "bottom")} />
    );
  }
}

function DataTable(props) {
  const { aggregation, dispatch, dataTable } = props;

  if (!aggregation) {
    return (
      <Grid>
        <Row>
          <Col md={12}>
            <p>No Data</p>
          </Col>
        </Row>
      </Grid>
    );
  }

  const agg = aggregation.tidy();
  const cntDims = agg.axes.length;
  const activePage = dataTable.page;
  const pager =
    agg.data.length > PAGE_SIZE ? (
      <Pagination
        ellipsis
        boundaryLinks
        maxButtons={5}
        bsSize="small"
        items={Math.ceil(agg.data.length / PAGE_SIZE)}
        activePage={activePage}
        onSelect={eventKey => dispatch(setPage(eventKey))}
      />
    ) : null;

  function sortData(data) {
    if (dataTable.sortIndex === null) return data;

    var sortAccessor;

    if (dataTable.sortIndex < cntDims) {
      sortAccessor = d => {
        const accessor = d[dataTable.sortIndex];
        return accessor ? accessor["caption"] : accessor;
      }
    } else {
      sortAccessor = d => d[dataTable.sortIndex];
    }

    var sorted = sortBy(data, [sortAccessor]);
    if (!dataTable.sortAscending) sorted = reverse(sorted);

    return sorted;
  }

  return (
    <Grid>
      <Row>
        <Col md={10}>{pager}</Col>
        <Col md={1} mdOffset={1} style={{ textAlign: "right" }}>
          <DownloadMenu aggregation={aggregation} />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Table responsive striped bordered condensed hover>
            <thead>
              <tr>
                {agg.axes.map((a, i) => (
                  <th key={i} onClick={() => dispatch(sortToggle(i))}>
                    {a.caption} / {a.level}{" "}
                    <SortDirection
                      columnIndex={i}
                      sortIndex={dataTable.sortIndex}
                      sortAscending={dataTable.sortAscending}
                    />
                  </th>
                ))}
                {agg.measures.map((m, i) => (
                  <th
                    className="measureCell"
                    key={i}
                    onClick={() => dispatch(sortToggle(cntDims + i))}
                  >
                    {m.caption}{" "}
                    <SortDirection
                      columnIndex={cntDims + i}
                      sortIndex={dataTable.sortIndex}
                      sortAscending={dataTable.sortAscending}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortData(agg.data)
                .slice(
                  (activePage - 1) * PAGE_SIZE,
                  (activePage - 1) * PAGE_SIZE + PAGE_SIZE
                )
                .map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className={j >= cntDims ? "measureCell" : ""}>
                        {j < cntDims
                          ? typeof cell === "undefined"
                            ? ""
                            : cell.caption
                          : typeof cell === "number"
                            ? cell.toLocaleString()
                            : cell}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col md={12}>{pager}</Col>
      </Row>
    </Grid>
  );
}

export default connect(state => ({
  aggregation: state.aggregation.present.data,
  dataTable: state.dataTable
}))(DataTable);
