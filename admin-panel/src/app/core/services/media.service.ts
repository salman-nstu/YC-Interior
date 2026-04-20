import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PageResponse } from '../models/api.model';
import { MediaResponse } from '../models/media.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MediaService {
  private base = `${environment.apiUrl}/media`;

  constructor(private http: HttpClient) {}

  upload(file: File, category?: string, subCategory?: string, altText?: string): Observable<ApiResponse<MediaResponse>> {
    const fd = new FormData();
    fd.append('file', file);
    if (category) fd.append('category', category);
    if (subCategory) fd.append('subCategory', subCategory);
    if (altText) fd.append('altText', altText);
    return this.http.post<ApiResponse<MediaResponse>>(`${this.base}/upload`, fd);
  }

  getAll(category?: string, subCategory?: string, page = 0, size = 20): Observable<ApiResponse<PageResponse<MediaResponse>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (category) params = params.set('category', category);
    if (subCategory) params = params.set('subCategory', subCategory);
    return this.http.get<ApiResponse<PageResponse<MediaResponse>>>(this.base, { params });
  }

  getById(id: number): Observable<ApiResponse<MediaResponse>> {
    return this.http.get<ApiResponse<MediaResponse>>(`${this.base}/${id}`);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`);
  }
}
