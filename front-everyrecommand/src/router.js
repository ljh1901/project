import { createElement } from 'react';
import { createBrowserRouter, Route, Routes } from 'react-router-dom';
import { UserListM0 } from './screens/user/UserListM0.jsx';
import { BoardListM0 } from './screens/board/BoardListM0.jsx';
/**
 * ===================================================================
 * 1. 정적 라우트 정의
 * ===================================================================
 * ADMIN은 세션 방식 => 로그인 인증(USER LOGIN과 상이) => ADMIN 기본화면 : 사용자 목록, 게시판 관리, 카테고리 관리
 * USER 기본화면 : 게시판 목록, 읽기, 글쓰기(로그인 인증 필요)
 * 비로그인 유저: 게시판 읽기만 가능 
 * 1-1. 로그인 화면
 * 1-2. 메인(게시판 목록) 화면
 * 1-3. 어드민 로그인 화면
 * 
 * ===================================================================
 * 2. 
 * ===================================================================
 * 
 * 
 * ===================================================================
 * 5. 동적 라우트 정의
 * ===================================================================
 * 동적 라우트에 따라 URL 주소를 변경
 * 1. 권한별 메뉴를 서버에서 받아올 경우 
 * - useRoutes() 방식 또는 컴포넌트 맵
 * 
 * 2. patchRoutesOnNavigation
 * - 라우트 트리 자체를 이동 시점에 동적 추가
 * 
 * 2. lazy + import() 방식
 * 컴포넌트 코드를 동적으로 로딩
 * 
 * 
 *  */ 

function Router() {
  const router = createBrowserRouter([
    {
      id: 'root',
      path: '/',
      Component: UserListM0
    },
    {
      
    },
    {
      //UserListM0에 갖다붙일 컴포넌트
    }
  ])
}
export {Router};
