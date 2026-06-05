export class PaginationDTO {
  page: number;
  size: number;

  constructor(page: number = 0, size: number = 20) {
    this.page = page;
    this.size = size;
  }
}
