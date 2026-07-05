// Utility to generate and play sounds
export class SoundManager {
  private audioContext: AudioContext | null = null

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  // Play warning beep (single tone)
  playWarning(): void {
    const ctx = this.getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = 800 // Hz
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.5)
  }

  // Play critical alert (double beep)
  playCritical(): void {
    const ctx = this.getAudioContext()

    const playBeep = (freq: number, duration: number, delay: number) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = freq
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.4, ctx.currentTime + delay)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration)

      oscillator.start(ctx.currentTime + delay)
      oscillator.stop(ctx.currentTime + delay + duration)
    }

    playBeep(1000, 0.3, 0) // First beep
    playBeep(1000, 0.3, 0.4) // Second beep
  }

  // Play success sound
  playSuccess(): void {
    const ctx = this.getAudioContext()

    const playTone = (freq: number, duration: number, delay: number) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = freq
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.2, ctx.currentTime + delay)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration)

      oscillator.start(ctx.currentTime + delay)
      oscillator.stop(ctx.currentTime + delay + duration)
    }

    playTone(523, 0.2, 0) // C
    playTone(659, 0.2, 0.2) // E
    playTone(784, 0.4, 0.4) // G
  }
}

export const soundManager = new SoundManager()
