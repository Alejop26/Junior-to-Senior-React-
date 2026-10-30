import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const userStore = create(
  persist(
    (set) => ({
      cart: [],

      addToCart: (product) =>
        set((state) => {
          const existingProduct = state.cart.find((item) => item.id === product.id)

          if (existingProduct) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: (item.quantity ?? 1) + 1 }
                  : item
              ),
            }
          }

          return { cart: [...state.cart, { ...product, quantity: 1 }] }
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((product) => product.id !== productId),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'shopping-cart',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
)
