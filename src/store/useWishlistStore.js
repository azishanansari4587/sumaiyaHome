// store/useWishlistStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],

      // ✅ Set full wishlist manually
      setWishlist: (data) => set({ wishlist: data }),

      // ✅ Add product with full details (id, image, color, etc.)
      addToWishlist: (product) => {
        const exists = get().wishlist.some(
          (item) =>
            item.id === product.id &&
            item.selectedColor?.name === product.selectedColor?.name // 👈 prevent duplicates of same color
        );

        if (!exists) {
          set({ wishlist: [...get().wishlist, product] });
        }
      },

      // ✅ Remove by productId + color (optional)
      removeFromWishlist: (productId, selectedColorName) => {
        set({
          wishlist: get().wishlist.filter(
            (item) =>
              !(
                item.id === productId &&
                item.selectedColor?.name === selectedColorName
              )
          ),
        });
      },

      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: "wishlist-storage", // persisted key name
    }
  )
);

export default useWishlistStore;
