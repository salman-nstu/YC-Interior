import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api.model';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/api/reviews`;

  constructor(private http: HttpClient) {}

  getAllReviews(): Observable<ApiResponse<any>> {
    // Get all featured reviews with a large page size
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}?featured=true&page=0&size=100`);
  }
}
