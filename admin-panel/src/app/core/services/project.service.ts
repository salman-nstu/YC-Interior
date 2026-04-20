import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { ApiResponse } from '../models/api.model';
import { ProjectResponse, ProjectRequest, ProjectCategory } from '../models/project.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectService extends BaseCrudService<ProjectResponse, ProjectRequest> {
  protected readonly endpoint = `${environment.apiUrl}/api/projects`;
  private readonly catBase = `${environment.apiUrl}/api/project-categories`;

  constructor(http: HttpClient) {
    super(http);
  }

  // Override setFeatured to include displayOrder parameter
  override setFeatured(id: number, featured: boolean, displayOrder?: number): Observable<ApiResponse<ProjectResponse>> {
    let params = new HttpParams().set('featured', featured);
    if (displayOrder !== undefined) params = params.set('displayOrder', displayOrder);
    return this.http.patch<ApiResponse<ProjectResponse>>(`${this.endpoint}/${id}/featured`, null, { params });
  }

  // Category management methods
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
