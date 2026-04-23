import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api.model';
import { ApplicationSettings } from '../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = `${environment.apiUrl}/api/settings`;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {}

  getSettings(): Observable<ApiResponse<ApplicationSettings>> {
    return this.http.get<ApiResponse<ApplicationSettings>>(this.apiUrl).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.updateFavicon(response.data);
          this.updateTitle(response.data);
        }
      })
    );
  }

  private updateFavicon(settings: ApplicationSettings): void {
    if (settings.faviconMedia && settings.faviconMedia.url) {
      const link: HTMLLinkElement = this.document.querySelector("link[rel*='icon']") || this.document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'icon';
      link.href = settings.faviconMedia.url;
      
      if (!this.document.querySelector("link[rel*='icon']")) {
        this.document.getElementsByTagName('head')[0].appendChild(link);
      }
    }
  }

  private updateTitle(settings: ApplicationSettings): void {
    if (settings.siteName) {
      this.document.title = settings.siteName;
    }
  }
}
