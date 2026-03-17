import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { environment } from '../../../environments/environment';
import { finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid py-4 fade-in">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 class="fw-bold mb-1" style="color: var(--text-primary);">
            Products 
            <span *ngIf="searchActive" class="badge bg-warning bg-opacity-25 text-warning border border-warning fs-6 ms-2 fw-medium rounded-pill align-middle" style="font-size: 0.85rem !important;">Search Result</span>
          </h2>
          <p class="text-muted mb-0">View and manage your entire product inventory.</p>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button *ngIf="searchActive" class="btn btn-light text-secondary rounded-pill shadow-sm px-4 d-flex align-items-center gap-2 border" (click)="clearSearch()">
            <i class="bi bi-x-circle"></i> Clear Filters
          </button>
          <button class="btn btn-primary rounded-pill shadow-sm px-4 d-flex align-items-center gap-2" (click)="openAddMode()">
            <i class="bi bi-plus-lg"></i> Add Product
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
            <h5 class="card-title fw-bold mb-0 text-dark">{{ isEditMode ? 'Edit Product' : 'Add New Product' }}</h5>
          </div>
          <div class="card-body px-4 pb-4 pt-2">
            <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
              <div class="row g-3 align-items-start">
                <div class="col-md-3">
                  <label class="form-label text-muted fw-medium text-uppercase" style="font-size: 0.75rem;">Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control bg-light" formControlName="name">
                </div>
                <div class="col-md-2">
                  <label class="form-label text-muted fw-medium text-uppercase" style="font-size: 0.75rem;">Price (Rs.)</label>
                  <input type="number" class="form-control bg-light" formControlName="price">
                </div>
                <div class="col-md-2">
                  <label class="form-label text-muted fw-medium text-uppercase" style="font-size: 0.75rem;">Quantity</label>
                  <input type="number" class="form-control bg-light" formControlName="quantity">
                </div>
                <div class="col-md-5">
                  <label class="form-label text-muted fw-medium text-uppercase" style="font-size: 0.75rem;">Category</label>
                  <select class="form-select bg-light" formControlName="categoryId">
                    <option value="">Select Category</option>
                    <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
                  </select>
                </div>
                <!-- Second Row -->
                <div class="col-md-7 mt-3">
                  <label class="form-label text-muted fw-medium text-uppercase" style="font-size: 0.75rem;">Product Image</label>
                  <div class="d-flex gap-3 align-items-center">
                    <input type="file" class="form-control bg-light" accept="image/*" (change)="onFileSelected($event)">
                    <div *ngIf="imagePreview" class="border rounded px-2 py-1 bg-white shadow-sm flex-shrink-0">
                      <img [src]="imagePreview" alt="Preview" class="rounded" style="height: 40px; object-fit: cover;">
                    </div>
                  </div>
                </div>
                <div class="col-md-5 mt-3 d-flex align-items-end justify-content-end gap-2">
                  <button type="button" class="btn btn-light px-4 py-2 fw-medium text-secondary" (click)="cancelForm()" [disabled]="isUploading">Cancel</button>
                  <button type="submit" class="btn btn-primary px-4 py-2 fw-medium shadow-sm d-flex align-items-center gap-2" [disabled]="productForm.invalid || isUploading">
                    <span *ngIf="isUploading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Save Product
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="card border-0 shadow-sm rounded-4">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="bg-light">
                <tr>
                  <th scope="col" class="ps-4 text-muted" width="5%">#</th>
                  <th scope="col" class="text-muted" width="10%">IMAGE</th>
                  <th scope="col" class="text-muted" width="25%">PRODUCT NAME</th>
                  <th scope="col" class="text-muted" width="20%">CATEGORY</th>
                  <th scope="col" class="text-muted text-end" width="15%">PRICE</th>
                  <th scope="col" class="text-muted text-center" width="10%">STOCK</th>
                  <th scope="col" class="pe-4 text-muted text-end" width="15%">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="products.length === 0">
                  <td colspan="7" class="text-center py-5">
                    <div class="d-flex flex-column align-items-center text-muted">
                      <i class="bi bi-box-seam fs-1 mb-2 opacity-50"></i>
                      <span class="fw-medium">No products available</span>
                      <small>Click 'Add Product' to list a new item.</small>
                    </div>
                  </td>
                </tr>
                <tr *ngFor="let prod of products; let i = index" [ngClass]="{'bg-danger bg-opacity-10': prod.quantity < 10}">
                  <td class="ps-4 text-muted fw-medium">{{ i + 1 }}</td>
                  <td>
                    <div class="rounded-3 shadow-sm bg-white border d-flex justify-content-center align-items-center overflow-hidden" style="width: 48px; height: 48px;">
                      <img *ngIf="prod.imageUrl" [src]="getImageUrl(prod.imageUrl)" alt="{{prod.name}}" style="width: 100%; height: 100%; object-fit: cover;">
                      <i *ngIf="!prod.imageUrl" class="bi bi-image text-muted opacity-50 fs-4"></i>
                    </div>
                  </td>
                  <td>
                    <span class="fw-bold text-dark fs-6">{{ prod.name }}</span>
                  </td>
                  <td>
                    <span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-2 py-1">
                      {{ prod.category?.name || 'Unknown' }}
                    </span>
                  </td>
                  <td class="text-end fw-semibold text-dark">
                    ₹{{ prod.price | number:'1.2-2' }}
                  </td>
                  <td class="text-center">
                    <div class="badge rounded-pill px-3 py-2 fw-bold" 
                         [ngClass]="prod.quantity < 10 ? 'bg-danger text-white border-danger shadow-sm' : 'bg-success bg-opacity-10 text-success border border-success border-opacity-25'">
                      {{ prod.quantity }}
                    </div>
                  </td>
                  <td class="text-end pe-4">
                    <button class="btn btn-sm btn-light text-primary rounded-circle me-2 shadow-sm" (click)="openEditMode(prod)" style="width: 32px; height: 32px; padding: 0;">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-light text-danger rounded-circle shadow-sm" (click)="deleteProduct(prod.id)" style="width: 32px; height: 32px; padding: 0;">
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
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  showForm: boolean = false;
  isEditMode: boolean = false;
  currentEditId: number | null = null;
  productForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isUploading: boolean = false;
  baseUrl = environment.apiUrl.replace('/api', '');
  searchActive: boolean = false;

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.route.queryParams.subscribe(params => {
      const searchId = params['searchId'] ? Number(params['searchId']) : undefined;
      this.searchActive = !!searchId;
      this.loadProducts(searchId);
    });
  }

  loadProducts(searchId?: number): void {
    this.productService.getProducts().subscribe(res => {
      if (searchId) {
        this.products = res.filter(p => p.id === searchId);
      } else {
        this.products = res;
      }
    });
  }

  clearSearch(): void {
    this.router.navigate(['/products']);
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  openAddMode(): void {
    this.showForm = true;
    this.isEditMode = false;
    this.currentEditId = null;
    this.selectedFile = null;
    this.imagePreview = null;
    this.productForm.reset({ price: 0, quantity: 0, categoryId: '' });
  }

  openEditMode(product: Product): void {
    this.showForm = true;
    this.isEditMode = true;
    this.currentEditId = product.id;
    this.selectedFile = null;
    this.imagePreview = product.imageUrl ? this.getImageUrl(product.imageUrl) : null;
    this.productForm.patchValue({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      categoryId: product.categoryId
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.isEditMode = false;
    this.currentEditId = null;
    this.selectedFile = null;
    this.imagePreview = null;
    this.productForm.reset();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  getImageUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${this.baseUrl}${url}`;
  }

  onSubmit(): void {
    if (this.productForm.invalid || this.isUploading) return;

    this.isUploading = true;
    let upload$: Observable<{ imageUrl: string } | null> = of(null);

    if (this.selectedFile) {
      upload$ = this.productService.uploadImage(this.selectedFile);
    }

    upload$.pipe(
      switchMap(res => {
        const payload: any = {
          ...this.productForm.value,
          categoryId: Number(this.productForm.value.categoryId)
        };

        if (res && res.imageUrl) {
          payload.imageUrl = res.imageUrl;
        }

        if (this.isEditMode && this.currentEditId) {
          return this.productService.updateProduct(this.currentEditId, payload);
        } else {
          return this.productService.createProduct(payload);
        }
      }),
      finalize(() => {
        this.isUploading = false;
      })
    ).subscribe({
      next: () => {
        this.loadProducts();
        this.cancelForm();
      },
      error: (err) => {
        console.error('Error saving product', err);
        alert('Failed to save product. Please try again.');
        this.isUploading = false;
      }
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}
