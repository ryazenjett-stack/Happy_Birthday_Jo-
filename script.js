const messages = [
  "Hi Jenah. Happy birthday.",
  "I hope your day fills with calm and soft light.",
  "I owe you an apology.",
  "I hurt you. I regret my choices.",
  "I missed us. I missed how you smile.",
  "I do not expect instant forgiveness.",
  "I wish to heal things between us, if you allow it.",
  "Thank you for reading this. I hope today brings you peace."
];

const messageEl = document.getElementById('messageText');
const replayBtn = document.getElementById('replayBtn');
const albumBtn = document.getElementById('albumBtn');
let sequenceIndex = 0;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function typeText(text, speed = 28) {
  messageEl.textContent = '';
  for (let i = 0; i < text.length; i++) {
    messageEl.textContent += text[i];
    await sleep(speed);
  }
}

async function playSequence() {
  sequenceIndex = 0;
  fadeInMusic();
  for (let i = 0; i < messages.length; i++) {
    await typeText(messages[i]);
    await sleep(900);
  }
  triggerConfetti();
}

playSequence();
replayBtn.addEventListener('click', playSequence);
albumBtn.addEventListener('click', () => window.scrollTo(0, document.body.scrollHeight));

// Static images (no upload)
const thumbs = document.getElementById('thumbs');
const slideImg = document.getElementById('slideImg');
const pager = document.getElementById('pager');
let slideIndex = 0;
let slideshowTimer = null;
const files = Array.from(thumbs.querySelectorAll('img'));

files.forEach((img, idx) => {
  const dot = document.createElement('div');
  dot.className = 'dot' + (idx === 0 ? ' active' : '');
  dot.dataset.index = idx;
  dot.addEventListener('click', () => gotoSlide(idx));
  pager.appendChild(dot);
});

function gotoSlide(i) {
  slideIndex = i;
  slideImg.src = files[i].src;
  document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
  document.querySelector(`.dot[data-index="${i}"]`).classList.add('active');
}

document.getElementById('prevBtn').addEventListener('click', () => {
  const next = (slideIndex - 1 + files.length) % files.length;
  gotoSlide(next);
});
document.getElementById('nextBtn').addEventListener('click', () => {
  const next = (slideIndex + 1) % files.length;
  gotoSlide(next);
});

const playButton = document.getElementById('playSlideshow');
playButton.addEventListener('click', () => {
  if (slideshowTimer) {
    clearInterval(slideshowTimer);
    slideshowTimer = null;
    playButton.textContent = 'Play slideshow';
  } else {
    playButton.textContent = 'Pause slideshow';
    slideshowTimer = setInterval(() => {
      const next = (slideIndex + 1) % files.length;
      gotoSlide(next);
    }, 2500);
  }
});

// Music fade-in
const bgMusic = document.getElementById('bgMusic');
function fadeInMusic() {
  if (!bgMusic) return;
  bgMusic.volume = 0;
  bgMusic.play().catch(() => {});
  let vol = 0;
  const fade = setInterval(() => {
    if (vol < 0.4) {
      vol += 0.02;
      bgMusic.volume = vol;
    } else {
      clearInterval(fade);
    }
  }, 200);
}

// Save current music state before page change
function saveMusicState() {
  localStorage.setItem('musicTime', bgMusic.currentTime);
  localStorage.setItem('musicPlaying', !bgMusic.paused);
}

// Restore music state when page reloads or next page opens
function restoreMusicState() {
  const savedTime = localStorage.getItem('musicTime');
  const wasPlaying = localStorage.getItem('musicPlaying') === 'true';
  if (savedTime) bgMusic.currentTime = parseFloat(savedTime);
  if (wasPlaying) bgMusic.play().catch(() => {});
}
restoreMusicState();

window.addEventListener('beforeunload', saveMusicState);

// Confetti animation
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');
let pieces = [];

function resize() {
  confettiCanvas.width = confettiCanvas.clientWidth * devicePixelRatio;
  confettiCanvas.height = confettiCanvas.clientHeight * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
}
window.addEventListener('resize', resize);
resize();

function random(min, max) { return Math.random() * (max - min) + min; }

function spawnConfetti() {
  for (let i = 0; i < 40; i++) {
    pieces.push({
      x: random(20, confettiCanvas.clientWidth - 20),
      y: -10 - random(0, 200),
      w: random(6, 12),
      h: random(8, 16),
      vx: random(-0.6, 0.6),
      vy: random(1.2, 3.2),
      rot: random(0, Math.PI * 2),
      vr: random(-0.06, 0.06),
      color: ['#ff6b9a', '#ffd07a', '#6b9bff', '#a6ffda'][Math.floor(random(0, 4))]
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  for (const p of pieces) {
    p.x += p.vx * 1.6;
    p.y += p.vy;
    p.rot += p.vr;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }
  pieces = pieces.filter(p => p.y < confettiCanvas.clientHeight + 40);
}
function step() { drawConfetti(); requestAnimationFrame(step); }
step();

function triggerConfetti() {
  spawnConfetti();
  setTimeout(spawnConfetti, 300);
  setTimeout(spawnConfetti, 650);
}

// Floating hearts
const heartsRoot = document.getElementById('hearts');
function makeHeart() {
  const h = document.createElement('div');
  h.className = 'heart';
  const size = Math.floor(Math.random() * 20) + 18;
  h.style.width = size + 'px';
  h.style.height = size + 'px';
  h.style.left = Math.random() * 100 + '%';
  h.style.bottom = '-40px';
  h.style.opacity = Math.random() * 0.6 + 0.25;
  heartsRoot.appendChild(h);
  const rise = Math.random() * 6000 + 4000;
  h.animate([
    { transform: 'translateY(0) scale(0.6)', opacity: h.style.opacity },
    { transform: 'translateY(-120vh) scale(1.1)', opacity: 0 }
  ], { duration: rise, easing: 'linear' }).onfinish = () => h.remove();
}
setInterval(makeHeart, 700);

const playBtn = document.getElementById('playAudio');
const pauseBtn = document.getElementById('pauseAudio');
const volumeSlider = document.getElementById('volume');
playBtn.addEventListener('click', () => {
  bgMusic.volume = volumeSlider.value;
  bgMusic.play().catch(() => {});
});
pauseBtn.addEventListener('click', () => bgMusic.pause());
volumeSlider.addEventListener('input', e => bgMusic.volume = e.target.value);

const nextPageBtn = document.getElementById('nextPageBtn');
if (nextPageBtn) {
  nextPageBtn.addEventListener('click', () => {
    saveMusicState();
    window.location.href = 'message.html';
  });
}

// Fullscreen mode for slideshow
const fullscreenBtn = document.getElementById('fullscreenBtn');
const slideshowContainer = document.getElementById('slideshow');

fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    slideshowContainer.requestFullscreen().catch(err => {
      console.log('Fullscreen failed:', err);
    });
  } else {
    document.exitFullscreen();
  }
});

document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    slideshowContainer.classList.add('fullscreen');
    document.getElementById('prevBtn').style.display = 'block';
    document.getElementById('nextBtn').style.display = 'block';
  } else {
    slideshowContainer.classList.remove('fullscreen');
    document.getElementById('prevBtn').style.display = '';
    document.getElementById('nextBtn').style.display = '';
  }
});
