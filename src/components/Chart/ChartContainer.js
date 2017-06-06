import React from 'react';
import { connect } from 'react-redux';

import { Grid, Row, Col } from 'react-bootstrap';

import Chart from './Chart.js';
import ChartSpecForm from './ChartSpecForm.js';

import '../../css/ChartContainer.css';

function _ChartContainer(props, context) {
    return (
        <Grid>
            <br />
            <Row>
                <Col md={3}>
                    <ChartSpecForm />
                </Col>
                <Col md={9}>
                    <Chart aggregation={props.currentAggregation}
                           spec={props.chartSpec} />
                </Col>
            </Row>
        </Grid>
    );
}

export default connect((state) => (
    {
        currentAggregation: state.aggregation.present,
        chartSpec: state.chartSpec
    }
))(_ChartContainer);
