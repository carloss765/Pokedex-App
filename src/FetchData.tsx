import { useEffect, useState } from "react";

export interface Pokemon {
  name: string;
  url: string;
}

interface PokemonsResponse {
  results: Pokemon[];
}

// Interfaces para los detalles del pokémon
export interface Sprites {
  front_default: string;
  back_default: string;
  front_shiny: string;
  back_shiny: string;
  front_female: string | null;
  back_female: string | null;
  front_shiny_female: string | null;
  back_shiny_female: string | null;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: Sprites;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
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

// Hook para obtener todos los detalles de un pokémon
export const useFetchDetails = (url: string) => {
  const [details, setDetails] = useState<PokemonDetail | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true)
        const res = await fetch(url)
        const data: PokemonDetail = await res.json()
        setDetails(data)
      } catch (error) {
        console.error('Error fetching pokemon details:', error)
        setDetails(null)
      } finally {
        setLoading(false)
      }
    }

    if (url) {
      fetchDetails()
    }
  }, [url])

  return { details, loading }
}
