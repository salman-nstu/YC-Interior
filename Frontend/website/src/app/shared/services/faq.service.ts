import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api.model';
import { FAQ } from '../models/faq.model';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private apiUrl = `${environment.apiUrl}/api/faqs`;

  constructor(private http: HttpClient) {}

  getAllFaqs(): Observable<ApiResponse<FAQ[]>> {
    return this.http.get<ApiResponse<FAQ[]>>(this.apiUrl);
  }
}
