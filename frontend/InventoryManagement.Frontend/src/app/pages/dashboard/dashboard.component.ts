import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container-fluid py-4 fade-in">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-5 border-bottom pb-3">
        <div>
          <h2 class="fw-bold mb-1" style="color: var(--text-primary);">Dashboard</h2>
          <p class="text-muted mb-0">Overview of your inventory operations.</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary rounded-pill pe-none"><i class="bi bi-calendar3 me-2"></i>Today</button>
          <button class="btn btn-primary rounded-pill shadow-sm" routerLink="/stock"><i class="bi bi-plus-lg me-2"></i>Quick Update</button>
        </div>
      </div>

      <div class="row g-4 mb-4">
        <!-- Dashboard Card 1 -->
        <div class="col-md-6 col-xl-3">
          <div class="card h-100 dashboard-card" style="background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); color: white;">
            <div class="card-body p-4 position-relative overflow-hidden">
              <i class="bi bi-box-seam position-absolute opacity-25" style="font-size: 6rem; right: -10px; bottom: -20px; transform: rotate(-15deg);"></i>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="text-uppercase fw-semibold tracking-wider mb-0 text-white-50">Products</h6>
                <div class="icon-circle bg-white text-primary d-flex justify-content-center align-items-center rounded-circle shadow-sm" style="width: 48px; height: 48px; font-size: 1.5rem;">
                  <i class="bi bi-box-seam"></i>
                </div>
              </div>
              <h3 class="fw-bold mb-1">Manage</h3>
              <p class="text-white-50 small mb-4">Inventory Master List</p>
              <a routerLink="/products" class="btn btn-light btn-sm rounded-pill fw-medium text-primary px-3 shadow-sm d-inline-flex align-items-center gap-2" style="position: relative; z-index: 1;">
                View Products <i class="bi bi-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
        
        <!-- Dashboard Card 2 -->
        <div class="col-md-6 col-xl-3">
          <div class="card h-100 dashboard-card" style="background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); color: white;">
            <div class="card-body p-4 position-relative overflow-hidden">
              <i class="bi bi-tags position-absolute opacity-25" style="font-size: 6rem; right: -10px; bottom: -20px; transform: rotate(-15deg);"></i>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="text-uppercase fw-semibold tracking-wider mb-0 text-white-50">Categories</h6>
                <div class="icon-circle bg-white text-info d-flex justify-content-center align-items-center rounded-circle shadow-sm" style="width: 48px; height: 48px; font-size: 1.5rem;">
                  <i class="bi bi-tags"></i>
                </div>
              </div>
              <h3 class="fw-bold mb-1">Organize</h3>
              <p class="text-white-50 small mb-4">Product Groupings</p>
              <a routerLink="/categories" class="btn btn-light btn-sm rounded-pill fw-medium text-info px-3 shadow-sm d-inline-flex align-items-center gap-2" style="position: relative; z-index: 1;">
                View Categories <i class="bi bi-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
        
        <!-- Dashboard Card 3 -->
        <div class="col-md-6 col-xl-3">
          <div class="card h-100 dashboard-card" style="background: linear-gradient(135deg, #10b981 0%, #047857 100%); color: white;">
            <div class="card-body p-4 position-relative overflow-hidden">
              <i class="bi bi-arrow-left-right position-absolute opacity-25" style="font-size: 6rem; right: -10px; bottom: -20px; transform: rotate(-15deg);"></i>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="text-uppercase fw-semibold tracking-wider mb-0 text-white-50">Stock Update</h6>
                <div class="icon-circle bg-white text-success d-flex justify-content-center align-items-center rounded-circle shadow-sm" style="width: 48px; height: 48px; font-size: 1.5rem;">
                  <i class="bi bi-arrow-left-right"></i>
                </div>
              </div>
              <h3 class="fw-bold mb-1">Adjust</h3>
              <p class="text-white-50 small mb-4">Add / Remove Stock</p>
              <a routerLink="/stock" class="btn btn-light btn-sm rounded-pill fw-medium text-success px-3 shadow-sm d-inline-flex align-items-center gap-2" style="position: relative; z-index: 1;">
                Update Stock <i class="bi bi-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
        
        <!-- Dashboard Card 4 -->
        <div class="col-md-6 col-xl-3">
          <div class="card h-100 dashboard-card" style="background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); color: white;">
            <div class="card-body p-4 position-relative overflow-hidden">
              <i class="bi bi-exclamation-triangle position-absolute opacity-25" style="font-size: 6rem; right: -10px; bottom: -20px; transform: rotate(-15deg);"></i>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="text-uppercase fw-semibold tracking-wider mb-0 text-white-50">Low Stock</h6>
                <div class="icon-circle bg-white text-danger d-flex justify-content-center align-items-center rounded-circle shadow-sm" style="width: 48px; height: 48px; font-size: 1.5rem;">
                  <i class="bi bi-bell"></i>
                </div>
              </div>
              <h3 class="fw-bold mb-1">Alerts</h3>
              <p class="text-white-50 small mb-4">Requires Attention</p>
              <a routerLink="/low-stock" class="btn btn-light btn-sm rounded-pill fw-medium text-danger px-3 shadow-sm d-inline-flex align-items-center gap-2" style="position: relative; z-index: 1;">
                View Alerts <i class="bi bi-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Recent Activity / Info Section -->
      <div class="row">
        <div class="col-12">
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
              <h5 class="fw-bold mb-0">System Overview</h5>
            </div>
            <div class="card-body p-4">
              <div class="p-4 bg-light rounded-3 border border-light text-center">
                <i class="bi bi-activity text-muted mb-3" style="font-size: 3rem;"></i>
                <h6 class="fw-bold">All systems operating normally</h6>
                <p class="text-muted small mb-0">Inventory database is synced. Ready for operations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-card {
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      border: none;
      border-radius: 16px;
    }
    .dashboard-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    }
    .dashboard-card .btn {
      transition: all 0.2s ease;
    }
    .dashboard-card .btn:hover {
      transform: translateX(5px);
    }
  `]
})
export class DashboardComponent {
}
