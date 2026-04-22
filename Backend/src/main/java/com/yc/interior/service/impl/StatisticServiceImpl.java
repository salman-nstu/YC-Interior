package com.yc.interior.service.impl;

import com.yc.interior.dto.request.StatisticRequest;
import com.yc.interior.dto.response.StatisticResponse;
import com.yc.interior.entity.Statistic;
import com.yc.interior.exception.ResourceNotFoundException;
import com.yc.interior.repository.StatisticRepository;
import com.yc.interior.service.StatisticService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticServiceImpl implements StatisticService {

    private static final int MAX_STATISTICS = 3;
    private final StatisticRepository repository;

    @Override
    public List<StatisticResponse> getAll() {
        return repository.findAllByOrderByDisplayOrderAsc().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public StatisticResponse getById(Long id) {
        return toResponse(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Statistic", id)));
    }

    @Override
    public StatisticResponse create(StatisticRequest request) {
        long currentCount = repository.count();
        if (currentCount >= MAX_STATISTICS) {
            throw new com.yc.interior.exception.BusinessException("Maximum statistics records reached (" + MAX_STATISTICS + "). Delete one to add another.");
        }
        
        // Auto-assign display order (0-2 for statistics, max 3)
        Integer displayOrder = request.getDisplayOrder();
        if (displayOrder == null) {
            // New items get the next sequential order
            displayOrder = (int) currentCount; // If 0 items, new gets 0; if 1 item, new gets 1; if 2 items, new gets 2
        } else if (displayOrder >= 0 && displayOrder <= 2) {
            // If order is in range, shift existing items
            shiftDisplayOrdersForInsertion(displayOrder);
        } else {
            displayOrder = 2; // Cap at max
        }
        
        Statistic entity = Statistic.builder()
                .label(request.getLabel()).value(request.getValue()).icon(request.getIcon())
                .displayOrder(displayOrder)
                .build();
        return toResponse(repository.save(entity));
    }
    
    private void shiftDisplayOrdersForInsertion(Integer insertOrder) {
        repository.findAll().stream()
                .filter(s -> s.getDisplayOrder() != null && s.getDisplayOrder() >= insertOrder)
                .forEach(s -> {
                    s.setDisplayOrder(s.getDisplayOrder() + 1);
                    repository.save(s);
                });
    }

    @Override
    public StatisticResponse update(Long id, StatisticRequest request) {
        Statistic entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Statistic", id));
        entity.setLabel(request.getLabel());
        entity.setValue(request.getValue());
        entity.setIcon(request.getIcon());
        
        // Handle display order changes
        if (request.getDisplayOrder() != null && !request.getDisplayOrder().equals(entity.getDisplayOrder())) {
            Integer newOrder = request.getDisplayOrder();
            Integer oldOrder = entity.getDisplayOrder();
            
            if (newOrder >= 0 && newOrder <= 2) {
                // If moving to a different order, shift items
                if (newOrder < oldOrder) {
                    // Moving up (lower order number)
                    repository.findAll().stream()
                            .filter(s -> s.getId() != id && s.getDisplayOrder() != null && 
                                    s.getDisplayOrder() >= newOrder && s.getDisplayOrder() < oldOrder)
                            .forEach(s -> {
                                s.setDisplayOrder(s.getDisplayOrder() + 1);
                                repository.save(s);
                            });
                } else if (newOrder > oldOrder) {
                    // Moving down (higher order number)
                    repository.findAll().stream()
                            .filter(s -> s.getId() != id && s.getDisplayOrder() != null && 
                                    s.getDisplayOrder() > oldOrder && s.getDisplayOrder() <= newOrder)
                            .forEach(s -> {
                                s.setDisplayOrder(s.getDisplayOrder() - 1);
                                repository.save(s);
                            });
                }
                entity.setDisplayOrder(newOrder);
            }
        }
        
        return toResponse(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Statistic", id);
        
        Statistic entity = repository.findById(id).orElseThrow();
        Integer deletedOrder = entity.getDisplayOrder();
        
        // Hard delete the statistic
        repository.deleteById(id);
        
        // Reorder remaining statistics
        if (deletedOrder != null) {
            reorderAfterDeletion(deletedOrder);
        }
    }
    
    private void reorderAfterDeletion(Integer deletedOrder) {
        repository.findAll().stream()
                .filter(s -> s.getDisplayOrder() != null && s.getDisplayOrder() > deletedOrder)
                .forEach(s -> {
                    s.setDisplayOrder(s.getDisplayOrder() - 1);
                    repository.save(s);
                });
    }

    private StatisticResponse toResponse(Statistic e) {
        return StatisticResponse.builder()
                .id(e.getId()).label(e.getLabel()).value(e.getValue()).icon(e.getIcon())
                .displayOrder(e.getDisplayOrder()).createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt()).build();
    }
}
