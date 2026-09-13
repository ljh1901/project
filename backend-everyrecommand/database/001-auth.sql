-- 기존 DB 구조와 충돌 여부를 확인한 후 수동 적용합니다. 애플리케이션은 자동 실행하지 않습니다.
CREATE TABLE app_user (
    user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    login_id VARCHAR(50) NOT NULL UNIQUE CHECK (length(trim(login_id)) > 0),
    password_hash VARCHAR(60) NOT NULL CHECK (password_hash ~ '^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$'),
    display_name VARCHAR(100) NOT NULL CHECK (length(trim(display_name)) > 0),
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER' CHECK (role IN ('ROLE_USER', 'ROLE_ADMIN')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- 계정은 관리 도구에서 login_id, password_hash(BCrypt), display_name을 바인딩하여 등록합니다.
-- 기본 계정이나 평문 비밀번호는 제공하지 않습니다.
