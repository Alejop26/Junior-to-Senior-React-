import { useEffect, useMemo, useState } from 'react'
import { userStore } from '../../Store/userStore'
import './Catalog.css'

const PRODUCTS_URL = 'https://dummyjson.com/products?limit=30'

const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(price)

function Catalog() {
  const addToCart = userStore((state) => state.addToCart)
  const favorites = userStore((state) => state.favorites)
  const toggleFavorite = userStore((state) => state.toggleFavorite)
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(PRODUCTS_URL, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('No fue posible cargar los productos.')
        }

        const data = await response.json()

        if (!Array.isArray(data.products)) {
          throw new Error('La respuesta de productos no tiene el formato esperado.')
        }

        setProducts(data.products)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Ocurrió un error al cargar los productos.'
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => controller.abort()
  }, [retry])

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products]
  )

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    const matches = products.filter((product) => {
      const matchesCategory =
        category === 'all' || product.category === category
      const matchesSearch =
        !normalizedSearch ||
        `${product.title} ${product.description}`.toLowerCase().includes(normalizedSearch)

      return matchesCategory && matchesSearch
    })

    return matches.sort((first, second) => {
      if (sortBy === 'price-ascending') {
        return first.price - second.price
      }

      if (sortBy === 'price-descending') {
        return second.price - first.price
      }

      if (sortBy === 'rating') {
        return second.rating - first.rating
      }

      return first.title.localeCompare(second.title)
    })
  }, [category, products, search, sortBy])

  return (
    <section className="catalog" aria-labelledby="catalog-title">
      <div className="catalog__heading">
        <div>
          <p className="catalog__eyebrow">Nuestra selección</p>
          <h2 id="catalog-title">Catálogo de productos</h2>
        </div>
        {!loading && !error && (
          <p className="catalog__count">
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'producto' : 'productos'}
          </p>
        )}
      </div>

      <div className="catalog__filters">
        <label className="catalog__search">
          <span>Buscar productos</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Ej. teléfono, perfume..."
          />
        </label>

        <label className="catalog__category">
          <span>Categoría</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="catalog__sort">
          <span>Ordenar por</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="featured">Nombre</option>
            <option value="price-ascending">Menor precio</option>
            <option value="price-descending">Mayor precio</option>
            <option value="rating">Mejor calificación</option>
          </select>
        </label>
      </div>

      {loading && (
        <p className="catalog__message" role="status">
          Cargando productos...
        </p>
      )}

      {!loading && error && (
        <div className="catalog__message catalog__message--error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => setRetry((attempt) => attempt + 1)}>
            Intentar de nuevo
          </button>
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <p className="catalog__message">
          No encontramos productos con esos filtros.
        </p>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <ul className="catalog__grid">
          {filteredProducts.map((product) => (
            <li className="product-card" key={product.id}>
              <div className="product-card__image">
                <img src={product.thumbnail} alt={product.title} loading="lazy" />
                <button
                  type="button"
                  className={`product-card__favorite${favorites.includes(product.id) ? ' is-favorite' : ''}`}
                  onClick={() => toggleFavorite(product.id)}
                  aria-pressed={favorites.includes(product.id)}
                  aria-label={
                    favorites.includes(product.id)
                      ? `Quitar ${product.title} de favoritos`
                      : `Agregar ${product.title} a favoritos`
                  }
                >
                  {favorites.includes(product.id) ? '♥' : '♡'}
                </button>
                {product.discountPercentage > 0 && (
                  <span className="product-card__discount">
                    -{Math.round(product.discountPercentage)}%
                  </span>
                )}
              </div>
              <div className="product-card__content">
                <p className="product-card__category">{product.category}</p>
                <h3>{product.title}</h3>
                <p className="product-card__description">{product.description}</p>
                <div className="product-card__details">
                  <span aria-label={`Calificación ${product.rating} de 5`}>
                    ★ {product.rating}
                  </span>
                  <span>{product.stock} disponibles</span>
                </div>
                <div className="product-card__footer">
                  <p>{formatPrice(product.price)}</p>
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    aria-label={`Agregar ${product.title} al carrito`}
                  >
                    {product.stock === 0 ? 'Agotado' : 'Agregar'}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Catalog
