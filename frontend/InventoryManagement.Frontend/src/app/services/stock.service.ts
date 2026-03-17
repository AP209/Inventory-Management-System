import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = `${environment.apiUrl}/stock`;

  constructor(private http: HttpClient, private productService: ProductService) { }

  addStock(productId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { productId, quantity }).pipe(
      tap(() => this.productService.productChanged$.next())
    );
  }

  removeStock(productId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/remove`, { productId, quantity }).pipe(
      tap(() => this.productService.productChanged$.next())
    );
  }
}
