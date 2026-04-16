import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PageResponse } from '../models/api.model';
import { environment } from '../../../environments/environment';
import {
  DashboardStats, Settings, AboutSection, Service, ProjectCategory, Project,
  Gallery, Statistic, Faq, Client, Review, TeamMember, PostCategory, Post,
  ContactMessage, Media
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ---- DASHBOARD ----
  getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.api}/api/dashboard/stats`);
  }

  // ---- MEDIA ----
  uploadMedia(file: File, category?: string, subCategory?: string, altText?: string): Observable<ApiResponse<Media>> {
    const fd = new FormData();
    fd.append('file', file);
    if (category)    fd.append('category', category);
    if (subCategory) fd.append('subCategory', subCategory);
    if (altText)     fd.append('altText', altText);
    return this.http.post<ApiResponse<Media>>(`${this.api}/media/upload`, fd);
  }

  getMediaList(category?: string, subCategory?: string, page = 0, size = 20): Observable<ApiResponse<PageResponse<Media>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (category)    params = params.set('category', category);
    if (subCategory) params = params.set('subCategory', subCategory);
    return this.http.get<ApiResponse<PageResponse<Media>>>(`${this.api}/media`, { params });
  }

  deleteMedia(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/media/${id}`);
  }

  // ---- SETTINGS ----
  getSettings(): Observable<ApiResponse<Settings>> {
    return this.http.get<ApiResponse<Settings>>(`${this.api}/api/settings`);
  }
  updateSettings(data: Partial<Settings>): Observable<ApiResponse<Settings>> {
    return this.http.put<ApiResponse<Settings>>(`${this.api}/api/settings`, data);
  }

  // ---- ABOUT ----
  getAboutSections(page = 0, size = 10): Observable<ApiResponse<PageResponse<AboutSection>>> {
    return this.http.get<ApiResponse<PageResponse<AboutSection>>>(`${this.api}/api/about?page=${page}&size=${size}`);
  }
  createAboutSection(data: any): Observable<ApiResponse<AboutSection>> {
    return this.http.post<ApiResponse<AboutSection>>(`${this.api}/api/about`, data);
  }
  updateAboutSection(id: number, data: any): Observable<ApiResponse<AboutSection>> {
    return this.http.put<ApiResponse<AboutSection>>(`${this.api}/api/about/${id}`, data);
  }
  deleteAboutSection(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/api/about/${id}`);
  }

  // ---- SERVICES ----
  getServices(keyword?: string, status?: string, page = 0, size = 10): Observable<ApiResponse<PageResponse<Service>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (keyword) params = params.set('keyword', keyword);
    if (status)  params = params.set('status', status);
    return this.http.get<ApiResponse<PageResponse<Service>>>(`${this.api}/api/services`, { params });
  }
  getService(id: number): Observable<ApiResponse<Service>> {
    return this.http.get<ApiResponse<Service>>(`${this.api}/api/services/${id}`);
  }
  createService(data: any): Observable<ApiResponse<Service>> {
    return this.http.post<ApiResponse<Service>>(`${this.api}/api/services`, data);
  }
  updateService(id: number, data: any): Observable<ApiResponse<Service>> {
    return this.http.put<ApiResponse<Service>>(`${this.api}/api/services/${id}`, data);
  }
  deleteService(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/api/services/${id}`);
  }

  // ---- PROJECT CATEGORIES ----
  getProjectCategories(page = 0, size = 20): Observable<ApiResponse<PageResponse<ProjectCategory>>> {
    return this.http.get<ApiResponse<PageResponse<ProjectCategory>>>(`${this.api}/api/project-categories?page=${page}&size=${size}`);
  }
  getProjectCategoriesList(): Observable<ApiResponse<ProjectCategory[]>> {
    return this.http.get<ApiResponse<ProjectCategory[]>>(`${this.api}/api/project-categories/list`);
  }
  createProjectCategory(data: any): Observable<ApiResponse<ProjectCategory>> {
    return this.http.post<ApiResponse<ProjectCategory>>(`${this.api}/api/project-categories`, data);
  }
  updateProjectCategory(id: number, data: any): Observable<ApiResponse<ProjectCategory>> {
    return this.http.put<ApiResponse<ProjectCategory>>(`${this.api}/api/project-categories/${id}`, data);
  }
  deleteProjectCategory(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/api/project-categories/${id}`);
  }

  // ---- PROJECTS ----
  getProjects(keyword?: string, status?: string, categoryId?: number, featured?: boolean, page = 0, size = 10): Observable<ApiResponse<PageResponse<Project>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (keyword)    params = params.set('keyword', keyword);
    if (status)     params = params.set('status', status);
    if (categoryId) params = params.set('categoryId', categoryId);
    if (featured !== undefined) params = params.set('featured', featured);
    return this.http.get<ApiResponse<PageResponse<Project>>>(`${this.api}/api/projects`, { params });
  }
  getProject(id: number): Observable<ApiResponse<Project>> {
    return this.http.get<ApiResponse<Project>>(`${this.api}/api/projects/${id}`);
  }
  createProject(data: any): Observable<ApiResponse<Project>> {
    return this.http.post<ApiResponse<Project>>(`${this.api}/api/projects`, data);
  }
  updateProject(id: number, data: any): Observable<ApiResponse<Project>> {
    return this.http.put<ApiResponse<Project>>(`${this.api}/api/projects/${id}`, data);
  }
  deleteProject(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/api/projects/${id}`);
  }
  setProjectFeatured(id: number, featured: boolean, displayOrder?: number): Observable<ApiResponse<Project>> {
    let params = new HttpParams().set('featured', featured);
    if (displayOrder !== undefined) params = params.set('displayOrder', displayOrder);
    return this.http.patch<ApiResponse<Project>>(`${this.api}/api/projects/${id}/featured`, null, { params });
  }

  // ---- GALLERY ----
  getGallery(keyword?: string, featured?: boolean, page = 0, size = 12): Observable<ApiResponse<PageResponse<Gallery>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (keyword)  params = params.set('keyword', keyword);
    if (featured !== undefined) params = params.set('featured', featured);
    return this.http.get<ApiResponse<PageResponse<Gallery>>>(`${this.api}/api/gallery`, { params });
  }
  createGallery(data: any): Observable<ApiResponse<Gallery>> {
    return this.http.post<ApiResponse<Gallery>>(`${this.api}/api/gallery`, data);
  }
  updateGallery(id: number, data: any): Observable<ApiResponse<Gallery>> {
    return this.http.put<ApiResponse<Gallery>>(`${this.api}/api/gallery/${id}`, data);
  }
  deleteGallery(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/api/gallery/${id}`);
  }
  setGalleryFeatured(id: number, featured: boolean, displayOrder?: number): Observable<ApiResponse<Gallery>> {
    let params = new HttpParams().set('featured', featured);
    if (displayOrder !== undefined) params = params.set('displayOrder', displayOrder);
    return this.http.patch<ApiResponse<Gallery>>(`${this.api}/api/gallery/${id}/featured`, null, { params });
  }

  // ---- STATISTICS ----
  getStatistics(): Observable<ApiResponse<Statistic[]>> {
    return this.http.get<ApiResponse<Statistic[]>>(`${this.api}/api/statistics`);
  }
  createStatistic(data: any): Observable<ApiResponse<Statistic>> {
    return this.http.post<ApiResponse<Statistic>>(`${this.api}/api/statistics`, data);
  }
  updateStatistic(id: number, data: any): Observable<ApiResponse<Statistic>> {
    return this.http.put<ApiResponse<Statistic>>(`${this.api}/api/statistics/${id}`, data);
  }
  deleteStatistic(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/api/statistics/${id}`);
  }

  // ---- FAQS ----
  getFaqs(keyword?: string, page = 0, size = 10): Observable<ApiResponse<PageResponse<Faq>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (keyword) params = params.set('keyword', keyword);
    return this.http.get<ApiResponse<PageResponse<Faq>>>(`${this.api}/api/faqs`, { params });
  }
  createFaq(data: any): Observable<ApiResponse<Faq>> {
    return this.http.post<ApiResponse<Faq>>(`${this.api}/api/faqs`, data);
  }
  updateFaq(id: number, data: any): Observable<ApiResponse<Faq>> {
    return this.http.put<ApiResponse<Faq>>(`${this.api}/api/faqs/${id}`, data);
  }
  deleteFaq(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/api/faqs/${id}`);
  }

  // ---- CLIENTS ----
  getClients(keyword?: string, page = 0, size = 10): Observable<ApiResponse<PageResponse<Client>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (keyword) params = params.set('keyword', keyword);
    return this.http.get<ApiResponse<PageResponse<Client>>>(`${this.api}/api/clients`, { params });
  }
  createClient(data: any): Observable<ApiResponse<Client>> {
    return this.http.post<ApiResponse<Client>>(`${this.api}/api/clients`, data);
  }
  updateClient(id: number, data: any): Observable<ApiResponse<Client>> {
    return this.http.put<ApiResponse<Client>>(`${this.api}/api/clients/${id}`, data);
  }
  deleteClient(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/api/clients/${id}`);
  }

  // ---- REVIEWS ----
  getReviews(keyword?: string, featured?: boolean, page = 0, size = 10): Observable<ApiResponse<PageResponse<Review>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (keyword) params = params.set('keyword', keyword);
    if (featured !== undefined) params = params.set('featured', featured);
    return this.http.get<ApiResponse<PageResponse<Review>>>(`${this.api}/api/reviews`, { params });
  }
  createReview(data: any): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(`${this.api}/api/reviews`, data);
  }
  updateReview(id: number, data: any): Observable<ApiResponse<Review>> {
    return this.http.put<ApiResponse<Review>>(`${this.api}/api/reviews/${id}`, data);
  }
  deleteReview(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/api/reviews/${id}`);
  }
  setReviewFeatured(id: number, featured: boolean): Observable<ApiResponse<Review>> {
    return this.http.patch<ApiResponse<Review>>(`${this.api}/api/reviews/${id}/featured?featured=${featured}`, null);
  }

  // ---- TEAM ----
  getTeamMembers(keyword?: string, page = 0, size = 10): Observable<ApiResponse<PageResponse<TeamMember>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (keyword) params = params.set('keyword', keyword);
    return this.http.get<ApiResponse<PageResponse<TeamMember>>>(`${this.api}/api/team`, { params });
  }
  createTeamMember(data: any): Observable<ApiResponse<TeamMember>> {
    return this.http.post<ApiResponse<TeamMember>>(`${this.api}/api/team`, data);
  }
  updateTeamMember(id: number, data: any): Observable<ApiResponse<TeamMember>> {
    return this.http.put<ApiResponse<TeamMember>>(`${this.api}/api/team/${id}`, data);
  }
  deleteTeamMember(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/api/team/${id}`);
  }

  // ---- POST CATEGORIES ----
  getPostCategories(page = 0, size = 20): Observable<ApiResponse<PageResponse<PostCategory>>> {
    return this.http.get<ApiResponse<PageResponse<PostCategory>>>(`${this.api}/api/post-categories?page=${page}&size=${size}`);
  }
  getPostCategoriesList(): Observable<ApiResponse<PostCategory[]>> {
    return this.http.get<ApiResponse<PostCategory[]>>(`${this.api}/api/post-categories/list`);
  }
  createPostCategory(data: any): Observable<ApiResponse<PostCategory>> {
    return this.http.post<ApiResponse<PostCategory>>(`${this.api}/api/post-categories`, data);
  }
  updatePostCategory(id: number, data: any): Observable<ApiResponse<PostCategory>> {
    return this.http.put<ApiResponse<PostCategory>>(`${this.api}/api/post-categories/${id}`, data);
  }
  deletePostCategory(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/api/post-categories/${id}`);
  }

  // ---- POSTS ----
  getPosts(keyword?: string, status?: string, categoryId?: number, page = 0, size = 10): Observable<ApiResponse<PageResponse<Post>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (keyword)    params = params.set('keyword', keyword);
    if (status)     params = params.set('status', status);
    if (categoryId) params = params.set('categoryId', categoryId);
    return this.http.get<ApiResponse<PageResponse<Post>>>(`${this.api}/api/posts`, { params });
  }
  createPost(data: any): Observable<ApiResponse<Post>> {
    return this.http.post<ApiResponse<Post>>(`${this.api}/api/posts`, data);
  }
  updatePost(id: number, data: any): Observable<ApiResponse<Post>> {
    return this.http.put<ApiResponse<Post>>(`${this.api}/api/posts/${id}`, data);
  }
  deletePost(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/api/posts/${id}`);
  }

  // ---- CONTACT MESSAGES ----
  getContactMessages(keyword?: string, isRead?: boolean, page = 0, size = 10): Observable<ApiResponse<PageResponse<ContactMessage>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (keyword) params = params.set('keyword', keyword);
    if (isRead !== undefined) params = params.set('isRead', isRead);
    return this.http.get<ApiResponse<PageResponse<ContactMessage>>>(`${this.api}/api/contact-messages`, { params });
  }
  markMessageRead(id: number): Observable<ApiResponse<ContactMessage>> {
    return this.http.patch<ApiResponse<ContactMessage>>(`${this.api}/api/contact-messages/${id}/read`, null);
  }
  deleteContactMessage(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/api/contact-messages/${id}`);
  }
}
