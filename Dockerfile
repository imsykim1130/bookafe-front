# 프로젝트 빌드
FROM node:20 as front

WORKDIR /app

# package 설치
# 패키지 설치는 오래 걸리기 때문에 다른 레이어로 실행하여 캐싱 이용
COPY package*.json ./
RUN npm install

# 나머지 빌드에 필요한 파일 복사 후 빌드
COPY . .
RUN npm run build

# nginx
FROM nginx:alpine
# nginx 설정 파일
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# nginx 의 /usr/share/nginx/html 폴더에 빌드 결과물 옮기기
COPY --from=front /app/dist /usr/share/nginx/html
ENTRYPOINT [ "nginx", "-g", "daemon off;"