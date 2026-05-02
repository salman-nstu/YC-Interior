import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.model';
import { Statistic } from '../models/statistic.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  private apiUrl = `${environment.apiUrl}/api/statistics`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Statistic[]>> {
    return this.http.get<ApiResponse<Statistic[]>>(this.apiUrl);
  }

  getById(id: number): Observable<ApiResponse<Statistic>> {
    return this.http.get<ApiResponse<Statistic>>(`${this.apiUrl}/${id}`);
  }
}
