import { useState } from 'react';
import {fetchApi} from './common/api.js';
function useBoardListP0(onClose, onCreated) {
    const [params, setParams] = useState({
        brdCtidNm: '',
        useYn: 'Y',
    });

    // 내부 변수 감지
    function handleChange(event) {
        const { name, value } = event.target;
        setParams(prev => ({ ...prev, [name]: value }));
    }

    function addCategory(params) {
        return fetchApi.post("/api/admin/BoardCategoryP0", params);
    }

    // 카테고리 생성 함수
    async function handleAddCategory() {
        await addCategory(params);
        onClose();
        await onCreated?.();
    }
    return { params, handleChange, handleAddCategory };
}
export {useBoardListP0};
