import React, { PureComponent } from 'react';
import { vegaLite as vlTooltip } from 'vega-tooltip';
import vegaEmbed from 'vega-embed';

import { specToVegaLite } from '../../lib/vega-utils';

export default class Chart extends PureComponent {

    updateChart() {
        if (this.props.aggregation.data === null) {
            return;
        }

        const vls = specToVegaLite(this.props.spec, this.props.aggregation);

        vegaEmbed(
            this._vegaContainer,
            vls,
            {
                mode: 'vega-lite'
            },
            (error, result) => {
                if (result)
                    vlTooltip(result.view, vls, {});
            }
        );
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


