package com.yc.interior.service.impl;

import com.yc.interior.dto.response.DashboardStatsResponse;
import com.yc.interior.entity.Project;
import com.yc.interior.repository.*;
import com.yc.interior.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ProjectRepository projectRepository;
    private final ServiceRepository serviceRepository;
    private final GalleryRepository galleryRepository;
    private final ClientRepository clientRepository;
    private final ReviewRepository reviewRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final PostRepository postRepository;
    private final ContactMessageRepository contactMessageRepository;

    @Override
    public DashboardStatsResponse getStats() {
        return DashboardStatsResponse.builder()
                .totalProjects(projectRepository.countByDeletedAtIsNull())
                .publishedProjects(projectRepository.countByStatusAndDeletedAtIsNull(Project.ProjectStatus.published))
                .draftProjects(projectRepository.countByStatusAndDeletedAtIsNull(Project.ProjectStatus.draft))
                .featuredProjects(projectRepository.countByIsFeaturedAndDeletedAtIsNull(true))
                .totalServices(serviceRepository.count())
                .totalGallery(galleryRepository.count())
                .featuredGallery(galleryRepository.countByIsFeaturedTrue())
                .totalClients(clientRepository.count())
                .totalReviews(reviewRepository.count())
                .totalTeamMembers(teamMemberRepository.count())
                .totalPosts(postRepository.count())
                .unreadMessages(contactMessageRepository.countByIsReadFalse())
                .build();
    }
}
