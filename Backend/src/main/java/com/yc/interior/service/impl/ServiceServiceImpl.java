package com.yc.interior.service.impl;

import com.yc.interior.dto.request.ServiceRequest;
import com.yc.interior.dto.response.MediaResponse;
import com.yc.interior.dto.response.ServiceResponse;
import com.yc.interior.entity.Service;
import com.yc.interior.entity.ServiceImage;
import com.yc.interior.exception.ResourceNotFoundException;
import com.yc.interior.repository.*;
import com.yc.interior.service.ServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceServiceImpl implements ServiceService {

    private final ServiceRepository serviceRepository;
    private final ServiceImageRepository serviceImageRepository;
    private final MediaRepository mediaRepository;
    private final MediaServiceImpl mediaService;

    @Override
    public Page<ServiceResponse> getAll(String keyword, String status, Pageable pageable) {
        Service.ServiceStatus serviceStatus = parseStatus(status);
        return serviceRepository.findAllWithFilters(keyword, serviceStatus, pageable).map(this::toResponse);
    }

    @Override
    public ServiceResponse getById(Long id) {
        return toResponse(serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", id)));
    }

    @Override
    @Transactional
    public ServiceResponse create(ServiceRequest request) {
        // Auto-assign display order (0-5 for services, max 6 featured)
        Integer displayOrder = request.getDisplayOrder();
        long currentCount = serviceRepository.count();
        
        if (displayOrder == null) {
            // Auto-increment: find max and add 1
            displayOrder = (int) Math.min(currentCount, 5); // Max order is 5 (0-5 = 6 items)
        } else if (displayOrder >= 0 && displayOrder <= 5) {
            // If order is in featured range, shift existing items
            shiftDisplayOrdersForInsertion(displayOrder);
        } else {
            // Order is beyond featured range, just use it
            displayOrder = (int) Math.max(displayOrder, 6);
        }
        
        Service entity = Service.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .coverMediaId(request.getCoverMediaId())
                .status(parseStatus(request.getStatus()) != null ? parseStatus(request.getStatus()) : Service.ServiceStatus.published)
                .displayOrder(displayOrder)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();
        if (entity.getStatus() == Service.ServiceStatus.published) entity.setPublishedAt(LocalDateTime.now());
        Service saved = serviceRepository.save(entity);
        saveImages(saved.getId(), request.getImageMediaIds());
        return toResponse(saved);
    }
    
    private void shiftDisplayOrdersForInsertion(Integer insertOrder) {
        // Get all services with order >= insertOrder and increment their order
        serviceRepository.findAll().stream()
                .filter(s -> s.getDisplayOrder() != null && s.getDisplayOrder() >= insertOrder)
                .forEach(s -> {
                    s.setDisplayOrder(s.getDisplayOrder() + 1);
                    serviceRepository.save(s);
                });
    }

    @Override
    @Transactional
    public ServiceResponse update(Long id, ServiceRequest request) {
        Service entity = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", id));
        entity.setTitle(request.getTitle());
        entity.setDescription(request.getDescription());
        entity.setCoverMediaId(request.getCoverMediaId());
        Service.ServiceStatus status = parseStatus(request.getStatus());
        if (status != null) entity.setStatus(status);
        if (entity.getStatus() == Service.ServiceStatus.published && entity.getPublishedAt() == null)
            entity.setPublishedAt(LocalDateTime.now());
        
        // Handle display order changes with shifting
        if (request.getDisplayOrder() != null) {
            Integer oldOrder = entity.getDisplayOrder();
            Integer newOrder = request.getDisplayOrder();
            
            if (oldOrder != null && !oldOrder.equals(newOrder)) {
                if (newOrder < oldOrder) {
                    // Shift items between newOrder and oldOrder up by 1
                    serviceRepository.findAll().stream()
                            .filter(s -> s.getDisplayOrder() != null && s.getDisplayOrder() >= newOrder && s.getDisplayOrder() < oldOrder && !s.getId().equals(id))
                            .forEach(s -> {
                                s.setDisplayOrder(s.getDisplayOrder() + 1);
                                serviceRepository.save(s);
                            });
                } else if (newOrder > oldOrder) {
                    // Shift items between oldOrder and newOrder down by 1
                    serviceRepository.findAll().stream()
                            .filter(s -> s.getDisplayOrder() != null && s.getDisplayOrder() > oldOrder && s.getDisplayOrder() <= newOrder && !s.getId().equals(id))
                            .forEach(s -> {
                                s.setDisplayOrder(s.getDisplayOrder() - 1);
                                serviceRepository.save(s);
                            });
                }
            }
            entity.setDisplayOrder(newOrder);
        }
        
        if (request.getIsActive() != null) entity.setIsActive(request.getIsActive());
        serviceImageRepository.deleteByServiceId(id);
        saveImages(id, request.getImageMediaIds());
        return toResponse(serviceRepository.save(entity));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!serviceRepository.existsById(id)) throw new ResourceNotFoundException("Service", id);
        
        Service entity = serviceRepository.findById(id).orElseThrow();
        Integer deletedOrder = entity.getDisplayOrder();
        
        // Delete cover media
        if (entity.getCoverMediaId() != null) {
            try {
                mediaService.delete(entity.getCoverMediaId());
            } catch (Exception e) {
                System.err.println("Failed to delete cover media: " + e.getMessage());
            }
        }
        
        // Delete all service images
        List<ServiceImage> serviceImages = serviceImageRepository.findByServiceId(id);
        for (ServiceImage serviceImage : serviceImages) {
            try {
                mediaService.delete(serviceImage.getMediaId());
            } catch (Exception e) {
                System.err.println("Failed to delete service image: " + e.getMessage());
            }
        }
        
        // Delete service image records
        serviceImageRepository.deleteByServiceId(id);
        
        // Hard delete the service
        serviceRepository.deleteById(id);
        
        // Reorder remaining services
        if (deletedOrder != null) {
            reorderAfterDeletion(deletedOrder);
        }
    }
    
    private void reorderAfterDeletion(Integer deletedOrder) {
        // Get all services with order > deletedOrder and decrement their order
        serviceRepository.findAll().stream()
                .filter(s -> s.getDisplayOrder() != null && s.getDisplayOrder() > deletedOrder)
                .forEach(s -> {
                    s.setDisplayOrder(s.getDisplayOrder() - 1);
                    serviceRepository.save(s);
                });
    }

    private void saveImages(Long serviceId, List<Long> mediaIds) {
        if (mediaIds == null) return;
        mediaIds.forEach(mediaId -> serviceImageRepository.save(
                ServiceImage.builder().serviceId(serviceId).mediaId(mediaId).build()));
    }

    private ServiceResponse toResponse(Service e) {
        List<MediaResponse> images = serviceImageRepository.findByServiceId(e.getId()).stream()
                .map(si -> mediaRepository.findByIdAndDeletedAtIsNull(si.getMediaId())
                        .map(mediaService::toResponse).orElse(null))
                .filter(m -> m != null).collect(Collectors.toList());

        var res = ServiceResponse.builder()
                .id(e.getId()).title(e.getTitle()).description(e.getDescription())
                .coverMediaId(e.getCoverMediaId())
                .status(e.getStatus() != null ? e.getStatus().name() : null)
                .publishedAt(e.getPublishedAt()).displayOrder(e.getDisplayOrder())
                .isActive(e.getIsActive()).createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt())
                .images(images);
        if (e.getCoverMediaId() != null)
            mediaRepository.findByIdAndDeletedAtIsNull(e.getCoverMediaId()).ifPresent(m -> res.coverMedia(mediaService.toResponse(m)));
        return res.build();
    }

    private Service.ServiceStatus parseStatus(String status) {
        if (status == null) return null;
        try { return Service.ServiceStatus.valueOf(status); } catch (Exception e) { return null; }
    }
}
