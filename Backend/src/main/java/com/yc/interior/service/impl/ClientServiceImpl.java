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
        // Auto-assign display order
        Integer displayOrder = request.getDisplayOrder();
        if (displayOrder == null) {
            displayOrder = (int) repository.findAll().stream()
                    .mapToInt(c -> c.getDisplayOrder() != null ? c.getDisplayOrder() : 0)
                    .max()
                    .orElse(-1) + 1;
        } else {
            // Shift existing items if inserting in the middle
            shiftDisplayOrdersForInsertion(displayOrder);
        }
        
        Client entity = Client.builder().name(request.getName()).logoMediaId(request.getLogoMediaId())
                .displayOrder(displayOrder).build();
        return toResponse(repository.save(entity));
    }
    
    private void shiftDisplayOrdersForInsertion(Integer insertOrder) {
        repository.findAll().stream()
                .filter(c -> c.getDisplayOrder() != null && c.getDisplayOrder() >= insertOrder)
                .forEach(c -> {
                    c.setDisplayOrder(c.getDisplayOrder() + 1);
                    repository.save(c);
                });
    }

    @Override
    public ClientResponse update(Long id, ClientRequest request) {
        Client entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Client", id));
        entity.setName(request.getName());
        entity.setLogoMediaId(request.getLogoMediaId());
        
        // Handle display order changes
        if (request.getDisplayOrder() != null && !request.getDisplayOrder().equals(entity.getDisplayOrder())) {
            Integer newOrder = request.getDisplayOrder();
            Integer oldOrder = entity.getDisplayOrder();
            
            if (oldOrder != null) {
                // If moving to a different order, shift items
                if (newOrder < oldOrder) {
                    // Moving up (lower order number)
                    repository.findAll().stream()
                            .filter(c -> !c.getId().equals(id) && c.getDisplayOrder() != null && 
                                    c.getDisplayOrder() >= newOrder && c.getDisplayOrder() < oldOrder)
                            .forEach(c -> {
                                c.setDisplayOrder(c.getDisplayOrder() + 1);
                                repository.save(c);
                            });
                } else if (newOrder > oldOrder) {
                    // Moving down (higher order number)
                    repository.findAll().stream()
                            .filter(c -> !c.getId().equals(id) && c.getDisplayOrder() != null && 
                                    c.getDisplayOrder() > oldOrder && c.getDisplayOrder() <= newOrder)
                            .forEach(c -> {
                                c.setDisplayOrder(c.getDisplayOrder() - 1);
                                repository.save(c);
                            });
                }
                entity.setDisplayOrder(newOrder);
            }
        }
        
        return toResponse(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Client", id);
        
        Client entity = repository.findById(id).orElseThrow();
        Integer deletedOrder = entity.getDisplayOrder();
        
        // Delete logo media
        if (entity.getLogoMediaId() != null) {
            try {
                mediaService.delete(entity.getLogoMediaId());
            } catch (Exception e) {
                System.err.println("Failed to delete logo media: " + e.getMessage());
            }
        }
        
        // Hard delete the client
        repository.deleteById(id);
        
        // Reorder remaining clients
        if (deletedOrder != null) {
            reorderAfterDeletion(deletedOrder);
        }
    }
    
    private void reorderAfterDeletion(Integer deletedOrder) {
        repository.findAll().stream()
                .filter(c -> c.getDisplayOrder() != null && c.getDisplayOrder() > deletedOrder)
                .forEach(c -> {
                    c.setDisplayOrder(c.getDisplayOrder() - 1);
                    repository.save(c);
                });
    }

    private ClientResponse toResponse(Client e) {
        var res = ClientResponse.builder().id(e.getId()).name(e.getName()).logoMediaId(e.getLogoMediaId())
                .displayOrder(e.getDisplayOrder()).createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt());
        if (e.getLogoMediaId() != null)
            mediaRepository.findByIdAndDeletedAtIsNull(e.getLogoMediaId()).ifPresent(m -> res.logoMedia(mediaService.toResponse(m)));
        return res.build();
    }
}
