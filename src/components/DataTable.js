import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';


class DataTable extends Component{
    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    render() {
        const { aggregation } = this.props;
        let c;

        if (!aggregation) {
            c = <p>No Data</p>;
        }
        else {
            const agg = aggregation.tidy();
            const cntDims = agg.axes.length;
            c = (
                <Table responsive striped bordered condensed hover>
                    <thead>
                        <tr>
                            {agg.axes.map((a,i) => <th key={i}>{a.caption}</th>)}
                            {agg.measures.map((m,i) => <th key={i}>{m.caption}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {agg.data.map((row, i) => (
                             <tr key={i}>
                                 {row.map((cell, j) => <td key={j}>{j < cntDims ? cell.caption : cell}</td>)}
                             </tr>
                         ))}
                    </tbody>
                </Table>
            );
        }
        return <div>{c}</div>;
    }
}

export default connect(state => (
    {
        aggregation: state.aggregation.data
    }
))(DataTable)
