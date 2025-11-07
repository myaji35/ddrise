#!/bin/bash

# GCP Cloud Run 배포 스크립트
# 사용법: ./deploy.sh [PROJECT_ID] [SERVICE_NAME] [REGION]

set -e

# 변수 설정
PROJECT_ID=${1:-"your-project-id"}
SERVICE_NAME=${2:-"ddrise-homepage"}
REGION=${3:-"asia-northeast3"}  # 서울 리전
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "🚀 GCP Cloud Run 배포 시작..."
echo "   프로젝트: ${PROJECT_ID}"
echo "   서비스: ${SERVICE_NAME}"
echo "   리전: ${REGION}"
echo ""

# GCP 프로젝트 설정
echo "📋 GCP 프로젝트 설정..."
gcloud config set project ${PROJECT_ID}

# Docker 이미지 빌드
echo "🔨 Docker 이미지 빌드 중..."
docker build -t ${IMAGE_NAME}:latest .

# Google Container Registry에 푸시
echo "📤 이미지를 GCR에 푸시 중..."
docker push ${IMAGE_NAME}:latest

# Cloud Run에 배포
echo "🌐 Cloud Run에 배포 중..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars="NODE_ENV=production"

echo ""
echo "✅ 배포 완료!"
echo ""
echo "🔗 서비스 URL을 확인하려면 다음 명령어를 실행하세요:"
echo "   gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format='value(status.url)'"
