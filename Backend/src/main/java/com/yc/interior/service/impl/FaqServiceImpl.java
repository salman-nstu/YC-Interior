package com.yc.interior.service.impl;

import com.yc.interior.dto.request.FaqRequest;
import com.yc.interior.dto.response.FaqResponse;
import com.yc.interior.entity.Faq;
import com.yc.interior.exception.ResourceNotFoundException;
import com.yc.interior.repository.FaqRepository;
import com.yc.interior.service.FaqService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FaqServiceImpl implements FaqService {

    private final FaqRepository repository;

    @Override
    public Page<FaqResponse> getAll(String keyword, Pageable pageable) {
        return repository.findAllWithFilter(keyword, pageable).map(this::toResponse);
    }

    @Override
    public FaqResponse getById(Long id) {
        return toResponse(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("FAQ", id)));
    }

    @Override
    public FaqResponse create(FaqRequest request) {
        // Auto-assign display order (0-4 for FAQ, max 5 featured)
        Integer displayOrder = request.getDisplayOrder();
        long currentCount = repository.count();
        
        if (displayOrder == null) {
            // Auto-increment: find max and add 1
            displayOrder = (int) Math.min(currentCount, 4); // Max order is 4 (0-4 = 5 items)
        } else if (displayOrder >= 0 && displayOrder <= 4) {
            // If order is in featured range, shift existing items
            shiftDisplayOrdersForInsertion(displayOrder);
        } else {
            // Order is beyond featured range, just use it
            displayOrder = (int) Math.max(displayOrder, 5);
        }
        
        Faq entity = Faq.builder().question(request.getQuestion()).answer(request.getAnswer())
                .displayOrder(displayOrder).build();
        return toResponse(repository.save(entity));
    }
    
    private void shiftDisplayOrdersForInsertion(Integer insertOrder) {
        repository.findAll().stream()
                .filter(f -> f.getDisplayOrder() != null && f.getDisplayOrder() >= insertOrder)
                .forEach(f -> {
                    f.setDisplayOrder(f.getDisplayOrder() + 1);
                    repository.save(f);
                });
    }

    @Override
    public FaqResponse update(Long id, FaqRequest request) {
        Faq entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("FAQ", id));
        entity.setQuestion(request.getQuestion());
        entity.setAnswer(request.getAnswer());
        
        // Handle display order changes with shifting
        if (request.getDisplayOrder() != null) {
            Integer oldOrder = entity.getDisplayOrder();
            Integer newOrder = request.getDisplayOrder();
            
            if (oldOrder != null && !oldOrder.equals(newOrder)) {
                if (newOrder < oldOrder) {
                    // Shift items between newOrder and oldOrder up by 1
                    repository.findAll().stream()
                            .filter(f -> f.getDisplayOrder() != null && f.getDisplayOrder() >= newOrder && f.getDisplayOrder() < oldOrder && !f.getId().equals(id))
                            .forEach(f -> {
                                f.setDisplayOrder(f.getDisplayOrder() + 1);
                                repository.save(f);
                            });
                } else if (newOrder > oldOrder) {
                    // Shift items between oldOrder and newOrder down by 1
                    repository.findAll().stream()
                            .filter(f -> f.getDisplayOrder() != null && f.getDisplayOrder() > oldOrder && f.getDisplayOrder() <= newOrder && !f.getId().equals(id))
                            .forEach(f -> {
                                f.setDisplayOrder(f.getDisplayOrder() - 1);
                                repository.save(f);
                            });
                }
            }
            entity.setDisplayOrder(newOrder);
        }
        
        return toResponse(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("FAQ", id);
        
        Faq entity = repository.findById(id).orElseThrow();
        Integer deletedOrder = entity.getDisplayOrder();
        
        // Hard delete the FAQ
        repository.deleteById(id);
        
        // Reorder remaining FAQs
        if (deletedOrder != null) {
            reorderAfterDeletion(deletedOrder);
        }
    }
    
    private void reorderAfterDeletion(Integer deletedOrder) {
        repository.findAll().stream()
                .filter(f -> f.getDisplayOrder() != null && f.getDisplayOrder() > deletedOrder)
                .forEach(f -> {
                    f.setDisplayOrder(f.getDisplayOrder() - 1);
                    repository.save(f);
                });
    }

    private FaqResponse toResponse(Faq e) {
        return FaqResponse.builder().id(e.getId()).question(e.getQuestion()).answer(e.getAnswer())
                .displayOrder(e.getDisplayOrder()).createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt()).build();
    }
}
