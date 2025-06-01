document.addEventListener('DOMContentLoaded', () => {
    // 要素を取得
    const timeDisplay = document.getElementById('time');
    const startButton = document.getElementById('start');
    const pauseButton = document.getElementById('pause');
    const resetButton = document.getElementById('reset');
    const sessionType = document.getElementById('session-type');
    const sessionCountElement = document.getElementById('session-count');

    // 設定
    let WORK_DURATION = 25 * 60; // 25分（秒単位）
    let BREAK_DURATION = 5 * 60; // 5分（秒単位）
    let isTestMode = false;
    const NORMAL_WORK_DURATION = 25 * 60;
    const NORMAL_BREAK_DURATION = 5 * 60;
    const TEST_WORK_DURATION = 1 * 60; // テスト用: 1分
    const TEST_BREAK_DURATION = 0.5 * 60; // テスト用: 30秒
    
    let timeLeft = WORK_DURATION; // 残り時間（秒）
    let timerId = null;
    let isRunning = false;
    let isWorkSession = true; // true: 作業中, false: 休憩中
    let sessionCount = 0;

    // 時間を「MM:SS」形式にフォーマット
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

    // タイマーを更新
    function updateDisplay() {
        timeDisplay.textContent = formatTime(timeLeft);
        document.title = `${formatTime(timeLeft)} - ${isWorkSession ? '作業中' : '休憩中'} | ポモドーロタイマー`;
    }

    // タイマーを開始
    function startTimer() {
        if (isRunning) return;  // 既に実行中の場合は何もしない
        
        isRunning = true;
        clearInterval(timerId); // 既存のタイマーをクリア
        
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();

            if (timeLeft <= 0) {
                clearInterval(timerId);
                isRunning = false; // タイマーを停止
                playAlarm();
                
                if (isWorkSession) {
                    // 作業時間終了 → 休憩に移行
                    sessionCount++;
                    sessionCountElement.textContent = sessionCount;
                    isWorkSession = false;
                    timeLeft = isTestMode ? TEST_BREAK_DURATION : NORMAL_BREAK_DURATION;
                    sessionType.textContent = '休憩時間';
                    showNotification('お疲れ様でした！休憩しましょう。');
                } else {
                    // 休憩終了 → 作業に移行
                    isWorkSession = true;
                    timeLeft = isTestMode ? TEST_WORK_DURATION : NORMAL_WORK_DURATION;
                    sessionType.textContent = '作業時間';
                    showNotification('休憩が終わりました。作業を再開しましょう！');
                }
                
                updateDisplay();
                // 自動的に次のセッションを開始
                setTimeout(() => startTimer(), 1000);
            }
        }, 1000);
    }

    // タイマーを一時停止
    function pauseTimer() {
        clearInterval(timerId);
        isRunning = false;
    }

    // テストモードを切り替え
    function toggleTestMode() {
        isTestMode = !isTestMode;
        const testModeBtn = document.getElementById('testModeToggle');
        
        if (isTestMode) {
            testModeBtn.textContent = 'テストモード: ON';
            testModeBtn.classList.add('test-mode-on');
        } else {
            testModeBtn.textContent = 'テストモード: OFF';
            testModeBtn.classList.remove('test-mode-on');
        }
        
        // タイマーをリセットして新しい設定を反映
        resetTimer();
        
        console.log('テストモード:', isTestMode ? 'ON' : 'OFF');
        console.log('作業時間:', WORK_DURATION / 60 + '分');
        console.log('休憩時間:', BREAK_DURATION / 60 + '分');
    }

    // タイマーをリセット
    function resetTimer() {
        pauseTimer();
        isWorkSession = true;
        // 現在のモードに応じた時間を設定
        timeLeft = isTestMode ? TEST_WORK_DURATION : NORMAL_WORK_DURATION;
        WORK_DURATION = isTestMode ? TEST_WORK_DURATION : NORMAL_WORK_DURATION;
        BREAK_DURATION = isTestMode ? TEST_BREAK_DURATION : NORMAL_BREAK_DURATION;
        sessionType.textContent = '作業時間';
        updateDisplay();
    }

    // アラーム音を再生
    function playAlarm() {
        const alarm = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
        alarm.volume = 0.5;
        alarm.play().catch(e => console.log('音声再生に失敗しました:', e));
    }

    // 通知を表示
    function showNotification(message) {
        if (Notification.permission === 'granted') {
            new Notification('ポモドーロタイマー', {
                body: message,
                icon: 'https://cdn-icons-png.flaticon.com/512/3132/3132739.png'
            });
        }
    }

    // 通知の許可をリクエスト
    if (Notification.permission !== 'denied') {
        Notification.requestPermission();
    }

    // イベントリスナーを設定
    startButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    resetButton.addEventListener('click', resetTimer);
    document.getElementById('testModeToggle').addEventListener('click', toggleTestMode);

    // 初期表示を更新
    updateDisplay();
});
