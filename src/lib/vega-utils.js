import { map, toPairs, isNull, memoize } from 'lodash';
import vl from 'vega-lite';
import vg from 'vega';

export const normalizeFieldName = memoize((fn) => fn.replace(' ', '_'));

export function toVegaShorthand(spec) {
    if (!spec || (!spec.x && !spec.y)) return '';

    const sh = map(toPairs(spec).filter(v => v[0] !== 'mark' && !isNull(v[1])),
                   (v) => `${v[0]}=${normalizeFieldName(v[1].name)},${v[1].variableType === 'drillDown' ? 'N' : 'Q'}`
                  ).join('|');

    return `mark=${spec.mark || 'point'}|${sh}`;
}

export function shortHandToVegaLite(sh) {
    if (sh === '') return '';
    return vl.shorthand.parse(sh);
}
