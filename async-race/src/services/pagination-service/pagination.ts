import Component from "../../utils/component";

class Pagination<T extends Component> {
  collection: T[];

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

  getItemsOnPage(pageIndex: number) {
    const itemsCount = this.getItemCountOnPage(pageIndex);
    if (itemsCount <= 0) return [];
    if (!this.collection.length) return [];
    return this.collection.slice(pageIndex, pageIndex + itemsCount + 1);
  }

  pageIndex(itemIndex: number) {
    if (itemIndex >= this.getItemCount() || itemIndex < 0) return -1;
    return Math.ceil((itemIndex + 1) / this.itemsPerPage) - 1;
  }
}

export default Pagination;
