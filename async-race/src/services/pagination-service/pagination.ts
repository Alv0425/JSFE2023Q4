class Pagination<T> {
  protected collection: T[];

  itemsPerPage: number;

  constructor(collection: T[], itemsPerPage: number) {
    this.collection = collection;
    this.itemsPerPage = itemsPerPage;
  }

  getItemCount(): number {
    return this.collection.length;
  }

  getPageCount(): number {
    if (this.collection.length === 0) return 1;
    return Math.ceil(this.collection.length / this.itemsPerPage);
  }

  getItemCountOnPage(pageIndex: number): number {
    if (pageIndex >= this.getPageCount() || pageIndex < 0) return -1;
    if (this.getItemCount() % this.itemsPerPage) {
      if (pageIndex === this.getPageCount() - 1) return this.getItemCount() % this.itemsPerPage;
    }
    return this.itemsPerPage;
  }

  removeItem(itemIndex: number): void {
    this.collection.splice(itemIndex, 1);
  }

  updateCollection(collection: T[]): void {
    this.collection = collection;
  }

  getItemsOnPage(pageIndex: number): T[] {
    const itemsCount = this.getItemCountOnPage(pageIndex);
    const baseItemsCount = this.getItemCountOnPage(0);
    if (itemsCount <= 0) return [];
    if (!this.collection.length) return [];
    const slice = this.collection.slice(pageIndex * baseItemsCount, pageIndex * baseItemsCount + itemsCount);
    return slice;
  }
}

export default Pagination;
