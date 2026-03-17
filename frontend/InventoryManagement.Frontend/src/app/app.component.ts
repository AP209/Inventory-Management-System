import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, CommonModule],
  template: `
    <ng-container *ngIf="authService.isLoggedIn(); else loginView">
      <div class="d-flex" style="min-height: 100vh; overflow-x: hidden;">
        <!-- Fixed Modern Sidebar -->
        <nav class="sidebar-wrapper" style="width: 260px; position: fixed; top: 0; bottom: 0; left: 0; z-index: 1030; background: var(--sidebar-bg); box-shadow: 4px 0 10px rgba(0,0,0,0.1);">
          <app-sidebar></app-sidebar>
        </nav>
        
        <!-- Main Content Area -->
        <div class="content-wrapper d-flex flex-column w-100" style="margin-left: 260px; min-height: 100vh; background-color: var(--bg-color);">
          <app-navbar></app-navbar>
          <main class="main-content flex-grow-1">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    </ng-container>
    
    <ng-template #loginView>
      <div class="auth-wrapper bg-light min-vh-100">
        <router-outlet></router-outlet>
      </div>
    </ng-template>
  `
})
export class AppComponent {
  title = 'InventoryManagement.Frontend';
  authService = inject(AuthService);
}
