import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // Method to search documents based on a search term in specified fields
  search(searchableFields: string[]) {
    const { searchTerm } = this.query;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: "i" },
            }) as FilterQuery<T>
        ),
      });
    }
    return this;
  }

  // Method to filter documents based on query parameters, excluding certain fields
  filter() {
    const queryObj = { ...this.query };
    if (queryObj.level) {
      queryObj["details.level"] = queryObj.level;
      delete queryObj.level;
    }
    if (queryObj.tags) {
      queryObj["tags.name"] = queryObj.tags;
      delete queryObj.tags;
    }
    const excludeFields = [
      "searchTerm",
      "sort",
      "sortOrder",
      "limit",
      "page",
      "fields",
      "minPrice",
      "maxPrice",
    ];
    excludeFields.forEach((el) => delete queryObj[el]);
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }

  // Method to filter documents, based on price range
  filterPrice() {
    const { minPrice, maxPrice } = this.query;
    const priceObj: any = {};
    if (minPrice) {
      priceObj.$gte = minPrice;
    }
    if (maxPrice) {
      priceObj.$lte = maxPrice;
    }
    if (minPrice || maxPrice) {
      this.modelQuery = this.modelQuery.find({ price: priceObj });
    }

    return this;
  }

  // Method to sort documents based on a sort parameter or default to '-createdAt'
  sort() {
    const sort = (this.query.sort as string) || "-createdAt";
    const sortOrder = this.query.sortOrder === "asc" ? "" : "-";
    this.modelQuery = this.modelQuery.sort(`${sortOrder}${sort}`);
    return this;
  }

  // Method to paginate the results based on page and limit parameters
  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // Method to select specific fields to be returned in the results
  fields() {
    const fields =
      (this.query.fields as string)?.split(",").join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  // Method to count the total number of documents matching the query
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(total / limit);
    return { page, limit, total, totalPage };
  }
}

export default QueryBuilder;
