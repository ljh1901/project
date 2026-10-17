import { createElement } from 'react';
import { createBrowserRouter, redirect, RouterProvider,} from 'react-router-dom';
import { UserListM0 } from './screens/user/UserListM0.jsx';
import { BoardCategoryListM0 } from './screens/board/BoardCategoryListM0.jsx';
import AdminMain from './layout/admin/AdminMain.jsx';
import Main from './layout/user/UserMain.jsx';
/**
 * ===================================================================
 * 1. 라우트 상수 / 기본 유틸 / 상태 정의
 * 2. 정적 라우트 정의
 * 3. 동적 라우트 정의
 * 4. clearRoutes
 * 5. 라우터 초기화
 * ===================================================================
 *  */ 
/**
 * ===================================================================
 * 1. 라우트 상수 / 기본 유틸 / 상태 정의
 * ===================================================================
 *      방식                             상황                                     특징
 * 직접 등록 + `lazy`        | URL을 화면별로 명확하게 정하고 싶을 때           | 화면 추가 시 라우트도 추가             |
 * `glob` 자동 등록 + `lazy` | 파일 추가만으로 등록하고 싶을 때                 | 폴더·파일명·export 규칙 필요          |
 *  서버 메뉴 + 컴포넌트 맵    | 메뉴와 접근 대상을 서버 데이터로 관리할 때        | 서버의 화면 코드를 로컬 컴포넌트에 연결  |
 * `patchRoutesOnNavigation` | 이동 시점에 아직 모르는 라우트 정의를 찾아야 할 때 | 런타임에 라우트 트리를 추가            |
 */
// 1. `screens/admin` 바로 아래의 모든 `.jsx` 파일**
const screens = import.meta.glob('./screens/admin/*.jsx');
// 팝업(P0)을 제외한 게시판 화면을 파일명으로 찾아 동적으로 등록합니다.
const boardScreens = import.meta.glob('./screens/board/*M0.jsx');


// screens 에서 Object로 경로 동적 생성
const adminRoutes = Object.entries(screens).map(([file, load]) => {
  const name = file.split('/').pop().replace('.jsx', '');
  return {
    path: name,
    lazy: async () => {
      const module = await load();
      return {
        Component: module[name],
        handle: { screenName: name },
      };
    },
  };
});
/**
 * ===================================================================
 * 2. 정적 라우트 정의
 * ===================================================================
 * ADMIN은 세션 방식 => 로그인 인증(USER LOGIN과 상이) => ADMIN 기본화면 : 사용자 목록, 게시판 관리, 카테고리 관리
 * USER 기본화면 : 게시판 목록, 읽기, 글쓰기(로그인 인증 필요)
 * 비로그인 유저: 게시판 읽기만 가능 
 * 1-1. 로그인 화면
 * 1-2. 메인(게시판 목록) 화면
 * 1-3. 어드민 로그인 화면
 **/
const router = createBrowserRouter([
  {
    id: "root",
    path: "error",
    // Component: Error
  },
    {
      path: "/",
      /**   
       * // router.js 없이 History API 사용(Vanilla Js)
       * 
       *    1. 새로고침 하면서 이동
       *    history.pushState(null, "", "/main") 
       *    location.href=""
       *    
       *    2. SPA 방식 이동
       *    history.replaceState(null, "", "/main")
      */
      loader: () => redirect("/boards")
    },
    {
      path: "/boards",
      id: "main",
      Component: Main,
      children: [
        { 
          index: true,
          lazy: async () => {
            const module = await boardScreens['./screens/board/BoardListM0.jsx']();
            return {
              Component: module.BoardListM0,
              handle: { screenName: 'BoardListM0' },
            };
          },
        },
      ]
    },
    {
      path: "/admin",
      Component: AdminMain,
      children:[
        {
          index: true,
          loader: () => redirect("/admin/users"),
        },
        {
          path: "users",
          Component: UserListM0,
          handle: { screenName: 'UserListM0' },
        },
        {
          path: "board-categories",
          Component: BoardCategoryListM0,
          handle: { screenName: 'BoardCategoryListM0' },
        },
        ...adminRoutes,
      ]
    },
  ],
    {/**
      * ===================================================================
      * 3. 동적 라우트 정의
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
      **/ 
    async patchRoutesOnNavigation({ path, patch }) {
      const match = path.match(/^\/boards\/([^/]+)\/?$/);
      if (!match) return;

      const screenName = match[1];
      const load = boardScreens[`./screens/board/${screenName}.jsx`];

      // 실제로 존재하는 화면만 등록
      if (!load) return;

      patch("main", [
        {
          path: screenName,
          handle: { screenName },
          lazy: async () => {
            const module = await load();
            return { Component: module[screenName] };
          },
        },
      ]);
    },
  }
);
function Router() {
  return createElement(RouterProvider, { router });
}
export {Router};
