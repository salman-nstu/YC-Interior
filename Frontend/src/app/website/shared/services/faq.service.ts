import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.model';
import { FAQ } from '../models/faq.model';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private apiUrl = `${environment.apiUrl}/api/faqs`;

  constructor(private http: HttpClient) {}

  getAllFaqs(): Observable<ApiResponse<any>> {
    // Get all FAQs with a large page size to fetch all at once
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}?page=0&size=100`);
  }
}
