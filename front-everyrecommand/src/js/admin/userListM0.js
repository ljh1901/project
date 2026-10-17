import { useEffect, useRef, useState } from 'react';
import { fetchApi } from '../common/api.js';

const dateFormatter = ({ value }) => value ? String(value).split('T')[0] : '-';

const userColumns = [
    { field: 'seqTbEvrcUsers', headerName: '사용자 번호', minWidth: 120 },
    { field: 'userId', headerName: '아이디', minWidth: 140 },
    { field: 'userName', headerName: '이름', minWidth: 120 },
    { field: 'userBrth', headerName: '생년월일', minWidth: 140, valueFormatter: dateFormatter },
    { field: 'userEmil', headerName: '이메일', minWidth: 220 },
    { field: 'userPrfid', headerName: '전화번호', minWidth: 160, valueFormatter: ({ value }) => value || '-' },
    { field: 'userCret', headerName: '최초 생성일', minWidth: 140, valueFormatter: dateFormatter },
    { field: 'userUpet', headerName: '최종 수정일', minWidth: 140, valueFormatter: dateFormatter },
];

async function createUserWorkbook(users) {
    const { default: ExcelJS } = await import('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('사용자 목록');
    worksheet.columns = userColumns.map(column => ({
        header: column.headerName,
        key: column.field,
        width: column.field === 'userEmil' ? 32 : 20,
    }));
    users.forEach(user => {
        worksheet.addRow(userColumns.map(column => {
            const value = user[column.field];
            return String(column.valueFormatter ? column.valueFormatter({ value }) : value ?? '');
        }));
    });
    worksheet.getRow(1).font = { bold: true };
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];
    return workbook;
}

function useUserListM0() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const downloadRef = useRef(null);

    useEffect(() => {
        let active = true;
        fetchApi.get('/api/admin/users')
            .then(result => {
                if (active) setUsers(result);
            })
            .catch(async () => {
                if (active) await window.PopupMyAlert.error('사용자 목록을 불러오지 못했습니다.');
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });
        return () => { active = false; };
    }, []);

    async function downloadExcel() {
        if (isLoading || isDownloading || users.length === 0) return;
        setIsDownloading(true);
        try {
            const workbook = await createUserWorkbook(users);
            const buffer = await workbook.xlsx.writeBuffer();
            const link = downloadRef.current;
            if (!link) return;
            const url = URL.createObjectURL(new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }));
            try {
                link.href = url;
                link.download = '사용자_목록.xlsx';
                link.click();
            } finally {
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            }
        } catch {
            await window.PopupMyAlert.error('엑셀 다운로드에 실패했습니다. 다시 시도해 주세요.');
        } finally {
            setIsDownloading(false);
        }
    }

    return { users, selectedUser, setSelectedUser, isLoading, isDownloading, downloadRef, downloadExcel };
}

export { userColumns, createUserWorkbook, useUserListM0 };
