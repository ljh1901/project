import { useState } from 'react';

function useBoardListP0() {
    const [params, setParams] = useState({
        brdCtidNm: '',
        useYn: 'Y',
    });

    // 내부 변수 감지
    function handleChange(event) {
        const { name, value } = event.target;
        setParams(prev => ({ ...prev, [name]: value }));
    }

    function addCategory(params){
        console.log(params);
    }

    // 카테고리 생성 함수
    function handleAddCategory() {
        addCategory(params);
    }
    return { params, handleChange, handleAddCategory };
}
export {useBoardListP0};
