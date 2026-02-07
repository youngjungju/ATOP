ATOP는 피부 사진과 복용 기록을 기반으로 시각적 특징을 관찰·요약해주는 웹 MVP입니다.

## Getting Started

### 1) 환경 변수 설정

`.env.local`에 아래 값을 채워주세요.

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=skin-images
GEMINI_API_KEY=
```

Supabase Storage 버킷은 public으로 설정되어 있어야 합니다.

### 2) 개발 서버 실행

```bash
npm install
npm run dev
```

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 랜딩 페이지를 확인할 수 있습니다.

## 주요 화면

- `/` 랜딩 페이지
- `/upload` 이미지 업로드 + 복용 기록 입력
- `/report/[id]` 관찰 리포트 결과
