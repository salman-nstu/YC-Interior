import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { PostService } from '../shared/services/post.service';
import { Post } from '../shared/models/post.model';
import { ApiResponse, PageResponse } from '../shared/models/api.model';

@Component({
  selector: 'app-blogs-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="blogs-page">
      <div class="container">
        <div class="header-section">
          <h1 class="page-title">BLOGS</h1>
          <p class="page-subtitle">Dive into the world interior and buildings, exploring the latest trends, regulations and best practices that drive responsible business operations.</p>
        </div>
        
        <div class="blogs-grid" *ngIf="!loading && posts.length > 0">
          <div class="blog-card" *ngFor="let post of posts" (click)="navigateToBlog(post.id)">
            <div class="blog-image">
              <img [src]="post.coverMedia?.url" [alt]="post.title" />
              <div class="blog-overlay">
                <div class="read-more-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 8 16 12 12 16"></polyline>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </div>
              </div>
            </div>
            <div class="blog-info">
              <h3 class="blog-title">{{ post.title }}</h3>
              <div class="blog-meta">
                <span class="blog-date">{{ formatDate(post.publishedAt || post.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="loading-state" *ngIf="loading">
          <p>Loading blogs...</p>
        </div>
        
        <div class="empty-state" *ngIf="!loading && posts.length === 0">
          <p>No blog posts available at the moment.</p>
        </div>
      </div>
    </div>
    
    <app-footer></app-footer>
  `,
  styles: [`
    .blogs-page {
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

    .header-section {
      margin-bottom: 60px;
    }

    .page-title {
      font-family: 'Ade', serif;
      font-size: 96px;
      font-weight: 400;
      color: #2C3E2F;
      margin: 0 0 20px 0;
      line-height: 1.1;
      letter-spacing: 2px;
    }

    .page-subtitle {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 18px;
      font-weight: 400;
      color: #5A6B5C;
      margin: 0;
      max-width: 900px;
      line-height: 1.6;
    }

    .blogs-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
    }

    .blog-card {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
      }
    }

    .blog-image {
      width: 100%;
      aspect-ratio: 16/10;
      overflow: hidden;
      position: relative;
      background-color: #e5e5e5;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
      }
    }

    .blog-overlay {
      position: absolute;
      inset: 0;
      background: rgba(70, 86, 59, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .blog-card:hover .blog-overlay {
      opacity: 1;
    }

    .blog-card:hover .blog-image img {
      transform: scale(1.05);
    }

    .read-more-icon {
      width: 60px;
      height: 60px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #46563B;
      transform: scale(0.8);
      transition: transform 0.3s ease;
    }

    .blog-card:hover .read-more-icon {
      transform: scale(1);
    }

    .blog-info {
      padding: 24px;
    }

    .blog-title {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 22px;
      font-weight: 600;
      color: #2C3E2F;
      margin: 0 0 12px 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .blog-meta {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .blog-date {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 14px;
      color: #7A8A7C;
    }

    .loading-state,
    .empty-state {
      text-align: center;
      padding: 80px 20px;
      font-size: 18px;
      color: #2C3E2F;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .container {
        padding: 0 40px;
      }

      .blogs-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 30px;
      }

      .page-title {
        font-size: 64px;
      }
    }

    @media (max-width: 768px) {
      .blogs-page {
        padding: 60px 0;
      }

      .container {
        padding: 0 20px;
      }

      .blogs-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .page-title {
        font-size: 48px;
      }

      .page-subtitle {
        font-size: 16px;
      }

      .header-section {
        margin-bottom: 40px;
      }

      .blog-info {
        padding: 20px;
      }

      .blog-title {
        font-size: 20px;
      }
    }
  `]
})
export class BlogsPageComponent implements OnInit {
  posts: Post[] = [];
  loading = true;

  constructor(
    private postService: PostService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'auto' });
    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;
    this.postService.getAllPosts().subscribe({
      next: (response: ApiResponse<PageResponse<Post>>) => {
        if (response.success && response.data) {
          this.posts = response.data.content;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading posts:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  navigateToBlog(postId: number) {
    this.router.navigate(['/blogs', postId]);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}
