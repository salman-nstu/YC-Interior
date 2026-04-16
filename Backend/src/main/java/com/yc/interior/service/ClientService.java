package com.yc.interior.service;

import com.yc.interior.dto.request.ClientRequest;
import com.yc.interior.dto.response.ClientResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ClientService {
    Page<ClientResponse> getAll(String keyword, Pageable pageable);
    ClientResponse getById(Long id);
    ClientResponse create(ClientRequest request);
    ClientResponse update(Long id, ClientRequest request);
    void delete(Long id);
}
