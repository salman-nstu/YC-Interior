package com.yc.interior.service;

import com.yc.interior.dto.request.ContactMessageRequest;
import com.yc.interior.dto.response.ContactMessageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ContactMessageService {
    ContactMessageResponse create(ContactMessageRequest request);
    Page<ContactMessageResponse> getAll(String keyword, Boolean isRead, Pageable pageable);
    ContactMessageResponse getById(Long id);
    ContactMessageResponse markAsRead(Long id);
    void delete(Long id);
}
