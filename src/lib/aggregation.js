import zip from "lodash/zip";
import reverse from "lodash/reverse";
import range from "lodash/range";
import keyBy from "lodash/keyBy";
import property from "lodash/property";

// from http://phrogz.net/lazy-cartesian-product
// XXX convert it into an ES6 generator funcion
function lazyProduct(sets, f, context) {
  if (!context) context = this;
  var p = [],
    max = sets.length - 1,
    lens = [];
  for (var i = sets.length; i--; ) lens[i] = sets[i].length;
  function dive(d) {
    var a = sets[d],
      len = lens[d],
      i;
    if (d === max) {
      for (i = 0; i < len; ++i) {
        p[d] = a[i];
        f.apply(context, p);
      }
    } else {
      for (i = 0; i < len; ++i) {
        p[d] = a[i];
        dive(d + 1);
      }
    }
    p.pop();
  }
  dive(0);
}

// Generate 'tidy data' (http://vita.had.co.nz/papers/tidy-data.pdf)
// from a result set
function tidyResponseMondrianPre1(resp) {
  const measures = resp.axes[0].members,
    dimensions = resp.axis_dimensions.slice(1),
    prod = resp.axes.slice(1).map(e => {
      return zip(e.members, range(e.members.length));
    }),
    values = resp.values,
    hasParents = "axis_parents" in resp;

  let data = [];

  lazyProduct(prod, function() {
    const cell = Array.prototype.slice.call(arguments), // convert arguments to array
      cidxs = reverse(cell.map(c => c[1])),
      cm = cell.map((c, i) => {
        const c0 = c[0];
        return hasParents
          ? {
              ...c0,
              parent: resp.axis_parents[i + 1][c0["parent_name"]]
            }
          : c0;
      }),
      mvalues = measures.map((m, mi) => {
        const r = cidxs.concat(mi).reduce(
          (memo, cur) => memo[cur], // navigate to values[coords]
          values
        );
        return r;
      });
    data.push(cm.concat(mvalues));
  });

  return {
    axes: dimensions,
    measures: measures,
    data: data
  };
}

function tidyResponse(resp) {
  const indexed_members = resp["axes"].map(ax =>
    keyBy(ax["members"], property("key"))
  );

  return {
    axes: resp["axes"].slice(1),
    data: resp["cell_keys"].map((ks, i) => {
      return [
        ...ks.map((k, j) => indexed_members[j + 1][k]),
        ...resp["values"][i]
      ];
    }),
    measures: resp["axes"][0]["members"]
  };
}

export default class Aggregation {
  constructor(agg) {
    // `agg` comes from mondrian-client.getAggregation
    Object.assign(this, agg.data);
    Object.assign(this, agg);
    this.hasParents = this.options.parents;
  }

  /**
   * returns a `tidy` representation of the Aggregation
   */
  tidy() {
    if (this.hasOwnProperty("cell_keys")) {
      // mondrian-rest >= 1.0.0
      return tidyResponse(this);
    } else {
      // mondrian-rest < 1.0.0
      return tidyResponseMondrianPre1(this);
    }
  }
}
