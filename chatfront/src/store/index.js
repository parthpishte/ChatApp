import { createAuthSlice } from "./slices/aurhslice";
import { create } from "zustand";
import { createChatSlice } from "./slices/chatslice";
export const useAppStore=create()((...a)=>({
    ...createAuthSlice(...a),
    ...createChatSlice(...a),
}))