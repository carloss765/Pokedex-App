import { Pokemon, useFetchDetails, useFetchPokemons } from "@/src/FetchData";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";

// Componente para mostrar un pokémon con sus detalles completos
function PokemonItem({ pokemon }: { pokemon: Pokemon }) {
  const { details, loading } = useFetchDetails(pokemon.url)

  return (
    <View style={styles.pokemonItem}>
      <Text style={styles.pokemonName}>{pokemon.name}</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : details ? (
        <>
          <Image source={{ uri: details.sprites.front_default }} style={styles.sprite} />
          <View style={styles.detailsContainer}>
            <Text style={styles.detailText}>ID: #{details.id}</Text>
            <Text style={styles.detailText}>Altura: {details.height / 10}m</Text>
            <Text style={styles.detailText}>Peso: {details.weight / 10}kg</Text>
            <View style={styles.typesContainer}>
              <Text style={styles.detailText}>Tipos: </Text>
              {details.types.map((type) => (
                <Text key={type.slot} style={styles.typeTag}>
                  {type.type.name}
                </Text>
              ))}
            </View>
          </View>
        </>
      ) : (
        <Text>No data available</Text>
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
    backgroundColor: '#fff',
  },
  pokemonItem: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pokemonName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'capitalize',
    color: '#2c3e50',
  },
  sprite: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  detailsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    marginVertical: 4,
    color: '#34495e',
  },
  typesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  typeTag: {
    backgroundColor: '#3498db',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
