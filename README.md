# CULTOUR — 관광지 스탬프 투어

> 관광지 탐방에 카메라 이미지 인증과 역사 퀴즈를 결합한 웹 서비스입니다.

> 4인 캡스톤 프로젝트에서 백엔드 API, Spring–Python WebSocket 연동,
> 스탬프 처리 및 지도 연동을 담당했습니다.

## 프로젝트 소개

**CULTOUR**는 사용자가 문화재와 랜드마크를 탐색하고,
카메라 이미지 인증과 역사 퀴즈를 통해 스탬프를 수집하는 서비스입니다.

관광지를 단순히 관람하는 것에 그치지 않고,
현장에서 문화재를 촬영하고 관련 퀴즈를 풀며 탐방에 참여하도록 기획했습니다.

이 저장소는 팀 프로젝트를 바탕으로 제가 담당한 구현과
개발 과정에서 배운 내용을 정리한 저장소입니다.

| 항목 | 내용 |
| --- | --- |
| **개발 기간** | 2026.02 ~ 2026.06 |
| **개발 인원** | 4명 |
| **담당 역할** | 백엔드, WebSocket 연동, 스탬프 처리, 지도 연동 |
| **팀 페이지** | https://kookmin-sw.github.io/2026-capstone-03/ |


## 담당 영역

| 영역 |  담당 내용 |
| --- | --- |
| **백엔드 API** | Spring Boot 기반 API 설계 및 구현 |
| **AI 서버 연동** | Spring WebSocket을 통한 이미지 전달 및 인식 결과 연결 |
| **스탬프 처리** | 인증된 사용자 정보를 이용한 스탬프 저장 API 구현 |
| **중복 획득 방지** | 사용자–관광지 조합의 DB unique 제약을 활용한 중복 저장 방지 |
| **지도 연동** | Kakao Maps API를 활용한 관광지 위치 표시 및 탐색 흐름 연결 |

JWT·OAuth2 인증 구조와 AI 모델 개발은 다른 팀원이 담당했습니다.
저는 해당 기능과 연동되는 API 및 이미지·결과 전달 흐름을 구현했습니다.

## 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| **Backend** | Java, Spring Boot, Spring Data JPA, Spring WebSocket |
| **Database** | MySQL |
| **Frontend** | React, TypeScript|
| **외부 연동** | Kakao Maps API |
| **AI 서버** | Python |

## 아키텍처

<img width="728" height="1095" alt="Image" src="https://github.com/user-attachments/assets/62524361-e16b-4165-9d31-d4dcf55c814f" />

## 주요 구현

### 1. Spring–Python WebSocket 연동

브라우저에서 받아온 카메라 이미지를 Spring Boot 서버를 거쳐
Python AI 서버로 전달하고, 분석 결과를 다시 브라우저으로 돌려주는 구조를 구현했습니다.

처리 흐름은 다음과 같습니다.

1. 브라우저에서 카메라 프레임을 이미지 데이터로 생성한다.
2. 이미지와 관광지 식별 정보를 WebSocket으로 전송한다.
3. Spring Boot 서버가 이미지를 Python AI 서버로 전송한다.
4. AI 서버가 대상 이미지와의 유사도를 계산한다.
5. Spring Boot 서버가 분석 결과를 브라우저에 전송한다.
6. 브라우저에서 인식 상태를 표시하고 다음 단계로 연결한다.

HTTP 요청마다 결과를 조회하는 방식 대신,
연결을 유지하면서 이미지와 결과를 주고받도록 구성했습니다.

이 과정에서 Spring 서버뿐 아니라 프론트엔드와 Python 서버가
동일한 메시지 형식을 사용하도록 맞추는 작업이 필요했습니다.

**관련 코드**:

- [Spring WebSocket Handler](Backend/backend/src/main/java/com/stamptour/backend/service/MyWebSocketHandler.java)
- [WebSocket 설정](Backend/backend/src/main/java/com/stamptour/backend/service/WebSocketConfig.java)
- [Python 연동 코드](AI/websocket_main.py)
- [카메라 화면](Frontend/src/app/pages/CameraPage.tsx)

### 2. 스탬프 저장과 중복 획득 방지

사용자와 관광지를 연결하는 스탬프 데이터를 저장하도록 구현했습니다.

스탬프 저장 API는 JWT 인증으로 확인한 사용자 정보를 사용하며,
클라이언트가 전달한 관광지 ID와 함께 획득 내역을 저장합니다.

동일한 사용자가 같은 관광지의 스탬프를 여러 번 저장하지 못하도록
DB 초기화 SQL에 unique 제약을 적용했습니다.

```sql
UNIQUE KEY unique_user_landmark (user_id, landmark_id)
```

**관련 코드**:

- [스탬프 API](Backend/backend/src/main/java/com/stamptour/backend/controller/StampController.java)
- [스탬프 엔티티](Backend/backend/src/main/java/com/stamptour/backend/entity/Stamp.java)
- [DB 스키마](Backend/DB_p/db.sql)

### 3. 관광지 조회와 스탬프 수집 상태 연결

관광지 목록과 현재 사용자의 스탬프 데이터를 조회한 뒤,
관광지별 수집 여부를 포함한 응답을 구성했습니다.

사용자의 스탬프를 관광지 ID 기준으로 묶고,
관광지 목록과 연결해 수집 여부와 획득 시각을 전달했습니다.

프론트엔드는 해당 정보를 이용해 방문한 관광지와
아직 방문하지 않은 관광지를 구분해 표시합니다.

관련 코드:

- [관광지 조회 서비스](Backend/backend/src/main/java/com/stamptour/backend/service/LandmarkService.java)
- [관광지 응답 DTO](Backend/backend/src/main/java/com/stamptour/backend/dto/LandmarkDTO.java)

### 4. Kakao Maps API 연동

관광지의 좌표를 이용해 지도에 위치와 마커를 표시하고,
관광지 탐색에서 상세 정보와 카메라 인증으로 이어지는 흐름을 구현했습니다.

지도 표시와 서버 데이터 처리는 역할을 나누어 진행했으며,
프론트엔드 담당자와 관광지 식별 정보 및 데이터 형식을 맞췄습니다.

## 현재 구현

| 기능 | 구현 상태 |
| --- | --- |
| 관광지 지도 표시 및 탐색 | 구현 |
| Spring–Python 이미지·분석 결과 중계 | 구현 |
| 퀴즈 화면 및 클라이언트 정답 판정 | 구현 |
| 사용자별 스탬프 저장 | 구현 |
| DB 제약을 통한 중복 스탬프 저장 방지 | 구현 |

## 한계와 개선 방향

### 다중 사용자 WebSocket 처리

현재 WebSocket 연결 코드는 브라우저 세션 하나를 보관하는 구조입니다.
여러 사용자가 동시에 접속하는 환경에서는 요청과 응답을
사용자별로 구분하는 처리가 필요합니다.

사용자·세션과 요청 식별자를 연결하고,
AI 결과를 원래 요청자에게만 전달하는 구조로 개선하고자 합니다.

### 서버 측 발급 자격 검증

현재 스탬프 API는 사용자 인증과 DB 저장을 처리하지만,
방문 인증 완료와 퀴즈 통과 여부를 서버에서 확인하지 않습니다.

방문 인증 결과를 사용자·관광지와 연결해 보관하고,
서버 채점과 발급 조건 검증을 추가하는 것이 개선 과제입니다.


## 실행 환경

- Java 17
- MySQL 8
- Node.js 및 npm
- Python과 AI 모델 실행에 필요한 패키지
- Kakao Maps 및 OAuth 제공자 설정

### 백엔드

1. MySQL에 `Backend/DB_p/db.sql`을 적용합니다.
2. `application.template.properties`를 참고해 실행 설정을 구성합니다.
3. DB 접속 정보, JWT 키, OAuth 설정을 입력합니다.
4. 백엔드 폴더에서 실행합니다.

> 기존 DB 초기화 SQL에는 테이블 삭제 구문이 있으므로,
> 데이터가 있는 DB에 실행하기 전 내용을 확인해야 합니다.

```bash
cd Backend/backend
./gradlew bootRun
```

Windows에서는 다음 명령을 사용합니다.

```powershell
cd Backend/backend
.\gradlew.bat bootRun
```

### 프론트엔드

```bash
cd Frontend
npm install
npm run dev
```

### AI 서버

AI 모델과 참조 임베딩을 준비하고,
필요한 Python 패키지를 설치한 뒤 실행합니다.

```bash
cd AI
python websocket_main.py
```

**(주의) 현재 코드에는 로컬 서버 주소를 사용하는 부분이 있으므로,
실행 환경이 달라질 경우 API·WebSocket·OAuth callback 주소를
함께 확인해야 합니다.
실제 비밀값이 포함된 설정 파일은 공개 저장소에 올리지 않습니다.**

## 팀 구성

| 이름 | 담당 |
| --- | --- |
| 문지환 | 팀장, 프론트엔드, 지도 및 스탬프 화면 |
| 김효준 | AI 모델 개발 및 이미지 처리 |
| 박상윤 | 백엔드 API, JWT·OAuth2 인증, DB 설계 |
| 윤준희 | 백엔드 API, WebSocket 연동, 지도 연동 및 스탬프 처리 |

## 프로젝트 링크

- [팀 저장소](https://github.com/kookmin-sw/2026-capstone-03)
- [개인 저장소](https://github.com/yjunhee/CapstoneProject)
- [팀 프로젝트 소개 페이지](https://kookmin-sw.github.io/2026-capstone-03/)
- [시연 영상](https://youtube.com/shorts/S-W0BrJ09cg)
