import _ from 'lodash';

// from http://phrogz.net/lazy-cartesian-product
// XXX convert it into an ES6 generator funcion
function lazyProduct(sets,f,context){
    if (!context) context=this;
    var p=[],max=sets.length-1,lens=[];
    for (var i=sets.length;i--;) lens[i]=sets[i].length;
    function dive(d){
        var a=sets[d], len=lens[d], i;
        if (d===max) {
            for (i=0;i<len;++i) { p[d]=a[i]; f.apply(context,p); }
        }
        else {
            for (i=0;i<len;++i) { p[d]=a[i]; dive(d+1); }
        }
        p.pop();
    }
    dive(0);
}

// Generate 'tidy data' (http://vita.had.co.nz/papers/tidy-data.pdf)
// from a result set
function tidyResponse(resp) {

    const measures = resp.axes[0].members,
          dimensions = resp.axis_dimensions.slice(1),
          prod = resp.axes.slice(1)
              .map(e => {
                  return _.zip(e.members, _.range(e.members.length));
              }),
          values = resp.values,
          hasParents = ('axis_parents' in resp);

    let data = [];

    lazyProduct(prod, function() {
        const cell = Array.prototype.slice.call(arguments), // convert arguments to array
              cidxs = _.reverse(cell.map((c) => c[1])),
              cm = cell.map(
                  (c, i) => {
                      const c0 = c[0];
                      return hasParents
                           ? { ...c0,
                               parent: resp.axis_parents[i+1][c0['parent_name']]
                           }
                           : c0;
                  }
              ),
              mvalues = measures.map((m, mi) => {
                  const r = cidxs.concat(mi)
                            .reduce((memo, cur) => (memo[cur]), // navigate to values[coords]
                                    values);
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


export default class Aggregation {

    static decorate(obj) {
        if (obj instanceof Aggregation) {
            return obj;
        }
        else if (obj instanceof Object) {
            return new Aggregation(obj);
        }
        else {
            throw new Error(`Cannot decorate object of type ${typeof(obj)}`);
        }
    }

    constructor(agg) {
        // `agg` comes from mondrian-client.getAggregation
        Object.assign(this, agg);
        this.hasParents = (this.params.parents);
    }

    /**
     * returns a `tidy` representation of the Aggregation
     */
    tidy() {
        return tidyResponse(this);
    }

    // filter by `filterAxis` and sort on measure
    topBy(filter, filterAxis, measureIndex) {
        const midx = _.isUndefined(measureIndex) ? 2 : measureIndex;
        return _.sortBy(this.tidy().filter((m) => m[filterAxis].key === filter.key),
                        (m) => -m[midx]);
    }

}
