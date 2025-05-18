import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useUserStore } from '../../store/userStore';
import { createPortal } from 'react-dom';

interface RequestInfoBadgeProps {
  className?: string;
}

export const RequestInfoBadge: React.FC<RequestInfoBadgeProps> = ({ className = '' }) => {
  const { requestInfo, refreshRequestInfo } = useUserStore();
  const [showDetails, setShowDetails] = useState(false);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, right: 0 });

  // 외부 클릭시 팝업 닫기 처리
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      popupRef.current && 
      !popupRef.current.contains(event.target as Node) &&
      badgeRef.current && 
      !badgeRef.current.contains(event.target as Node)
    ) {
      setShowDetails(false);
    }
  }, []);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 요청 정보가 없으면 가져오기
    if (!requestInfo) {
      refreshRequestInfo();
    }

    // 1분마다 정보 업데이트
    const intervalId = setInterval(() => {
      refreshRequestInfo();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [refreshRequestInfo, requestInfo]);

  // 팝업이 표시될 때만 document에 클릭 이벤트 리스너 추가
  useEffect(() => {
    if (showDetails) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDetails, handleClickOutside]);

  const toggleDetails = () => {
    if (!showDetails && badgeRef.current) {
      // 배지의 위치 정보 가져오기
      const rect = badgeRef.current.getBoundingClientRect();
      
      // 팝업 위치 계산
      setPopupPosition({
        top: rect.bottom + window.scrollY + 5, // 배지 아래 5px 여백
        right: window.innerWidth - rect.right
      });
    }
    
    setShowDetails(prev => !prev);
  };

  // 로딩 중이거나 요청 정보가 없는 경우 스켈레톤 UI 표시
  if (!requestInfo) {
    return (
      <span className="text-xs px-2 py-1 bg-gray-200 rounded-full animate-pulse">
        --/-- 요청 사용
      </span>
    );
  }
  
  // 사용 요청 수에 따른 색상 설정
  let badgeColorClass = 'bg-green-100 text-green-800'; // 기본 녹색 (안전)
  
  // 사용량 비율 계산
  const usageRatio = requestInfo.used / requestInfo.total;
  
  if (usageRatio >= 0.9) { // 90% 이상 사용
    badgeColorClass = 'bg-red-100 text-red-800'; // 빨간색 (위험)
  } else if (usageRatio >= 0.7) { // 70% 이상 사용
    badgeColorClass = 'bg-yellow-100 text-yellow-800'; // 노란색 (주의)
  }

  // 팝업 포털 생성
  const renderPopup = () => {
    if (!showDetails || !requestInfo) return null;
    
    return createPortal(
      <div 
        ref={popupRef}
        className="fixed z-50 bg-white rounded-modern shadow-lg min-w-[200px]"
        style={{ 
          top: `${popupPosition.top}px`, 
          right: `${popupPosition.right}px` 
        }}
      >
        <div className="p-3">
          <div className="text-sm font-semibold mb-2 text-gray-800">요청 정보</div>
          
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">총 요청 수:</span>
              <span className="font-medium">{requestInfo.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">사용한 요청:</span>
              <span className="font-medium">{requestInfo.used}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">남은 요청:</span>
              <span className={`font-medium ${usageRatio >= 0.9 ? 'text-red-600' : ''}`}>
                {requestInfo.remaining}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-gray-100">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="h-1.5 rounded-full" 
                style={{ 
                  width: `${(requestInfo.used / requestInfo.total) * 100}%`,
                  backgroundColor: usageRatio >= 0.9 ? '#ef4444' : 
                                  usageRatio >= 0.7 ? '#f59e0b' : '#10b981'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="relative">
      <span 
        ref={badgeRef}
        className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer ${badgeColorClass} ${className} hover:opacity-80 transition-opacity`}
        title="클릭하여 상세 정보 보기"
        onClick={toggleDetails}
      >
        {requestInfo.used}/{requestInfo.total} 요청 사용
      </span>
      
      {renderPopup()}
    </div>
  );
};

export default RequestInfoBadge; 