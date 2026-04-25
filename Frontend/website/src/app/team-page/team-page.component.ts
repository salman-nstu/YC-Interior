import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { TeamMemberService } from '../shared/services/team-member.service';
import { TeamMember } from '../shared/models/team-member.model';
import { ApiResponse, PageResponse } from '../shared/models/api.model';

@Component({
  selector: 'app-team-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="team-page">
      <div class="container">
        <h1 class="page-title">MEET OUR<br>TEAM MEMBERS</h1>
        
        <div class="team-grid" *ngIf="!loading && teamMembers.length > 0">
          <div class="team-card" *ngFor="let member of teamMembers">
            <div class="member-image">
              <img [src]="member.media?.url" [alt]="member.name" />
            </div>
            <div class="member-info">
              <h3 class="member-name">{{ member.name }}</h3>
              <p class="member-designation">{{ member.designation }}</p>
            </div>
          </div>
        </div>
        
        <div class="loading-state" *ngIf="loading">
          <p>Loading team members...</p>
        </div>
        
        <div class="empty-state" *ngIf="!loading && teamMembers.length === 0">
          <p>No team members available at the moment.</p>
        </div>
      </div>
    </div>
    
    <app-footer></app-footer>
  `,
  styles: [`
    .team-page {
      background-color: #D4D9C8;
      min-height: 100vh;
      padding: 80px 0;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 60px;
    }

    .page-title {
      font-family: 'Ade', serif;
      font-size: 96px;
      font-weight: 400;
      color: #2C3E2F;
      margin-bottom: 60px;
      line-height: 1.1;
      letter-spacing: 2px;
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
    }

    .team-card {
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: translateY(-8px);
      }
    }

    .member-image {
      width: 100%;
      aspect-ratio: 3/4;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      margin-bottom: 20px;
      background-color: #e5e5e5;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
      }
    }

    .team-card:hover .member-image img {
      transform: scale(1.05);
    }

    .member-info {
      text-align: center;
      padding: 0 10px;
    }

    .member-name {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 24px;
      font-weight: 600;
      color: #2C3E2F;
      margin: 0 0 8px 0;
    }

    .member-designation {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 16px;
      font-weight: 400;
      color: #5A6B5C;
      margin: 0;
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

      .team-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 30px;
      }

      .page-title {
        font-size: 64px;
      }
    }

    @media (max-width: 768px) {
      .team-page {
        padding: 60px 0;
      }

      .container {
        padding: 0 20px;
      }

      .team-grid {
        grid-template-columns: 1fr;
        gap: 40px;
      }

      .page-title {
        font-size: 48px;
        margin-bottom: 40px;
      }

      .member-name {
        font-size: 22px;
      }

      .member-designation {
        font-size: 15px;
      }
    }
  `]
})
export class TeamPageComponent implements OnInit {
  teamMembers: TeamMember[] = [];
  loading = true;

  constructor(
    private teamMemberService: TeamMemberService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'auto' });
    this.loadTeamMembers();
  }

  loadTeamMembers() {
    this.loading = true;
    this.teamMemberService.getAllTeamMembers().subscribe({
      next: (response: ApiResponse<PageResponse<TeamMember>>) => {
        if (response.success && response.data) {
          this.teamMembers = response.data.content;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading team members:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
