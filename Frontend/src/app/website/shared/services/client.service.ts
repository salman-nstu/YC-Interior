import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.model';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/api/clients`;

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<ApiResponse<any>> {
    // Get all clients with a large page size to fetch all at once
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}?page=0&size=100`);
  }
}
