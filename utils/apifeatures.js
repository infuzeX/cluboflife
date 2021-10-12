class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {

    let queryObj = { ...this.queryString };
    ['sort', 'page', 'limit', 'fields'].forEach(
      (prop) => delete queryObj[prop]
    );
    
    let queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt|regex|options|or|and)\b/g,
      (match) => `$${match}`
    );
    queryObj = JSON.parse(queryStr);

    ['$or', '$and'].forEach(oper => {
      const query = [];
      if (queryObj[oper]) {
        for (let prop in queryObj[oper]) {
          query.push({ [prop]: queryObj[oper][prop] });
        }
        queryObj[oper] = query;
      }
    })

    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('triggeredDate');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  lean() {
    this.query = this.query.lean();
    return this;
  }
}

module.exports = APIFeatures;
