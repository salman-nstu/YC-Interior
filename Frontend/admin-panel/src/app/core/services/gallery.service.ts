import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PageResponse } from '../models/api.model';
import { GalleryResponse, GalleryRequest } from '../models/gallery.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private base = `${environment.apiUrl}/api/gallery`;

  constructor(private http: HttpClient) {}

  getAll(featured?: boolean, page = 0, size = 12): Observable<ApiResponse<PageResponse<GalleryResponse>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (featured !== undefined) params = params.set('featured', featured);
    return this.http.get<ApiResponse<PageResponse<GalleryResponse>>>(this.base, { params });
  }

  getById(id: number): Observable<ApiResponse<GalleryResponse>> {
    return this.http.get<ApiResponse<GalleryResponse>>(`${this.base}/${id}`);
  }

  create(req: GalleryRequest): Observable<ApiResponse<GalleryResponse>> {
    return this.http.post<ApiResponse<GalleryResponse>>(this.base, req);
  }

  update(id: number, req: GalleryRequest): Observable<ApiResponse<GalleryResponse>> {
    return this.http.put<ApiResponse<GalleryResponse>>(`${this.base}/${id}`, req);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`);
  }

  setFeatured(id: number, featured: boolean, displayOrder?: number): Observable<ApiResponse<GalleryResponse>> {
    let params = new HttpParams().set('featured', featured);
    if (displayOrder !== undefined) params = params.set('displayOrder', displayOrder);
    return this.http.patch<ApiResponse<GalleryResponse>>(`${this.base}/${id}/featured`, null, { params });
  }
}
