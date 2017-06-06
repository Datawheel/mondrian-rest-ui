import React, { PureComponent } from 'react';
import { vegaLite as vlTooltip } from 'vega-tooltip';
import vegaEmbed from 'vega-embed';

import { specToVegaLite, transformForVega } from '../../lib/vega-utils';

export default class Chart extends PureComponent {

    updateChart() {

        if (this.props.aggregation.data === null) {
            return;
        }

        let vls = specToVegaLite(this.props.spec);
        vls = {
            ...vls,
            mark: this.props.spec.mark,
            data: {
                values: transformForVega(this.props.aggregation)
            }
        };

        console.log(vls.data.values);

        vegaEmbed(
            this._vegaContainer,
            vls,
            {
                mode: 'vega-lite'
            },
            (error, result) => {
                vlTooltip(result.view, vls, {});
            }
        );
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.spec !== nextProps.spec;
    }

    componentDidUpdate() {
        this.updateChart();
    }

    render() {
        return (
            <div>
                <div ref={(c) => this._vegaContainer = c}></div>
                <div id="vis-tooltip" className="vg-tooltip"></div>
            </div>
        );
    }
}


