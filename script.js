// script.js: connects audio element to WebAudio analyser and drives needle animation.
(function(){
  const audioElem = document.getElementById('audioElem');
  const playBtn = document.getElementById('playBtn');
  const vol = document.getElementById('vol');
  const intensityControl = document.getElementById('intensity');
  const needleGroup = document.getElementById('needleGroup');
  const bigNeedleGroup = document.getElementById('bigNeedleGroup');
  const clawStroke = document.getElementById('clawStroke');

  let audioCtx, sourceNode, analyserNode, dataArray, rafId;

  // angle mapping
  const MIN_ANGLE = -55;
  const MAX_ANGLE = 55;

  // smoothing
  let currentLevel = 0;
  const SMOOTH = 0.12;

  function ensureAudioContext(){
    if(audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = 2048;
    analyserNode.smoothingTimeConstant = 0.6;
    dataArray = new Uint8Array(analyserNode.frequencyBinCount);
  }

  function connectAudioElement(){
    ensureAudioContext();
    if(sourceNode) sourceNode.disconnect();
    sourceNode = audioCtx.createMediaElementSource(audioElem);
    sourceNode.connect(analyserNode);
    analyserNode.connect(audioCtx.destination);
  }

  function start(){
    if(!audioCtx) connectAudioElement();
    if(audioCtx.state === 'suspended') audioCtx.resume();
    audioElem.play().catch(()=>{
      // autoplay blocked — inform user (button will resume)
      console.log('Autoplay blocked; user interaction required.');
    });
    animate();
    // play scratch reveal shortly after audio starts
    setTimeout(playScratchReveal, 900);
  }

  playBtn.addEventListener('click', ()=>{
    // if not connected yet, connect
    if(!audioCtx) connectAudioElement();
    if(audioCtx.state === 'suspended') audioCtx.resume();
    audioElem.play();
  });

  vol.addEventListener('input', ()=> audioElem.volume = vol.value);

  function getRMS(){
    analyserNode.getByteTimeDomainData(dataArray);
    let sum = 0;
    for(let i=0;i<dataArray.length;i++){
      const v = (dataArray[i] - 128) / 128; // -1..1
      sum += v * v;
    }
    const rms = Math.sqrt(sum / dataArray.length);
    return rms; // 0..1-ish
  }

  function animate(){
    rafId = requestAnimationFrame(animate);
    if(!analyserNode) return;
    const rms = getRMS();
    // scale and bias RMS based on intensity
    const intensity = parseFloat(intensityControl.value);
    // map rms (0..~0.4 typical) to 0..1 with extra headroom
    const scaled = Math.min(1, (rms * 3.5) * (0.6 + intensity * 0.8));
    // smooth
    currentLevel += (scaled - currentLevel) * SMOOTH;

    const angle = MIN_ANGLE + (MAX_ANGLE - MIN_ANGLE) * currentLevel;
    needleGroup.setAttribute('transform', `translate(150,150) rotate(${angle})`);
    bigNeedleGroup.setAttribute('transform', `translate(300,200) rotate(${angle})`);
  }

  // Clip stroke reveal prep
  function prepareClawStroke(){
    if(!clawStroke) return;
    const total = clawStroke.getTotalLength();
    clawStroke.style.strokeDasharray = total;
    clawStroke.style.strokeDashoffset = total;
    return total;
  }

  function playScratchReveal(){
    const total = prepareClawStroke();
    if(!clawStroke || !total) return;
    clawStroke.style.transition = 'none';
    clawStroke.style.strokeDashoffset = total;
    // animate
    setTimeout(()=>{
      clawStroke.style.transition = 'stroke-dashoffset 520ms cubic-bezier(.02,.8,.3,1)';
      clawStroke.style.strokeDashoffset = 0;
    }, 50);
  }

  // Initialize: prepare stroke and try to start playback (autoplay may be blocked)
  prepareClawStroke();

  // If user loads the page and the browser allows autoplay (some do when muted or previous gesture),
  // we attempt to start. If blocked, clicking Play will start audio + animation.
  // Start when user interacts with page to enable AudioContext in some browsers.
  document.addEventListener('click', function initOnFirstClick(){
    if(!audioCtx){
      connectAudioElement();
      // try to start playback on user gesture
      audioElem.play().then(()=>{
        // started, begin animation loop
        animate();
        playScratchReveal();
      }).catch(()=>{
        // autoplay blocked; nothing to do — user can press play
      });
    }
    document.removeEventListener('click', initOnFirstClick);
  });

})();
