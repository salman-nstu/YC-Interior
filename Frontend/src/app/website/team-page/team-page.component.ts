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
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    .team-card {
      background-color: transparent;
      border-radius: 24px;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
      }
    }

    .member-image {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 50%;
      overflow: hidden;
      margin: 20px auto;
      background-color: #e5e5e5;
      max-width: 200px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
    }

    .team-card:hover .member-image img {
      transform: scale(1.05);
    }

    .member-info {
      background-color: #CFD0AE;
      padding: 20px;
      text-align: center;
      margin-top: auto;
    }

    .member-name {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 18px;
      font-weight: 600;
      color: #2C3E2F;
      margin: 0 0 8px 0;
      line-height: 1.3;
    }

    .member-designation {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 14px;
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
    @media (max-width: 1200px) {
      .team-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 968px) {
      .container {
        padding: 0 40px;
      }

      .team-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }

      .page-title {
        font-size: 64px;
      }

      .member-name {
        font-size: 16px;
      }

      .member-designation {
        font-size: 13px;
      }
    }

    @media (max-width: 576px) {
      .team-page {
        padding: 60px 0;
      }

      .container {
        padding: 0 20px;
      }

      .team-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .page-title {
        font-size: 48px;
        margin-bottom: 40px;
      }

      .member-info {
        padding: 16px;
      }

      .member-name {
        font-size: 15px;
      }

      .member-designation {
        font-size: 12px;
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
