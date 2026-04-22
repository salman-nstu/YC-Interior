import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api.model';
import { AboutUs } from '../models/about.model';

@Injectable({
  providedIn: 'root'
})
export class AboutService {
  private apiUrl = `${environment.apiUrl}/api/about`;

  constructor(private http: HttpClient) {}

  getAbout(): Observable<ApiResponse<AboutUs>> {
    return this.http.get<ApiResponse<AboutUs>>(this.apiUrl);
  }
}
