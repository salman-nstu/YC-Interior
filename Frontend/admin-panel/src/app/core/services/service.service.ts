import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from './base-crud.service';
import { ServiceResponse, ServiceRequest } from '../models/service.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ServiceService extends BaseCrudService<ServiceResponse, ServiceRequest> {
  protected readonly endpoint = `${environment.apiUrl}/api/services`;

  constructor(http: HttpClient) {
    super(http);
  }
}
