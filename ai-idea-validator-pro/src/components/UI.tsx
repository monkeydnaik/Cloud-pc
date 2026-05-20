import { useGameStore } from '../store/gameStore'

export function UI() {
  const score = useGameStore((state) => state.score)

  return (
    <div className="absolute top-4 left-4 text-white font-bold text-xl pointer-events-none drop-shadow-md z-10 w-full pr-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">Aether's Wake</h1>
          <div className="text-sm font-normal mt-1 opacity-80">WASD to move, Space to jump, Hold Space to glide</div>
          <div className="text-sm font-normal opacity-80">Shift to Dash, Click to Grapple</div>
        </div>
        <div className="text-2xl flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg border border-cyan-500/30">
          <span className="text-cyan-400">Aether Crystals:</span> {score}
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50">
        +
      </div>
    </div>
  )
}
