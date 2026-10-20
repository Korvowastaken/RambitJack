// Synthesised with Web Audio, plus two Pixabay samples (Pixabay Content License):
// swipe.mp3 — pixabay.com/sound-effects/film-special-effects-swipe-132084
// chips.mp3 — pixabay.com/sound-effects/film-special-effects-handfull-of-poker-chips-95810
let ctx
let muted = false
// created lazily: browsers only allow audio after the first user gesture
const audio = () => (ctx ??= new AudioContext())

export function setMuted(value) {
  muted = value
}

function tone(freq, start, duration, type = 'square', volume = 0.06) {
  const a = audio()
  const osc = a.createOscillator()
  const gain = a.createGain()
  const t = a.currentTime + start
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(volume, t)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(gain).connect(a.destination)
  osc.start(t)
  osc.stop(t + duration)
}

// fading burst of filtered noise
function swish(start, freq, duration = 0.12, volume = 0.35) {
  const a = audio()
  const buffer = a.createBuffer(1, Math.floor(a.sampleRate * duration), a.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
  const src = a.createBufferSource()
  const filter = a.createBiquadFilter()
  const gain = a.createGain()
  src.buffer = buffer
  filter.type = 'bandpass'
  filter.frequency.value = freq
  gain.gain.value = volume
  src.connect(filter).connect(gain).connect(a.destination)
  src.start(a.currentTime + start)
}

// fetched up front, decoded on first play (decoding needs the AudioContext);
// falls back to a synth sound if the file can't load
function sample(url, fallback, volume = 0.6) {
  const data = fetch(url).then(r => r.arrayBuffer()).catch(() => null)
  let decoded
  return (start = 0) => {
    const a = audio()
    const at = a.currentTime + start
    decoded ??= data.then(d => d && a.decodeAudioData(d)).catch(() => null)
    decoded.then(buffer => {
      if (!buffer) return fallback(Math.max(0, at - a.currentTime))
      const src = a.createBufferSource()
      const gain = a.createGain()
      src.buffer = buffer
      gain.gain.value = volume
      src.connect(gain).connect(a.destination)
      src.start(Math.max(at, a.currentTime))
    })
  }
}

const swipe = sample('/sounds/swipe.mp3', start => swish(start, 3200))
const chips = sample('/sounds/chips.mp3', start => tone(110, start, 0.35, 'sawtooth', 0.08))

const play = fn => (...args) => { if (!muted) fn(...args) }

export const sfx = {
  deal: play((delayMs = 0) => swipe(delayMs / 1000)),
  flip: play(() => swish(0, 1800, 0.08, 0.5)),
  click: play(() => tone(880, 0, 0.05)),
  lose: play(() => chips()),
  win: play(() => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.08, 0.22))),
  draw: play(() => [440, 440].forEach((f, i) => tone(f, i * 0.15, 0.18, 'triangle', 0.1))),
}
