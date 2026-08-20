# 관광지 스탬프 투어 - CULTOUR

## 캡스톤 프로젝트
> **주변 문화재를 방문하고, 스탬프를 모으며 즐기는 역사 탐방 웹 서비스입니다.**
>
> GPS 기반 지도 안내, 실시간 카메라 객체 인식 인증, 퀴즈 시스템을 통해 지루할 수 있는 유적지 방문을 하나의 게임처럼 즐길 수 있도록 돕습니다.


## 프로젝트 개요

**관광지 스탬프 투어**는 사용자가 직접 랜드마크 및 문화재를 방문하여 스탬프를 획득하고, 달성률에 따라 보상을 받을 수 있는 서비스입니다. 

### 주요 기능

- **카메라/AI 인증:** 해당 장소에서 카메라를 켜면 AI가 객체를 인식하여 방문을 인증합니다.
- **스탬프 획득:** 장소에 얽힌 역사 퀴즈를 풀고 스탬프를 획득할 수 있습니다.
- **리워드 시스템:** 모은 스탬프를 소모해 상품과 교환할 수 있습니다.
- **도전과제 시스템:** 다양한 도전과제에 도전 할 수 있습니다.

### 시스템 아키텍처

<img width="728" height="1095" alt="Image" src="https://github.com/user-attachments/assets/62524361-e16b-4165-9d31-d4dcf55c814f" />

### 기술 스택
| 분류 | 기술 스택 |
| :--- | :--- |
| **Frontend** |  React, TypeScript, Tailwind CSS, Kakao Maps API |
| **Backend** | Spring Boot, Spring Security (JWT), OAuth2 (Google, Kakao, Naver), Node.js |
| **Database** | MySQL |
| **AI** | Python |

## 담당 기능

| 담당 기능 | 주요 구현 내용 |
|---|---|
| Backend API | Spring Boot 기반 Controller-Service-Repository 구조 및 REST API 구현 |
| 실시간 AI 인증 | Spring WebSocket ↔ Python AI 서버 간 실시간 이미지 및 인증 결과 통신 구현 |
| 스탬프 시스템 | 사용자-관광지 관계 기반 스탬프 발급 및 DB Unique Constraint를 통한 중복 획득 방지 |
| 지도 서비스 | Kakao Map API를 활용한 관광지 위치 및 Marker 표시 |

### 핵심 구현

**Spring Boot Backend**

Controller → Service → Repository 계층을 분리하여 사용자, 관광지, 퀴즈, 스탬프 관련 REST API를 구현했습니다.

**WebSocket 기반 AI 인증**

사용자의 카메라 이미지를 WebSocket을 통해 Spring Boot 서버에서 Python AI 서버로 전달하고, AI 서버에서 계산한 이미지 유사도 및 인증 결과를 다시 Frontend로 전달하는 실시간 통신 구조를 구축했습니다.

**스탬프 중복 방지**

사용자와 관광지의 조합에 Unique Constraint를 적용하여 동일 관광지의 스탬프가 중복 저장되지 않도록 데이터베이스 수준에서 정합성을 보장했습니다.

**Kakao Map**

Kakao Map API를 활용하여 관광지 위치를 지도에 표시하고 사용자가 관광지를 탐색한 후 상세 정보 및 방문 인증으로 이어질 수 있도록 구현했습니다.

## 팀원

| 사진 | 이름 | 역할 및 담당 | 연락처 및 SNS |
| :---: | :---: | :--- | :--- |
| <img src="https://avatars.githubusercontent.com/u/85243418?v=4" width="100" height="100"/> | **문지환** | **Team Leader / Frontend**<br/>- 기획 및 프로젝트 총괄<br/>- React 기반 UI/UX 설계 및 개발<br/>-  맵 지도 연동 및 스탬프 비즈니스 로직 구현| [GitHub](https://github.com/munjihwan020627)<br/>[Email](mailto:aa020627@kookmin.ac.kr) |
| <img src="https://avatars.githubusercontent.com/u/145461925?v=4" width="100" height="100"/> | **김효준** | **AI**<br/>- 실시간 웹캠 비디오 프레임 전송 로직 구현<br/>- 랜드마크 객체 인식 AI 모델 설계, 학습 및 최적화<br/>- | [GitHub](https://github.com/SoftwareJun)<br/>[Email](mailto:junjungdong@kookmin.ac.kr) |
| <img src="https://avatars.githubusercontent.com/u/85819413?v=4" width="100" height="100"/> | **박상윤** | **Backend / Data**<br/>- Spring Boot API 설계 및 개발<br/>-  JWT 및 OAuth2 기반 보안 아키텍처 구현<br/>- DB 설계 및 구축| [GitHub](https://github.com/Park-Sangyun)<br/>[Email](mailto:a5653a@kookmin.ac.kr) |
| <img src="https://avatars.githubusercontent.com/u/82225260?v=4" width="100" height="100"/> | **윤준희** | **Backend / Data**<br/>- Spring Boot API 설계 및 개발<br/>- WebSocket 구축<br/>- Kakao Map API 연동 및 스탬프 로직 구현| [GitHub](https://github.com/yjunhee)<br/>[Email](mailto:junhee1129@kookmin.ac.kr) |

## 링크
### Git 페이지
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-팀%20페이지%20바로가기-blue?style=for-the-badge&logo=github)](https://kookmin-sw.github.io/2026-capstone-03/)

### 소개 영상
[![관광지 스탬프 투어 시연 영상](https://img.shields.io/badge/YouTube-시연%20영상%20보러가기-red?style=for-the-badge&logo=youtube)](https://youtube.com/shorts/S-W0BrJ09cg)


