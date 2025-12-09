import { useEffect, useState } from "react";

export interface Pokemon {
  name: string;
  url: string;
}

interface PokemonsResponse {
  results: Pokemon[];
}

interface PokemonDetail {
  sprites: {
    front_default: string;
  };
}
export const fetchPokemons = async (): Promise<Pokemon[]> => {
  try {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
    const data: PokemonsResponse = await res.json()
    console.log(data)
    return data.results
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const useFetchPokemons = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  useEffect(() => {
    fetchPokemons().then(data => {
      setPokemons(data)
    })
  }, [])
  return pokemons
}

export const useFetchSprite = (url: string) => {
  const [sprite, setSprite] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchSprite = async () => {
      try {
        setLoading(true)
        const res = await fetch(url)
        const data: PokemonDetail = await res.json()
        setSprite(data.sprites.front_default)
      } catch (error) {
        console.error('Error fetching sprite:', error)
        setSprite(null)
      } finally {
        setLoading(false)
      }
    }

    if (url) {
      fetchSprite()
    }
  }, [url])

  return { sprite, loading }
}
