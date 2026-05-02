import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { PostService } from '../shared/services/post.service';
import { Post } from '../shared/models/post.model';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="blog-detail-page">
      <div class="container">
        <div *ngIf="!loading && post" class="blog-content">
          <!-- Top Section: Info and Cover Image -->
          <div class="blog-header">
            <div class="blog-info">
              <h1 class="blog-title">{{ post.title }}</h1>
              
              <div class="blog-meta">
                <span class="blog-date">{{ formatDate(post.publishedAt || post.createdAt) }}</span>
                <span class="blog-category" *ngIf="post.category">{{ post.category.name }}</span>
              </div>
              
              <div class="blog-description">
                <p>{{ post.description }}</p>
              </div>
            </div>
            
            <div class="blog-cover">
              <img [src]="post.coverMedia?.url" [alt]="post.title" />
            </div>
          </div>
          
          <!-- Suggested Posts Section -->
          <div class="suggested-posts" *ngIf="suggestedPosts.length > 0">
            <h2 class="suggested-title">More Articles to Read</h2>
            
            <div class="suggested-grid">
              <div class="suggested-card" *ngFor="let suggestedPost of suggestedPosts" (click)="navigateToBlog(suggestedPost.id)">
                <div class="suggested-image">
                  <img [src]="suggestedPost.coverMedia?.url" [alt]="suggestedPost.title" />
                  <div class="suggested-overlay">
                    <div class="read-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 8 16 12 12 16"></polyline>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="suggested-info">
                  <h3 class="suggested-post-title">{{ suggestedPost.title }}</h3>
                  <span class="suggested-date">{{ formatDate(suggestedPost.publishedAt || suggestedPost.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="loading-state" *ngIf="loading">
          <p>Loading blog post...</p>
        </div>
        
        <div class="error-state" *ngIf="!loading && !post">
          <p>Blog post not found.</p>
        </div>
      </div>
    </div>
    
    <app-footer></app-footer>
  `,
  styles: [`
    .blog-detail-page {
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

    .blog-content {
      display: flex;
      flex-direction: column;
      gap: 80px;
    }

    /* Header Section */
    .blog-header {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: start;
    }

    .blog-info {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .blog-title {
      font-family: 'Ade', serif;
      font-size: 48px;
      font-weight: 400;
      color: #2C3E2F;
      margin: 0;
      line-height: 1.2;
    }

    .blog-meta {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .blog-date {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 16px;
      color: #7A8A7C;
    }

    .blog-category {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #46563B;
      background-color: #B8C5A8;
      padding: 6px 16px;
      border-radius: 20px;
    }

    .blog-description {
      margin-top: 20px;
      padding-left: 20px;
      border-left: 4px solid #B8C5A8;
      
      p {
        font-family: 'Sofia Sans', sans-serif;
        font-size: 17px;
        line-height: 1.8;
        color: #2d2d2d;
        margin: 0;
        white-space: pre-wrap;
      }
    }

    .blog-cover {
      width: 100%;
      height: 100%;
      min-height: 400px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    /* Suggested Posts Section */
    .suggested-posts {
      margin-top: 20px;
    }

    .suggested-title {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 32px;
      font-weight: 600;
      color: #2C3E2F;
      margin: 0 0 40px 0;
    }

    .suggested-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }

    .suggested-card {
      background: #CFD0AE;
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      
      &:hover {
        transform: translateY(-6px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }
    }

    .suggested-image {
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

    .suggested-overlay {
      position: absolute;
      inset: 0;
      background: rgba(70, 86, 59, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .suggested-card:hover .suggested-overlay {
      opacity: 1;
    }

    .suggested-card:hover .suggested-image img {
      transform: scale(1.05);
    }

    .read-icon {
      width: 50px;
      height: 50px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #46563B;
      transform: scale(0.8);
      transition: transform 0.3s ease;
    }

    .suggested-card:hover .read-icon {
      transform: scale(1);
    }

    .suggested-info {
      padding: 20px;
    }

    .suggested-post-title {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 18px;
      font-weight: 600;
      color: #2C3E2F;
      margin: 0 0 8px 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .suggested-date {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 13px;
      color: #7A8A7C;
    }

    .loading-state,
    .error-state {
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

      .blog-header {
        grid-template-columns: 1fr;
        gap: 40px;
      }

      .blog-title {
        font-size: 40px;
      }

      .suggested-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }
    }

    @media (max-width: 768px) {
      .blog-detail-page {
        padding: 60px 0;
      }

      .container {
        padding: 0 20px;
      }

      .blog-content {
        gap: 60px;
      }

      .blog-title {
        font-size: 32px;
      }

      .blog-meta {
        font-size: 14px;
      }

      .blog-description p {
        font-size: 15px;
      }

      .blog-cover {
        min-height: 300px;
      }

      .suggested-title {
        font-size: 28px;
        margin-bottom: 30px;
      }

      .suggested-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .suggested-info {
        padding: 16px;
      }

      .suggested-post-title {
        font-size: 17px;
      }
    }
  `]
})
export class BlogDetailComponent implements OnInit {
  post: Post | null = null;
  suggestedPosts: Post[] = [];
  loading = true;
  postId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'auto' });
    
    this.route.params.subscribe(params => {
      this.postId = +params['id'];
      if (this.postId) {
        this.loadPost();
      }
    });
  }

  loadPost() {
    this.loading = true;
    this.postService.getPostById(this.postId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.post = response.data;
          this.loadSuggestedPosts();
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading post:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadSuggestedPosts() {
    this.postService.getSuggestedPosts(this.postId, 3).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Filter out the current post and limit to 3
          this.suggestedPosts = response.data.content
            .filter(p => p.id !== this.postId)
            .slice(0, 3);
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading suggested posts:', error);
      }
    });
  }

  navigateToBlog(postId: number) {
    this.router.navigate(['/blogs', postId]).then(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
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
