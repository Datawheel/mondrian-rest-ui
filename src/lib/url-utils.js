import { map, property } from 'lodash';

export function serializeAggregationParams(cube, aggregation) {

    const s = {};

    if (cube !== null) {
        s.cube = cube.name;
    }

    if (aggregation.drillDowns.length > 0) {
        s.drillDowns = map(aggregation.drillDowns, (dd) => [dd.hierarchy.dimension.name, dd.hierarchy.name, dd.name]);
    }

    if (Object.keys(aggregation.cuts).length > 0) {
        s.cuts = map(aggregation.cuts, (v, k) => cutExpression(v));
    }

    if (Object.keys(aggregation.measures).length > 0) {
        s.measures = map(aggregation.measures, property('name'));
    }

    return btoa(JSON.stringify(s));
};

function cutExpression(cut) {
    return (cut.cutMembers.length === 1) ? cut.cutMembers[0].fullName : `{${cut.cutMembers.map(property('fullName')).join(',')}}`;
}
