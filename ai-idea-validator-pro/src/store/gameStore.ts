import { create } from 'zustand'

interface GameState {
  score: number
  addScore: (points: number) => void
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  addScore: (points) => set((state) => ({ score: state.score + points })),
}))
