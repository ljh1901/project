package com.ourcommunity.mapper.batch;

import java.util.List;
import java.util.Map;

public interface BatchMapper {
    List<Map<String,Object>> searchBatchJob(Map<String,Object> params);
}
