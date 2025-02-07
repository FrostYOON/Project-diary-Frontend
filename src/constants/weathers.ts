// 도시 이름 한글 변환 맵
export const CITY_NAME_KR: Record<string, string> = {
  'Seoul': '서울',
  'Incheon': '인천',
  'Gunpo': '군포',
  'Suwon': '수원',
  'Seongnam': '성남',
  'Goyang': '고양',
  'Yongin': '용인',
  'Gimpo': '김포',
  'Hanam': '하남',
  'Busan': '부산',
  'Daegu': '대구',
  'Daejeon': '대전',
  'Gwangju': '광주',
  'Ulsan': '울산',
  'Sejong': '세종',
  'Jeonju': '전주'
};

// 날씨 관련 설정
export const WEATHER_CONFIG = {
  FETCH_INTERVAL: 300000,  // 5분
  ROTATION_INTERVAL: 5000, // 5초
  TRANSITION_DELAY: 50,    // 0.05초
  SLIDE_DURATION: 500      // 0.5초
};

// 날씨 API 관련
export const WEATHER_API = {
  ICON_URL: 'https://openweathermap.org/img/w',
  ENDPOINT: '/weather'
};