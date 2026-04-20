import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { ApiResponse, PageResponse } from '../models/api.model';
import { ProjectResponse, ProjectRequest, ProjectCategory } from '../models/project.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private base = `${environment.apiUrl}/api/projects`;
  private catBase = `${environment.apiUrl}/api/project-categories`;

  constructor(private http: HttpClient) {}

  getAll(keyword?: string, status?: string, categoryId?: number, featured?: boolean, page = 0, size = 10): Observable<ApiResponse<PageResponse<ProjectResponse>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (keyword) params = params.set('keyword', keyword);
    if (status) params = params.set('status', status);
    if (categoryId) params = params.set('categoryId', categoryId);
    if (featured !== undefined) params = params.set('featured', featured);
    
    console.log('📡 API Request:', `${this.base}?${params.toString()}`);
    
    return this.http.get<ApiResponse<PageResponse<ProjectResponse>>>(this.base, { params }).pipe(
      timeout(10000) // 10 second timeout
    );
  }

  getById(id: number): Observable<ApiResponse<ProjectResponse>> {
    return this.http.get<ApiResponse<ProjectResponse>>(`${this.base}/${id}`);
  }

  create(req: ProjectRequest): Observable<ApiResponse<ProjectResponse>> {
    return this.http.post<ApiResponse<ProjectResponse>>(this.base, req);
  }

  update(id: number, req: ProjectRequest): Observable<ApiResponse<ProjectResponse>> {
    return this.http.put<ApiResponse<ProjectResponse>>(`${this.base}/${id}`, req);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`);
  }

  setFeatured(id: number, featured: boolean, displayOrder?: number): Observable<ApiResponse<ProjectResponse>> {
    let params = new HttpParams().set('featured', featured);
    if (displayOrder !== undefined) params = params.set('displayOrder', displayOrder);
    return this.http.patch<ApiResponse<ProjectResponse>>(`${this.base}/${id}/featured`, null, { params });
  }

  getCategories(): Observable<ApiResponse<ProjectCategory[]>> {
    return this.http.get<ApiResponse<ProjectCategory[]>>(`${this.catBase}/list`);
  }

  createCategory(name: string): Observable<ApiResponse<ProjectCategory>> {
    return this.http.post<ApiResponse<ProjectCategory>>(this.catBase, { name });
  }

  updateCategory(id: number, name: string): Observable<ApiResponse<ProjectCategory>> {
    return this.http.put<ApiResponse<ProjectCategory>>(`${this.catBase}/${id}`, { name });
  }

  deleteCategory(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.catBase}/${id}`);
  }
}
