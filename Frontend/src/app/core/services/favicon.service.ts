import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FaviconService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  setFavicon(faviconUrl: string) {
    const link: HTMLLinkElement = this.document.querySelector("link[rel*='icon']") || this.document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = faviconUrl;
    
    // Remove existing favicon links
    const existingLinks = this.document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach(el => el.remove());
    
    // Add the new favicon
    this.document.head.appendChild(link);
  }

  resetFavicon() {
    const link: HTMLLinkElement = this.document.querySelector("link[rel*='icon']") || this.document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = '/favicon.ico';
    
    const existingLinks = this.document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach(el => el.remove());
    
    this.document.head.appendChild(link);
  }
}
