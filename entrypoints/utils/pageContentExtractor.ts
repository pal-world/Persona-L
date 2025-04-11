export const extractPageContent = (): string => {
  // 메타 태그, 스크립트 등을 제외한 본문 내용만 추출
  const bodyText = document.body.innerText;

  // 주요 콘텐츠 영역 찾기
  const mainContentSelectors = [
    'article',
    'main',
    '.content',
    '.post',
    '.article',
    '#content',
    '#main',
    '.post-content',
    '.entry-content',
    '.se-main-container',
    '.post-view',
    '#postViewArea',
  ];

  // 1. 먼저 본문에서 콘텐츠 찾기
  for (const selector of mainContentSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent && element.textContent.length > 100) {
      return element.textContent.trim();
    }
  }

  // 2. 본문의 단락에서 콘텐츠 찾기
  const paragraphs = document.querySelectorAll('p');
  if (paragraphs.length > 0) {
    let content = '';
    paragraphs.forEach((p) => {
      if (p.textContent && p.textContent.trim().length > 20) {
        content += p.textContent.trim() + '\n\n';
      }
    });

    if (content.length > 100) {
      return content;
    }
  }

  // 3. 본문에서 충분한 콘텐츠를 찾지 못한 경우 iframe 확인
  try {
    const iframes = document.querySelectorAll('iframe');
    if (iframes.length > 0) {
      for (const iframe of iframes) {
        try {
          // 동일 출처 정책으로 인해 접근 가능한 iframe만 처리 가능
          if (iframe.contentDocument) {
            const iframeContent = iframe.contentDocument.body.innerText;
            if (iframeContent && iframeContent.length > 100) {
              return iframeContent.trim();
            }

            // iframe 내부의 주요 콘텐츠 영역 찾기
            for (const selector of mainContentSelectors) {
              const element = iframe.contentDocument.querySelector(selector);
              if (element && element.textContent && element.textContent.length > 100) {
                return element.textContent.trim();
              }
            }

            // iframe 내부의 단락 찾기
            const iframeParagraphs = iframe.contentDocument.querySelectorAll('p');
            if (iframeParagraphs.length > 0) {
              let content = '';
              iframeParagraphs.forEach((p) => {
                if (p.textContent && p.textContent.trim().length > 20) {
                  content += p.textContent.trim() + '\n\n';
                }
              });

              if (content.length > 100) {
                return content;
              }
            }
          }
        } catch (e) {
          console.log('iframe 접근 오류:', e);
          // CORS 정책으로 인해 접근이 제한될 수 있음
        }
      }
    }
  } catch (e) {
    console.log('iframe 처리 오류:', e);
  }

  // 4. 최후의 방법으로 body 텍스트 반환 (최대 5000자)
  return bodyText.substring(0, 5000);
};
