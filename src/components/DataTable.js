import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Table, Pagination, DropdownButton, MenuItem, Glyphicon } from 'react-bootstrap';

import { PAGE_SIZE } from '../settings';
import { setPage } from '../redux/reducers/dataTable';

import '../css/DataTable.css';

class DataTable extends Component{
    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    render() {
        const { aggregation } = this.props;
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
            const activePage = this.props.dataTable.page;
            const pager = (agg.data.length > PAGE_SIZE ) ?
                          <Pagination
                              ellipsis
                              boundaryLinks
                              maxButtons={5}
                              bsSize="small"
                              items={Math.floor(agg.data.length / PAGE_SIZE) }
                              activePage={activePage}
                              onSelect={(eventKey) => this.props.dispatch(setPage(eventKey)) } /> : null;

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
                                        {agg.axes.map((a,i) => <th key={i}>{a.caption}</th>)}
                                        {agg.measures.map((m,i) => <th className="measureCell" key={i}>{m.caption}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {agg.data.slice((activePage - 1) * PAGE_SIZE,
                                                    (activePage - 1) * PAGE_SIZE + PAGE_SIZE)
                                        .map((row, i) => {
                                            return (
                                                <tr key={i}>
                                                    {
                                                        row.map((cell, j) =>
                                                            <td key={j} className={j >= cntDims ? 'measureCell' : ''}>
                                                                {j < cntDims ? cell.caption : (typeof(cell) === 'number' ? cell.toLocaleString() : cell)}
                                                            </td>)
                                                    }
                                                </tr>
                                        )})}
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
}

export default connect(state => (
    {
        aggregation: state.aggregation.data,
        dataTable: state.dataTable
    }
))(DataTable)
