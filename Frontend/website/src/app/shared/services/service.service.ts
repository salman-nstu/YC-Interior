import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, PageResponse } from '../models/api.model';
import { Service } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/api/services`;

  constructor(private http: HttpClient) {}

  getServices(page: number = 0, size: number = 6): Observable<ApiResponse<PageResponse<Service>>> {
    return this.http.get<ApiResponse<PageResponse<Service>>>(`${this.apiUrl}?page=${page}&size=${size}&status=published`);
  }

  getServiceById(id: number): Observable<ApiResponse<Service>> {
    return this.http.get<ApiResponse<Service>>(`${this.apiUrl}/${id}`);
  }
}
