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
        Statistic entity = Statistic.builder()
                .label(request.getLabel()).value(request.getValue()).icon(request.getIcon())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .build();
        return toResponse(repository.save(entity));
    }

    @Override
    public StatisticResponse update(Long id, StatisticRequest request) {
        Statistic entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Statistic", id));
        entity.setLabel(request.getLabel());
        entity.setValue(request.getValue());
        entity.setIcon(request.getIcon());
        if (request.getDisplayOrder() != null) entity.setDisplayOrder(request.getDisplayOrder());
        return toResponse(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Statistic", id);
        repository.deleteById(id);
    }

    private StatisticResponse toResponse(Statistic e) {
        return StatisticResponse.builder()
                .id(e.getId()).label(e.getLabel()).value(e.getValue()).icon(e.getIcon())
                .displayOrder(e.getDisplayOrder()).createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt()).build();
    }
}
