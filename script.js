document.addEventListener('DOMContentLoaded', () => {

    /* ═══════════════════════════════════════════
       UÇUŞAN ARKA PLAN YAPRAKLARI
    ═══════════════════════════════════════════ */
    const bgPetals    = document.getElementById('bg-petals');
    const petalEmojis = ['🌸', '🌺', '🌷', '✿', '❀', '🌹'];
    for (let i = 0; i < 18; i++) {
        const span = document.createElement('span');
        span.className = 'bg-petal';
        span.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
        span.style.left             = `${Math.random() * 100}vw`;
        span.style.fontSize         = `${Math.random() * 1.2 + 0.7}rem`;
        span.style.animationDuration = `${Math.random() * 12 + 10}s`;
        span.style.animationDelay   = `-${Math.random() * 20}s`;
        bgPetals.appendChild(span);
    }

    /* ═══════════════════════════════════════════
       YANLIŞ CEVAP SESİ — yanlis.mp3 dosyasından
       Her yanlışta ses biraz daha yüksek çalar
    ═══════════════════════════════════════════ */
    const wrongAudio = document.getElementById('wrong-audio');

    function playCrowdAAA(volume) {
        if (!wrongAudio) return;
        wrongAudio.pause();
        wrongAudio.currentTime = 0;
        wrongAudio.volume = Math.min(volume, 1.0);
        wrongAudio.play().catch(e => console.log('Ses:', e));
    }

    /* ═══════════════════════════════════════════
       SORU EKRANI MANTIĞI

    ═══════════════════════════════════════════ */
    const quizInput   = document.getElementById('quiz-input');
    const quizBtn     = document.getElementById('quiz-btn');
    const quizHint    = document.getElementById('quiz-hint');
    const wrongEmoji  = document.getElementById('wrong-emoji');
    const quizScreen  = document.getElementById('quiz-screen');
    const mainContent = document.getElementById('main-content');

    let wrongCount = 0;

    function handleWrongAnswer() {
        wrongCount++;
        // Ses giderek yüksekleşir ve uzar
        const volume   = Math.min(0.18 + wrongCount * 0.22, 1.0);
        const duration = Math.min(0.8 + wrongCount * 0.4, 3.5);
        playCrowdAAA(volume, duration);

        quizInput.classList.remove('shake');
        void quizInput.offsetWidth;
        quizInput.classList.add('shake');

        const messages = [
            { emoji: '😧',  hint: 'Emin misin? Bir düşün...' },
            { emoji: '😱',  hint: 'Aa! Bu yanlış!' },
            { emoji: '🫨',  hint: 'AAAA! Gerçekten bilmiyor musun?!' },
            { emoji: '🤯',  hint: 'AAAA!!! Nasıl bilmezsin??!' },
            { emoji: '💀',  hint: 'AAAAAAA!!! AVAŞIN\'I NASIL BİLMEZSİN!' },
        ];
        const msg = messages[Math.min(wrongCount - 1, messages.length - 1)];
        wrongEmoji.textContent = msg.emoji;
        quizHint.textContent   = msg.hint;
        quizHint.style.color   = wrongCount >= 3 ? '#ff3c7d' : '#ffb347';

        quizInput.value = '';
        quizInput.focus();
    }

    function handleCorrectAnswer() {
        quizInput.blur();
        quizScreen.style.animation = 'fadeOutScale 0.8s ease forwards';
        setTimeout(() => {
            quizScreen.style.display    = 'none';
            mainContent.style.display   = 'flex';
            mainContent.style.animation = 'fadeIn 1s ease';
            initMain();
        }, 800);
    }

    function checkAnswer() {
        const val = quizInput.value.trim().toLowerCase()
            .replace('ş', 'ş').replace('ı', 'ı');
        if (
            val === 'avaşin'  || val === 'avaşın' ||
            val === 'avasın'  || val === 'avasin'  ||
            val === 'avash̦in' || val === 'avaşin'
        ) {
            handleCorrectAnswer();
        } else if (val === '') {
            quizInput.focus();
        } else {
            handleWrongAnswer();
        }
    }

    quizBtn.addEventListener('click', checkAnswer);
    quizInput.addEventListener('keydown', e => { if (e.key === 'Enter') checkAnswer(); });

    /* ═══════════════════════════════════════════
       SÜSLÜ ÇİÇEK + OVERLAY
    ═══════════════════════════════════════════ */
    function initMain() {
        const fancyFlower = document.getElementById('fancy-flower');
        const bloomBtn    = document.getElementById('bloom-btn');
        const resetBtn    = document.getElementById('reset-btn');
        const particles   = document.getElementById('particles');

        // Arka plan parçacıkları
        for (let i = 0; i < 30; i++) {
            const p    = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 4 + 1;
            p.style.cssText = `
                width:${size}px; height:${size}px;
                left:${Math.random()*100}vw; bottom:-20px;
                background:hsl(${Math.random()*60+300},100%,75%);
                animation-duration:${Math.random()*10+10}s;
                animation-delay:-${Math.random()*5}s;
            `;
            particles.appendChild(p);
        }

        bloomBtn.addEventListener('click', () => {
            fancyFlower.classList.add('bloomed');
            bloomBtn.disabled = true;
            bloomBtn.textContent = '🌸 Açıyor...';
            bloomBtn.style.opacity = '0.6';

            // Patlayan parlak parçacıklar
            for (let i = 0; i < 60; i++) {
                setTimeout(() => {
                    const bp  = document.createElement('div');
                    bp.className = 'particle';
                    const size = Math.random() * 7 + 2;
                    const hue  = Math.random() * 80 + 290;
                    bp.style.cssText = `
                        width:${size}px; height:${size}px;
                        left:${50 + (Math.random()-0.5)*50}%;
                        top:${42  + (Math.random()-0.5)*40}%;
                        background:hsl(${hue},100%,70%);
                        box-shadow:0 0 10px hsl(${hue},100%,75%);
                        opacity:1;
                    `;
                    particles.appendChild(bp);
                    bp.animate([
                        { transform:'scale(0) rotate(0deg)', opacity:1 },
                        { transform:`scale(1) translate(${(Math.random()-0.5)*700}px,${(Math.random()-0.5)*700}px) rotate(${Math.random()*720}deg)`, opacity:0 }
                    ], { duration:2500 + Math.random()*1000, easing:'ease-out' })
                    .onfinish = () => bp.remove();
                }, i * 35);
            }

            setTimeout(() => {
                document.getElementById('photo-overlay').classList.add('show');
                document.getElementById('bg-music').play()
                    .catch(e => console.log('Müzik:', e));
                bloomBtn.textContent = '✨ Hayran Kalın';
            }, 4500);
        });

        document.getElementById('close-overlay').addEventListener('click', () => {
            document.getElementById('photo-overlay').classList.remove('show');
            document.getElementById('bg-music').pause();
        });

        resetBtn.addEventListener('click', () => {
            fancyFlower.classList.remove('bloomed');
            bloomBtn.disabled = false;
            bloomBtn.style.opacity = '1';
            bloomBtn.textContent = '🌸 Çiçeği Açtır';
            document.getElementById('photo-overlay').classList.remove('show');
            const m = document.getElementById('bg-music');
            m.pause(); m.currentTime = 0;
        });
    }
});
