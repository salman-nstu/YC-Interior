import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, PageResponse } from '../models/api.model';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/api/posts`;

  constructor(private http: HttpClient) {}

  getAllPosts(page: number = 0, size: number = 100): Observable<ApiResponse<PageResponse<Post>>> {
    return this.http.get<ApiResponse<PageResponse<Post>>>(`${this.apiUrl}?page=${page}&size=${size}&status=published`);
  }

  getPostById(id: number): Observable<ApiResponse<Post>> {
    return this.http.get<ApiResponse<Post>>(`${this.apiUrl}/${id}`);
  }

  getSuggestedPosts(excludeId: number, limit: number = 3): Observable<ApiResponse<PageResponse<Post>>> {
    return this.http.get<ApiResponse<PageResponse<Post>>>(`${this.apiUrl}?page=0&size=${limit + 1}&status=published`);
  }
}
