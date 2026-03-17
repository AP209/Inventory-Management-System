import { Component, inject, HostListener, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { combineLatest, Observable, timer } from 'rxjs';
import { debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

interface SearchResults {
  products: Product[];
  categories: Category[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <nav class="navbar navbar-expand bg-white px-4 py-3" style="border-bottom: 1px solid var(--border-color); z-index: 1020;">
      <!-- Mobile Toggler -->
      <button class="btn btn-light d-md-none me-3" type="button">
        <i class="bi bi-list fs-4"></i>
      </button>

      <!-- Global Search -->
      <div class="d-none d-md-flex align-items-center position-relative">
        <div class="position-relative">
          <i class="bi bi-search position-absolute text-muted" style="top: 50%; left: 16px; transform: translateY(-50%);"></i>
          <input type="text" [formControl]="searchControl" class="form-control border-0 bg-light rounded-pill ps-5 pe-4" placeholder="Search products, categories..." style="width: 350px; font-size: 0.95rem; padding-top: 10px; padding-bottom: 10px; transition: all 0.2s;" (focus)="isSearchFocused = true" (click)="$event.stopPropagation()">
        </div>

        <!-- Search Results Dropdown -->
        <div *ngIf="isSearchFocused && searchControl.value && (searchResults$ | async) as results" class="position-absolute shadow-lg bg-white rounded-4 overflow-hidden" style="top: calc(100% + 10px); left: 0; width: 450px; max-height: 400px; overflow-y: auto; border: 1px solid var(--border-color); z-index: 1050;">
          
          <!-- Loading State (Optional, handled by async inherently but good for UX if needed) -->
          
          <div *ngIf="results.categories.length === 0 && results.products.length === 0" class="text-center p-4 text-muted">
            <i class="bi bi-search fs-3 mb-2 d-block"></i>
            No results found for "{{ searchControl.value }}"
          </div>

          <!-- Categories Section -->
          <div *ngIf="results.categories.length > 0">
            <div class="bg-light px-3 py-2 border-bottom fw-bold text-uppercase text-muted" style="font-size: 0.7rem; letter-spacing: 0.5px;">Categories</div>
            <div class="list-group list-group-flush">
              <button *ngFor="let cat of results.categories" (click)="navigateTo('categories', cat.id)" class="list-group-item list-group-item-action py-3 px-3 border-0 d-flex align-items-center gap-3 custom-hover">
                <div class="rounded bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
                  <i class="bi bi-tags-fill"></i>
                </div>
                <div>
                  <div class="fw-semibold text-dark">{{ cat.name }}</div>
                  <div class="text-muted small text-truncate" style="max-width: 300px;">{{ cat.description || 'No description' }}</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Products Section -->
          <div *ngIf="results.products.length > 0">
            <div class="bg-light px-3 py-2 border-bottom fw-bold text-uppercase text-muted" style="font-size: 0.7rem; letter-spacing: 0.5px;">Products</div>
            <div class="list-group list-group-flush">
              <button *ngFor="let prod of results.products" (click)="navigateTo('products', prod.id)" class="list-group-item list-group-item-action py-3 px-3 border-0 d-flex align-items-center gap-3 custom-hover">
                <div class="rounded bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
                  <i class="bi bi-box-seam-fill"></i>
                </div>
                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="fw-semibold text-dark">{{ prod.name }}</div>
                    <span class="badge bg-light text-dark border">{{ prod.price | currency:'INR' }}</span>
                  </div>
                  <div class="d-flex justify-content-between align-items-center mt-1">
                    <div class="text-muted small">{{ prod.category?.name }}</div>
                    <div class="small fw-medium" [ngClass]="prod.quantity < 10 ? 'text-danger' : 'text-success'">Stock: {{ prod.quantity }}</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- Right Navigation Items -->
      <div class="ms-auto d-flex align-items-center gap-3">
        <!-- Notification Icon -->
        <button class="btn btn-light rounded-circle position-relative d-flex align-items-center justify-content-center border-0" style="width: 40px; height: 40px; background-color: var(--secondary-color);" routerLink="/low-stock" title="Low Stock Alerts">
          <i class="bi bi-bell fs-5 text-secondary"></i>
          <ng-container *ngIf="(lowStockCount$ | async) as count">
            <span *ngIf="count > 0" class="position-absolute translate-middle badge rounded-pill bg-danger" style="top: 8px; right: -2px; font-size: 0.6rem;">
              {{ count > 99 ? '99+' : count }}
            </span>
          </ng-container>
        </button>

        <!-- Profile Dropdown -->
        <div class="dropdown cursor-pointer position-relative" [class.show]="dropdownOpen">
          <button class="btn btn-light rounded-pill border-0 d-flex align-items-center gap-3 px-3 py-2 custom-hover" type="button" style="background-color: transparent;" (click)="toggleDropdown($event)" [attr.aria-expanded]="dropdownOpen">
            <div class="rounded-circle bg-primary text-white d-flex flex-shrink-0 align-items-center justify-content-center shadow-sm" style="width: 36px; height: 36px; font-weight: 600; font-family: 'Outfit', 'Inter', sans-serif;">
              A
            </div>
            <div class="text-start d-none d-sm-flex flex-column justify-content-center">
              <span class="fw-bold text-dark" style="font-family: 'Outfit', 'Inter', sans-serif; font-size: 0.95rem; line-height: 1.1; letter-spacing: 0.2px;">Hey Admin</span>
              <span class="text-muted fw-medium mt-1" style="font-size: 0.75rem; letter-spacing: 0.3px;">Administrator</span>
            </div>
            <i class="bi bi-chevron-down text-muted ms-1 fs-6"></i>
          </button>
          
          <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2 position-absolute" [class.show]="dropdownOpen" style="border-radius: var(--border-radius); min-width: 200px; right: 0;">
            <li><a class="dropdown-item py-2 fw-medium" href="#"><i class="bi bi-person me-2 text-primary"></i> Profile</a></li>
            <li><a class="dropdown-item py-2 fw-medium" href="#"><i class="bi bi-gear me-2 text-primary"></i> Settings</a></li>
            <li><hr class="dropdown-divider my-2"></li>
            <li class="px-3 pb-2 pt-1">
              <button class="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 shadow-sm" (click)="logout()">
                <i class="bi bi-box-arrow-right"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .custom-hover:hover {
      background-color: var(--secondary-color) !important;
    }
  `]
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  router = inject(Router);
  private eRef = inject(ElementRef);

  dropdownOpen = false;
  isSearchFocused = false;
  searchControl = new FormControl('');

  searchResults$!: Observable<SearchResults>;
  lowStockCount$!: Observable<number>;

  ngOnInit() {
    // Combine both data streams and filter them based on the search input
    this.searchResults$ = combineLatest([
      this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300)),
      this.productService.getProducts(),
      this.categoryService.getCategories()
    ]).pipe(
      map(([searchTerm, products, categories]) => {
        const term = (searchTerm || '').toLowerCase().trim();

        if (!term) {
          return { products: [], categories: [] };
        }

        return {
          categories: categories.filter(c =>
            c.name.toLowerCase().includes(term) ||
            (c.description && c.description.toLowerCase().includes(term))
          ).slice(0, 3), // Limit to top 3 categories

          products: products.filter(p =>
            p.name.toLowerCase().includes(term) ||
            (p.category && p.category.name.toLowerCase().includes(term))
          ).slice(0, 5) // Limit to top 5 products
        };
      })
    );

    // Fetch low stock count for the notification bell (polls every 15 seconds)
    this.lowStockCount$ = timer(0, 15000).pipe(
      switchMap(() => this.productService.getLowStockProducts()),
      map(products => products.length)
    );
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
    this.isSearchFocused = false; // Close search if opening profile
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
      this.isSearchFocused = false;
    }
  }

  navigateTo(type: 'products' | 'categories', id: number) {
    this.isSearchFocused = false;
    this.searchControl.setValue('');
    this.router.navigate([`/${type}`], { queryParams: { searchId: id } });
  }

  logout() {
    this.dropdownOpen = false;
    this.authService.logout();
  }
}
