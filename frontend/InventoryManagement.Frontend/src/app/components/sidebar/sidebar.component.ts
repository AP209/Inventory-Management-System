import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="d-flex flex-column h-100" style="background-color: var(--sidebar-bg); color: var(--sidebar-text);">
      
      <!-- Brand Area -->
      <div class="brand-area d-flex align-items-center px-4 py-4 mb-2" style="border-bottom: 1px solid rgba(255,255,255,0.05);">
        <div class="d-flex align-items-center gap-3 w-100">
          <div class="brand-icon d-flex flex-shrink-0 align-items-center justify-content-center rounded-4 shadow-sm" style="width: 42px; height: 42px; background: linear-gradient(135deg, var(--primary-color), #4f46e5); color: white; font-size: 1.3rem;">
            <i class="bi bi-box-seam-fill"></i>
          </div>
          <div class="d-flex flex-column justify-content-center mt-1">
            <span class="fw-bolder text-white text-uppercase" style="font-family: 'Outfit', 'Inter', sans-serif; font-size: 1.05rem; letter-spacing: 1px; line-height: 1;">Inventory</span>
            <span class="fw-semibold" style="font-family: 'Outfit', 'Inter', sans-serif; font-size: 0.75rem; color: #818cf8; letter-spacing: 0.5px; margin-top: 2px;">MANAGEMENT</span>
          </div>
        </div>
      </div>

      <!-- Navigation Links -->
      <ul class="nav flex-column gap-2 px-3 py-3 overflow-auto flex-grow-1">
        <li class="nav-item">
          <a class="nav-link sidebar-link rounded-3 px-3 py-2 fw-medium d-flex align-items-center gap-3" routerLink="/dashboard" routerLinkActive="active-link">
            <i class="bi bi-house-door"></i> <span>Dashboard</span>
          </a>
        </li>
        <li class="nav-item mt-2">
          <small class="text-uppercase fw-semibold px-3 mb-1 d-block" style="font-size: 0.7rem; color: #6b7280; letter-spacing: 1px;">Management</small>
          <a class="nav-link sidebar-link rounded-3 px-3 py-2 fw-medium d-flex align-items-center gap-3" routerLink="/categories" routerLinkActive="active-link">
            <i class="bi bi-tags"></i> <span>Categories</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link sidebar-link rounded-3 px-3 py-2 fw-medium d-flex align-items-center gap-3" routerLink="/products" routerLinkActive="active-link">
            <i class="bi bi-box-seam"></i> <span>Products</span>
          </a>
        </li>
        <li class="nav-item mt-2">
          <small class="text-uppercase fw-semibold px-3 mb-1 d-block" style="font-size: 0.7rem; color: #6b7280; letter-spacing: 1px;">Inventory</small>
          <a class="nav-link sidebar-link rounded-3 px-3 py-2 fw-medium d-flex align-items-center gap-3" routerLink="/stock" routerLinkActive="active-link">
            <i class="bi bi-arrow-left-right"></i> <span>Stock Update</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link sidebar-link rounded-3 px-3 py-2 fw-medium d-flex align-items-center gap-3" routerLink="/low-stock" routerLinkActive="active-link">
            <i class="bi bi-exclamation-triangle"></i> <span>Low Stock Alert</span>
          </a>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .sidebar-link {
      color: var(--sidebar-text);
      transition: var(--transition);
      border: 1px solid transparent;
    }
    .sidebar-link i {
      font-size: 1.1rem;
      transition: transform 0.2s ease;
    }
    .sidebar-link:hover {
      color: var(--sidebar-text-active);
      background-color: var(--sidebar-active);
      transform: translateX(4px);
    }
    .sidebar-link:hover i {
      transform: scale(1.1);
    }
    .active-link {
      color: var(--sidebar-text-active) !important;
      background: linear-gradient(90deg, rgba(79, 70, 229, 0.15) 0%, transparent 100%) !important;
      border-left: 3px solid var(--primary-color) !important;
    }
    .active-link i {
      color: var(--primary-color);
    }
  `]
})
export class SidebarComponent {
}
