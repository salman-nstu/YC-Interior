import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SettingsResponse } from '../models/misc.model';
import { FaviconService } from './favicon.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsStateService {
  private faviconService = inject(FaviconService);
  private settingsSubject = new BehaviorSubject<SettingsResponse | null>(null);
  public settings$: Observable<SettingsResponse | null> = this.settingsSubject.asObservable();

  updateSettings(settings: SettingsResponse) {
    this.settingsSubject.next(settings);
    
    // Update favicon if available
    if (settings?.faviconMedia?.url) {
      this.faviconService.setFavicon(settings.faviconMedia.url);
    } else {
      this.faviconService.resetFavicon();
    }
  }

  getSettings(): SettingsResponse | null {
    return this.settingsSubject.value;
  }
}
