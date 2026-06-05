import { FilterDTO } from "../filter/filter-dto";
import { PaginationDTO } from "../pagination/pagination-dto";

export class RecipeFilterRequest {
  filter: FilterDTO;
  pagination: PaginationDTO;

  constructor(filter: FilterDTO, pagination: PaginationDTO = new PaginationDTO()) {
    this.filter = filter;
    this.pagination = pagination;
  }
}
