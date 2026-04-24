package com.yc.interior.service.impl;

import com.yc.interior.dto.request.ContactMessageRequest;
import com.yc.interior.dto.response.ContactMessageResponse;
import com.yc.interior.entity.ContactMessage;
import com.yc.interior.exception.ResourceNotFoundException;
import com.yc.interior.repository.ContactMessageRepository;
import com.yc.interior.service.ContactMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactMessageServiceImpl implements ContactMessageService {

    private final ContactMessageRepository repository;

    @Override
    public ContactMessageResponse create(ContactMessageRequest request) {
        ContactMessage entity = ContactMessage.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .subject(request.getSubject())
                .message(request.getMessage())
                .isRead(false)
                .build();
        return toResponse(repository.save(entity));
    }

    @Override
    public Page<ContactMessageResponse> getAll(String keyword, Boolean isRead, Pageable pageable) {
        return repository.findAllWithFilters(keyword, isRead, pageable).map(this::toResponse);
    }

    @Override
    public ContactMessageResponse getById(Long id) {
        return toResponse(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("ContactMessage", id)));
    }

    @Override
    public ContactMessageResponse markAsRead(Long id) {
        ContactMessage entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("ContactMessage", id));
        entity.setIsRead(true);
        return toResponse(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("ContactMessage", id);
        repository.deleteById(id);
    }

    private ContactMessageResponse toResponse(ContactMessage e) {
        return ContactMessageResponse.builder().id(e.getId()).name(e.getName()).email(e.getEmail())
                .phone(e.getPhone()).subject(e.getSubject()).message(e.getMessage())
                .isRead(e.getIsRead()).createdAt(e.getCreatedAt()).build();
    }
}
