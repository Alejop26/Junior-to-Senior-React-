import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const userStore = create(
  persist(
    (set) => ({
      cart: [],
      favorites: [],

      addToCart: (product) =>
        set((state) => {
          const existingProduct = state.cart.find((item) => item.id === product.id)

          if (existingProduct) {
            if (
              Number.isFinite(existingProduct.stock) &&
              existingProduct.quantity >= existingProduct.stock
            ) {
              return state
            }

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

      increaseQuantity: (productId) =>
        set((state) => ({
          cart: state.cart.map((product) =>
            product.id === productId &&
            (!Number.isFinite(product.stock) || product.quantity < product.stock)
              ? { ...product, quantity: product.quantity + 1 }
              : product
          ),
        })),

      decreaseQuantity: (productId) =>
        set((state) => ({
          cart: state.cart
            .map((product) =>
              product.id === productId
                ? { ...product, quantity: product.quantity - 1 }
                : product
            )
            .filter((product) => product.quantity > 0),
        })),

      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((product) => product.id !== productId),
        })),

      clearCart: () => set({ cart: [] }),

      toggleFavorite: (productId) =>
        set((state) => ({
          favorites: state.favorites.includes(productId)
            ? state.favorites.filter((id) => id !== productId)
            : [...state.favorites, productId],
        })),
    }),
    {
      name: 'shopping-cart',
      partialize: (state) => ({
        cart: state.cart,
        favorites: state.favorites,
      }),
    }
  )
)
