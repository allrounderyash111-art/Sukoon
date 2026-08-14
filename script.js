/* ================================
   SUKOON — script.js
   Har cheez explain ki hui hai. Songs/shayaris change karne ke liye
   admin.html use karo — woh tumhe seedha yeh wala code de dega,
   bas copy karke yahan neeche wale PLAYLIST aur SHAYARIS mein paste karna hai.
================================= */

/* ---------- TWINKLE STARS (extra light layer on top of the image) ---------- */
const twinkleLayer = document.getElementById('twinkleLayer');
for (let i = 0; i < 22; i++) {
  const s = document.createElement('div');
  s.className = 'twinkle';
  s.style.left = Math.random() * 100 + '%';
  s.style.top = Math.random() * 55 + '%';
  s.style.animationDelay = Math.random() * 4 + 's';
  s.style.animationDuration = (2.5 + Math.random() * 3) + 's';
  twinkleLayer.appendChild(s);
}

/* ================================
   SHAYARIS — admin.html se generate hoke yahan aayega
================================= */
const shayaris = [
  "har raat guzar jaati hai,<br>kuch gaane saath reh jaate hain",
  "akele hone mein bhi ek sukoon hai,<br>khud se milne ka mausam hai",
  "khamoshi bhi kabhi kabhi<br>sabse achhi dost lagti hai",
  "chaand akela nahi hota,<br>bas thoda door hota hai",
  "kuch log akele nahi hote,<br>bas apne saath hote hain"
];

let sIndex = 0;
const shayariEl = document.getElementById('shayariLine');
function showShayari() {
  shayariEl.classList.remove('show');
  setTimeout(() => {
    shayariEl.innerHTML = shayaris[sIndex % shayaris.length];
    shayariEl.classList.add('show');
    sIndex++;
  }, 500);
}
showShayari();
setInterval(showShayari, 8000);

/* ---------- LIVE LISTENER COUNT (simulated) ---------- */
const countEl = document.getElementById('listenerCount');
let count = 41;
setInterval(() => {
  count += Math.floor(Math.random() * 5) - 2;
  if (count < 14) count = 14;
  countEl.textContent = count;
}, 3500);

/* ================================
   PLAYLIST — admin.html se generate hoke yahan aayega
   id = YouTube video ka ID (URL mein "v=" ke baad wala part)
================================= */
const playlist = [
  { id: "A5G528i-OYY", title: "Kitaab", artist: "Shwet" },
  { id: "REPLACE_WITH_VIDEO_ID", title: "Barsaat", artist: "" },
  { id: "REPLACE_WITH_VIDEO_ID", title: "Bairan", artist: "" }
];

let currentTrack = 0;
let player;
let isPlaying = false;

const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const songbar = document.getElementById('songbar');
const trackNameEl = document.getElementById('trackName');
const artistNameEl = document.getElementById('artistName');
const progressFill = document.getElementById('progressFill');

const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '0',
    width: '0',
    videoId: playlist[currentTrack].id,
    playerVars: { autoplay: 0, controls: 0 },
    events: {
      onStateChange: onPlayerStateChange,
      onReady: () => { updateTrackInfo(); }
    }
  });
}

function updateTrackInfo() {
  trackNameEl.textContent = playlist[currentTrack].title;
  artistNameEl.textContent = playlist[currentTrack].artist || '';
}

function loadTrack(index, autoplay) {
  if (playlist[index].id === "REPLACE_WITH_VIDEO_ID") {
    alert("Yeh slot abhi khaali hai — admin.html se code generate karke script.js mein paste karo.");
    return;
  }
  currentTrack = index;
  updateTrackInfo();
  if (player && player.loadVideoById) {
    if (autoplay) {
      player.loadVideoById(playlist[currentTrack].id);
    } else {
      player.cueVideoById(playlist[currentTrack].id);
    }
  }
}

playBtn.addEventListener('click', () => {
  if (!player) return;
  if (isPlaying) {
    player.pauseVideo();
  } else {
    if (playlist[currentTrack].id === "REPLACE_WITH_VIDEO_ID") {
      alert("Yeh slot abhi khaali hai — admin.html se code generate karke script.js mein paste karo.");
      return;
    }
    player.playVideo();
  }
});

prevBtn.addEventListener('click', () => {
  const newIndex = (currentTrack - 1 + playlist.length) % playlist.length;
  loadTrack(newIndex, isPlaying);
});

nextBtn.addEventListener('click', () => {
  const newIndex = (currentTrack + 1) % playlist.length;
  loadTrack(newIndex, isPlaying);
});

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
    songbar.classList.add('playing');
    playIcon.innerHTML = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>';
  } else if (event.data === YT.PlayerState.PAUSED) {
    isPlaying = false;
    songbar.classList.remove('playing');
    playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
  } else if (event.data === YT.PlayerState.ENDED) {
    const newIndex = (currentTrack + 1) % playlist.length;
    loadTrack(newIndex, true);
  }
}

setInterval(() => {
  if (player && player.getCurrentTime && isPlaying) {
    const dur = player.getDuration();
    const cur = player.getCurrentTime();
    if (dur > 0) {
      progressFill.style.width = (cur / dur * 100) + '%';
    }
  }
}, 1000);
