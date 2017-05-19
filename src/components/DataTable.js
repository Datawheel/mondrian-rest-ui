import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Table, Pagination, DropdownButton, MenuItem, Glyphicon, Checkbox } from 'react-bootstrap';

import { partialRight } from 'lodash';

import { PAGE_SIZE } from '../settings';
import { setPage } from '../redux/reducers/dataTable';
import { setProperty } from '../redux/reducers/aggregation';

import '../css/DataTable.css';

/**
 * Renders a dropdown menu next to a column header
 * that allows selection of level properties
 */
function _PropertySelectorDropdown(props) {

  const { level, dispatch, aggregation } = props;

  function onChange(event, propertyName) {
    dispatch(setProperty(level, propertyName, event.target.checked));
  }

  var selectedProps = new Set();
  if (level.hierarchy.dimension.name in aggregation.properties) {
    selectedProps = aggregation.properties[level.hierarchy.dimension.name];
  }

  console.log('selectedProps', selectedProps);

  return (
    <DropdownButton bsSize="small" title={<Glyphicon glyph="align-justify"/>} bsStyle="link">
      {
        level.properties.map((pname, i) => {
          return (<MenuItem key={i} eventKey={i}>
          <Checkbox
      checked={selectedProps.has(pname)}
      onChange={partialRight(onChange, pname)}
      inline>{pname}</Checkbox>
          </MenuItem>);
        })
      }
    </DropdownButton>
  );
}

const PropertySelectorDropdown = connect(state => (
  {
    currentCube: state.cubes.currentCube,
    aggregation: state.aggregation,
  }
))(_PropertySelectorDropdown);


function DataTable(props) {
  const { aggregation, currentCube, dataTable, dispatch } = props;
  let c;

  if (!aggregation) {
    c = (
      <Grid>
        <Row>
          <Col md={12}><p>No Data</p></Col>
        </Row>
      </Grid>
    );
  }
  else {
    const agg = aggregation.tidy();
    const cntDims = agg.axes.length;
    const activePage = dataTable.page;
    const pager = (agg.data.length > PAGE_SIZE ) ?
                  <Pagination
                      ellipsis
                      boundaryLinks
                      maxButtons={5}
                      bsSize="small"
                      items={Math.floor(agg.data.length / PAGE_SIZE) }
                      activePage={activePage}
                      onSelect={(eventKey) => dispatch(setPage(eventKey)) } /> : null;

    c = (
      <Grid>
        <Row>
          <Col md={10}>
            {pager}
          </Col>
          <Col md={1} mdOffset={1} style={{textAlign: 'right'}}>
            <DropdownButton bsSize="large" title={<Glyphicon glyph="download"/>} bsStyle="link">
              <MenuItem eventKey="1" href={aggregation.url.replace('/aggregate', '/aggregate.csv')}>CSV</MenuItem>
              <MenuItem eventKey="2" href={aggregation.url.replace('/aggregate', '/aggregate.xls')}>Excel</MenuItem>
            </DropdownButton>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Table responsive striped bordered condensed hover>
              <thead>
                <tr>
                  {agg.axes.map((a,i) => {
                     const level = currentCube.dimensionsByName[a.name]
                                              .hierarchies[0]
                                              .getLevel(a.level);
                     var propSelector = '';
                     if (level.properties.length > 0) {
                       propSelector = <PropertySelectorDropdown level={level} />;
                     }
                     return (<th key={i}>{a.caption}{propSelector}</th>);
                   })}
                  {agg.measures.map((m,i) => <th className="measureCell" key={i}>{m.caption}</th>)}
                </tr>
              </thead>
              <tbody>
                {agg.data.slice((activePage - 1) * PAGE_SIZE,
                                (activePage - 1) * PAGE_SIZE + PAGE_SIZE)
                    .map((row, i) => (
                      <tr key={i}>
                        {
                          row.map((cell, j) =>
                            <td key={j} className={j >= cntDims ? 'measureCell' : ''}>
                              {j < cntDims ? cell.caption : (typeof(cell) === 'number' ? cell.toLocaleString() : cell)}
                            </td>)
                        }
                      </tr>
                    ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {pager}
          </Col>
        </Row>
      </Grid>
    );
  }

  return c;
}


export default connect(state => (
  {
    currentCube: state.cubes.currentCube,
    aggregation: state.aggregation.data,
    dataTable: state.dataTable
  }
))(DataTable)

// Local Variables:
// js2-basic-offset: 4
// End:
