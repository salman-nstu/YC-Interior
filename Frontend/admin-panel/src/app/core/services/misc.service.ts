import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PageResponse } from '../models/api.model';
import {
  SettingsResponse, SettingsRequest,
  FaqResponse, FaqRequest,
  ClientResponse, ClientRequest,
  ReviewResponse, ReviewRequest,
  TeamMemberResponse, TeamMemberRequest,
  PostResponse, PostRequest, PostCategory,
  ContactMessageResponse,
  AboutSectionResponse, AboutSectionRequest,
  StatisticResponse, StatisticRequest
} from '../models/misc.model';import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MiscService {
  constructor(private http: HttpClient) {}

  // ─── Settings ───────────────────────────────────────────────────────────────
  getSettings(): Observable<ApiResponse<SettingsResponse>> {
    return this.http.get<ApiResponse<SettingsResponse>>(`${environment.apiUrl}/api/settings`);
  }
  updateSettings(req: SettingsRequest): Observable<ApiResponse<SettingsResponse>> {
    return this.http.put<ApiResponse<SettingsResponse>>(`${environment.apiUrl}/api/settings`, req);
  }

  // ─── FAQ ────────────────────────────────────────────────────────────────────
  getFaqs(keyword?: string, page = 0, size = 10): Observable<ApiResponse<PageResponse<FaqResponse>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (keyword) params = params.set('keyword', keyword);
    return this.http.get<ApiResponse<PageResponse<FaqResponse>>>(`${environment.apiUrl}/api/faqs`, { params });
  }
  createFaq(req: FaqRequest): Observable<ApiResponse<FaqResponse>> {
    return this.http.post<ApiResponse<FaqResponse>>(`${environment.apiUrl}/api/faqs`, req);
  }
  updateFaq(id: number, req: FaqRequest): Observable<ApiResponse<FaqResponse>> {
    return this.http.put<ApiResponse<FaqResponse>>(`${environment.apiUrl}/api/faqs/${id}`, req);
  }
  deleteFaq(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/api/faqs/${id}`);
  }

  // ─── Clients ────────────────────────────────────────────────────────────────
  getClients(keyword?: string, page = 0, size = 10): Observable<ApiResponse<PageResponse<ClientResponse>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (keyword) params = params.set('keyword', keyword);
    return this.http.get<ApiResponse<PageResponse<ClientResponse>>>(`${environment.apiUrl}/api/clients`, { params });
  }
  createClient(req: ClientRequest): Observable<ApiResponse<ClientResponse>> {
    return this.http.post<ApiResponse<ClientResponse>>(`${environment.apiUrl}/api/clients`, req);
  }
  updateClient(id: number, req: ClientRequest): Observable<ApiResponse<ClientResponse>> {
    return this.http.put<ApiResponse<ClientResponse>>(`${environment.apiUrl}/api/clients/${id}`, req);
  }
  deleteClient(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/api/clients/${id}`);
  }

  // ─── Reviews ────────────────────────────────────────────────────────────────
  getReviews(page = 0, size = 10): Observable<ApiResponse<PageResponse<ReviewResponse>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<ReviewResponse>>>(`${environment.apiUrl}/api/reviews`, { params });
  }
  createReview(req: ReviewRequest): Observable<ApiResponse<ReviewResponse>> {
    return this.http.post<ApiResponse<ReviewResponse>>(`${environment.apiUrl}/api/reviews`, req);
  }
  updateReview(id: number, req: ReviewRequest): Observable<ApiResponse<ReviewResponse>> {
    return this.http.put<ApiResponse<ReviewResponse>>(`${environment.apiUrl}/api/reviews/${id}`, req);
  }
  deleteReview(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/api/reviews/${id}`);
  }

  // ─── Team Members ───────────────────────────────────────────────────────────
  getTeamMembers(page = 0, size = 10): Observable<ApiResponse<PageResponse<TeamMemberResponse>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<TeamMemberResponse>>>(`${environment.apiUrl}/api/team`, { params });
  }
  createTeamMember(req: TeamMemberRequest): Observable<ApiResponse<TeamMemberResponse>> {
    return this.http.post<ApiResponse<TeamMemberResponse>>(`${environment.apiUrl}/api/team`, req);
  }
  updateTeamMember(id: number, req: TeamMemberRequest): Observable<ApiResponse<TeamMemberResponse>> {
    return this.http.put<ApiResponse<TeamMemberResponse>>(`${environment.apiUrl}/api/team/${id}`, req);
  }
  deleteTeamMember(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/api/team/${id}`);
  }

  // ─── Posts ──────────────────────────────────────────────────────────────────
  getPosts(keyword?: string, status?: string, categoryId?: number, page = 0, size = 10): Observable<ApiResponse<PageResponse<PostResponse>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (keyword) params = params.set('keyword', keyword);
    if (status) params = params.set('status', status);
    if (categoryId) params = params.set('categoryId', categoryId);
    return this.http.get<ApiResponse<PageResponse<PostResponse>>>(`${environment.apiUrl}/api/posts`, { params });
  }
  createPost(req: PostRequest): Observable<ApiResponse<PostResponse>> {
    return this.http.post<ApiResponse<PostResponse>>(`${environment.apiUrl}/api/posts`, req);
  }
  updatePost(id: number, req: PostRequest): Observable<ApiResponse<PostResponse>> {
    return this.http.put<ApiResponse<PostResponse>>(`${environment.apiUrl}/api/posts/${id}`, req);
  }
  deletePost(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/api/posts/${id}`);
  }
  getPostCategories(): Observable<ApiResponse<PostCategory[]>> {
    return this.http.get<ApiResponse<PostCategory[]>>(`${environment.apiUrl}/api/post-categories/list`);
  }
  createPostCategory(name: string): Observable<ApiResponse<PostCategory>> {
    return this.http.post<ApiResponse<PostCategory>>(`${environment.apiUrl}/api/post-categories`, { name });
  }
  deletePostCategory(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/api/post-categories/${id}`);
  }

  // ─── Contact Messages ───────────────────────────────────────────────────────
  getMessages(isRead?: boolean, page = 0, size = 10): Observable<ApiResponse<PageResponse<ContactMessageResponse>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (isRead !== undefined) params = params.set('isRead', isRead);
    return this.http.get<ApiResponse<PageResponse<ContactMessageResponse>>>(`${environment.apiUrl}/api/contact-messages`, { params });
  }
  markRead(id: number): Observable<ApiResponse<ContactMessageResponse>> {
    return this.http.patch<ApiResponse<ContactMessageResponse>>(`${environment.apiUrl}/api/contact-messages/${id}/read`, null);
  }
  deleteMessage(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/api/contact-messages/${id}`);
  }

  // ─── About Sections ─────────────────────────────────────────────────────────
  getAboutSections(): Observable<ApiResponse<PageResponse<AboutSectionResponse>>> {
    return this.http.get<ApiResponse<PageResponse<AboutSectionResponse>>>(`${environment.apiUrl}/api/about?size=20`);
  }
  createAboutSection(req: AboutSectionRequest): Observable<ApiResponse<AboutSectionResponse>> {
    return this.http.post<ApiResponse<AboutSectionResponse>>(`${environment.apiUrl}/api/about`, req);
  }
  updateAboutSection(id: number, req: AboutSectionRequest): Observable<ApiResponse<AboutSectionResponse>> {
    return this.http.put<ApiResponse<AboutSectionResponse>>(`${environment.apiUrl}/api/about/${id}`, req);
  }
  deleteAboutSection(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/api/about/${id}`);
  }

  // ─── Statistics ─────────────────────────────────────────────────────────────
  getStatistics(): Observable<ApiResponse<StatisticResponse[]>> {
    return this.http.get<ApiResponse<StatisticResponse[]>>(`${environment.apiUrl}/api/statistics`);
  }
  createStatistic(req: StatisticRequest): Observable<ApiResponse<StatisticResponse>> {
    return this.http.post<ApiResponse<StatisticResponse>>(`${environment.apiUrl}/api/statistics`, req);
  }
  updateStatistic(id: number, req: StatisticRequest): Observable<ApiResponse<StatisticResponse>> {
    return this.http.put<ApiResponse<StatisticResponse>>(`${environment.apiUrl}/api/statistics/${id}`, req);
  }
  deleteStatistic(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/api/statistics/${id}`);
  }
}
