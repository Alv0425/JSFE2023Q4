import Component from "../../utils/component";

class Pagination<T extends Component> {
  protected collection: T[];

  itemsPerPage: number;

  constructor(collection: T[], itemsPerPage: number) {
    this.collection = collection;
    this.itemsPerPage = itemsPerPage;
  }

  getItemCount() {
    return this.collection.length;
  }

  getPageCount() {
    return Math.ceil(this.collection.length / this.itemsPerPage);
  }

  getItemCountOnPage(pageIndex: number) {
    if (pageIndex >= this.getPageCount() || pageIndex < 0) return -1;
    if (this.getItemCount() % this.itemsPerPage) {
      if (pageIndex === this.getPageCount() - 1) return this.getItemCount() % this.itemsPerPage;
    }
    return this.itemsPerPage;
  }

  removeItem(itemIndex: number) {
    this.collection.splice(itemIndex, 1);
  }

  addItem(item: T) {
    this.collection.push(item);
  }

  updateCollection(collection: T[]) {
    this.collection = collection;
  }

  getItemsOnPage(pageIndex: number) {
    const itemsCount = this.getItemCountOnPage(pageIndex);
    const baseItemsCount = this.getItemCountOnPage(0);
    if (itemsCount <= 0) return [];
    if (!this.collection.length) return [];
    const slice = this.collection.slice(pageIndex * baseItemsCount, pageIndex * baseItemsCount + itemsCount);
    return slice;
  }

  pageIndex(itemIndex: number) {
    if (itemIndex >= this.getItemCount() || itemIndex < 0) return -1;
    return Math.ceil((itemIndex + 1) / this.itemsPerPage) - 1;
  }
}

export default Pagination;
