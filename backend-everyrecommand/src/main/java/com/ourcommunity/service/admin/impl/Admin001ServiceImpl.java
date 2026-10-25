package com.ourcommunity.service.admin.impl;

import java.sql.PreparedStatement;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.ourcommunity.exception.CommonException;
import com.ourcommunity.service.admin.Admin001Service;

import net.sf.jsqlparser.JSQLParserException;
import net.sf.jsqlparser.parser.CCJSqlParser;
import net.sf.jsqlparser.parser.CCJSqlParserUtil;
import net.sf.jsqlparser.statement.Statement;
import net.sf.jsqlparser.statement.select.PlainSelect;

@Service 
public class Admin001ServiceImpl implements Admin001Service{

    /**
     * JsqlParser 사용하기
     * net.sf.jsqlparser.statement.Statement: SQL을 분석한 구조를 담는 객체
     * --------------------------------------------------------------------
     * java.sql.Statement
     * java.sql.PreparedStatement
     * */
    @Override
    public Map<String, Object> ad0001M0(Map<String, Object> params) {
        try {
            // 1. 검사할 쿼리문 정의
            String sql = "";
            // 2. 검사기 생성
            Statement sqlState = CCJSqlParserUtil.parse(sql);
            // 3. 검사할 목록
            if(sqlState instanceof PlainSelect select){
                // SELECT 항목 목록: 컬럼·함수·수식·별칭 포함 
                // u.id, COUNT(*) AS cnt 
                select.getSelectItems();
                // FROM 대상: 테이블 또는 서브쿼리
                select.getFromItem();
                // WHERE 조건식. 없으면 null
                select.getWhere();
                // JOIN 문 따로 가져오기
                // select.getJoins()
            }
        }catch(JSQLParserException e){
            throw new CommonException("Query 형식이 맞지 않습니다.", "[E999]");
        }catch(Exception e){
            e.printStackTrace();;
        }
        return null;
    }
}
