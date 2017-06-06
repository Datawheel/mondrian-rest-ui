import { reduce, toPairs, fromPairs, isNull, property, zipObject } from 'lodash';

const VEGA_LITE_TEMPLATE = {
    "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
    config: {
        cell: {
            width: 400,
            height: 400
        },
        facet: {
            cell: {
                width: 400,
                height: 200
            }
        }
    },
    mark: "point",
    data: {},
    encoding: {}
};

export function specToVegaLite(spec) {
    if (!spec || (!spec.x && !spec.y)) return {};

    const encoding = reduce(
        toPairs(spec).filter(v => v[0] !== 'mark' && !isNull(v[1])),
        (memo, [k, v]) => {

            var enc = {
                field: v.name,
                type: v.variableType === 'drillDown' ? 'nominal' : 'quantitative'
            };

            if (v.vegaFunction) {
                enc.aggregate = v.vegaFunction;
            }

            return {
                ...memo,
                ...fromPairs([[k, enc]])
            };
        },
        {}
    );

    return {
        ...VEGA_LITE_TEMPLATE,
        encoding: encoding
    };
}

export function transformForVega(aggregation) {
    const tidyData = aggregation.data.tidy();
    const keys = tidyData.axes.map(property('level'))
          .concat(tidyData.measures.map(property('name'))),
          nDrilldowns = tidyData.axes.length;

    return tidyData.data.map(
        (d) =>
            zipObject(keys,
                      d.slice(0,nDrilldowns).map(property('caption'))
                      .concat(d.slice(nDrilldowns)))
    );
}
