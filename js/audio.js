(function () {
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      audioCtx = new AudioContextClass();
    }
    return audioCtx;
  }

  function beep({
    frequency = 880,
    duration = 0.08,
    type = "sine",
    volume = 0.03,
    delay = 0
  } = {}) {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  function playScanStart() {
    beep({ frequency: 660, duration: 0.06, type: "square", volume: 0.025, delay: 0 });
    beep({ frequency: 880, duration: 0.06, type: "square", volume: 0.025, delay: 0.08 });
    beep({ frequency: 1100, duration: 0.08, type: "triangle", volume: 0.03, delay: 0.16 });
  }

  function playProgressTick(progress = 0) {
    const freq = 500 + progress * 5;
    beep({ frequency: freq, duration: 0.03, type: "sine", volume: 0.015 });
  }

  function playSuccess() {
    beep({ frequency: 740, duration: 0.08, type: "triangle", volume: 0.03, delay: 0 });
    beep({ frequency: 988, duration: 0.08, type: "triangle", volume: 0.03, delay: 0.09 });
    beep({ frequency: 1318, duration: 0.12, type: "triangle", volume: 0.035, delay: 0.18 });
  }

  function playError() {
    beep({ frequency: 240, duration: 0.1, type: "sawtooth", volume: 0.03, delay: 0 });
    beep({ frequency: 180, duration: 0.12, type: "sawtooth", volume: 0.03, delay: 0.08 });
  }

  function unlockAudio() {
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
  }

  window.PhoneTrackerAudio = {
    unlockAudio,
    playScanStart,
    playProgressTick,
    playSuccess,
    playError
  };
})();