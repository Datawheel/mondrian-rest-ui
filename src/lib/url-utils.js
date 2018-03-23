import map from "lodash/map";
import property from "lodash/property";
import isString from "lodash/isString";
import isArray from "lodash/isArray";

export function aggregationLink(hash) {
  const { origin, pathname } = window.location;
  const url = `${origin}${pathname}#${hash}`;

  return url;
}

export function getAggregationParams() {
  const hash = atob(window.location.hash.slice(1));
  let params = null;
  try {
    params = JSON.parse(hash);
  } catch (e) {
    return null;
  }

  // TODO shitty validation
  if (!isString(params.cube) || !isArray(params.drillDowns)) {
    return null;
  }

  return params;
}

export function serializeAggregationParams(cube, aggregation) {
  const s = {
    drillDowns: [],
    cuts: []
  };

  if (cube !== null) {
    s.cube = cube.name;
  }

  // encoded as an array of [dimName, hierarchyName, levelName]
  if (aggregation.drillDowns.length > 0) {
    s.drillDowns = map(aggregation.drillDowns, dd => [
      dd.hierarchy.dimension.name,
      dd.hierarchy.name,
      dd.name
    ]);
  }

  // encoded as an array of [[..memberKeys..], [dimName, hierarchyName, levelName]]
  if (Object.keys(aggregation.cuts).length > 0) {
    s.cuts = map(aggregation.cuts, c => {
      return [
        c.cutMembers.map(property("key")),
        [c.level.hierarchy.dimension.name, c.level.hierarchy.name, c.level.name]
      ];
    });
  }

  if (Object.keys(aggregation.measures).length > 0) {
    s.measures = map(aggregation.measures, property("name"));
  }

  return btoa(JSON.stringify(s));
}
