package com.ourcommunity.service.common;
import java.util.Map;
public interface CommonService {
    // 프런트에 제공할 공개 환경 설정을 조회합니다.
    Map<String, Object> getAppConfig();
}
