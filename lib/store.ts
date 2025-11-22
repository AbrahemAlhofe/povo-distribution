import { create } from 'zustand'

interface StoreState {
  isAsideOpen: boolean
  toggleAside: () => void
}

const useStore = create<StoreState>((set) => ({
  isAsideOpen: false,
  toggleAside: () => set((state) => ({ isAsideOpen: !state.isAsideOpen })),
}))

export default useStore