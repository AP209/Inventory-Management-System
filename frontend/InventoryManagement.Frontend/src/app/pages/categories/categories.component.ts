import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid py-4 fade-in">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 class="fw-bold mb-1" style="color: var(--text-primary);">
            Categories 
            <span *ngIf="searchActive" class="badge bg-warning bg-opacity-25 text-warning border border-warning fs-6 ms-2 fw-medium rounded-pill align-middle" style="font-size: 0.85rem !important;">Search Result</span>
          </h2>
          <p class="text-muted mb-0">Manage product groupings and classifications.</p>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button *ngIf="searchActive" class="btn btn-light text-secondary rounded-pill shadow-sm px-4 d-flex align-items-center gap-2 border" (click)="clearSearch()">
            <i class="bi bi-x-circle"></i> Clear Filters
          </button>
          <button class="btn btn-primary rounded-pill shadow-sm px-4 d-flex align-items-center gap-2" (click)="openAddMode()">
            <i class="bi bi-plus-lg"></i> Add Category
          </button>
        </div>
      </div>

      <!-- Add/Edit Form -->
      <div class="slide-down mb-4" *ngIf="showForm">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div class="card-header bg-white border-bottom-0 pt-4 pb-2 px-4 d-flex align-items-center gap-2">
            <div class="icon-circle bg-primary text-white d-flex justify-content-center align-items-center rounded-circle" style="width: 32px; height: 32px;">
              <i class="bi" [ngClass]="isEditMode ? 'bi-pencil' : 'bi-plus-lg'"></i>
            </div>
            <h5 class="card-title fw-bold mb-0 text-dark">{{ isEditMode ? 'Edit Category' : 'Create New Category' }}</h5>
          </div>
          <div class="card-body px-4 pb-4 pt-2">
            <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
              <div class="row g-3 align-items-end">
                <div class="col-md-4">
                  <label class="form-label text-muted fw-medium text-uppercase" style="font-size: 0.75rem; letter-spacing: 0.5px;">Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control form-control-lg bg-light" formControlName="name" placeholder="e.g. Electronics">
                </div>
                <div class="col-md-5">
                  <label class="form-label text-muted fw-medium text-uppercase" style="font-size: 0.75rem; letter-spacing: 0.5px;">Description <span class="text-muted text-lowercase font-monospace fw-normal">(Optional)</span></label>
                  <input type="text" class="form-control form-control-lg bg-light" formControlName="description" placeholder="Short description of the category">
                </div>
                <div class="col-md-3 d-flex gap-2">
                  <button type="submit" class="btn btn-primary flex-grow-1 py-2 fw-medium shadow-sm" [disabled]="categoryForm.invalid">Save</button>
                  <button type="button" class="btn btn-light flex-grow-1 py-2 fw-medium text-secondary" (click)="cancelForm()">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="card border-0 shadow-sm rounded-4">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="bg-light">
                <tr>
                  <th scope="col" width="10%" class="ps-4 text-muted">#</th>
                  <th scope="col" width="30%" class="text-muted">NAME</th>
                  <th scope="col" width="45%" class="text-muted">DESCRIPTION</th>
                  <th scope="col" width="15%" class="text-end pe-4 text-muted">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="categories.length === 0">
                  <td colspan="4" class="text-center py-5">
                    <div class="d-flex flex-column align-items-center text-muted">
                      <i class="bi bi-inbox fs-1 mb-2 opacity-50"></i>
                      <span class="fw-medium">No categories found</span>
                      <small>Click 'Add Category' to get started.</small>
                    </div>
                  </td>
                </tr>
                <tr *ngFor="let cat of categories; let i = index">
                  <td class="ps-4 text-muted">{{ i + 1 }}</td>
                  <td>
                    <div class="d-flex align-items-center gap-3">
                      <div class="bg-primary bg-opacity-10 text-primary rounded d-flex justify-content-center align-items-center" style="width: 36px; height: 36px;">
                        <i class="bi bi-tag-fill"></i>
                      </div>
                      <span class="fw-semibold text-dark">{{ cat.name }}</span>
                    </div>
                  </td>
                  <td class="text-secondary">{{ cat.description || '-' }}</td>
                  <td class="text-end pe-4">
                    <button class="btn btn-sm btn-light text-primary rounded-circle me-2 shadow-sm" (click)="openEditMode(cat)" style="width: 32px; height: 32px; padding: 0;">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-light text-danger rounded-circle shadow-sm" (click)="deleteCategory(cat.id)" style="width: 32px; height: 32px; padding: 0;">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .slide-down {
      animation: slideDown 0.3s ease-out forwards;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  showForm: boolean = false;
  isEditMode: boolean = false;
  currentEditId: number | null = null;
  categoryForm: FormGroup;
  searchActive: boolean = false;

  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const searchId = params['searchId'] ? Number(params['searchId']) : undefined;
      this.searchActive = !!searchId;
      this.loadCategories(searchId);
    });
  }

  loadCategories(searchId?: number): void {
    this.categoryService.getCategories().subscribe(res => {
      if (searchId) {
        this.categories = res.filter(c => c.id === searchId);
      } else {
        this.categories = res;
      }
    });
  }

  clearSearch(): void {
    this.router.navigate(['/categories']);
  }

  openAddMode(): void {
    this.showForm = true;
    this.isEditMode = false;
    this.currentEditId = null;
    this.categoryForm.reset();
  }

  openEditMode(category: Category): void {
    this.showForm = true;
    this.isEditMode = true;
    this.currentEditId = category.id;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.isEditMode = false;
    this.currentEditId = null;
    this.categoryForm.reset();
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) return;

    if (this.isEditMode && this.currentEditId) {
      this.categoryService.updateCategory(this.currentEditId, this.categoryForm.value).subscribe(() => {
        this.loadCategories();
        this.cancelForm();
      });
    } else {
      this.categoryService.createCategory(this.categoryForm.value).subscribe(() => {
        this.loadCategories();
        this.cancelForm();
      });
    }
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }
}
