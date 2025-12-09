import { Pokemon, useFetchDetails, useFetchPokemons } from "@/src/FetchData";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";

// Mapeo de colores por tipo de pokémon
const TYPE_COLORS: Record<string, string> = {
  normal:   '#CFCFB5',
  fire:     '#F6A56D',
  water:    '#93B4F6',
  electric: '#FAE67D',
  grass:    '#9FDE87',
  ice:      '#C4F0F0',
  fighting: '#D96B65',
  poison:   '#C47AC4',
  ground:   '#E8D7A1',
  flying:   '#CFC3F8',
  psychic:  '#FBA9C6',
  bug:      '#C8D25E',
  rock:     '#D2C68A',
  ghost:    '#9E8AC3',
  dragon:   '#A08AFA',
  dark:     '#9B8B76',
  steel:    '#D6D6E8',
  fairy:    '#F7C1D0',
};

// Componente para mostrar un pokémon con sus detalles completos
function PokemonItem({ pokemon }: { pokemon: Pokemon }) {
  const { details, loading } = useFetchDetails(pokemon.url)

  // Obtener el color basado en el primer tipo del pokémon
  const backgroundColor = details?.types[0]?.type.name
    ? TYPE_COLORS[details.types[0].type.name] || '#f5f5f5'
    : '#f5f5f5'

  return (
    <View style={[styles.pokemonItem, { backgroundColor }]}>
      <Text style={styles.pokemonName}>{pokemon.name}</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" />
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
                <Text
                  key={type.slot}
                  style={[
                    styles.typeTag,
                    { backgroundColor: TYPE_COLORS[type.type.name] || '#3498db' }
                  ]}
                >
                  {type.type.name}
                </Text>
              ))}
            </View>
          </View>
        </>
      ) : (
        <Text style={styles.noDataText}>No data available</Text>
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
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  pokemonName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'capitalize',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
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
    color: '#ffffff',
    fontWeight: '500',
  },
  noDataText: {
    color: '#ffffff',
    fontSize: 16,
  },
  typesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  typeTag: {
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});
