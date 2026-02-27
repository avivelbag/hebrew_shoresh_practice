import type { TropeMark } from "@/types/trope";

let audioCtx: AudioContext | null = null;
let activeNodes: AudioNode[] = [];

function getContext(): AudioContext {
  if (!audioCtx || audioCtx.state === "closed") {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function cleanupActiveNodes() {
  for (const node of activeNodes) {
    try {
      node.disconnect();
    } catch {
      // Node may already be disconnected
    }
  }
  activeNodes = [];
}

export async function playTrope(motif: TropeMark): Promise<void> {
  const ctx = getContext();
  if (ctx.state === "suspended") await ctx.resume();

  cleanupActiveNodes();

  const startTime = ctx.currentTime + 0.05;
  let time = startTime;

  for (const [semitones, durMult] of motif.intervals) {
    const freq = 293.66 * Math.pow(2, semitones / 12); // D4 tonic
    const duration = 0.25 * durMult;

    const osc = new OscillatorNode(ctx, { type: "sine", frequency: freq });
    const gain = new GainNode(ctx, { gain: 0 });

    osc.connect(gain).connect(ctx.destination);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.25, time + 0.02);
    gain.gain.setValueAtTime(0.25, time + duration - 0.05);
    gain.gain.linearRampToValueAtTime(0, time + duration);

    osc.start(time);
    osc.stop(time + duration);

    activeNodes.push(osc, gain);
    time += duration;
  }

  // Cleanup after last note ends
  const lastOsc = activeNodes[activeNodes.length - 2] as OscillatorNode;
  lastOsc.addEventListener("ended", cleanupActiveNodes);
}

export function stopAll() {
  cleanupActiveNodes();
}

export function suspendContext() {
  if (audioCtx && audioCtx.state === "running") audioCtx.suspend();
}
