import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PageResponse } from '../models/api.model';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/api/projects`;

  constructor(private http: HttpClient) {}

  getFeaturedProjects(): Observable<ApiResponse<PageResponse<Project>>> {
    return this.http.get<ApiResponse<PageResponse<Project>>>(`${this.apiUrl}/featured?size=4`);
  }

  getAllProjects(page: number, size: number): Observable<ApiResponse<PageResponse<Project>>> {
    return this.http.get<ApiResponse<PageResponse<Project>>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getProjectById(id: number): Observable<ApiResponse<Project>> {
    return this.http.get<ApiResponse<Project>>(`${this.apiUrl}/${id}`);
  }
}
