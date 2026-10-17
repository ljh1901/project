import { useEffect, useState } from 'react';
import { fetchApi } from '../common/api.js';
import { popUpOpen } from '../common/popUp.js';
import { createRowChangeHandler } from '../utils/formUtils.js';

function useBoardCategoryListM0() {
  const [boards, setBoards] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    const boardList = await fetchApi.get('/api/admin/board-categories');
    setBoards(boardList);
    setSelectedIds([]);
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

  useEffect(() => {
    loadData();
    popUpOpen();
  }, []);

  const selectCheckBox = (event) => {
    setSelectedIds(event.target.checked ? boards.map(board => board.brdCtid) : []);
  };

  const selectedCheckBoxes = (event, brdCtid) => {
    const checked = event.target.checked;
    setSelectedIds(prev => checked ? [...prev, brdCtid] : prev.filter(id => id !== brdCtid));
  };

  const handleChange = createRowChangeHandler(setBoards, 'brdCtid');

  return {
    boards, selectedIds, isSaving, error, isModalOpen, setIsModalOpen,
    loadData, deleteCategory, saveSelected, selectCheckBox, selectedCheckBoxes, handleChange,
  };
}

export { useBoardCategoryListM0 };
