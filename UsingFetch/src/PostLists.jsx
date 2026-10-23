import { useState, useEffect } from "react"

export default function PostLists() {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    async function cargar() {
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`)
        if (res.ok) { throw new Error('Este es el error que debo mostrar en pantalla') }

        const data = await res.json()
        console.log(data)
        setPosts(data)

      } catch (error) {
        console.log(error.message)
      }


    }
    cargar()

  }, [page])

  return (
    <ul>{posts?.map(element => <li key= {element.id}>{element.title}</li>)}</ul>
  )
}

