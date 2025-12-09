import { Pokemon, useFetchDetails } from "@/src/FetchData";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Modal as RNModal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get('window');

// Mapeo de colores por tipo
const TYPE_COLORS: Record<string, string> = {
    normal: '#CFCFB5',
    fire: '#F6A56D',
    water: '#93B4F6',
    electric: '#FAE67D',
    grass: '#9FDE87',
    ice: '#C4F0F0',
    fighting: '#D96B65',
    poison: '#C47AC4',
    ground: '#E8D7A1',
    flying: '#CFC3F8',
    psychic: '#FBA9C6',
    bug: '#C8D25E',
    rock: '#D2C68A',
    ghost: '#9E8AC3',
    dragon: '#A08AFA',
    dark: '#9B8B76',
    steel: '#D6D6E8',
    fairy: '#F7C1D0',
};

// Mapeo de nombres de stats a español
const STAT_NAMES: Record<string, string> = {
    hp: 'PS',
    attack: 'Ataque',
    defense: 'Defensa',
    'special-attack': 'At. Esp.',
    'special-defense': 'Def. Esp.',
    speed: 'Velocidad',
};

interface ModalProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    pokemon: Pokemon;
}

export default function Modal({ showModal, setShowModal, pokemon }: ModalProps) {
    const { details, loading } = useFetchDetails(pokemon.url);
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const shadowAnim = useRef(new Animated.Value(0)).current;
    const [currentSprite, setCurrentSprite] = useState<'front' | 'back'>('front');

    // Animación de rotación continua
    useEffect(() => {
        const rotateAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        );

        const shadowAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(shadowAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: false,
                }),
                Animated.timing(shadowAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: false,
                }),
            ])
        );

        rotateAnimation.start();
        shadowAnimation.start();

        // Cambiar sprite cada 2 segundos
        const spriteInterval = setInterval(() => {
            setCurrentSprite((prev) => (prev === 'front' ? 'back' : 'front'));
        }, 2000);

        return () => {
            rotateAnimation.stop();
            shadowAnimation.stop();
            clearInterval(spriteInterval);
        };
    }, [rotateAnim, shadowAnim]);

    const backgroundColor = details?.types[0]?.type.name
        ? TYPE_COLORS[details.types[0].type.name] || '#f5f5f5'
        : '#f5f5f5';

    // Interpolación para la rotación
    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '15deg'],
    });

    // Interpolación para la posición de la sombra
    const shadowX = shadowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 10],
    });

    const shadowY = shadowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-5, 5],
    });

    return (
        <RNModal
            visible={showModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContainer, { backgroundColor }]}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setShowModal(false)}
                    >
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#ffffff" />
                        </View>
                    ) : details ? (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Header con nombre e ID */}
                            <View style={styles.header}>
                                <Text style={styles.pokemonName}>{details.name}</Text>
                                <Text style={styles.pokemonId}>#{details.id.toString().padStart(3, '0')}</Text>
                            </View>

                            {/* Tipos */}
                            <View style={styles.typesRow}>
                                {details.types.map((type) => (
                                    <View
                                        key={type.slot}
                                        style={[
                                            styles.typeChip,
                                            { backgroundColor: TYPE_COLORS[type.type.name] || '#3498db' },
                                        ]}
                                    >
                                        <Text style={styles.typeText}>{type.type.name}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Sprite animado con sombra */}
                            <View style={styles.spriteContainer}>
                                <Animated.View
                                    style={[
                                        styles.shadow,
                                        {
                                            transform: [
                                                { translateX: shadowX },
                                                { translateY: shadowY },
                                            ],
                                        },
                                    ]}
                                />
                                <Animated.Image
                                    source={{
                                        uri:
                                            currentSprite === 'front'
                                                ? details.sprites.front_default
                                                : details.sprites.back_default,
                                    }}
                                    style={[
                                        styles.sprite,
                                        {
                                            transform: [{ rotate: rotateInterpolate }],
                                        },
                                    ]}
                                />
                            </View>

                            {/* Información básica */}
                            <View style={styles.infoGrid}>
                                <View style={styles.infoCard}>
                                    <Text style={styles.infoLabel}>Peso</Text>
                                    <Text style={styles.infoValue}>{details.weight / 10} kg</Text>
                                </View>
                                <View style={styles.infoCard}>
                                    <Text style={styles.infoLabel}>Altura</Text>
                                    <Text style={styles.infoValue}>{details.height / 10} m</Text>
                                </View>
                                <View style={styles.infoCard}>
                                    <Text style={styles.infoLabel}>Exp. Base</Text>
                                    <Text style={styles.infoValue}>{details.base_experience}</Text>
                                </View>
                            </View>

                            {/* Estadísticas */}
                            <View style={styles.statsSection}>
                                <Text style={styles.sectionTitle}>Estadísticas Base</Text>
                                {details.stats.map((stat) => {
                                    const percentage = (stat.base_stat / 255) * 100;
                                    return (
                                        <View key={stat.stat.name} style={styles.statRow}>
                                            <Text style={styles.statName}>
                                                {STAT_NAMES[stat.stat.name] || stat.stat.name}
                                            </Text>
                                            <Text style={styles.statValue}>{stat.base_stat}</Text>
                                            <View style={styles.statBarContainer}>
                                                <View
                                                    style={[
                                                        styles.statBar,
                                                        {
                                                            width: `${percentage}%`,
                                                            backgroundColor:
                                                                percentage > 80 ? '#4CAF50' : percentage > 50 ? '#FFC107' : '#FF5252',
                                                        },
                                                    ]}
                                                />
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>

                            {/* Habilidades */}
                            <View style={styles.abilitiesSection}>
                                <Text style={styles.sectionTitle}>Habilidades</Text>
                                {details.abilities.map((ability) => (
                                    <View key={ability.slot} style={styles.abilityChip}>
                                        <Text style={styles.abilityText}>
                                            {ability.ability.name.replace('-', ' ')}
                                            {ability.is_hidden && ' (Oculta)'}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    ) : (
                        <Text style={styles.errorText}>No se pudieron cargar los datos</Text>
                    )}
                </View>
            </View>
        </RNModal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.9,
        maxHeight: height * 0.85,
        borderRadius: 20,
        padding: 20,
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    loadingContainer: {
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 10,
    },
    pokemonName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'capitalize',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    pokemonId: {
        fontSize: 20,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '600',
    },
    typesRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
    },
    typeChip: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    typeText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    spriteContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        marginBottom: 20,
        position: 'relative',
    },
    sprite: {
        width: 180,
        height: 180,
    },
    shadow: {
        position: 'absolute',
        width: 120,
        height: 30,
        borderRadius: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        bottom: 10,
    },
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 25,
    },
    infoCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        minWidth: 100,
    },
    infoLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        marginBottom: 5,
    },
    infoValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    statsSection: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        padding: 15,
        borderRadius: 15,
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    statName: {
        color: '#fff',
        fontSize: 14,
        width: 80,
        fontWeight: '600',
    },
    statValue: {
        color: '#fff',
        fontSize: 14,
        width: 40,
        fontWeight: 'bold',
    },
    statBarContainer: {
        flex: 1,
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    statBar: {
        height: '100%',
        borderRadius: 4,
    },
    abilitiesSection: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        padding: 15,
        borderRadius: 15,
        marginBottom: 20,
    },
    abilityChip: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    abilityText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    errorText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
    },
});
