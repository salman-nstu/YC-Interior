package com.yc.interior.service;

import com.yc.interior.dto.request.ServiceRequest;
import com.yc.interior.dto.response.ServiceResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ServiceService {
    Page<ServiceResponse> getAll(String keyword, String status, Pageable pageable);
    ServiceResponse getById(Long id);
    ServiceResponse create(ServiceRequest request);
    ServiceResponse update(Long id, ServiceRequest request);
    void delete(Long id);
}
