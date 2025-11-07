#!/bin/bash

# GCP Cloud Build를 사용한 배포 (Docker 로컬 설치 불필요)
# 사용법: ./deploy-cloudbuild.sh [PROJECT_ID] [SERVICE_NAME] [REGION]

set -e

# 변수 설정
PROJECT_ID=${1:-"your-project-id"}
SERVICE_NAME=${2:-"ddrise-homepage"}
REGION=${3:-"asia-northeast3"}

echo "🚀 GCP Cloud Build를 사용한 배포 시작..."
echo "   프로젝트: ${PROJECT_ID}"
echo "   서비스: ${SERVICE_NAME}"
echo "   리전: ${REGION}"
echo ""

# GCP 프로젝트 설정
echo "📋 GCP 프로젝트 설정..."
gcloud config set project ${PROJECT_ID}

# Cloud Build 사용하여 빌드 및 배포
echo "🔨 Cloud Build로 이미지 빌드 및 배포 중..."
gcloud run deploy ${SERVICE_NAME} \
  --source . \
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
echo "🔗 서비스 URL:"
gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format='value(status.url)'
