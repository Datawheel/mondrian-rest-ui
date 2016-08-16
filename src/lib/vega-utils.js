import { map, toPairs, isNull, memoize, flowRight, property, zipObject } from 'lodash';
import vl from 'vega-lite';

export const normalizeFieldName = memoize((fn) => fn.replace(' ', '_'));

export function toVegaShorthand(spec) {
    if (!spec || (!spec.x && !spec.y)) return '';

    console.log('spec', spec);

    const vegaFuncName = spec.vegaFunction ? spec.vegaFunction + '_' : '';

    const sh = map(toPairs(spec).filter(v => v[0] !== 'mark' && !isNull(v[1])),
                   (v) => `${v[0]}=${v[1].vegaFunction ? v[1].vegaFunction + '_' : ''}${normalizeFieldName(v[1].name)},${v[1].variableType === 'drillDown' ? 'N' : 'Q'}`
                  ).join('|');

    return `mark=${spec.mark || 'point'}|${sh}`;
}

export function shortHandToVegaLite(sh) {
    if (sh === '') return '';
    return vl.shorthand.parse(sh);
}

export function transformForVega(tidyData) {
    const keys = tidyData.axes.map(flowRight(normalizeFieldName, property('level')))
              .concat(tidyData.measures.map(flowRight(normalizeFieldName, property('name')))),
          nDrilldowns = tidyData.axes.length;
    return tidyData.data.map(
        (d) =>
            zipObject(keys,
                      d.slice(0,nDrilldowns).map(property('caption'))
                      .concat(d.slice(nDrilldowns)))
    );
}
