package com.yc.interior.service;

import com.yc.interior.dto.request.StatisticRequest;
import com.yc.interior.dto.response.StatisticResponse;
import java.util.List;

public interface StatisticService {
    List<StatisticResponse> getAll();
    StatisticResponse getById(Long id);
    StatisticResponse create(StatisticRequest request);
    StatisticResponse update(Long id, StatisticRequest request);
    void delete(Long id);
}
