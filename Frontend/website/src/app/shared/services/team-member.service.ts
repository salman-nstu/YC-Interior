import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse, PageResponse } from '../models/api.model';
import { TeamMember } from '../models/team-member.model';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {
  private apiUrl = `${environment.apiUrl}/api/team`;

  constructor(private http: HttpClient) {}

  getAllTeamMembers(page: number = 0, size: number = 100): Observable<ApiResponse<PageResponse<TeamMember>>> {
    const url = `${this.apiUrl}?page=${page}&size=${size}`;
    console.log('Fetching team members from:', url);
    
    return this.http.get<ApiResponse<PageResponse<TeamMember>>>(url).pipe(
      tap(response => console.log('Team members response:', response)),
      catchError(error => {
        console.error('Error fetching team members:', error);
        throw error;
      })
    );
  }
}
