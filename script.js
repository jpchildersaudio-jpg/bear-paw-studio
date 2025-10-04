const audio = document.getElementById('bg-music');
const needle = document.getElementById('needle');
const overlay = document.getElementById('overlay');
const playButton = document.getElementById('playButton');

// Web Audio API for VU animation
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const track = audioCtx.createMediaElementSource(audio);
const analyser = audioCtx.createAnalyser();
track.connect(analyser).connect(audioCtx.destination);

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function animateNeedle() {
  requestAnimationFrame(animateNeedle);
  analyser.getByteTimeDomainData(dataArray);
  
  let sum = 0;
  for (let i = 0; i < bufferLength; i++) {
    sum += Math.abs(dataArray[i] - 128);
  }
  let avg = sum / bufferLength;
  
  let angle = (avg / 64) * 90 - 45;
  if (angle > 45) angle = 45;
  if (angle < -45) angle = -45;
  
  needle.style.transform = `rotate(${angle}deg)`;
}

playButton.addEventListener('click', () => {
  overlay.style.display = 'none';
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  audio.play();
  animateNeedle();
});
