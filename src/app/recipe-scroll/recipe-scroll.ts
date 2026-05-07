import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { RecipeCardDTO } from '../../model/recipe/recipe-card-dto';
import { RecipeCard } from '../recipe-card/recipe-card';

@Component({
  selector: 'app-recipe-scroll',
  standalone: false,
  templateUrl: './recipe-scroll.html',
  styleUrl: './recipe-scroll.css',
})
export class RecipeScroll implements AfterViewInit, OnDestroy {
  @Input() recipes: RecipeCardDTO[] = [];
  @Input() hasMore: boolean = false;
  @Output() loadMore = new EventEmitter<void>();

  @Input()
  set loading(value: boolean) {
    if (this._loading && !value) {
      queueMicrotask(() => this.reobserveSentinel());
    }
    this._loading = value;
  }
  get loading(): boolean { return this._loading; }
  private _loading: boolean = false;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('sentinel') sentinel!: ElementRef;
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && this.hasMore && !this.loading) {
        this.loadMore.emit();
      }
    }, {
      root: this.scrollContainer.nativeElement,
      rootMargin: '200px'
    });

    if (this.sentinel) {
      this.observer.observe(this.sentinel.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private reobserveSentinel(): void {
    if (this.sentinel && this.observer) {
      this.observer.unobserve(this.sentinel.nativeElement);
      this.observer.observe(this.sentinel.nativeElement);
    }
  }
}
