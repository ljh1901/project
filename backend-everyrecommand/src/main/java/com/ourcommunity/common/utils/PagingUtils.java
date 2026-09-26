package com.ourcommunity.common.utils;

/**
 * @Class
 * PagingUtils
 * 페이징 알고리즘
 * PostMapping만 사용
 */
public class PagingUtils {
    public static String pagingAlgorithm(String url, int totalCount, int pageSize, int listSize, int currentPage){
        if(currentPage <0) currentPage = 1;
        StringBuilder paging = new StringBuilder();

        // 1. 전체 페이지 구하기
        int totalPage = (int) Math.ceil((double)totalCount/pageSize);

        // 2. 유저 그룹 구하기
        int userGroup = currentPage/listSize;
        if(currentPage%listSize == 0){
            userGroup--;
        }

        // 3. 페이지 목록 출력하기
        // 3-1. 첫페이지 아닐때,
        if(userGroup != 0){
            paging.append("<Link to='");
            paging.append(url);
            paging.append("'>&lt;&lt;");
            paging.append("</Link>");
        }
        for(int i= userGroup*pageSize + 1; i<userGroup*pageSize +1+pageSize; i++){
            if(i>totalPage){
                break;
            }
            paging.append("<Link to='");
            paging.append(url);
            paging.append("'>");
            paging.append(i);
            paging.append("</Link>");
        }
        // 3-2. 마지막 페이지 일때,
        if((userGroup == totalPage/pageSize - (totalPage%pageSize==0?1:0))){
            paging.append("<Link to='");
            paging.append(url);
            paging.append("'>&gt;&gt;");
            paging.append("</Link>");
        }
        return paging.toString();
    }
}
