import { useMemo } from 'react';
import { AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { UserListP0 } from './UserListP0.jsx';
import { userColumns, useUserListM0 } from '../../js/admin/userListM0.js';
import '../../css/userListM0.css';

const modules = [AllCommunityModule];
const gridTheme = themeQuartz.withParams({
    accentColor: '#0969da',
    backgroundColor: '#ffffff',
    foregroundColor: '#1f2328',
    borderColor: '#d1d9e0',
    headerBackgroundColor: '#f6f8fa',
    headerTextColor: '#59636e',
    rowHoverColor: '#f6f8fa',
    fontFamily: 'inherit',
    fontSize: 13,
    headerFontSize: 12,
    headerHeight: 42,
    rowHeight: 48,
    cellHorizontalPadding: 16,
    wrapperBorderRadius: 0,
});
const defaultColDef = { flex: 1, sortable: true, resizable: true };
const localeText = { noRowsToShow: '등록된 사용자가 없습니다.', loadingOoo: '사용자 목록을 불러오는 중입니다.' };
const getRowId = ({ data }) => String(data.seqTbEvrcUsers);

export function UserListM0() {
    const {
        users, selectedUser, setSelectedUser, isLoading, isDownloading, downloadRef, downloadExcel,
    } = useUserListM0();
    const columnDefs = useMemo(() => [
        ...userColumns,
        {
            headerName: '비고',
            colId: 'detail',
            minWidth: 120,
            sortable: false,
            cellRenderer: ({ data }) => (
                <button type="button" className="user-detail-button" onClick={() => setSelectedUser(data)}>상세보기</button>
            ),
        },
    ], [setSelectedUser]);

    return (
        <main className="user-list">
            <div className="user-list-heading">
                <div>
                    <p className="eyebrow">관리자 / 사용자</p>
                    <h1>사용자 목록</h1>
                    <p className="page-description">등록된 사용자를 확인하고 목록을 내려받을 수 있습니다.</p>
                </div>
                <button type="button" className="button-primary user-download-button" onClick={downloadExcel}
                    disabled={isLoading || isDownloading || users.length === 0}>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M8 1.5v8m-3-3 3 3 3-3M2.5 10v3.5h11V10" />
                    </svg>
                    {isDownloading ? '엑셀 생성 중...' : '엑셀 다운로드'}
                </button>
                <a ref={downloadRef} hidden />
            </div>
            <section className="panel" aria-label="전체 사용자">
                <div className="panel-heading">
                    <h2>전체 사용자 <span className="count-badge">{isLoading ? '…' : users.length.toLocaleString()}</span></h2>
                    <span className="panel-caption">엑셀에는 조회된 전체 목록이 포함됩니다.</span>
                </div>
                <div className="user-list-grid">
                    <AgGridReact
                        modules={modules}
                        theme={gridTheme}
                        rowData={users}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        getRowId={getRowId}
                        loading={isLoading}
                        localeText={localeText}
                    />
                </div>
            </section>
            {selectedUser && (
                <UserListP0 userInfo={selectedUser} onClose={() => setSelectedUser(null)} />
            )}
        </main>
    );
}
