import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from './base-crud.service';
import { TeamMemberResponse, TeamMemberRequest } from '../models/misc.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TeamService extends BaseCrudService<TeamMemberResponse, TeamMemberRequest> {
  protected readonly endpoint = `${environment.apiUrl}/api/team`;

  constructor(http: HttpClient) {
    super(http);
  }
}