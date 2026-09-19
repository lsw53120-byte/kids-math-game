// 6세 맞춤형 수학 모험 게임 로직

// 레벨 및 난이도별 목표 설정 (1단계: 1~5 추가 및 4단계 체계)
const LEVEL_CONFIG = {
  1: { level: 1, name: '1단계 (1~5)', targetStars: 5, rangeName: '1부터 5까지 기초 셈', reward: '👑' },
  2: { level: 2, name: '2단계 (6~10)', targetStars: 7, rangeName: '6부터 10까지 셈', reward: '🏆' },
  3: { level: 3, name: '3단계 (11~15)', targetStars: 8, rangeName: '11부터 15까지 셈', reward: '🌟' },
  4: { level: 4, name: '4단계 (16~20)', targetStars: 10, rangeName: '20까지 최고 마스터', reward: '🚀' }
};

// 전역 상태
const STATE = {
  stars: 0,
  currentMode: null, // 'add', 'sub', 'quiz'
  difficulty: 1,     // 1단계: 1~5, 2단계: 6~10, 3단계: 11~15, 4단계: 16~20
  stageStars: 0,     // 현재 레벨 목표 달성용 별 개수
  currentTheme: 'animals', // 'animals', 'dino', 'space', 'car'
  currentProblem: null,
  eatenCount: 0,
  poppedCount: 0,
  stickers: [],
  soundMuted: false,
};

// 스티커 풀 (보상용 귀여운 이모지들)
const STICKER_POOL = [
  '⭐', '🌟', '🌈', '🍭', '🍓', '🧁', '🍦', '🍕',
  '🐶', '🐱', '🐰', '🐻', '🐼', '🦁', '🦖', '🚀',
  '🏎️', '⚽', '👑', '🎁', '🎈', '💖', '🦄', '🐣',
  '🏆', '🎪', '🛸', '💎', '🍉', '🥨', '🍰', '🐬'
];

// 테마 정의 (자연스러운 쉼표 호흡 및 다정한 말투 적용)
const THEMES = {
  animals: {
    id: 'animals',
    name: '동물 친구들',
    mascot: '🐻',
    title: '냠냠 팡팡!<br>수학 놀이터',
    voiceIntro: '안녕! 귀여운 동물 친구들과 신나게 놀아봐요!',
    targets: [
      { icon: '🐻', name: '곰돌이' },
      { icon: '🐰', name: '토끼' },
      { icon: '🐼', name: '판다' },
      { icon: '🐶', name: '강아지' },
      { icon: '🐱', name: '야옹이' },
      { icon: '🦁', name: '사자' }
    ],
    addItems: ['🍎', '🍓', '🍌', '🍇', '🥕', '🍩', '🍪', '🥞'],
    addPrompt: (t, n1, n2) => `${t.name}에게, 간식 ${n1}개와, ${n2}개를 줄 거야. 모두 몇 개일까?`,
    addTitle: (t) => `${t.icon} ${t.name}에게 줄 간식은 모두 몇 개일까?`,
    addFeedAction: () => window.sound.playNom(),
    subItems: ['🎈', '🔴', '🟡', '🟢', '🟣', '🟠', '🔵'],
    subPrompt: (n1, n2) => `풍선 ${n1}개 중에, ${n2}개를 톡 터뜨려봐! 남은 풍선은 몇 개일까?`,
    subTitle: (n2) => `풍선 ${n2}개를 톡! 터뜨리고 남은 개수를 맞춰봐!`,
    subUnit: '개',
    subAction: () => window.sound.playPop()
  },
  dino: {
    id: 'dino',
    name: '공룡 대탐험',
    mascot: '🦖',
    title: '쿵쿵 크아앙!<br>공룡 수학 모험',
    voiceIntro: '쿵쿵! 멋진 공룡 대탐험을 시작해요!',
    targets: [
      { icon: '🦖', name: '티라노' },
      { icon: '🦕', name: '브라키오' },
      { icon: '🦅', name: '프테라노돈' },
      { icon: '🐊', name: '아기공룡' }
    ],
    addItems: ['🍖', '🥩', '🍗', '🌿', '🪵', '🍄', '🍎'],
    addPrompt: (t, n1, n2) => `배고픈 ${t.name}에게, 먹이 ${n1}개와, ${n2}개를 먹여줄 거야. 모두 몇 개일까?`,
    addTitle: (t) => `${t.icon} ${t.name}에게 줄 먹이는 모두 몇 개일까?`,
    addFeedAction: () => window.sound.playDinoStomp(),
    subItems: ['🥚', '🥚', '🥚', '🥚', '🥚', '🥚', '🥚'],
    subPrompt: (n1, n2) => `공룡 알 ${n1}개 중에서, ${n2}개를 톡톡 깨뜨려봐! 남은 알은 몇 개일까?`,
    subTitle: (n2) => `공룡 알 ${n2}개를 톡! 깨뜨리고 남은 알을 세어봐!`,
    subUnit: '개',
    subAction: () => window.sound.playDinoStomp()
  },
  space: {
    id: 'space',
    name: '우주 별나라',
    mascot: '🚀',
    title: '슈우웅 퓨융!<br>우주 수학 탐험',
    voiceIntro: '반짝반짝 신비한 우주로 모험을 떠나요!',
    targets: [
      { icon: '🚀', name: '우주선' },
      { icon: '🛸', name: 'UFO' },
      { icon: '👨‍🚀', name: '우주비행사' },
      { icon: '👾', name: '외계인 친구' }
    ],
    addItems: ['⭐', '⚡', '🔋', '💎', '🪐', '💫', '🌟'],
    addPrompt: (t, n1, n2) => `${t.name}에, 별 에너지 ${n1}개와, ${n2}개를 충전할 거야. 모두 몇 개일까?`,
    addTitle: (t) => `${t.icon} ${t.name}에 충전할 에너지는 모두 몇 개일까?`,
    addFeedAction: () => window.sound.playStar(),
    subItems: ['☄️', '🌑', '🪐', '🌌', '🛸', '🛰️', '💫'],
    subPrompt: (n1, n2) => `우주 운석 ${n1}개 중, ${n2}개를 레이저로 팡! 쏘아봐! 남은 운석은 몇 개일까?`,
    subTitle: (n2) => `운석 ${n2}개를 레이저로 팡! 쏘고 남은 것을 세어봐!`,
    subUnit: '개',
    subAction: () => window.sound.playLaser()
  },
  car: {
    id: 'car',
    name: '씽씽 자동차',
    mascot: '🏎️',
    title: '부릉부릉 빵빵!<br>자동차 수학 레이싱',
    voiceIntro: '부릉부릉! 신나는 자동차 레이싱을 출발해요!',
    targets: [
      { icon: '🅿️', name: '주차장' },
      { icon: '🏁', name: '도착지' },
      { icon: '⛽', name: '주유소' },
      { icon: '🚏', name: '정류장' }
    ],
    addItems: ['🚗', '🚙', '🚕', '🚓', '🚑', '🚒', '🚚', '🏎️'],
    addPrompt: (t, n1, n2) => `${t.name}에, 자동차 ${n1}대와, ${n2}대가 들어왔어. 모두 몇 대일까?`,
    addTitle: (t) => `${t.icon} ${t.name}에 모인 자동차는 모두 몇 대일까?`,
    addFeedAction: () => window.sound.playCarHonk(),
    subItems: ['🚗', '🚕', '🚙', '🏎️', '🚐', '🚚', '🛵'],
    subPrompt: (n1, n2) => `자동차 ${n1}대 중, ${n2}대가 부릉 출발했어! 남은 차는 몇 대일까?`,
    subTitle: (n2) => `자동차 ${n2}대를 탭해서 슝 출발시키고 남은 차를 세어봐!`,
    subUnit: '대',
    subAction: () => window.sound.playCarHonk()
  }
};

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  loadSavedData();
  setupUIEventListeners();
  updateHeaderStats();
  updateLevelGoalProgress();
});

function loadSavedData() {
  try {
    const savedStars = localStorage.getItem('math_kids_stars');
    const savedStageStars = localStorage.getItem('math_kids_stage_stars');
    const savedStickers = localStorage.getItem('math_kids_stickers');
    const savedDiff = localStorage.getItem('math_kids_diff');
    const savedTheme = localStorage.getItem('math_kids_theme');
    if (savedStars) STATE.stars = parseInt(savedStars, 10);
    if (savedStageStars) STATE.stageStars = parseInt(savedStageStars, 10);
    if (savedStickers) STATE.stickers = JSON.parse(savedStickers);
    if (savedDiff) {
      STATE.difficulty = Math.max(1, Math.min(4, parseInt(savedDiff, 10)));
      document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.level, 10) === STATE.difficulty);
      });
    }
    if (savedTheme && THEMES[savedTheme]) {
      applyTheme(savedTheme, false);
    }
  } catch (e) {
    console.warn(e);
  }
}

function saveData() {
  try {
    localStorage.setItem('math_kids_stars', STATE.stars);
    localStorage.setItem('math_kids_stage_stars', STATE.stageStars);
    localStorage.setItem('math_kids_stickers', JSON.stringify(STATE.stickers));
    localStorage.setItem('math_kids_diff', STATE.difficulty);
    localStorage.setItem('math_kids_theme', STATE.currentTheme);
  } catch (e) {
    console.warn(e);
  }
}

function applyTheme(themeId, speakAnnouncement = true) {
  const theme = THEMES[themeId];
  if (!theme) return;
  STATE.currentTheme = themeId;
  saveData();

  // 바디 클래스 변경
  document.body.className = themeId === 'animals' ? '' : `theme-${themeId}`;

  // 마스코트 & 타이틀 변경
  const mascotEl = document.getElementById('main-mascot');
  if (mascotEl) mascotEl.textContent = theme.mascot;

  const titleEl = document.querySelector('.main-title');
  if (titleEl) titleEl.innerHTML = theme.title;

  // 탭 active 갱신
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === themeId);
  });

  if (speakAnnouncement) {
    window.sound.speak(theme.voiceIntro);
  }
}

function updateHeaderStats() {
  document.getElementById('star-count-display').textContent = STATE.stars;
  document.getElementById('sticker-count-display').textContent = STATE.stickers.length;
}

// 이벤트 리스너 세팅
function setupUIEventListeners() {
  // 첫 터치/클릭 시 오디오 활성화
  document.body.addEventListener('touchstart', () => window.sound.init(), { once: true });
  document.body.addEventListener('click', () => window.sound.init(), { once: true });

  // 상단 홈 버튼
  document.getElementById('home-btn').addEventListener('click', () => {
    window.sound.playClick();
    showScreen('home-screen');
  });

  // 상단 소리 토글 버튼
  const soundBtn = document.getElementById('sound-toggle-btn');
  soundBtn.addEventListener('click', () => {
    STATE.soundMuted = !STATE.soundMuted;
    window.sound.isMuted = STATE.soundMuted;
    window.sound.speechEnabled = !STATE.soundMuted;
    soundBtn.textContent = STATE.soundMuted ? '🔇' : '🔊';
    if (!STATE.soundMuted) window.sound.playClick();
  });

  // 테마 선택 버튼 클릭 이벤트
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      window.sound.playClick();
      const themeId = e.currentTarget.dataset.theme;
      applyTheme(themeId, true);
    });
  });

  // 난이도 선택 버튼 (1단계: 1~5부터 4단계: 16~20까지)
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      window.sound.playClick();
      document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      STATE.difficulty = parseInt(e.currentTarget.dataset.level, 10);
      STATE.stageStars = 0; // 새 난이도 선택 시 목표 별 리셋
      saveData();
      updateLevelGoalProgress();
      
      const diffNames = {
        1: '1단계, 1부터 5까지 재미있는 기초 셈이에요!',
        2: '2단계, 6부터 10까지 덧셈 뺄셈이에요!',
        3: '3단계, 11부터 15까지 도전해봐요!',
        4: '4단계, 20까지 최고 난이도 마스터예요!'
      };
      window.sound.speak(diffNames[STATE.difficulty]);
    });
  });

  // 게임 모드 선택
  document.getElementById('btn-mode-add').addEventListener('click', () => startAddMode());
  document.getElementById('btn-mode-sub').addEventListener('click', () => startSubMode());
  document.getElementById('btn-mode-quiz').addEventListener('click', () => startQuizMode());
  document.getElementById('btn-mode-stickers').addEventListener('click', () => openStickerBook());

  // 음성 다시 듣기 버튼
  document.getElementById('replay-voice-btn').addEventListener('click', () => {
    window.sound.playClick();
    if (STATE.currentProblem && STATE.currentProblem.voiceText) {
      window.sound.speak(STATE.currentProblem.voiceText);
    }
  });

  // 다음 문제 모달 버튼
  document.getElementById('modal-next-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    goToNextProblem();
  });
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// ----------------------------------------------------
// 목표 진행도 및 상단 상태 UI 갱신
// ----------------------------------------------------
function updateLevelGoalProgress() {
  const config = LEVEL_CONFIG[STATE.difficulty] || LEVEL_CONFIG[1];
  const badgeEl = document.getElementById('current-level-badge');
  const textEl = document.getElementById('goal-remaining-text');
  const fillEl = document.getElementById('goal-progress-fill');
  
  if (badgeEl) badgeEl.textContent = config.name;
  
  const current = Math.min(STATE.stageStars, config.targetStars);
  const remaining = Math.max(0, config.targetStars - current);
  const pct = Math.min(100, Math.round((current / config.targetStars) * 100));

  if (textEl) {
    if (remaining === 0) {
      textEl.innerHTML = `🎉 <strong>목표 달성! 레벨업!</strong>`;
    } else {
      textEl.innerHTML = `승급까지 ⭐ <strong>${remaining}개</strong> 남음!`;
    }
  }
  if (fillEl) fillEl.style.width = `${pct}%`;
}

// 오답 패널티 플로팅 토스트 표시
function triggerPenaltyToast() {
  const toast = document.getElementById('penalty-toast');
  if (!toast) return;
  toast.classList.remove('active');
  void toast.offsetWidth; // 리플로우
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 1600);
}

// ----------------------------------------------------
// 문제 생성기 (1단계: 1~5, 2단계: 6~10, 3단계: 11~15, 4단계: 16~20)
// ----------------------------------------------------
function generateProblem(type) {
  let num1, num2, ans;
  
  if (type === 'add') {
    if (STATE.difficulty === 1) {
      // 1단계: 1~5 (합이 2~5)
      ans = Math.floor(Math.random() * 4) + 2; // 2, 3, 4, 5
      num1 = Math.floor(Math.random() * (ans - 1)) + 1;
      num2 = ans - num1;
    } else if (STATE.difficulty === 2) {
      // 2단계: 6~10 (합이 6~10)
      ans = Math.floor(Math.random() * 5) + 6; // 6, 7, 8, 9, 10
      num1 = Math.floor(Math.random() * (ans - 2)) + 1;
      num2 = ans - num1;
    } else if (STATE.difficulty === 3) {
      // 3단계: 11~15 (합이 11~15)
      ans = Math.floor(Math.random() * 5) + 11; // 11, 12, 13, 14, 15
      num1 = Math.floor(Math.random() * 5) + 4;
      num2 = ans - num1;
    } else {
      // 4단계: 16~20 (합이 16~20)
      ans = Math.floor(Math.random() * 5) + 16; // 16, 17, 18, 19, 20
      num1 = Math.floor(Math.random() * 6) + 7;
      num2 = ans - num1;
    }
    return { num1, num2, ans, type: '+' };
  } else {
    // 뺄셈
    if (STATE.difficulty === 1) {
      // 1단계: 1~5 (num1이 2~5)
      num1 = Math.floor(Math.random() * 4) + 2; // 2, 3, 4, 5
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
      ans = num1 - num2;
    } else if (STATE.difficulty === 2) {
      // 2단계: 6~10 (num1이 6~10)
      num1 = Math.floor(Math.random() * 5) + 6; // 6 ~ 10
      num2 = Math.floor(Math.random() * (num1 - 2)) + 1;
      ans = num1 - num2;
    } else if (STATE.difficulty === 3) {
      // 3단계: 11~15 (num1이 11~15)
      num1 = Math.floor(Math.random() * 5) + 11;
      num2 = Math.floor(Math.random() * 5) + 3;
      ans = num1 - num2;
    } else {
      // 4단계: 16~20 (num1이 16~20)
      num1 = Math.floor(Math.random() * 5) + 16;
      num2 = Math.floor(Math.random() * 6) + 5;
      ans = num1 - num2;
    }
    return { num1, num2, ans, type: '-' };
  }
}

// ----------------------------------------------------
// [모드 1: 덧셈] 테마 맞춤형 합치기 모험
// ----------------------------------------------------
function startAddMode() {
  STATE.currentMode = 'add';
  showScreen('game-play-screen');
  nextAddProblem();
}

function nextAddProblem() {
  const prob = generateProblem('add');
  STATE.currentProblem = prob;
  STATE.eatenCount = 0;

  const theme = THEMES[STATE.currentTheme] || THEMES.animals;
  const target = theme.targets[Math.floor(Math.random() * theme.targets.length)];
  const item1 = theme.addItems[Math.floor(Math.random() * theme.addItems.length)];
  let item2 = theme.addItems[Math.floor(Math.random() * theme.addItems.length)];
  while (item2 === item1) {
    item2 = theme.addItems[Math.floor(Math.random() * theme.addItems.length)];
  }

  // 수식 표시
  document.getElementById('eq-num1').textContent = prob.num1;
  document.getElementById('eq-operator').textContent = '+';
  document.getElementById('eq-num2').textContent = prob.num2;
  document.getElementById('eq-ans').textContent = '?';

  // 문제 음성 텍스트
  const voice = theme.addPrompt(target, prob.num1, prob.num2);
  prob.voiceText = voice;
  document.getElementById('prompt-text').textContent = theme.addTitle(target);
  window.sound.speak(voice);

  // 스테이지 렌더링
  const stage = document.getElementById('game-stage');
  stage.innerHTML = `
    <div class="feeder-stage">
      <div class="animal-avatar" id="animal-target">
        ${target.icon}
        <div class="food-count-bubble" id="eaten-counter">0</div>
      </div>
      <div style="font-size:14px; color:#868e96; margin-bottom: 4px;">손가락으로 톡톡 터치해보세요!</div>
      <div class="food-basket" id="food-basket"></div>
    </div>
  `;

  // 바구니에 아이템 채우기
  const basket = document.getElementById('food-basket');
  for (let i = 0; i < prob.num1; i++) {
    basket.appendChild(createFoodItem(item1, theme));
  }
  for (let i = 0; i < prob.num2; i++) {
    basket.appendChild(createFoodItem(item2, theme));
  }

  // 보기 버튼 생성
  renderChoices(prob.ans);
}

function createFoodItem(itemEmoji, theme) {
  const item = document.createElement('div');
  item.className = 'food-item';
  item.textContent = itemEmoji;
  item.addEventListener('click', () => {
    if (item.classList.contains('eaten')) return;
    item.classList.add('eaten');
    
    // 테마별 액션 사운드
    theme.addFeedAction();
    STATE.eatenCount++;
    
    // 애니메이션
    const target = document.getElementById('animal-target');
    target.classList.remove('nom-nom');
    void target.offsetWidth;
    target.classList.add('nom-nom');

    document.getElementById('eaten-counter').textContent = STATE.eatenCount;
    window.sound.speak(`${STATE.eatenCount}!`);

    if (STATE.eatenCount === STATE.currentProblem.ans) {
      window.sound.playStar();
    }
  });
  return item;
}

// ----------------------------------------------------
// [모드 2: 뺄셈] 테마 맞춤형 터뜨리기 / 출발 모험
// ----------------------------------------------------
function startSubMode() {
  STATE.currentMode = 'sub';
  showScreen('game-play-screen');
  nextSubProblem();
}

function nextSubProblem() {
  const prob = generateProblem('sub');
  STATE.currentProblem = prob;
  STATE.poppedCount = 0;

  const theme = THEMES[STATE.currentTheme] || THEMES.animals;

  // 수식 표시
  document.getElementById('eq-num1').textContent = prob.num1;
  document.getElementById('eq-operator').textContent = '-';
  document.getElementById('eq-num2').textContent = prob.num2;
  document.getElementById('eq-ans').textContent = '?';

  const voice = theme.subPrompt(prob.num1, prob.num2);
  prob.voiceText = voice;
  document.getElementById('prompt-text').textContent = theme.subTitle(prob.num2);
  window.sound.speak(voice);

  // 스테이지 렌더링
  const stage = document.getElementById('game-stage');
  stage.innerHTML = `
    <div style="font-size:14px; color:#e03131; margin-bottom:8px; font-weight:bold;">
      목표: <span id="pop-target-display">${prob.num2}</span>${theme.subUnit} 중 <span id="pop-current-display">0</span>${theme.subUnit} 완료!
    </div>
    <div class="balloon-grid" id="balloon-grid"></div>
  `;

  const grid = document.getElementById('balloon-grid');
  const items = theme.subItems;
  for (let i = 0; i < prob.num1; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.textContent = items[i % items.length];
    balloon.style.animationDelay = `${(i * 0.22).toFixed(2)}s`;

    balloon.addEventListener('click', () => {
      if (balloon.classList.contains('popped')) return;
      
      if (STATE.poppedCount < prob.num2) {
        balloon.classList.add('popped');
        theme.subAction();
        STATE.poppedCount++;
        document.getElementById('pop-current-display').textContent = STATE.poppedCount;

        if (STATE.poppedCount === prob.num2) {
          window.sound.speak(`잘했어! 이제 남은 개수를 세어볼까?`);
        } else {
          window.sound.speak(`${STATE.poppedCount}!`);
        }
      } else {
        window.sound.speak(`이제 남은 개수를 세어서 정답을 골라봐!`);
      }
    });
    grid.appendChild(balloon);
  }

  // 보기 버튼 생성
  renderChoices(prob.ans);
}

// ----------------------------------------------------
// [모드 3: 스피드 퀴즈] 별나라 모험
// ----------------------------------------------------
function startQuizMode() {
  STATE.currentMode = 'quiz';
  showScreen('game-play-screen');
  nextQuizProblem();
}

function nextQuizProblem() {
  const isAdd = Math.random() > 0.5;
  const prob = generateProblem(isAdd ? 'add' : 'sub');
  STATE.currentProblem = prob;

  document.getElementById('eq-num1').textContent = prob.num1;
  document.getElementById('eq-operator').textContent = prob.type;
  document.getElementById('eq-num2').textContent = prob.num2;
  document.getElementById('eq-ans').textContent = '?';

  const opName = prob.type === '+' ? '더하기' : '빼기';
  const voice = `${prob.num1} ${opName} ${prob.num2}는 얼마일까?`;
  prob.voiceText = voice;
  document.getElementById('prompt-text').textContent = `⭐ 별나라 퀴즈: ${prob.num1} ${prob.type} ${prob.num2} = ?`;
  window.sound.speak(voice);

  const stage = document.getElementById('game-stage');
  const itemIcon = prob.type === '+' ? '⭐' : '💎';
  
  let visualHtml = '';
  if (prob.type === '+') {
    visualHtml = `
      <div style="display:flex; align-items:center; justify-content:center; gap:16px; flex-wrap:wrap;">
        <div style="background:#fff9db; padding:10px; border-radius:12px; border:2px solid #ffe066;">
          ${Array(prob.num1).fill(itemIcon).join(' ')}
        </div>
        <span style="font-size:24px; font-weight:bold; color:#f08c00;">+</span>
        <div style="background:#e7f5ff; padding:10px; border-radius:12px; border:2px solid #a5d8ff;">
          ${Array(prob.num2).fill(itemIcon).join(' ')}
        </div>
      </div>
    `;
  } else {
    visualHtml = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:12px;">
        <div style="background:#fff5f5; padding:10px; border-radius:12px; border:2px solid #ffc9c9;">
          ${Array(prob.num1).fill(itemIcon).join(' ')}
        </div>
        <div style="color:#e03131; font-size:15px; font-weight:bold;">
          여기서 ${prob.num2}개를 쏙 빼면 몇 개가 남을까요?
        </div>
      </div>
    `;
  }

  stage.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:14px;">
      ${visualHtml}
    </div>
  `;

  renderChoices(prob.ans);
}

// ----------------------------------------------------
// 보기 버튼(키패드) 생성 및 정답 판별
// ----------------------------------------------------
function renderChoices(correctAns) {
  const choicesArea = document.getElementById('choices-area');
  choicesArea.innerHTML = '';

  // 오답 후보 2개 생성 (정답과 1~3 차이나는 숫자, 0 이하 제외)
  const choices = [correctAns];
  let loopCount = 0;
  while (choices.length < 3 && loopCount < 40) {
    loopCount++;
    const diff = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
    const candidate = correctAns + diff;
    if (candidate > 0 && !choices.includes(candidate)) {
      choices.push(candidate);
    }
  }
  let fallback = 1;
  while (choices.length < 3) {
    if (!choices.includes(fallback)) choices.push(fallback);
    fallback++;
  }

  // 보기 섞기
  choices.sort(() => Math.random() - 0.5);

  choices.forEach(val => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = val;
    btn.addEventListener('click', () => handleAnswer(val, correctAns, btn));
    choicesArea.appendChild(btn);
  });
}

let autoNextTimer = null;

// 다음 문제로 넘어가기 공통 함수
function goToNextProblem() {
  if (autoNextTimer) {
    clearTimeout(autoNextTimer);
    autoNextTimer = null;
  }
  document.getElementById('reward-modal-overlay').classList.remove('active');
  if (STATE.currentMode === 'add') nextAddProblem();
  else if (STATE.currentMode === 'sub') nextSubProblem();
  else if (STATE.currentMode === 'quiz') nextQuizProblem();
}

// 정답 선택 처리 (보상, 레벨업 판별 및 오답 패널티)
function handleAnswer(selectedVal, correctAns, btnElement) {
  if (selectedVal === correctAns) {
    // 정답! - 버튼 중복 클릭 방지
    document.querySelectorAll('.choice-btn').forEach(b => b.style.pointerEvents = 'none');

    window.sound.playCorrect();
    document.getElementById('eq-ans').textContent = correctAns;
    
    // 별 및 스테이지 목표 별 획득
    STATE.stars += 1;
    STATE.stageStars += 1;
    
    // 랜덤 스티커 보상 획득
    const newSticker = STICKER_POOL[Math.floor(Math.random() * STICKER_POOL.length)];
    STATE.stickers.push(newSticker);
    saveData();
    updateHeaderStats();
    updateLevelGoalProgress();

    // 폭죽(컨페티) 발사
    triggerConfetti();

    const config = LEVEL_CONFIG[STATE.difficulty] || LEVEL_CONFIG[1];

    // 목표 별 개수 달성 시 -> 레벨업 대축제 모달!
    if (STATE.stageStars >= config.targetStars) {
      setTimeout(() => {
        showLevelUpModal(config);
      }, 400);
    } else {
      // 일반 정답 칭찬 및 보상 모달
      const compliments = [
        '정답이야! 정말 대단해!',
        '와아! 천재 아니야? 멋져!',
        '딩동댕! 칭찬 스티커를 줄게!',
        '우와! 최고야 최고!'
      ];
      const praise = compliments[Math.floor(Math.random() * compliments.length)];
      window.sound.speak(`${correctAns}! ${praise}`);

      setTimeout(() => {
        showRewardModal(newSticker, praise);
      }, 450);
    }
  } else {
    // 오답 (스마트 패널티: 별 1개 감소 및 시각 효과)
    window.sound.playPenalty();
    btnElement.classList.add('shake-it');
    setTimeout(() => btnElement.classList.remove('shake-it'), 400);

    // 유아 친화적 감점 패널티 (0개 미만 방어선)
    let penaltyOccurred = false;
    if (STATE.stars > 0) {
      STATE.stars -= 1;
      penaltyOccurred = true;
    }
    if (STATE.stageStars > 0) {
      STATE.stageStars -= 1;
    }
    saveData();
    updateHeaderStats();
    updateLevelGoalProgress();

    // 플로팅 토스트 표시
    triggerPenaltyToast();

    // 다정한 격려 음성
    const penaltyMsgs = [
      '앗, 별 하나가 도망갔어요! 다시 맞추면 별을 되찾을 수 있어! 힘내!',
      '괜찮아! 천천히 다시 세어보고 별을 다시 찾아오자!',
      '아쉽다! 하나씩 콕콕 다시 세어볼까? 할 수 있어!'
    ];
    const msg = penaltyMsgs[Math.floor(Math.random() * penaltyMsgs.length)];
    window.sound.speak(msg);
  }
}

// 레벨업 대축제 모달 표시 (목표 달성 시 화려한 승급)
function showLevelUpModal(currentConfig) {
  window.sound.playLevelUp();
  triggerConfetti();

  const isMaxLevel = STATE.difficulty >= 4;
  const nextLevelNum = isMaxLevel ? 4 : STATE.difficulty + 1;
  const bonusReward = currentConfig.reward || '👑';
  STATE.stickers.push(bonusReward);
  
  // 스테이지 별 초기화 및 다음 단계 진입
  STATE.stageStars = 0;
  if (!isMaxLevel) {
    STATE.difficulty = nextLevelNum;
  }
  saveData();
  updateHeaderStats();
  updateLevelGoalProgress();

  // 홈 화면 난이도 버튼 활성화 상태 동기화
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.level, 10) === STATE.difficulty);
  });

  const modalOverlay = document.getElementById('levelup-modal-overlay');
  const titleEl = document.getElementById('modal-levelup-title');
  const descEl = document.getElementById('modal-levelup-desc');
  const bonusItemEl = document.getElementById('levelup-bonus-item');
  const nextBtn = document.getElementById('modal-levelup-btn');

  if (isMaxLevel) {
    titleEl.textContent = '🌟 수학 챔피언 등극!';
    descEl.textContent = '축하해요! 모든 단계를 완벽하게 정복했어요!';
    nextBtn.textContent = '계속해서 최고 마스터 도전하기! 🚀';
    window.sound.speak('축하합니다! 모든 단계를 완벽하게 정복한 수학 챔피언이에요!');
  } else {
    titleEl.textContent = '🎉 레벨업 대축제!';
    descEl.textContent = `축하해요! 이제 ${LEVEL_CONFIG[nextLevelNum].name}로 승급합니다!`;
    nextBtn.textContent = `${LEVEL_CONFIG[nextLevelNum].name}로 모험 떠나기! 🚀`;
    window.sound.speak(`와아! 목표를 달성했어요! 축하합니다! 이제 ${LEVEL_CONFIG[nextLevelNum].name}로 승급했어요!`);
  }

  bonusItemEl.textContent = bonusReward;
  modalOverlay.classList.add('active');

  nextBtn.onclick = (e) => {
    e.stopPropagation();
    modalOverlay.classList.remove('active');
    goToNextProblem();
  };
}

// 축하 모달 표시 (1.5초 후 자동 다음 문제 이동 + 화면 어디든 탭해도 즉시 이동)
function showRewardModal(sticker, praise) {
  document.getElementById('modal-reward-icon').textContent = sticker;
  document.getElementById('modal-reward-title').textContent = '참 잘했어요!';
  document.getElementById('modal-reward-desc').textContent = `${praise} 새 스티커를 받았어요!`;
  
  const modalOverlay = document.getElementById('reward-modal-overlay');
  modalOverlay.classList.add('active');

  // 모달 영역 아무 곳이나 탭해도 즉시 넘어가기
  modalOverlay.onclick = () => goToNextProblem();

  // 아이가 가만히 있어도 1.6초 후 자동으로 다음 문제로 슝!
  if (autoNextTimer) clearTimeout(autoNextTimer);
  autoNextTimer = setTimeout(() => {
    goToNextProblem();
  }, 1600);
}

// ----------------------------------------------------
// [스티커 보관함]
// ----------------------------------------------------
function openStickerBook() {
  showScreen('sticker-book-screen');
  window.sound.speak(`우와! 내가 모은 칭찬 스티커들이야! 모두 ${STATE.stickers.length}개나 모았어!`);
  
  const board = document.getElementById('sticker-board');
  board.innerHTML = '';

  if (STATE.stickers.length === 0) {
    board.innerHTML = `
      <div class="sticker-board-empty">
        <div style="font-size: 48px;">🌟</div>
        <p>아직 스티커가 없어요!</p>
        <p>문제를 맞추고 반짝반짝 스티커를 모아봐요!</p>
      </div>
    `;
    return;
  }

  STATE.stickers.forEach(stk => {
    const el = document.createElement('div');
    el.className = 'placed-sticker';
    el.textContent = stk;
    el.addEventListener('click', () => {
      window.sound.playStar();
    });
    board.appendChild(el);
  });
}

// ----------------------------------------------------
// 컨페티(별가루 파티클) 효과
// ----------------------------------------------------
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  const particles = [];
  const colors = ['#ff6b8b', '#ffd43b', '#4dabf7', '#51cf66', '#cc5de8', '#ff922b'];

  for (let i = 0; i < 45; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.8) * 14,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      gravity: 0.35,
      opacity: 1
    });
  }

  let animFrame;
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.opacity -= 0.015;
      if (p.opacity > 0) {
        alive = true;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    if (alive) {
      animFrame = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animFrame);
    }
  }
  render();
}
