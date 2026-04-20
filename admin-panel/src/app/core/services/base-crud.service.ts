import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { ApiResponse, PageResponse } from '../models/api.model';
import { environment } from '../../environments/environment';

export interface CrudService<T, CreateRequest, UpdateRequest = CreateRequest> {
  getAll(params?: any): Observable<ApiResponse<PageResponse<T>>>;
  getById(id: number): Observable<ApiResponse<T>>;
  create(request: CreateRequest): Observable<ApiResponse<T>>;
  update(id: number, request: UpdateRequest): Observable<ApiResponse<T>>;
  delete(id: number): Observable<ApiResponse<void>>;
}

@Injectable()
export abstract class BaseCrudService<T, CreateRequest, UpdateRequest = CreateRequest> 
  implements CrudService<T, CreateRequest, UpdateRequest> {
  
  protected abstract readonly endpoint: string;
  protected readonly timeout = 10000; // 10 seconds
  
  constructor(protected http: HttpClient) {}

  getAll(params: {
    keyword?: string;
    status?: string;
    categoryId?: number;
    featured?: boolean;
    page?: number;
    size?: number;
    [key: string]: any;
  } = {}): Observable<ApiResponse<PageResponse<T>>> {
    let httpParams = new HttpParams()
      .set('page', params.page || 0)
      .set('size', params.size || 10);
    
    // Add all other parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '' && key !== 'page' && key !== 'size') {
        httpParams = httpParams.set(key, params[key]);
      }
    });

    console.log(`📡 API Request: ${this.endpoint}?${httpParams.toString()}`);
    
    return this.http.get<ApiResponse<PageResponse<T>>>(this.endpoint, { params: httpParams })
      .pipe(timeout(this.timeout));
  }

  getById(id: number): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.endpoint}/${id}`)
      .pipe(timeout(this.timeout));
  }

  create(request: CreateRequest): Observable<ApiResponse<T>> {
    console.log(`📡 Creating:`, request);
    return this.http.post<ApiResponse<T>>(this.endpoint, request)
      .pipe(timeout(this.timeout));
  }

  update(id: number, request: UpdateRequest): Observable<ApiResponse<T>> {
    console.log(`📡 Updating ${id}:`, request);
    return this.http.put<ApiResponse<T>>(`${this.endpoint}/${id}`, request)
      .pipe(timeout(this.timeout));
  }

  delete(id: number): Observable<ApiResponse<void>> {
    console.log(`📡 Deleting ${id}`);
    return this.http.delete<ApiResponse<void>>(`${this.endpoint}/${id}`)
      .pipe(timeout(this.timeout));
  }

  // Common additional operations
  setFeatured(id: number, featured: boolean): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.endpoint}/${id}/featured`, { featured })
      .pipe(timeout(this.timeout));
  }

  updateOrder(id: number, order: number): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.endpoint}/${id}/order`, { displayOrder: order })
      .pipe(timeout(this.timeout));
  }

  updateStatus(id: number, status: string): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.endpoint}/${id}/status`, { status })
      .pipe(timeout(this.timeout));
  }
}