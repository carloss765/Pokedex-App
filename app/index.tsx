import { Pokemon, useFetchPokemons, useFetchSprite } from "@/src/FetchData";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";

function PokemonItem({ pokemon }: { pokemon: Pokemon }) {
  const { sprite, loading } = useFetchSprite(pokemon.url)

  return (
    <View style={styles.pokemonItem}>
      <Text style={styles.pokemonName}>{pokemon.name}</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : sprite ? (
        <Image source={{ uri: sprite }} style={styles.sprite} />
      ) : (
        <Text>No image available</Text>
      )}
    </View>
  )
}

export default function Index() {
  const pokemons = useFetchPokemons()

  return (
    <ScrollView style={styles.container}>
      {pokemons.map((pokemon) => (
        <PokemonItem key={pokemon.name} pokemon={pokemon} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  pokemonItem: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  sprite: {
    width: 100,
    height: 100,
  },
});
