import { create } from "zustand";

interface IEventStore {
  mousePos: { x: number; y: number };
  boundingRect: DOMRect | null;
  setMousePos: (pos: { x: number; y: number }) => void;
  setBoundingRect: (rect: DOMRect) => void;
}

export const EventStore = create<IEventStore>((set) => ({
  mousePos: { x: 0, y: 0 },
  boundingRect: null,
  setMousePos: (pos) => set(() => ({ mousePos: pos })),
  setBoundingRect: (rect) => set(() => ({ boundingRect: rect })),
}));
