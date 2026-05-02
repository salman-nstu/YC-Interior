import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.model';
import { ImpactStatistics } from '../models/impact.model';

@Injectable({
  providedIn: 'root'
})
export class ImpactService {
  private apiUrl = `${environment.apiUrl}/api/impact`;

  constructor(private http: HttpClient) {}

  getStatistics(): Observable<ApiResponse<ImpactStatistics>> {
    return this.http.get<ApiResponse<ImpactStatistics>>(this.apiUrl);
  }
}
