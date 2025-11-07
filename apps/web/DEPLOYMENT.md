# GCP Cloud Run 배포 가이드

## 사전 준비

### 1. GCP 계정 및 프로젝트 설정
```bash
# GCP CLI 설치 확인
gcloud --version

# GCP 로그인
gcloud auth login

# 프로젝트 생성 (선택사항)
gcloud projects create [PROJECT_ID] --name="DDRise Homepage"

# 프로젝트 설정
gcloud config set project [PROJECT_ID]
```

### 2. 필요한 API 활성화
```bash
# Cloud Run API 활성화
gcloud services enable run.googleapis.com

# Container Registry API 활성화
gcloud services enable containerregistry.googleapis.com

# Cloud Build API 활성화
gcloud services enable cloudbuild.googleapis.com
```

### 3. Docker 인증 설정
```bash
# GCR 인증
gcloud auth configure-docker
```

## 배포 방법

### 방법 1: 배포 스크립트 사용 (추천)
```bash
# 실행 권한 부여
chmod +x deploy.sh

# 배포 실행
./deploy.sh [PROJECT_ID] [SERVICE_NAME] [REGION]

# 예시
./deploy.sh my-project-id ddrise-homepage asia-northeast3
```

### 방법 2: 수동 배포
```bash
# 1. Docker 이미지 빌드
docker build -t gcr.io/[PROJECT_ID]/ddrise-homepage:latest .

# 2. GCR에 푸시
docker push gcr.io/[PROJECT_ID]/ddrise-homepage:latest

# 3. Cloud Run에 배포
gcloud run deploy ddrise-homepage \
  --image gcr.io/[PROJECT_ID]/ddrise-homepage:latest \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1
```

## 환경 변수 설정

배포 시 환경 변수를 추가하려면:

```bash
gcloud run deploy ddrise-homepage \
  --image gcr.io/[PROJECT_ID]/ddrise-homepage:latest \
  --platform managed \
  --region asia-northeast3 \
  --set-env-vars="DATABASE_URL=your-db-url,NEXT_PUBLIC_API_URL=your-api-url"
```

또는 `.env` 파일에서 로드:

```bash
gcloud run deploy ddrise-homepage \
  --image gcr.io/[PROJECT_ID]/ddrise-homepage:latest \
  --platform managed \
  --region asia-northeast3 \
  --env-vars-file=.env.yaml
```

## 서비스 URL 확인

```bash
gcloud run services describe ddrise-homepage \
  --region asia-northeast3 \
  --format='value(status.url)'
```

## 로그 확인

```bash
gcloud run services logs read ddrise-homepage \
  --region asia-northeast3 \
  --limit 50
```

## 서비스 삭제

```bash
gcloud run services delete ddrise-homepage --region asia-northeast3
```

## 비용 최적화 팁

1. **최소 인스턴스 0으로 설정**: 트래픽이 없을 때 자동으로 스케일 다운
2. **메모리 및 CPU 조정**: 필요에 따라 512Mi/1CPU 조정
3. **리전 선택**: 서울(asia-northeast3) 사용으로 레이턴시 최소화

## 문제 해결

### 빌드 실패
- `pnpm-lock.yaml` 파일이 있는지 확인
- Node.js 버전 확인 (Dockerfile에서 node:20-alpine 사용)

### 배포 실패
- GCP API가 활성화되어 있는지 확인
- 프로젝트 ID가 정확한지 확인
- 리전이 유효한지 확인

### 서비스 접근 불가
- `--allow-unauthenticated` 플래그 확인
- 방화벽 규칙 확인
