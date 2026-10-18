import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchApi } from '../common/api.js';
import { popUpOpen } from '../common/popUp.js';
import { createRowChangeHandler } from '../utils/formUtils.js';

function useBoardCategoryListM0() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.toString();
    const requestId = useRef(0);
    const [paging, setPaging] = useState(null);
    const [searchObj, setSearchObj] = useState({ listCount: '5', useYn: '', brdCtidNm: '', brdFrrgTs: '' });
    const [boards, setBoards] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadData = async () => {
        const id = ++requestId.current;
        const queryParams = new URLSearchParams(query);
        if (!queryParams.has('listCount')) queryParams.set('listCount', '5');
        if (!queryParams.has('currentPage')) queryParams.set('currentPage', '1');
        setError('');
        try {
            const result = await fetchApi.get(`/api/admin/board-categoriesM0?${queryParams}`);
            if (id !== requestId.current) return;
            if (String(result.paging.currentPage) !== queryParams.get('currentPage')) {
                queryParams.set('currentPage', String(result.paging.currentPage));
                setSearchParams(queryParams, { replace: true });
            }
            setBoards(result.list);
            setPaging(result.paging);
            setSelectedIds([]);
        } catch (error) {
            if (id !== requestId.current) return;
            setBoards([]);
            setPaging(null);
            setSelectedIds([]);
            setError(error.message || '목록 조회에 실패했습니다.');
        }
    };

    const deleteCategory = async (params) => {
        await saveCategories([params]);
    };

    const saveCategories = async (params) => {
        if (params.length === 0 || isSaving) return;
        setIsSaving(true);
        setError('');
        try {
            await fetchApi.put('/api/admin/board-categories', params);
            await loadData();
        } catch {
            setError('저장에 실패했습니다. 다시 시도해 주세요.');
        } finally {
            setIsSaving(false);
        }
    };

    const saveSelected = () => saveCategories(boards
        .filter(board => selectedIds.includes(board.brdCtid))
        .map(({ brdCtid, useYn }) => ({ brdCtid, useYn })));
    const hasClosePopupCk = document.cookie.split(";").some(cookie => cookie.trim() == 'closePopup=true');
    useEffect(() => {
        const params = new URLSearchParams(query);
        setSearchObj({
            listCount: params.get('listCount') ?? '5',
            useYn: params.get('useYn') ?? '',
            brdCtidNm: params.get('brdCtidNm') ?? '',
            brdFrrgTs: params.get('brdFrrgTs') ?? '',
        });
        loadData();
        return () => { requestId.current++; };
    }, [query]);

    useEffect(() => {
        if(!hasClosePopupCk){
            popUpOpen()
        }
    }, []);

    const selectCheckBox = (event) => {
        setSelectedIds(event.target.checked ? boards.map(board => board.brdCtid) : []);
    };

    const selectedCheckBoxes = (event, brdCtid) => {
        const checked = event.target.checked;
        setSelectedIds(prev => checked ? [...prev, brdCtid] : prev.filter(id => id !== brdCtid));
    };

    const handleChange = createRowChangeHandler(setBoards, 'brdCtid');
    
    const searchBtn = (params) => {
        const nextParams = new URLSearchParams(params);
        nextParams.set('currentPage', '1');
        if (nextParams.toString() === query) {
            loadData();
        } else {
            setSearchParams(nextParams);
        }
    };

    return {
        boards, 
        selectedIds, 
        isSaving, 
        error, 
        isModalOpen, 

        setIsModalOpen,
        loadData, 
        deleteCategory, 
        saveSelected, 
        selectCheckBox, 
        selectedCheckBoxes, 
        handleChange, 
        searchBtn,
        paging,
        searchObj,
        setSearchObj
    };
}

export { useBoardCategoryListM0 };
