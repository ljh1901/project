import '../../css/AD0001M0.css';
import {useEffect, useState} from 'react';
import {useSqlParams} from '../../js/admin/AD0001M0';
function AD0001M0() {
    const [mode, setMode] = useState(false);
    const [checked, setChecked] = useState(false);
    const {params, handleParamsChange, insertSqlParams} = useSqlParams();
    return (
        <main className="sql-workspace">
            <header className="sql-workspace-heading">
                <div>
                    <p className="sql-workspace-eyebrow">관리자 / SQL</p>
                    <h1>SQL 관리</h1>
                    <p>쿼리를 작성하고 실행 파라미터를 확인하세요.</p>
                </div>
                <span className="sql-workspace-badge">PostgreSQL</span>
            </header>
            <section className="sql-panel" aria-labelledby="sql-editor-title">
                <div className="sql-panel-heading">
                    <div>
                        <h2 id="sql-editor-title">SQL 미리보기</h2>
                    </div>
                    <span className="sql-panel-label">QUERY</span>
                </div>
                <label className="sql-editor-label" htmlFor="sql-query">SQL 쿼리</label>
                <textarea
                    id="sql-query"
                    className="sql-query-input"
                    name="strSql"
                    value={params.strSql}
                    onChange={handleParamsChange}
                    disabled={!mode}
                />
                <a type='button' name="editMode" style={{cursor:'pointer'}} onClick={() => setMode(prev => !prev)}>{!mode?'편집하기':'미리보기'}</a>
                <div className="sql-editor-caption">SQL 작성 영역 · 입력한 쿼리는 자동 실행되지 않습니다.</div>
            </section>

            <section className="sql-panel" aria-labelledby="sql-params-title">
                <div className="sql-panel-heading">
                    <div>
                        <h2 id="sql-params-title">실행 파라미터</h2>
                        <p>쿼리에서 사용하는 파라미터 정보를 확인합니다.</p>
                    </div>
                    <span className="sql-panel-label">PARAMETERS</span>
                </div>
                <div className="sql-table-scroll">
                    <table className="sql-params-table" aria-label="실행 파라미터 목록" style={{ textAlign: 'center', justifyContent: 'center', }}>
                        <caption>쿼리 파라미터 등록 화면</caption>
                        <thead>
                            <tr>
                                <th>
                                    <label>
                                        <input type='checkbox' 
                                               checked={checked} 
                                               onChange={(event) => setChecked(event.target.checked)}/>
                                        선택
                                    </label>
                                </th>
                                <th scope="col">DML</th>
                                <th scope="col">타입</th>
                                <th scope="col">크기</th>
                                <th scope="col">실행 파라미터</th>
                                <th scope="col">
                                    <button type="button" onClick={insertSqlParams}>등록</button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)}/>
                                </td>
                                <td>
                                    <select name="dataManipul" onChange={handleParamsChange}>
                                        <option value="SELECT">SELECT</option>
                                        <option value="UPDATE">UPDATE</option>
                                        <option value="INSERT">INSERT</option>
                                        <option value="DELETE">DELETE</option>
                                    </select>
                                </td>
                                <td>
                                    <select name="dataType" onChange={handleParamsChange}>
                                        <option>VARCHAR</option>
                                        <option>(Oracle, Tibero) NUMBER</option>
                                        <option>INT</option>
                                        <option>Timestamp</option>
                                        <option>Date</option>
                                        <option>FLOAT</option>
                                    </select>
                                </td>
                                <td>
                                    <input type="text" name="dataSize" onChange={handleParamsChange}/>
                                </td>
                                <td>
                                    <input type="text" name="paramName" onChange={handleParamsChange}/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}

export { AD0001M0 };
