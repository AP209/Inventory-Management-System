import { Category } from './category.model';

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  categoryId: number;
  category?: Category;
  imageUrl?: string;
}
