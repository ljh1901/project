import { useState } from 'react';
import {fetchApi} from './common/api.js';
import { createChangeHandler } from './utils/formUtils.js';
function useBoardListP0(onClose, onCreated) {
    const [params, setParams] = useState({
        brdCtidNm: '',
        useYn: 'Y',
    });

    const handleChange = createChangeHandler(setParams);

    function addCategory(params) {
        return fetchApi.post("/api/admin/board-categories", params, {
            contentType: 'application/json'
        });
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
