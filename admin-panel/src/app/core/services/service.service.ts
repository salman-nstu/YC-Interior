import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PageResponse } from '../models/api.model';
import { ServiceResponse, ServiceRequest } from '../models/service.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private base = `${environment.apiUrl}/api/services`;

  constructor(private http: HttpClient) {}

  getAll(keyword?: string, page = 0, size = 10): Observable<ApiResponse<PageResponse<ServiceResponse>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (keyword) params = params.set('keyword', keyword);
    return this.http.get<ApiResponse<PageResponse<ServiceResponse>>>(this.base, { params });
  }

  getById(id: number): Observable<ApiResponse<ServiceResponse>> {
    return this.http.get<ApiResponse<ServiceResponse>>(`${this.base}/${id}`);
  }

  create(req: ServiceRequest): Observable<ApiResponse<ServiceResponse>> {
    return this.http.post<ApiResponse<ServiceResponse>>(this.base, req);
  }

  update(id: number, req: ServiceRequest): Observable<ApiResponse<ServiceResponse>> {
    return this.http.put<ApiResponse<ServiceResponse>>(`${this.base}/${id}`, req);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`);
  }
}
