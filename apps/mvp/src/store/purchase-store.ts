import { set as setDate } from "date-fns";
import { create } from "zustand";

interface PurchaseModalState {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

export const usePurchaseModal = create<PurchaseModalState>((set) => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
}));
