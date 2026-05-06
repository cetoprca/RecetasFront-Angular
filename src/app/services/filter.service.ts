import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FilterDTO } from "../../model/filter/filter-dto";

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterSubject = new BehaviorSubject<FilterDTO>(new FilterDTO());
  currentFilter$ = this.filterSubject.asObservable();

  get currentFilter(): FilterDTO {
    return this.filterSubject.getValue();
  }

  updateFilter(filter: Partial<FilterDTO>): void {
    const current = this.currentFilter;
    const updated = new FilterDTO(
      filter.tags ?? current.tags,
      filter.ingredients ?? current.ingredients,
      filter.author ?? current.author,
      filter.cuisine ?? current.cuisine,
      filter.rating ?? current.rating,
      filter.exactRating ?? current.exactRating,
      filter.creationDate ?? current.creationDate,
      filter.prepTime ?? current.prepTime,
      filter.exactPrepTime ?? current.exactPrepTime,
      filter.cookTime ?? current.cookTime,
      filter.exactCookTime ?? current.exactCookTime,
      filter.totalTime ?? current.totalTime,
      filter.exactTotalTime ?? current.exactTotalTime
    );
    this.filterSubject.next(updated);
  }

  setAuthor(authorId: number): void {
    this.updateFilter({ author: authorId });
  }

  resetFilter(): void {
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
}
