# Persona-L

<div align="center">
  <img src="assets/icon.png" alt="Persona-L 로고" width="120" height="120" />
  <h3>작가의 마음으로 글을 이해하세요</h3>
</div>

## 프로젝트 소개

**Persona-L**은 웹 페이지의 글을 분석하여 작가의 페르소나를 생성하고, 그 작가와 직접 대화할 수 있는 크롬 확장 프로그램입니다. 이 프로젝트는 독자가 작가의 의도와 생각을 더 깊이 이해할 수 있도록 도와줍니다.

> **이름의 의미**: "Persona-L"은 작가의 **Persona**(페르소나)와 **Personal**(개인적인) 대화를 나눈다는 의미를 담고 있습니다. 작가의 관점에서 글을 이해하고 개인적인 대화를 통해 더 깊은 통찰을 얻을 수 있습니다.

## 주요 기능

- **작가 페르소나 생성**: 웹 페이지의 텍스트를 분석하여 작가의 페르소나를 자동으로 생성합니다.
- **작가와의 대화**: 생성된 페르소나를 바탕으로 작가와 직접 대화할 수 있습니다.
- **대화 내역 관리**: 사이트별로 대화 내역을 저장하고 검색할 수 있습니다.
- **직관적인 UI/UX**: 사용자 친화적인 인터페이스로 쉽게 사용할 수 있습니다.

## 설치 방법

1. 저장소를 클론합니다:

   ```bash
   git clone https://github.com/Kim-DaeHan/Persona-L.git
   cd Persona-L
   ```

2. 의존성을 설치합니다:

   ```bash
   bun install
   ```

3. 개발 모드로 실행합니다:

   ```bash
   bun run dev
   ```

4. 빌드합니다:

   ```bash
   bun run build
   ```

5. 크롬 확장 프로그램으로 로드하기:
   - 크롬 브라우저에서 `chrome://extensions/` 페이지로 이동합니다.
   - 개발자 모드를 활성화합니다.
   - "압축해제된 확장 프로그램을 로드합니다" 버튼을 클릭합니다.
   - 빌드된 `dist` 폴더를 선택합니다.

## 사용 방법

1. 크롬 브라우저에서 확장 프로그램을 설치합니다.
2. OpenAI API 키를 설정합니다.
3. 분석하고 싶은 글이 있는 웹 페이지에서 확장 프로그램 아이콘을 클릭합니다.
4. "페르소나 생성" 버튼을 클릭하여 작가의 페르소나를 생성합니다.
5. 생성된 페르소나와 대화를 시작합니다.
6. 대화 내역은 자동으로 저장되며, 상단의 리스트 아이콘을 클릭하여 확인할 수 있습니다.

## 기술 스택

- **프론트엔드**: React, TypeScript, Tailwind CSS
- **확장 프로그램**: WXT (Web Extension Tools)
- **AI 통합**: OpenAI API
- **상태 관리**: Zustand
- **패키지 관리자**: Bun

## 기여하기

프로젝트에 기여하고 싶으시다면 다음 단계를 따라주세요:

1. 이 저장소를 포크합니다.
2. 새 브랜치를 생성합니다: `git checkout -b feature/amazing-feature`
3. 변경사항을 커밋합니다: `git commit -m 'Add some amazing feature'`
4. 브랜치에 푸시합니다: `git push origin feature/amazing-feature`
5. Pull Request를 제출합니다.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 연락처

프로젝트 관리자: [이메일 주소](kjs50458281@gmail.com)

---

<div align="center">
  <p>작가의 마음으로 글을 이해하세요 - Persona-L</p>
</div>
