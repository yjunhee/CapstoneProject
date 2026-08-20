# 관광지 스탬프 투어 - CULTOUR

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-팀%20페이지%20바로가기-blue?style=for-the-badge&logo=github)](https://kookmin-sw.github.io/2026-capstone-03/)

> **주변 문화재를 방문하고, 스탬프를 모으며 즐기는 역사 탐방 웹 서비스입니다.**

> GPS 기반 지도 안내, 실시간 카메라 객체 인식 인증, 퀴즈 시스템을 통해 지루할 수 있는 유적지 방문을 하나의 게임처럼 즐길 수 있도록 돕습니다.

<br/>

## 1. 프로젝트 소개

**관광지 스탬프 투어**는 사용자가 직접 랜드마크 및 문화재를 방문하여 스탬프를 획득하고, 달성률에 따라 보상을 받을 수 있는 서비스입니다. 

### 주요 기능 (Preview)
- **카메라/AI 인증:** 해당 장소에서 카메라를 켜면 AI가 객체를 인식하여 방문을 인증합니다.
- **스탬프 & 퀴즈 투어:** 장소에 얽힌 역사 퀴즈를 풀고 스탬프를 획득할 수 있습니다.
- **리워드 시스템 (선물 교환소):** 모은 스탬프를 활용해 상품으로 교환할 수 있습니다.
- **내 프로필 & 도전과제:** 다양한 도전과제에 도전 할 수 있습니다.

### 기술 스택 (Tech Stack)
- **Frontend:** React, TypeScript, Tailwind CSS, Kakao Maps API
- **Backend:** Spring Boot, Spring Security (JWT), OAuth2 (Google, Kakao, Naver), Node.js
- **Database:** MySQL
- **AI:** Python

<br/>
## 2. 소개 영상

프로젝트의 실제 동작 화면과 주요 기능을 담은 시연 영상입니다.

[![관광지 스탬프 투어 시연 영상](https://img.shields.io/badge/YouTube-시연%20영상%20보러가기-red?style=for-the-badge&logo=youtube)](https://youtube.com/shorts/S-W0BrJ09cg)

^^^영상 넣어야함^^^

*(※ 위 링크를 클릭하면 YouTube 소개 영상으로 이동합니다.)*

<br/>

## 3. 팀 소개

| 사진 | 이름 | 역할 및 담당 | 연락처 및 SNS |
| :---: | :---: | :--- | :--- |
| <img src="https://avatars.githubusercontent.com/u/85243418?v=4" width="100" height="100"/> | **문지환** | **Team Leader / Frontend**<br/>- 기획 및 프로젝트 총괄<br/>- React 기반 UI/UX 설계 및 개발<br/>-  맵 지도 연동 및 스탬프 비즈니스 로직 구현| [GitHub](https://github.com/munjihwan020627)<br/>[Email](mailto:aa020627@kookmin.ac.kr) |
| <img src="https://avatars.githubusercontent.com/u/145461925?v=4" width="100" height="100"/> | **김효준** | **AI**<br/>- 실시간 웹캠 비디오 프레임 전송 로직 구현<br/>- 랜드마크 객체 인식 AI 모델 설계, 학습 및 최적화<br/>- | [GitHub](https://github.com/SoftwareJun)<br/>[Email](mailto:junjungdong@kookmin.ac.kr) |
| <img src="https://avatars.githubusercontent.com/u/85819413?v=4" width="100" height="100"/> | **박상윤** | **Backend / Data**<br/>- Spring Boot 백엔드 API 설계 및 개발<br/>-  JWT 및 OAuth2 기반 보안 아키텍처 구현<br/>- DB 설계 및 구축| [GitHub](https://github.com/Park-Sangyun)<br/>[Email](mailto:a5653a@kookmin.ac.kr) |
| <img src="https://avatars.githubusercontent.com/u/82225260?v=4" width="100" height="100"/> | **윤준희** | **Backend / Data**<br/>- Spring Boot 백엔드 API 설계 및 개발<br/>- WebSocket 통신 서버 구축<br/>- 맵 지도 연동 및 스탬프 비즈니스 로직 구현| [GitHub](https://github.com/yjunhee)<br/>[Email](mailto:junhee1129@kookmin.ac.kr) |

<br/>

## 4. 설치 및 사용법 (Installation & Usage)

본 프로젝트를 로컬 환경에서 실행하기 위한 설치 방법입니다.

### 사전 요구사항 (Prerequisites)
- Java 26 
- Node.js 18.x 이상
- MySQL 8.0 이상

### 설치 및 실행 방법

**1. Repository 클론**
```bash
git clone https://github.com/kookmin-sw/2026-capstone-03.git
cd 2026-capstone-03
```

**2. DB (MySQL) 구성**
```bash
cd Backend/DB_p
mysql -u root -p < db.sql
```

**3. Backend (Spring Boot) 실행**
```bash
cd Backend/backend
# spring boot 실행 전, src/main/resources/application.template.properties 파일에 MySQL 접속 정보 및 OAuth API Key 세팅 후 application.properties로 복사
./gradlew bootRun
```
* 서버가 `http://localhost:5000` 에서 실행됩니다.

**4. Frontend (React) 실행**
```bash
cd Frontend
npm install
npm run dev
```
* 프론트엔드가 `http://localhost:5173` 에서 실행됩니다.

<br/>
