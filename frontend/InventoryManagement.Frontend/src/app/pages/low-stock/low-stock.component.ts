import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-low-stock',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-fluid py-4 fade-in">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-4 border-bottom pb-3" style="border-color: rgba(239, 68, 68, 0.2) !important;">
        <div>
          <h2 class="fw-bold mb-1 text-danger d-flex align-items-center gap-2">
            <i class="bi bi-exclamation-triangle-fill"></i> Low Stock Alerts
          </h2>
          <p class="text-muted mb-0">Products that are running out and require immediate restocking.</p>
        </div>
      </div>

      <div class="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger rounded-4 d-flex align-items-center mb-4 p-4 shadow-sm" role="alert">
        <div class="icon-circle bg-danger text-white d-flex justify-content-center align-items-center rounded-circle flex-shrink-0 me-3 shadow-sm" style="width: 48px; height: 48px;">
          <i class="bi bi-bell-fill fs-5"></i>
        </div>
        <div>
          <h5 class="fw-bold mb-1">Attention Required</h5>
          <p class="mb-0 text-danger opacity-75">The following products have a stock level below 10. Restock soon to prevent halting operations.</p>
        </div>
      </div>

      <!-- Table Section -->
      <div class="card border-0 shadow-sm rounded-4 overflow-hidden" style="box-shadow: 0 10px 30px rgba(239, 68, 68, 0.05) !important;">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="bg-danger bg-opacity-10">
                <tr>
                  <th scope="col" class="ps-4 text-danger fw-semibold" width="5%">#</th>
                  <th scope="col" class="text-danger fw-semibold" width="35%">PRODUCT NAME</th>
                  <th scope="col" class="text-danger fw-semibold" width="20%">CATEGORY</th>
                  <th scope="col" class="text-danger fw-semibold text-center" width="20%">CURRENT STOCK</th>
                  <th scope="col" class="text-end pe-4 text-danger fw-semibold" width="20%">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="lowStockProducts.length === 0">
                  <td colspan="5" class="text-center py-5">
                    <div class="d-flex flex-column align-items-center text-success">
                      <div class="icon-circle bg-success bg-opacity-10 text-success d-flex justify-content-center align-items-center rounded-circle mb-3" style="width: 64px; height: 64px;">
                        <i class="bi bi-check-lg fs-1"></i>
                      </div>
                      <h5 class="fw-bold mb-1">All Clear</h5>
                      <span class="text-muted">All products are sufficiently stocked.</span>
                    </div>
                  </td>
                </tr>
                <tr *ngFor="let prod of lowStockProducts; let i = index">
                  <td class="ps-4 text-muted fw-bold">{{ i + 1 }}</td>
                  <td>
                    <div class="d-flex align-items-center gap-3">
                      <div class="icon-circle bg-danger bg-opacity-10 text-danger d-flex justify-content-center align-items-center rounded-circle" style="width: 40px; height: 40px;">
                        <i class="bi bi-box-seam-fill"></i>
                      </div>
                      <span class="fw-bold text-dark fs-6">{{ prod.name }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-2 py-1">
                      {{ prod.category?.name || 'Unknown' }}
                    </span>
                  </td>
                  <td class="text-center">
                    <div class="badge rounded-pill bg-danger px-4 py-2 fw-bold text-white shadow-sm" style="font-size: 0.95rem;">
                      {{ prod.quantity }}
                    </div>
                  </td>
                  <td class="text-end pe-4">
                    <a routerLink="/stock" [queryParams]="{ productId: prod.id }" class="btn btn-danger rounded-pill shadow-sm fw-medium d-inline-flex align-items-center gap-2 px-3 py-2 transition-all hover-translate-y">
                      <i class="bi bi-plus-circle"></i> Add Stock
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LowStockComponent implements OnInit {
  lowStockProducts: Product[] = [];

  private productService = inject(ProductService);

  ngOnInit(): void {
    this.productService.getLowStockProducts().subscribe(res => {
      // API may just return all low stock, or we might need to filter locally
      // Assuming API returns products where quantity < 5 as per instructions
      this.lowStockProducts = res;

      // Fallback local filter just in case the backend doesn't filter perfectly
      /* 
      this.lowStockProducts = res.filter(p => p.quantity < 5); 
      */
    });
  }
}
