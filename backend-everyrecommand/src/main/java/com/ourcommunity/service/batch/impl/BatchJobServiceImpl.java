package com.ourcommunity.service.batch.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.ourcommunity.mapper.batch.BatchMapper;
import com.ourcommunity.service.batch.BatchJobService;

@Service
public class BatchJobServiceImpl implements BatchJobService{
    private final BatchMapper batchMapper;
    public BatchJobServiceImpl(BatchMapper batchMapper){
        this.batchMapper = batchMapper;
    }

    @Override
    public List<Map<String,Object>> searchBatchJob(Map<String, Object> params) {
        List<Map<String,Object>> result = new ArrayList<Map<String,Object>>();
        result = batchMapper.searchBatchJob(params);
        return result;
    }
}
