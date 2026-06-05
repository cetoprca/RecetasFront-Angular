import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FilterDTO } from "../../model/filter/filter-dto";

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterSubject = new BehaviorSubject<FilterDTO>(new FilterDTO());
  currentFilter$ = this.filterSubject.asObservable();

  private shouldRequestFlag = false;

  get currentFilter(): FilterDTO {
    return this.filterSubject.getValue();
  }

  updateFilter(filter: Partial<FilterDTO>): void {
    const current = this.currentFilter;
    const updated = new FilterDTO(
      filter.tags !== undefined ? filter.tags : current.tags,
      filter.ingredients !== undefined ? filter.ingredients : current.ingredients,
      filter.author !== undefined ? filter.author : current.author,
      filter.cuisine !== undefined ? filter.cuisine : current.cuisine,
      filter.rating !== undefined ? filter.rating : current.rating,
      filter.exactRating !== undefined ? filter.exactRating : current.exactRating,
      filter.creationDate !== undefined ? filter.creationDate : current.creationDate,
      filter.prepTime !== undefined ? filter.prepTime : current.prepTime,
      filter.exactPrepTime !== undefined ? filter.exactPrepTime : current.exactPrepTime,
      filter.cookTime !== undefined ? filter.cookTime : current.cookTime,
      filter.exactCookTime !== undefined ? filter.exactCookTime : current.exactCookTime,
      filter.totalTime !== undefined ? filter.totalTime : current.totalTime,
      filter.exactTotalTime !== undefined ? filter.exactTotalTime : current.exactTotalTime
    );
    this.filterSubject.next(updated);
  }

  applyFilter(filter: FilterDTO): void {
    this.shouldRequestFlag = true;
    this.filterSubject.next(filter);
  }

  setAuthor(authorId: string): void {
    this.updateFilter({ author: authorId });
  }

  resetFilter(): void {
    this.shouldRequestFlag = true;
    const nullFilter = new FilterDTO(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );
    this.filterSubject.next(nullFilter);
  }

  clearFilter(): void {
    this.filterSubject.next(new FilterDTO());
  }

  consumeShouldRequest(): boolean {
    const value = this.shouldRequestFlag;
    this.shouldRequestFlag = false;
    return value;
  }
}
