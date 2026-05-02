import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PageResponse } from '../models/api.model';
import { GalleryImage } from '../models/gallery.model';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private apiUrl = `${environment.apiUrl}/api/gallery`;

  constructor(private http: HttpClient) {}

  getFeaturedImages(): Observable<ApiResponse<PageResponse<GalleryImage>>> {
    return this.http.get<ApiResponse<PageResponse<GalleryImage>>>(`${this.apiUrl}?featured=true&size=10`);
  }

  getAllImages(page: number = 0, size: number = 12): Observable<ApiResponse<PageResponse<GalleryImage>>> {
    return this.http.get<ApiResponse<PageResponse<GalleryImage>>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }
}
