import { userStore } from '../../Store/userStore'

const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(price)

function Cart() {
  const cart = userStore((state) => state.cart)
  const increaseQuantity = userStore((state) => state.increaseQuantity)
  const decreaseQuantity = userStore((state) => state.decreaseQuantity)
  const removeFromCart = userStore((state) => state.removeFromCart)
  const clearCart = userStore((state) => state.clearCart)

  const itemCount = cart.reduce((total, product) => total + product.quantity, 0)
  const total = cart.reduce(
    (sum, product) => sum + Number(product.price ?? 0) * product.quantity,
    0
  )

  if (cart.length === 0) {
    return (
      <section className="cart cart--animated" aria-labelledby="cart-title">
        <div className="cart__heading">
          <h2 id="cart-title">Carrito de compras</h2>
          <span className="cart__count-badge" aria-label="0 artículos">
            0
          </span>
        </div>
        <div className="cart__empty">
          <span className="cart__empty-icon" aria-hidden="true">
            🛒
          </span>
          <p>Tu carrito está vacío. ¡Vamos a encontrar algo genial!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="cart cart--animated" aria-labelledby="cart-title">
      <div className="cart__heading">
        <h2 id="cart-title">Carrito de compras</h2>
        <span
          className="cart__count-badge"
          key={itemCount}
          aria-label={`${itemCount} ${itemCount === 1 ? 'artículo' : 'artículos'}`}
        >
          {itemCount}
        </span>
      </div>

      <ul className="cart__items">
        {cart.map((product, index) => {
          const name = product.name ?? product.title ?? 'Producto'
          const price = Number(product.price ?? 0)

          return (
            <li
              className="cart__item"
              key={product.id}
              style={{ animationDelay: `${Math.min(index, 6) * 70}ms` }}
            >
              <div>
                <h3>{name}</h3>
                <p>{formatPrice(price)} cada uno</p>
                <div className="cart__quantity">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(product.id)}
                    aria-label={`Disminuir cantidad de ${name}`}
                  >
                    −
                  </button>
                  <span
                    className="cart__quantity-value"
                    key={product.quantity}
                    aria-live="polite"
                  >
                    {product.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => increaseQuantity(product.id)}
                    disabled={
                      Number.isFinite(product.stock) &&
                      product.quantity >= product.stock
                    }
                    aria-label={`Aumentar cantidad de ${name}`}
                  >
                    +
                  </button>
                </div>
              </div>
              <p>{formatPrice(price * product.quantity)}</p>
              <button
                type="button"
                className="cart__remove"
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
        <p>
          Total:{' '}
          <span className="cart__total-value" key={total} aria-live="polite">
            {formatPrice(total)}
          </span>
        </p>
      </div>

      <button type="button" onClick={clearCart}>
        Vaciar carrito
      </button>
    </section>
  )
}

export default Cart