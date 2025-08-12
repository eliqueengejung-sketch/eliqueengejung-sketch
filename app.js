/* app.js
   - start 클릭 시 david 순환 멈추고 선택 화면으로 전환
   - 플레이어 버튼 클릭 시 해당 버튼 active로 바꾸고 다른 버튼 비활성화
   - 데이비드 선택(랜덤) 표시, 결과 이미지 노출
   - 다시하기 버튼은 '선택 전' 화면(버튼 초기 상태)으로 되돌림
*/

document.addEventListener('DOMContentLoaded', () => {
  // 요소들
  const startScreen = document.getElementById('start-screen');
  const davidCycler = document.getElementById('david-cycler');

  const choiceScreen = document.getElementById('choice-screen');
  const choiceBg = document.getElementById('choice-bg');
  const btns = Array.from(document.querySelectorAll('.choice-btn'));

  const resultScreen = document.getElementById('result-screen');
  const davidChoiceImg = document.getElementById('david-choice');
  const resultTextImg = document.getElementById('result-text');
  const btnRetry = document.getElementById('btn-retry');

  /* 파일명 규칙:
     player btns: assets/btn-{choice}-default.png / assets/btn-{choice}-active.png
     david images: assets/david-{choice}.png
     result images: assets/result-tie.png, assets/result-david-wins.png, assets/result-player-wins.png
   */
  const choices = ['scissors','rock','paper'];

  // david 사이클링 (시작화면)
  const davidImgs = choices.map(c => `assets/david-${c}.png`);
  let cycleIndex = 0;
  let cycleTimer = null;

  function startDavidCycler(){
    if(cycleTimer) clearInterval(cycleTimer);
    davidCycler.src = davidImgs[0];
    cycleIndex = 0;
    cycleTimer = setInterval(() => {
      cycleIndex = (cycleIndex + 1) % davidImgs.length;
      davidCycler.src = davidImgs[cycleIndex];
    }, 300); // 300ms 간격으로 바뀜 (원하면 변경)
  }

  function stopDavidCycler(){
    if(cycleTimer) {
      clearInterval(cycleTimer);
      cycleTimer = null;
    }
  }

  // 초기 실행: 사이클 시작
  startDavidCycler();

  // -> START 클릭: 사이클 멈추고 선택 화면 표시
  startScreen.addEventListener('click', () => {
    stopDavidCycler();
    startScreen.classList.add('hidden');
    davidCycler.classList.add('hidden');

    showChoiceScreen();
  });

  // 화면 전환 함수들
  function showChoiceScreen(){
    // 결과 화면 숨기고 선택 화면 보이기
    resultScreen.classList.add('hidden');
    choiceScreen.classList.remove('hidden');
    // 버튼 초기화
    btns.forEach(btn => {
      const choice = btn.dataset.choice;
      btn.src = `assets/btn-${choice}-default.png`;
      btn.style.pointerEvents = 'auto';
      btn.classList.remove('inactive');
    });
  }

  function showResultScreen(){
    choiceScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    // 살짝 애니메이션
    resultScreen.classList.remove('fade-in');
    void resultScreen.offsetWidth;
    resultScreen.classList.add('fade-in');
  }

  // 승패 판단
  function determineResult(player, david) {
    if (player === david) return 'tie';
    if ((player === 'scissors' && david === 'paper') ||
        (player === 'rock'     && david === 'scissors') ||
        (player === 'paper'    && david === 'rock')) {
      return 'player';
    }
    return 'david';
  }

  // 버튼 클릭 처리
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 이미 비활성화되어 있을 경우 무시
      if (btn.style.pointerEvents === 'none') return;

      // 플레이어 선택
      const playerChoice = btn.dataset.choice;

      // 1) 버튼 상태 변경 (클릭한 버튼만 active 이미지로)
      btns.forEach(b => {
        const c = b.dataset.choice;
        if (c === playerChoice) {
          b.src = `assets/btn-${c}-active.png`;
        } else {
          b.src = `assets/btn-${c}-default.png`;
          // 다른 버튼 클릭 방지
          b.style.pointerEvents = 'none';
        }
      });

      // 2) 데이비드 랜덤 선택
      const davidChoice = choices[Math.floor(Math.random() * choices.length)];

      // 3) 결과 표시 (짧은 딜레이로 연출)
      setTimeout(() => {
        // david 선택 이미지를 중앙 사각형에 넣기
        davidChoiceImg.src = `assets/david-${davidChoice}.png`;

        // 결과 문구 이미지 선택
        const res = determineResult(playerChoice, davidChoice);
        if (res === 'tie') {
          resultTextImg.src = 'assets/result-tie.png';
        } else if (res === 'david') {
          resultTextImg.src = 'assets/result-david-wins.png';
        } else {
          resultTextImg.src = 'assets/result-player-wins.png';
        }

        // 4) 결과 화면 보여주기 (결과 하단에 다시하기 버튼 포함)
        showResultScreen();
      }, 420); // 420ms 후에 결과가 나오게 연출
    });
  });

  // 다시하기: 선택 화면(버튼 초기 상태)로 복귀
  btnRetry.addEventListener('click', () => {
    showChoiceScreen();
  });

  // (선택적으로) 이미지 프리로딩 - 사용자 경험 향상
  function preload(arr){
    arr.forEach(src => {
      const i = new Image();
      i.src = src;
    });
  }
  const preloadList = [
    ...davidImgs,
    'assets/btn-scissors-default.png',
    'assets/btn-scissors-active.png',
    'assets/btn-rock-default.png',
    'assets/btn-rock-active.png',
    'assets/btn-paper-default.png',
    'assets/btn-paper-active.png',
    'assets/result-tie.png',
    'assets/result-david-wins.png',
    'assets/result-player-wins.png',
    'assets/btn-retry.png',
    'assets/screen-before-choice.png',
    'assets/start-overlay.png',
    'assets/bg-base.png'
  ];
  preload(preloadList);
});