import { fetchApi } from '../common/api.js';
import { useState } from 'react';
import {Parser} from 'node-sql-parser'
// 검사기 생성
const parser = new Parser();
try {
    const query = 'SELECT 123 FROM tb_icr_name WHERE ID=1';
    // 검사기
    const ast = parser.astify(query, {
        database: 'Postgresql', // 데이터베이스 설정
    });
    if(ast?.columns?.length == null){
        throw new Error("실행할 COLUMN이 없습니다.");
    }
    console.log(ast);
} catch (error) {
    console.error(error);   
}

function useSqlParams() {
    const [params, setParams] = useState({
        strSql: 'SELECT \nFROM table_name\nWHERE column_name = :value;',
        dataManipul: '',
        dataType: '',
        dataSize: '',
        paramName: '',
    });

    const handleParamsChange = (event) => {
        const { name, value } = event.target;

        setParams(prev => ({
            ...prev,
            [name]: value
        }));
    }
    function insertSqlParams() {
        setParams(prev => {
            const paramName = prev.paramName.trim();
            if (!paramName) {
                return prev;
            }

            return {
                ...prev,
                strSql: `SELECT ${paramName}\nFROM table_name\nWHERE column_name = :value;`
            };
        });
        console.log(params);
    }
    return { params, handleParamsChange, insertSqlParams }
}
export { useSqlParams }
