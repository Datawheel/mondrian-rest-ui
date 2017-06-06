import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Table, Pagination, DropdownButton, MenuItem, Glyphicon, Checkbox } from 'react-bootstrap';

import { partialRight, flatMap, pick, forEach } from 'lodash';

import { PAGE_SIZE } from '../settings';
import { setPage } from '../redux/reducers/dataTable';
import { setProperty } from '../redux/reducers/aggregation';

import '../css/DataTable.css';

function DownloadDropdownButton(props) {
    return (
        <DropdownButton id="download-dropdownbutton" bsSize="large" title={<Glyphicon glyph="download"/>} bsStyle="link">
            <MenuItem eventKey="1" href={props.aggregation.url.replace('/aggregate', '/aggregate.csv')}>CSV</MenuItem>
            <MenuItem eventKey="2" href={props.aggregation.url.replace('/aggregate', '/aggregate.xls')}>Excel</MenuItem>
        </DropdownButton>
    );
}

/**
 * Renders a dropdown menu next to a column header
 * that allows selection of level properties
 */
function PropertySelectorDropdown(props) {

    const { level, dispatch, aggregation } = props;

    function onChange(event, propertyName) {
        dispatch(setProperty(level, propertyName, event.target.checked));
    }

    var selectedProps = new Set();
    if (level.hierarchy.dimension.name in aggregation.properties) {
        selectedProps = aggregation.properties[level.hierarchy.dimension.name];
    }

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


class DataTable extends Component{

    render() {
        const { aggregation, currentCube, dataTable } = this.props;

        if (!aggregation.data) {
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

        const agg = aggregation.data.tidy();
        const cntDims = agg.axes.length; // how many dimensions (drilldowns)
        const activePage = dataTable.page;
        const pager = (agg.data.length > PAGE_SIZE ) ?
                      <Pagination
                          ellipsis
                          boundaryLinks
                          maxButtons={5}
                          bsSize="small"
                          items={Math.floor(agg.data.length / PAGE_SIZE) }
                          activePage={activePage}
                          onSelect={(eventKey) => this.props.dispatch(setPage(eventKey)) } /> : null;

        return (
            <Grid>
                <Row>
                    <Col md={10}>
                        {pager}
                    </Col>
                    <Col md={1} mdOffset={1} style={{textAlign: 'right'}}>
                        <DownloadDropdownButton aggregation={aggregation.data} />
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Table responsive striped bordered condensed hover>
                            <thead>
                                <tr>
                                    {flatMap(agg.axes, (a,i) => {
                                         const level = currentCube.dimensionsByName[a.name]
                                                                  .hierarchies[0]
                                                                  .getLevel(a.level);
                                         var h = [];

                                         var propSelector = null;
                                         if (level.properties.length > 0) {
                                             propSelector = (
                                                 <PropertySelectorDropdown
                                                     level={level}
                                                     aggregation={aggregation}
                                                     dispatch={this.props.dispatch} />
                                             );
                                         }

                                         h.push(
                                             <th key={i}>
                                                 {a.caption} / {level.name} {propSelector}
                                             </th>
                                         );

                                         (aggregation.properties[a.name] || []).forEach((p, j) =>
                                             h.push(<th key={`${i}-${j}`}>{a.name} / {p}</th>)
                                         )

                                         return h;
                                     })}
                                    {agg.measures.map((m,i) => <th className="measureCell" key={i}>{m.caption}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {agg.data.slice((activePage - 1) * PAGE_SIZE,
                                                (activePage - 1) * PAGE_SIZE + PAGE_SIZE)
                                    .map((row, i) => (
                                        <tr key={i}>
                                            {   // dimensions
                                                flatMap(row.slice(0, cntDims),
                                                        (cell, idx) => {
                                                            const h = [<td key={idx}>
                                                                {cell.caption}
                                                            </td>];
                                                            forEach(pick(cell.properties,
                                                                         Array.from(aggregation.properties[agg.axes[idx].name] || new Set())),
                                                                    (v, k, j) =>
                                                                        h.push(<td key={`${idx}-${j}`}>{v}</td>)
                                                            )
                                                            return h;
                                                        })
                                            }
                                            {   // measures
                                                row.slice(cntDims).map((cell, idx) =>
                                                    <td key={cntDims + idx} className="measureCell">
                                                        {(typeof(cell) === 'number' ? cell.toLocaleString() : cell)}
                                                    </td>
                                                )
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
}


export default connect(state => (
    {
        aggregation: state.aggregation.present,
        dataTable: state.dataTable,
        currentCube: state.cubes.currentCube
    }
))(DataTable)

// Local Variables:
// js2-basic-offset: 2
// End:
