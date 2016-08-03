import _ from 'lodash';
import formurlencoded from 'form-urlencoded';

export function levelFullName(dimension, levelDepth) {
    const h = dimension.hierarchies[0]; // XXX support optional hierarchies?
    let lD = levelDepth;
    if (_.isUndefined(levelDepth)) {
        lD = h.has_all ? 1 : 0;
    }
    const l = h.levels[lD];
    return l.full_name;
}

// convert "[Jurisdicciones].[Secretaria de Caca]" to "Jurisdicciones/Secretaria de Caca"
const FN_RE = /\[([^\]]+)\]/g;
export function fullNameToURL(fn) {
    let m, parts = [];
    while ((m = FN_RE.exec(fn)) !== null) {
        if (m.index === FN_RE.lastIndex) {
            FN_RE.lastIndex++;
        }
        parts.push(encodeURIComponent(m[1]));
    }
    return parts.join('/');
}

// convert "Jurisdicciones/Secretaria de Caca" to "[Jurisdicciones].[Secretaria de Caca]"
export function urlToFullName(url) {
    const parts = url.split('/');
    return parts.map(p => `[${decodeURIComponent(p)}]`).join('.');
}

// shape of params:
// {
//     drilldown: array of: dimension or [dimension, <int>levelDepth]
//     measures: array of measure,
//     cut: array of member full_name,
//     nonempty: 'true' or 'false'
//     distinct: 'true' or 'false'
// }
export function aggregationQS(params) {
    const o = {
        drilldown: params.drilldown.map(l => l.full_name),
        measures: params.measures.map(m => m.name),
        cut: params.cut,
        nonempty: params.nonempty ? 'true' : 'false',
        distinct: params.distinct ? 'true' : 'false',
        parents: params.parents ? 'true' : 'false'
    };
    return formurlencoded(o);
}
