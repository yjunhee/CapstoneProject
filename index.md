<div align="center">
  <h1>Cultour (관광지 스탬프 투어)</h1>
  <p><strong>주변 문화재를 방문하고, 스탬프를 모으며 즐기는 역사 탐방 웹 서비스</strong></p>

  <a href="https://github.com/kookmin-sw/2026-capstone-03" target="_blank"><img src="https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github"></a>
  <br/><br/>
</div>

## 프로젝트 소개

> **"지루한 문화재 방문을 하나의 게임처럼 즐겁게!"**

**Cultour**는 온·오프라인을 융합하여 사용자에게 새로운 역사 탐험 경험을 제공합니다. 
사용자는 지도를 통해 주변 문화재를 확인하고, **실시간 웹캠을 통한 방문 인증(AI 객체 인식)**과 **역사 퀴즈**를 통해 자신만의 스탬프 컬렉션을 완성할 수 있습니다. 모은 스탬프는 교환소에서 다양한 리워드로 교환하며 성취감을 얻을 수 있습니다.

<br/>

## 프로젝트 포스터

<div align="center">
  <img src="./assets/poster.png" width="80%" alt="Cultour 포스터">
</div>

<br/>

## 시연 영상 및 발표 자료

<div align="center">
  <h3>시연 영상 (YouTube)</h3>
  <a href="https://youtube.com/shorts/S-W0BrJ09cg">
    <img src="https://img.shields.io/badge/YouTube-시연_영상_보러가기-FF0000?style=for-the-badge&logo=youtube" alt="Youtube">
  </a>
</div>

<div align="center">
  <h3>발표 자료 (PPT)</h3>
  <a href="https://여기에PPT링크">
    <img src="https://img.shields.io/badge/PDF-발표_자료_다운로드-E34F26?style=for-the-badge&logo=pdf" alt="PPT">
  </a>
</div>

<br/>

## 주요 기능

| 위치 기반 인터랙티브 지도 | AI 실시간 카메라 인증 |
|:---:|:---:|
| <img src="./assets/Map.png" width="50%"> | <img src="./assets/AI_Camera.png" width="50%"> |
| **카카오 맵 API**를 활용하여 내 주변 문화재와 획득 가능한 스탬프의 위치를 직관적으로 보여줍니다. | 랜드마크 앞에서 카메라를 켜면 **AI 객체 인식**을 통해 실제 방문 여부를 실시간으로 인증합니다. |

<br/>

| 역사 퀴즈 시스템 | 리워드 교환소 |
|:---:|:---:|
| <img src="./assets/Quiz.png" width="50%"> | <img src="./assets/Reward.png" width="50%"> |
| 인증을 마치면 해당 문화재와 관련된 **O/X 퀴즈**가 출제되어 역사적 지식을 자연스럽게 습득합니다. | 지역별 수집률을 한눈에 확인하고, 모은 스탬프로 상품권, 굿즈 등 **실제 리워드로 교환**합니다. |

<br/>

## 시스템 아키텍처

<div align="center">
  <img src="./assets/architecture.png" width="90%" alt="시스템 아키텍처">
</div>

* **Client:** React (TypeScript) 기반의 반응형 PWA 구축
* **Server:** Spring Boot 기반 RESTful API 및 JWT + OAuth2 보안 설계
* **AI/WebSocket:** Python 서버를 통한 실시간 이미지 프레임 객체 인식 처리
* **Database & Infra:** MySQL, AWS Lightsail을 이용한 무중단 배포 환경

<br/>

## 기술 스택

### Frontend
<p>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
</p>

### Backend
<p>
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white">
  <img src="https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
</p>

### AI
<p>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white">
</p>

### Infra & Tools
<p>
  <img src="https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white">
</p>

<br/>

## 팀원 소개

| 프로필 사진 | 이름(학번) | 역할 및 담당 업무 | GitHub |
| :---: | :---: | :--- | :---: |
| <img src="https://avatars.githubusercontent.com/u/85243418?v=4" width="80" height="80" style="border-radius:50%;"> | **문지환** | **Team Leader & Frontend** <br/> - 기획 및 프로젝트 총괄 <br/> - React 기반 UI/UX 설계 및 개발 <br/> - 맵 지도 연동 및 스탬프 비즈니스 로직 구현 | [@munjihwan020627](https://github.com/munjihwan020627) |
| <img src="https://avatars.githubusercontent.com/u/145461925?v=4" width="80" height="80" style="border-radius:50%;"> | **김효준** | **AI** <br/> - 실시간 웹캠 비디오 프레임 전송 로직 구현 <br/> - 랜드마크 객체 인식 AI 모델 학습 및 최적화 | [@SoftwareJun](https://github.com/SoftwareJun) |
| <img src="https://avatars.githubusercontent.com/u/85819413?v=4" width="80" height="80" style="border-radius:50%;"> | **박상윤** | **Backend** <br/> - Spring Boot 백엔드 API 설계 및 개발 <br/> - JWT 및 OAuth2 기반 보안 아키텍처 구현 <br/> - DB 설계 및 구축 | [@Park-Sangyun](https://github.com/Park-Sangyun) |
| <img src="https://avatars.githubusercontent.com/u/82225260?v=4" width="80" height="80" style="border-radius:50%;"> | **윤준희** | **Backend** <br/> - Spring Boot 백엔드 API 설계 및 개발 <br/> - 맵 지도 연동 및 스탬프 비즈니스 로직 구현 <br/> - Python WebSocket 통신 서버 구축 | [@yjunhee](https://github.com/yjunhee) |
