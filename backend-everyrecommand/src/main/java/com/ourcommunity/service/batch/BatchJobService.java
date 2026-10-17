package com.ourcommunity.service.batch;

import java.util.List;
import java.util.Map;

public interface BatchJobService {
    List<Map<String,Object>> searchBatchJob(Map<String,Object> params);
    Map<String,Object> tempFileClearJob(Map<String,Object> params);
}
