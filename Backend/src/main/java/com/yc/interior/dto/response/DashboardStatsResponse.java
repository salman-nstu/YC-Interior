package com.yc.interior.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardStatsResponse {
    private long totalProjects;
    private long publishedProjects;
    private long draftProjects;
    private long featuredProjects;
    private long totalServices;
    private long totalGallery;
    private long featuredGallery;
    private long totalClients;
    private long totalReviews;
    private long totalTeamMembers;
    private long totalPosts;
    private long unreadMessages;
}
