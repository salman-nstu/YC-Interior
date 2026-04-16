package com.yc.interior.service.impl;

import com.yc.interior.dto.request.ClientRequest;
import com.yc.interior.dto.response.ClientResponse;
import com.yc.interior.entity.Client;
import com.yc.interior.exception.ResourceNotFoundException;
import com.yc.interior.repository.ClientRepository;
import com.yc.interior.repository.MediaRepository;
import com.yc.interior.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository repository;
    private final MediaRepository mediaRepository;
    private final MediaServiceImpl mediaService;

    @Override
    public Page<ClientResponse> getAll(String keyword, Pageable pageable) {
        return repository.findAllWithFilter(keyword, pageable).map(this::toResponse);
    }

    @Override
    public ClientResponse getById(Long id) {
        return toResponse(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Client", id)));
    }

    @Override
    public ClientResponse create(ClientRequest request) {
        Client entity = Client.builder().name(request.getName()).logoMediaId(request.getLogoMediaId())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0).build();
        return toResponse(repository.save(entity));
    }

    @Override
    public ClientResponse update(Long id, ClientRequest request) {
        Client entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Client", id));
        entity.setName(request.getName());
        entity.setLogoMediaId(request.getLogoMediaId());
        if (request.getDisplayOrder() != null) entity.setDisplayOrder(request.getDisplayOrder());
        return toResponse(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Client", id);
        repository.deleteById(id);
    }

    private ClientResponse toResponse(Client e) {
        var res = ClientResponse.builder().id(e.getId()).name(e.getName()).logoMediaId(e.getLogoMediaId())
                .displayOrder(e.getDisplayOrder()).createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt());
        if (e.getLogoMediaId() != null)
            mediaRepository.findByIdAndDeletedAtIsNull(e.getLogoMediaId()).ifPresent(m -> res.logoMedia(mediaService.toResponse(m)));
        return res.build();
    }
}
