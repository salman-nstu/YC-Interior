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
        Faq entity = Faq.builder().question(request.getQuestion()).answer(request.getAnswer())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0).build();
        return toResponse(repository.save(entity));
    }

    @Override
    public FaqResponse update(Long id, FaqRequest request) {
        Faq entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("FAQ", id));
        entity.setQuestion(request.getQuestion());
        entity.setAnswer(request.getAnswer());
        if (request.getDisplayOrder() != null) entity.setDisplayOrder(request.getDisplayOrder());
        return toResponse(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("FAQ", id);
        repository.deleteById(id);
    }

    private FaqResponse toResponse(Faq e) {
        return FaqResponse.builder().id(e.getId()).question(e.getQuestion()).answer(e.getAnswer())
                .displayOrder(e.getDisplayOrder()).createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt()).build();
    }
}
