package com.ourcommunity.utils;

import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class PagingUtils {
    public static Map<String, Object> pagingAlgorithm(int totalCount, int pageSize, int listCount, int currentPage) {
        if (totalCount < 0 || pageSize < 1 || listCount < 1) {
            throw new IllegalArgumentException("Invalid paging parameters");
        }
        int totalPage = (int) Math.ceil((double) totalCount / listCount);
        currentPage = Math.max(1, Math.min(currentPage, Math.max(1, totalPage)));
        int startPage = ((currentPage - 1) / pageSize) * pageSize + 1;
        int endPage = Math.min(startPage + pageSize - 1, totalPage);
        long start = ((long) currentPage - 1) * listCount + 1;

        return Map.of(
                "currentPage", currentPage,
                "listCount", listCount,
                "totalCount", totalCount,
                "totalPage", totalPage,
                "startPage", startPage,
                "endPage", endPage,
                "start", start,
                "end", (long) listCount * currentPage);
    }

    public static Map<String, Object> pagingAlgorithm(String url, Map<String, Object> searchParams,
            int totalCount, int pageSize, int listCount, int currentPage) {
        Map<String, Object> paging = new HashMap<>(pagingAlgorithm(totalCount, pageSize, listCount, currentPage));
        int page = (int) paging.get("currentPage");
        int startPage = (int) paging.get("startPage");
        int endPage = (int) paging.get("endPage");
        int totalPage = (int) paging.get("totalPage");
        List<Map<String, Object>> links = new ArrayList<>();
        if (startPage > 1) {
            links.add(pageLink(url, searchParams, listCount, startPage - 1, "이전", false));
        }
        for (int number = startPage; number <= endPage; number++) {
            links.add(pageLink(url, searchParams, listCount, number, String.valueOf(number), number == page));
        }
        if (endPage < totalPage) {
            links.add(pageLink(url, searchParams, listCount, endPage + 1, "다음", false));
        }
        paging.put("links", links);
        return paging;
    }

    private static Map<String, Object> pageLink(String url, Map<String, Object> searchParams,
            int listCount, int page, String label, boolean current) {
        StringBuilder to = new StringBuilder(url).append("?currentPage=").append(page)
                .append("&listCount=").append(listCount);
        searchParams.forEach((key, value) -> {
            if (!key.equals("currentPage") && !key.equals("listCount") && value != null) {
                to.append('&').append(URLEncoder.encode(key, StandardCharsets.UTF_8))
                        .append('=').append(URLEncoder.encode(value.toString(), StandardCharsets.UTF_8));
            }
        });
        return Map.of("label", label, "to", to.toString(), "current", current);
    }
}
