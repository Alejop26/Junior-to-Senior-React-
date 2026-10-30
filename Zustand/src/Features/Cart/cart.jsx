import { userStore } from '../../Store/userStore'

const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(price)

function Cart() {
  const cart = userStore((state) => state.cart)
  const removeFromCart = userStore((state) => state.removeFromCart)
  const clearCart = userStore((state) => state.clearCart)

  const itemCount = cart.reduce((total, product) => total + product.quantity, 0)
  const total = cart.reduce(
    (sum, product) => sum + Number(product.price ?? 0) * product.quantity,
    0
  )

  if (cart.length === 0) {
    return (
      <section className="cart" aria-labelledby="cart-title">
        <h2 id="cart-title">Carrito de compras</h2>
        <p>Tu carrito está vacío.</p>
      </section>
    )
  }

  return (
    <section className="cart" aria-labelledby="cart-title">
      <h2 id="cart-title">Carrito de compras</h2>

      <ul className="cart__items">
        {cart.map((product) => {
          const name = product.name ?? product.title ?? 'Producto'
          const price = Number(product.price ?? 0)

          return (
            <li className="cart__item" key={product.id}>
              <div>
                <h3>{name}</h3>
                <p>
                  {formatPrice(price)} × {product.quantity}
                </p>
              </div>
              <p>{formatPrice(price * product.quantity)}</p>
              <button
                type="button"
                onClick={() => removeFromCart(product.id)}
                aria-label={`Quitar ${name} del carrito`}
              >
                Quitar
              </button>
            </li>
          )
        })}
      </ul>

      <div className="cart__summary">
        <p>
          {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}
        </p>
        <p>Total: {formatPrice(total)}</p>
      </div>

      <button type="button" onClick={clearCart}>
        Vaciar carrito
      </button>
    </section>
  )
}

export default Cart