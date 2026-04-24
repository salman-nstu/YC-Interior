import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, PageResponse } from '../models/api.model';
import { AboutSection } from '../models/about.model';

@Injectable({
  providedIn: 'root'
})
export class AboutService {
  private apiUrl = `${environment.apiUrl}/api/about`;

  constructor(private http: HttpClient) {}

  getAboutSections(page: number = 0, size: number = 10): Observable<ApiResponse<PageResponse<AboutSection>>> {
    return this.http.get<ApiResponse<PageResponse<AboutSection>>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getAboutById(id: number): Observable<ApiResponse<AboutSection>> {
    return this.http.get<ApiResponse<AboutSection>>(`${this.apiUrl}/${id}`);
  }
}
