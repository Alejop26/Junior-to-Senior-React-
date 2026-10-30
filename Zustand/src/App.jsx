import Catalog from './Features/Catalog/Catalog'
import Cart from './Features/Cart/cart'

function App() {
  return (
    <main className="app">
      <header className="app__header">
        <p className="app__brand">Tienda online</p>
        <h1>Encuentra tu próximo favorito</h1>
      </header>
      <div className="storefront">
        <Catalog />
        <Cart />
      </div>
    </main>
  )
}

export default App
