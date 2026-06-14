import { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2Icon, VolumeXIcon, ChevronDownIcon } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { AmbientSound } from '../types';

const SOUNDS: { value: AmbientSound; label: string; icon: string }[] = [
  { value: 'none', label: 'Off', icon: '🔇' },
  { value: 'typewriter', label: 'Typewriter', icon: '🖋️' },
  { value: 'rain', label: 'Rain', icon: '🌧️' },
  { value: 'cafe', label: 'Café', icon: '☕' },
  { value: 'lofi', label: 'Lo-fi', icon: '🎵' },
];

// Generate ambient sounds using Web Audio API (no external files needed)
class AmbientGenerator {
  private ctx: AudioContext | null = null;
  private nodes: AudioNode[] = [];
  private gainNode: GainNode | null = null;
  private isPlaying = false;

  start(type: AmbientSound, volume: number) {
    this.stop();
    if (type === 'none') return;

    try {
      this.ctx = new AudioContext();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = volume * 0.3;
      this.gainNode.connect(this.ctx.destination);

      switch (type) {
        case 'rain':
          this.createRain();
          break;
        case 'cafe':
          this.createCafe();
          break;
        case 'lofi':
          this.createLofi();
          break;
        case 'typewriter':
          this.createTypewriterAmbient();
          break;
      }

      this.isPlaying = true;
    } catch {
      // AudioContext not available
    }
  }

  private createRain() {
    if (!this.ctx || !this.gainNode) return;
    // Brown noise for rain
    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Low-pass filter for softer rain
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    source.connect(filter);
    filter.connect(this.gainNode);
    source.start();

    this.nodes.push(source, filter);
  }

  private createCafe() {
    if (!this.ctx || !this.gainNode) return;
    // Pink noise + gentle hum for cafe ambience
    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 600;
    filter.Q.value = 0.5;

    source.connect(filter);
    filter.connect(this.gainNode);
    source.start();

    this.nodes.push(source, filter);
  }

  private createLofi() {
    if (!this.ctx || !this.gainNode) return;
    // Gentle sine wave chords with vinyl crackle
    const freqs = [261.63, 329.63, 392.00]; // C major chord

    freqs.forEach(freq => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const oscGain = this.ctx!.createGain();
      oscGain.gain.value = 0.04;

      // Slow tremolo
      const lfo = this.ctx!.createOscillator();
      lfo.frequency.value = 0.3 + Math.random() * 0.2;
      const lfoGain = this.ctx!.createGain();
      lfoGain.gain.value = 0.015;

      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      lfo.start();

      osc.connect(oscGain);
      oscGain.connect(this.gainNode!);
      osc.start();

      this.nodes.push(osc, oscGain, lfo, lfoGain);
    });

    // Vinyl crackle (quiet white noise with highpass)
    const bufferSize = this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.015;
    }

    const crackle = this.ctx.createBufferSource();
    crackle.buffer = buffer;
    crackle.loop = true;

    const hpf = this.ctx.createBiquadFilter();
    hpf.type = 'highpass';
    hpf.frequency.value = 5000;

    crackle.connect(hpf);
    hpf.connect(this.gainNode);
    crackle.start();

    this.nodes.push(crackle, hpf);
  }

  private createTypewriterAmbient() {
    if (!this.ctx || !this.gainNode) return;
    // Very subtle mechanical hum
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 60;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 120;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.02;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.gainNode);
    osc.start();

    this.nodes.push(osc, filter, gain);
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.setTargetAtTime(volume * 0.3, this.ctx!.currentTime, 0.1);
    }
  }

  stop() {
    this.nodes.forEach(node => {
      try {
        if ('stop' in node && typeof (node as OscillatorNode).stop === 'function') {
          (node as OscillatorNode).stop();
        }
        node.disconnect();
      } catch {
        // Already stopped
      }
    });
    this.nodes = [];

    if (this.ctx && this.ctx.state !== 'closed') {
      try { this.ctx.close(); } catch { /* ignore */ }
    }
    this.ctx = null;
    this.gainNode = null;
    this.isPlaying = false;
  }

  get playing() {
    return this.isPlaying;
  }
}

export const AmbientSoundPlayer = () => {
  const { settings, updateSettings } = useSettings();
  const [volume, setVolume] = useState(0.5);
  const [isExpanded, setIsExpanded] = useState(false);
  const generatorRef = useRef<AmbientGenerator | null>(null);

  // Initialize generator
  useEffect(() => {
    generatorRef.current = new AmbientGenerator();
    return () => {
      generatorRef.current?.stop();
    };
  }, []);

  // React to ambient sound changes
  useEffect(() => {
    if (generatorRef.current) {
      generatorRef.current.start(settings.ambientSound, volume);
    }
  }, [settings.ambientSound]);

  // React to volume changes
  useEffect(() => {
    if (generatorRef.current) {
      generatorRef.current.setVolume(volume);
    }
  }, [volume]);

  const handleSoundChange = useCallback((sound: AmbientSound) => {
    updateSettings({ ambientSound: sound });
    if (sound === 'none') {
      generatorRef.current?.stop();
    }
  }, [updateSettings]);

  const currentSound = SOUNDS.find(s => s.value === settings.ambientSound) || SOUNDS[0];

  // Don't render if no sound is selected and player is collapsed
  if (settings.ambientSound === 'none' && !isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-all shadow-lg"
        title="Ambient sounds"
      >
        <VolumeXIcon size={16} />
      </button>
    );
  }

  return (
    <div className="ambient-player">
      <div className="flex items-center gap-3">
        {/* Current sound */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          <span>{currentSound.icon}</span>
          <span>{currentSound.label}</span>
          <ChevronDownIcon
            size={14}
            className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Volume */}
        {settings.ambientSound !== 'none' && (
          <div className="flex items-center gap-2">
            <Volume2Icon size={14} className="text-muted-foreground" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 accent-primary"
            />
          </div>
        )}

        {/* Close */}
        {settings.ambientSound === 'none' && (
          <button
            onClick={() => setIsExpanded(false)}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Expanded sound picker */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-1.5">
          {SOUNDS.map(sound => (
            <button
              key={sound.value}
              onClick={() => handleSoundChange(sound.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                settings.ambientSound === sound.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {sound.icon} {sound.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
