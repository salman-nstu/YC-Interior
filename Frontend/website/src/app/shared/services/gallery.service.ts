import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api.model';
import { GalleryImage } from '../models/gallery.model';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private apiUrl = `${environment.apiUrl}/api/gallery`;

  constructor(private http: HttpClient) {}

  getFeaturedImages(): Observable<ApiResponse<GalleryImage[]>> {
    return this.http.get<ApiResponse<GalleryImage[]>>(`${this.apiUrl}/featured`);
  }
}
