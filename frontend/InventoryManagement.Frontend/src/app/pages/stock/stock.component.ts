import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { StockService } from '../../services/stock.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid py-4 fade-in">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 class="fw-bold mb-1" style="color: var(--text-primary);">Stock Update</h2>
          <p class="text-muted mb-0">Record incoming inventory or manually adjust stock levels.</p>
        </div>
      </div>

      <div class="row g-4 d-flex align-items-stretch">
        <!-- Stock Update Form Card -->
        <div class="col-lg-7">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
              <div class="d-flex align-items-center gap-2">
                <div class="icon-circle bg-primary bg-opacity-10 text-primary d-flex justify-content-center align-items-center rounded-circle" style="width: 36px; height: 36px;">
                  <i class="bi bi-box-arrow-in-down"></i>
                </div>
                <h5 class="card-title fw-bold mb-0">Modify Inventory Quantity</h5>
              </div>
            </div>
            <div class="card-body p-4 pt-3">
              
              <div *ngIf="message" class="alert alert-success alert-dismissible fade show border-0 bg-success bg-opacity-10 text-success rounded-3 d-flex align-items-center mb-4" role="alert">
                <i class="bi bi-check-circle-fill me-2 fs-5"></i>
                <div>{{ message }}</div>
                <button type="button" class="btn-close" (click)="message = ''"></button>
              </div>
              
              <div *ngIf="error" class="alert alert-danger alert-dismissible fade show border-0 bg-danger bg-opacity-10 text-danger rounded-3 d-flex align-items-center mb-4" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                <div>{{ error }}</div>
                <button type="button" class="btn-close" (click)="error = ''"></button>
              </div>

              <form [formGroup]="stockForm" (ngSubmit)="onSubmit()">
                <div class="mb-4">
                  <label class="form-label text-muted fw-medium text-uppercase" style="font-size: 0.75rem;">Select Product <span class="text-danger">*</span></label>
                  <select class="form-select form-select-lg bg-light fs-6" formControlName="productId">
                    <option value="">-- Choose a product to update --</option>
                    <option *ngFor="let prod of products" [value]="prod.id">
                      {{ prod.name }} (Current: {{ prod.quantity }})
                    </option>
                  </select>
                </div>
                
                <div class="mb-4 p-3 bg-light rounded-3 border border-light">
                  <label class="form-label text-muted fw-medium text-uppercase d-block mb-3" style="font-size: 0.75rem;">Action Type <span class="text-danger">*</span></label>
                  <div class="d-flex flex-wrap gap-4">
                    <div class="form-check custom-radio align-items-center d-flex">
                      <input class="form-check-input bg-success bg-opacity-25 border-success border-opacity-50 mt-0 me-2" type="radio" formControlName="action" value="add" id="actionAdd" style="width: 1.2rem; height: 1.2rem;">
                      <label class="form-check-label fw-semibold text-success ms-1 pt-1" for="actionAdd">
                        Add Stock (+)
                      </label>
                    </div>
                    <div class="form-check custom-radio align-items-center d-flex">
                      <input class="form-check-input bg-danger bg-opacity-25 border-danger border-opacity-50 mt-0 me-2" type="radio" formControlName="action" value="remove" id="actionRemove" style="width: 1.2rem; height: 1.2rem;">
                      <label class="form-check-label fw-semibold text-danger ms-1 pt-1" for="actionRemove">
                        Remove Stock (-)
                      </label>
                    </div>
                  </div>
                </div>

                <div class="mb-5 row align-items-end">
                  <div class="col-sm-6">
                    <label class="form-label text-muted fw-medium text-uppercase" style="font-size: 0.75rem;">Quantity to {{ stockForm.value.action }} <span class="text-danger">*</span></label>
                    <div class="input-group input-group-lg">
                      <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-hash"></i></span>
                      <input type="number" class="form-control bg-light border-start-0 ps-0 fs-5" formControlName="quantity" min="1" placeholder="0">
                    </div>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary btn-lg w-100 fw-medium shadow-sm py-3 rounded-3 d-flex justify-content-center align-items-center gap-2" [disabled]="stockForm.invalid || isSubmitting">
                  <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm"></span>
                  <i *ngIf="!isSubmitting" class="bi bi-cloud-arrow-up"></i>
                  Confirm Stock Update
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Instructions Panel -->
        <div class="col-lg-5">
          <div class="card border-0 shadow-sm rounded-4 text-white h-100 overflow-hidden" style="background: linear-gradient(135deg, var(--sidebar-bg) 0%, #31314d 100%);">
            <div class="card-body p-4 d-flex flex-column position-relative">
              <i class="bi bi-info-circle position-absolute opacity-10" style="font-size: 10rem; right: -20px; bottom: -20px;"></i>
              <div class="d-flex align-items-center gap-3 mb-4 z-1">
                <div class="bg-white bg-opacity-10 rounded d-flex justify-content-center align-items-center" style="width: 48px; height: 48px;">
                  <i class="bi bi-lightbulb text-warning fs-4"></i>
                </div>
                <h4 class="fw-bold mb-0">How to Update</h4>
              </div>
              
              <div class="d-flex flex-column gap-4 z-1 mt-2">
                <div class="d-flex gap-3">
                  <div class="rounded-circle bg-primary bg-opacity-25 text-primary d-flex justify-content-center align-items-center flex-shrink-0 fw-bold" style="width: 32px; height: 32px;">1</div>
                  <div>
                    <h6 class="fw-bold mb-1">Select Product</h6>
                    <p class="text-white-50 small mb-0">Choose the exact item you want to modify from the dropdown menu.</p>
                  </div>
                </div>
                <div class="d-flex gap-3">
                  <div class="rounded-circle bg-primary bg-opacity-25 text-primary d-flex justify-content-center align-items-center flex-shrink-0 fw-bold" style="width: 32px; height: 32px;">2</div>
                  <div>
                    <h6 class="fw-bold mb-1">Choose Operation</h6>
                    <p class="text-white-50 small mb-0">Select "Add" for incoming shipments or returns. Select "Remove" for damaged goods, shrinkage, or audit corrections.</p>
                  </div>
                </div>
                <div class="d-flex gap-3">
                  <div class="rounded-circle bg-primary bg-opacity-25 text-primary d-flex justify-content-center align-items-center flex-shrink-0 fw-bold" style="width: 32px; height: 32px;">3</div>
                  <div>
                    <h6 class="fw-bold mb-1">Enter Volume</h6>
                    <p class="text-white-50 small mb-0">Key in the precise quantity to adjust.</p>
                  </div>
                </div>
              </div>
              
              <div class="mt-auto pt-4 border-top border-light border-opacity-10 z-1">
                <div class="d-flex align-items-center gap-2 text-warning fs-7 fw-medium">
                  <i class="bi bi-exclamation-circle-fill"></i>
                  Note: Adjustments are logged instantly and alter the core inventory database.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StockComponent implements OnInit {
  products: Product[] = [];
  stockForm: FormGroup;
  message: string = '';
  error: string = '';
  isSubmitting: boolean = false;

  private productService = inject(ProductService);
  private stockService = inject(StockService);
  private fb = inject(FormBuilder);

  constructor() {
    this.stockForm = this.fb.group({
      productId: ['', Validators.required],
      action: ['add', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(res => {
      this.products = res;
    });
  }

  onSubmit(): void {
    if (this.stockForm.invalid) return;

    this.isSubmitting = true;
    this.message = '';
    this.error = '';

    const { productId, action, quantity } = this.stockForm.value;
    const prodId = Number(productId);
    const qty = Number(quantity);

    const req$ = action === 'add' 
      ? this.stockService.addStock(prodId, qty)
      : this.stockService.removeStock(prodId, qty);

    req$.subscribe({
      next: () => {
        this.message = `Successfully ${action === 'add' ? 'added' : 'removed'} ${quantity} items.`;
        this.isSubmitting = false;
        this.stockForm.patchValue({ quantity: 1 });
        this.loadProducts(); // Refresh current stock counts
      },
      error: (err) => {
        this.error = 'Failed to update stock. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
