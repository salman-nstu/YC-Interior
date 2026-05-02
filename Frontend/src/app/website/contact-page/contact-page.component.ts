import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { SettingsService } from '../shared/services/settings.service';
import { ContactMessageService } from '../shared/services/contact-message.service';
import { ApplicationSettings } from '../shared/models/settings.model';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="contact-page">
      <div class="container">
        <div class="contact-grid">
          <!-- Left Side: Contact Information -->
          <div class="contact-info">
            <div class="info-header">
              <p class="subtitle">WE'RE HERE TO HELP YOU</p>
              <h1 class="title">DISCUSS YOUR<br>INTERIOR<br>SOLUTIONS FOR<br>FREE</h1>
              <p class="description">REACH OUT TO US WITH YOUR CONCERNS</p>
            </div>
            
            <!-- Contact Details -->
            <div class="contact-details" *ngIf="settings">
              <!-- Email -->
              <div class="contact-item">
                <div class="icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div class="contact-text">
                  <p *ngFor="let email of getEmails()">{{ email }}</p>
                </div>
              </div>
              
              <!-- Phone -->
              <div class="contact-item">
                <div class="icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div class="contact-text">
                  <p *ngFor="let phone of getPhones()">{{ phone }}</p>
                </div>
              </div>
              
              <!-- Address -->
              <div class="contact-item">
                <div class="icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div class="contact-text">
                  <p>{{ settings.address }}</p>
                </div>
              </div>
            </div>
            
            <!-- Map -->
            <div class="map-container" *ngIf="safeMapUrl">
              <iframe 
                [src]="safeMapUrl" 
                width="100%" 
                height="300" 
                style="border:0; border-radius: 12px;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
            
            <!-- Social Media -->
            <div class="social-section" *ngIf="settings">
              <p class="social-title">FOLLOW US</p>
              <div class="social-icons">
                <div *ngIf="settings.facebookUrl" (click)="openExternalLink(settings.facebookUrl, $event)" class="social-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </div>
                <div *ngIf="settings.instagramUrl" (click)="openExternalLink(settings.instagramUrl, $event)" class="social-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div *ngIf="settings.linkedinUrl" (click)="openExternalLink(settings.linkedinUrl, $event)" class="social-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </div>
                <div *ngIf="settings.whatsappUrl" (click)="openExternalLink(settings.whatsappUrl, $event)" class="social-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </div>
                <div *ngIf="settings.youtubeUrl" (click)="openExternalLink(settings.youtubeUrl, $event)" class="social-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right Side: Contact Form -->
          <div class="contact-form-wrapper">
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form">
              <div class="form-group">
                <input 
                  type="text" 
                  formControlName="name" 
                  placeholder="Your Name"
                  [class.error]="contactForm.get('name')?.invalid && contactForm.get('name')?.touched"
                />
                <span class="error-message" *ngIf="contactForm.get('name')?.invalid && contactForm.get('name')?.touched">
                  Name is required
                </span>
              </div>
              
              <div class="form-group">
                <input 
                  type="email" 
                  formControlName="email" 
                  placeholder="Your Email"
                  [class.error]="contactForm.get('email')?.invalid && contactForm.get('email')?.touched"
                />
                <span class="error-message" *ngIf="contactForm.get('email')?.invalid && contactForm.get('email')?.touched">
                  Valid email is required
                </span>
              </div>
              
              <div class="form-group">
                <input 
                  type="tel" 
                  formControlName="phone" 
                  placeholder="Your Contact"
                  [class.error]="contactForm.get('phone')?.invalid && contactForm.get('phone')?.touched"
                />
                <span class="error-message" *ngIf="contactForm.get('phone')?.invalid && contactForm.get('phone')?.touched">
                  Phone is required
                </span>
              </div>
              
              <div class="form-group">
                <input 
                  type="text" 
                  formControlName="subject" 
                  placeholder="Subject"
                  [class.error]="contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched"
                />
                <span class="error-message" *ngIf="contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched">
                  Subject is required
                </span>
              </div>
              
              <div class="form-group">
                <textarea 
                  formControlName="message" 
                  placeholder="Message"
                  rows="6"
                  [class.error]="contactForm.get('message')?.invalid && contactForm.get('message')?.touched"
                ></textarea>
                <span class="error-message" *ngIf="contactForm.get('message')?.invalid && contactForm.get('message')?.touched">
                  Message is required
                </span>
              </div>
              
              <button type="submit" class="submit-btn" [disabled]="submitting || contactForm.invalid">
                <span *ngIf="!submitting">Send Message →</span>
                <span *ngIf="submitting">Sending...</span>
              </button>
              
              <div class="success-message" *ngIf="submitSuccess">
                Message sent successfully! We'll get back to you soon.
              </div>
              
              <div class="error-message" *ngIf="submitError">
                {{ submitError }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <app-footer></app-footer>
  `,
  styles: [`
    .contact-page {
      background-color: #D4D9C8;
      min-height: 100vh;
      padding: 80px 0;
      width: 100%;
      overflow-x: hidden;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 60px;
      width: 100%;
      box-sizing: border-box;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: start;
    }

    /* Left Side - Contact Info */
    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .info-header {
      margin-bottom: 20px;
    }

    .subtitle {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #5A6B5C;
      margin: 0 0 16px 0;
      letter-spacing: 1px;
    }

    .title {
      font-family: 'Ade', serif;
      font-size: 48px;
      font-weight: 400;
      color: #2C3E2F;
      margin: 0 0 16px 0;
      line-height: 1.2;
    }

    .description {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #5A6B5C;
      margin: 0;
      letter-spacing: 0.5px;
    }

    .contact-details {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .icon-wrapper {
      width: 48px;
      height: 48px;
      background-color: #46563B;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      
      svg {
        color: white;
      }
    }

    .contact-text {
      flex: 1;
      
      p {
        font-family: 'Sofia Sans', sans-serif;
        font-size: 16px;
        color: #2C3E2F;
        margin: 0;
        line-height: 1.6;
      }
    }

    .map-container {
      width: 100%;
      margin-top: 12px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .social-section {
      margin-top: 12px;
    }

    .social-title {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #5A6B5C;
      margin: 0 0 16px 0;
      letter-spacing: 1px;
    }

    .social-icons {
      display: flex;
      gap: 16px;
    }

    .social-icon {
      width: 44px;
      height: 44px;
      background-color: #46563B;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: all 0.3s ease;
      cursor: pointer;
      
      &:hover {
        background-color: #5a6e4a;
        transform: translateY(-2px);
      }
    }

    /* Right Side - Contact Form */
    .contact-form-wrapper {
      background: white;
      border-radius: 24px;
      padding: 48px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    input, textarea {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 16px;
      padding: 16px 20px;
      border: 2px solid #D4D9C8;
      border-radius: 12px;
      background-color: #F5F5F0;
      color: #2C3E2F;
      transition: all 0.3s ease;
      
      &::placeholder {
        color: #9AA89C;
      }
      
      &:focus {
        outline: none;
        border-color: #46563B;
        background-color: white;
      }
      
      &.error {
        border-color: #d32f2f;
      }
    }

    textarea {
      resize: vertical;
      min-height: 120px;
    }

    .error-message {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 13px;
      color: #d32f2f;
      margin-top: 4px;
    }

    .submit-btn {
      background-color: #46563B;
      color: white;
      padding: 16px 32px;
      border-radius: 12px;
      font-family: 'Sofia Sans', sans-serif;
      font-size: 16px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 8px;
      
      &:hover:not(:disabled) {
        background-color: #5a6e4a;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(70, 86, 59, 0.3);
      }
      
      &:disabled {
        background-color: #a0a0a0;
        cursor: not-allowed;
        opacity: 0.6;
      }
    }

    .success-message {
      background-color: #4caf50;
      color: white;
      padding: 16px;
      border-radius: 8px;
      text-align: center;
      font-family: 'Sofia Sans', sans-serif;
      font-size: 15px;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .container {
        padding: 0 40px;
      }

      .contact-grid {
        grid-template-columns: 1fr;
        gap: 60px;
      }

      .title {
        font-size: 40px;
      }
    }

    @media (max-width: 768px) {
      .contact-page {
        padding: 60px 0;
      }

      .container {
        padding: 0 20px;
      }

      .contact-grid {
        gap: 40px;
      }

      .title {
        font-size: 32px;
      }

      .contact-form-wrapper {
        padding: 32px 24px;
      }

      .contact-form {
        gap: 20px;
      }

      input, textarea {
        padding: 14px 16px;
        font-size: 15px;
      }
    }
  `]
})
export class ContactPageComponent implements OnInit {
  settings: ApplicationSettings | null = null;
  contactForm: FormGroup;
  submitting = false;
  submitSuccess = false;
  submitError: string | null = null;
  safeMapUrl: SafeResourceUrl | null = null;

  constructor(
    private settingsService: SettingsService,
    private contactMessageService: ContactMessageService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'auto' });
    this.loadSettings();
  }

  loadSettings() {
    this.settingsService.getSettings().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.settings = response.data;
          this.safeMapUrl = this.getSafeMapUrl();
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error loading settings:', error);
      }
    });
  }

  getSafeMapUrl(): SafeResourceUrl {
    if (this.settings?.mapEmbedUrl) {
      // Extract URL from iframe HTML if full iframe tag is provided
      let url = this.settings.mapEmbedUrl;
      
      // Check if it's a full iframe HTML
      if (url.includes('<iframe')) {
        // Extract src attribute from iframe
        const srcMatch = url.match(/src=["']([^"']+)["']/);
        if (srcMatch && srcMatch[1]) {
          url = srcMatch[1];
        }
      }
      
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return '';
  }

  getEmails(): string[] {
    if (!this.settings?.email) return [];
    // Split by comma, semicolon, or newline and trim whitespace
    return this.settings.email
      .split(/[,;\n]+/)
      .map(e => e.trim())
      .filter(e => e.length > 0);
  }

  getPhones(): string[] {
    if (!this.settings?.phone) return [];
    // Split by comma, semicolon, or newline and trim whitespace
    return this.settings.phone
      .split(/[,;\n]+/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
  }

  openExternalLink(url: string, event: Event) {
    console.log('Contact page - openExternalLink called with URL:', url);
    event.preventDefault();
    event.stopPropagation();
    if (url) {
      // Add protocol if missing
      let finalUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        finalUrl = 'https://' + url;
      }
      console.log('Opening URL in new window:', finalUrl);
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    }
  }

  onSubmit() {
    if (this.contactForm.valid && !this.submitting) {
      this.submitting = true;
      this.submitSuccess = false;
      this.submitError = null;

      this.contactMessageService.submitMessage(this.contactForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.submitSuccess = true;
            this.contactForm.reset();
            setTimeout(() => {
              this.submitSuccess = false;
            }, 5000);
          }
          this.submitting = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error submitting message:', error);
          this.submitError = 'Failed to send message. Please try again.';
          this.submitting = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }
}
