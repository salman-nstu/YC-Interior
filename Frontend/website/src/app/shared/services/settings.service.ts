import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api.model';
import { ApplicationSettings } from '../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = `${environment.apiUrl}/api/settings`;

  constructor(private http: HttpClient) {}

  getSettings(): Observable<ApiResponse<ApplicationSettings>> {
    return this.http.get<ApiResponse<ApplicationSettings>>(this.apiUrl);
  }
}
