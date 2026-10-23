import { useRef, useEffect, useState } from "react";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previousSearch, setPreviousSearch] = useState("");

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const controllerRef = useRef(null);
  const lastTermRef = useRef("");       
  const renderCountRef = useRef(0);
  const renderBadgeRef = useRef(null);   

 
  useEffect(() => {
    renderCountRef.current += 1;
    if (renderBadgeRef.current) {
      renderBadgeRef.current.textContent = renderCountRef.current;
    }
  });

  
  useEffect(() => {
    inputRef.current.focus();
  }, []);


  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName;
      const typing =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" ||
        e.target.isContentEditable;
      if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        inputRef.current.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      controllerRef.current?.abort();
    };
  }, []);

  
  const buscar = async (term) => {
    controllerRef.current?.abort();

    if (!term.trim()) {
      setResults([]);
      setTotal(0);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://api.github.com/search/users?q=${encodeURIComponent(term)}&per_page=10`,
        { signal: controller.signal }
      );

      if (!res.ok) {
        throw new Error(
          res.status === 403 || res.status === 429
            ? "Límite de peticiones alcanzado. Espera un minuto."
            : `Error ${res.status}`
        );
      }

      const data = await res.json();
      setResults(data.items);
      setTotal(data.total_count);
      setPreviousSearch(lastTermRef.current); 
      lastTermRef.current = term;
    } catch (err) {
      if (err.name === "AbortError") return; 
      setError(err.message);
      setResults([]);
      setTotal(0);
    } finally {
      
      if (controllerRef.current === controller) setLoading(false);
    }
  };

 
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => buscar(value), 400);
  };

  
  const handleClear = () => {
    clearTimeout(timerRef.current);
    controllerRef.current?.abort();
    setQuery("");
    setResults([]);
    setTotal(0);
    setError("");
    setLoading(false);
    inputRef.current.focus();
  };

  return (
    <main className="page-shell">
      <section className="search-card" aria-labelledby="page-title">
        <header className="page-heading">
          <p className="eyebrow">Explora la comunidad</p>
          <h1 id="page-title">Encuentra tu próximo perfil</h1>
          <p className="page-description">
            Busca entre millones de usuarios de GitHub y descubre nuevos perfiles.
          </p>
        </header>

        <div className="search-form">
          <div className="search-input-wrap">
            <input
              ref={inputRef}
              className="search-input"
              value={query}
              onChange={handleChange}
              placeholder="Busca usuarios..."
              aria-label="Buscar usuarios de GitHub"
            />
          </div>
          <button className="clear-button" type="button" onClick={handleClear}>
            Limpiar
          </button>
        </div>
        <p className="search-hint">
          Pulsa <kbd>/</kbd> para enfocar la búsqueda
        </p>

        <div className="search-meta">
          <span className="render-count">
            Renderizados: <span ref={renderBadgeRef}>0</span>
          </span>
          {previousSearch && (
            <span className="previous-search">Búsqueda anterior: {previousSearch}</span>
          )}
        </div>

        {error && <p className="status-message status-error" role="alert">{error}</p>}
        {loading && <p className="status-message" role="status">Buscando usuarios...</p>}

        {!loading && !error && query.trim() && results.length === 0 && (
          <p className="status-message">No se encontraron usuarios para esta búsqueda.</p>
        )}

        {results.length > 0 && (
          <section aria-label="Resultados de búsqueda">
            <p className="results-summary">{total.toLocaleString("es-ES")} resultados encontrados</p>
            <ul className="results-list">
              {results.map((user) => (
                <li className="result-item" key={user.id}>
                  <a className="result-link" href={user.html_url} target="_blank" rel="noreferrer">
                    <img className="result-avatar" src={user.avatar_url} alt="" />
                    <span className="result-name">{user.login}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>
    </main>
  );
}