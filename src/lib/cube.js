import _ from 'lodash';

export default class Cube {

    static decorate(obj) {
        if (obj instanceof Cube) {
            return obj;
        }
        else if (obj instanceof Object) {
            return new Cube(obj);
        }
        else {
            throw new Error(`Cannot decorate object of type ${typeof(obj)}`);
        }
    }

    constructor(agg) {
        // `agg` comes from mondrian-client.getAggregation
        Object.assign(this, agg);

        this.caption = this.annotations.caption || this.name;
        this.measures = _.map(this.measures, (m, i) => ({...m, index: i }));

        this._dimensionsByName = {};
    }

    standardDimensions() {
        return this.dimensions.filter(d => d.type !== 'time');
    }

    timeDimension() {
        return this.dimensions.find(d => d.type === 'time');
    }

    defaultMeasure() {
        return this.measures.find(m => m.annotations.default) || this.measures[0];
    }

    findDimension(dimensionName) {
        if (this._dimensionsByName[dimensionName])
            return this._dimensionsByName[dimensionName];

        const dim = _.find(this.standardDimensions(), d => d.name === dimensionName);
        if (_.isUndefined(dim)) {
            throw new Error(`Dimension ${dimensionName} does not exist in cube ${this.name}`);
        }

        this._dimensionsByName[dimensionName] = dim;
        return this._dimensionsByName[dimensionName];
    }

    findMeasure(measureFullName) {
        const measure = _.find(this.measures, m => m.full_name === measureFullName);
        if (_.isUndefined(measure)) {
            throw new Error(`Measure ${measureFullName} does not exist in cube ${this.name}`);
        }
        return measure;
    }
}
