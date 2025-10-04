const audio = document.getElementById('bg-music');
const needle = document.getElementById('needle');

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
  
  // Calculate average amplitude
  let sum = 0;
  for (let i = 0; i < bufferLength; i++) {
    sum += Math.abs(dataArray[i] - 128);
  }
  let avg = sum / bufferLength;
  
  // Map average amplitude to needle angle (-45° to +45°)
  let angle = (avg / 64) * 90 - 45;
  if (angle > 45) angle = 45;
  if (angle < -45) angle = -45;
  
  needle.style.transform = `rotate(${angle}deg)`;
}

audio.onplay = () => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  animateNeedle();
};
