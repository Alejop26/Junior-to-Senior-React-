import { useState, useEffect } from "react"

export default function PostLists() {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const controller = new AbortController()
    async function cargar() {
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`, {signal: controller.signal})
        if (!res.ok) throw new Error(`Error ${res.status}`);

        const data = await res.json()
        setPosts(data)

      } catch (error) {
        if (error.name == 'AbortError') return
        setError(error.message)      
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }


    } 
    cargar()

    return () => controller.abort()

  }, [page])

  return (
    <ul>{posts?.map(element => <li key= {element.id}>{element.title}</li>)}</ul>
  )
}

