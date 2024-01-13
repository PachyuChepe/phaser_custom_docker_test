# Node.js 환경 설정
FROM node:18-buster
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 애플리케이션 파일 복사
COPY . .

# 애플리케이션 실행 포트 설정
EXPOSE 8080

# 애플리케이션 실행
CMD ["npm", "start"]
