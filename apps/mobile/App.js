import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const CATEGORIES = [
  { id: '1', name: 'Mecânica', icon: '🔧' },
  { id: '2', name: 'Elétrica', icon: '⚡' },
  { id: '3', name: 'Saúde', icon: '🏥' },
  { id: '4', name: 'Beleza', icon: '💇' },
  { id: '5', name: 'Limpeza', icon: '🧹' },
  { id: '6', name: 'Transporte', icon: '🚚' }
];

const SERVICES = [
  { id: 's1', name: 'Oficina João', category: 'Mecânica', rating: 4.8, distance: '2.3 km' },
  { id: 's2', name: 'Eletricista Silva', category: 'Elétrica', rating: 4.5, distance: '1.2 km' },
  { id: 's3', name: 'Clínica Boa Vida', category: 'Saúde', rating: 4.6, distance: '3.5 km' }
];

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>AchAqui</Text>
          <Text style={styles.subtitle}>Encontre serviços locais em Angola</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((item) => (
              <TouchableOpacity key={item.id} style={styles.categoryCard}>
                <Text style={styles.categoryIcon}>{item.icon}</Text>
                <Text style={styles.categoryName}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicos proximos</Text>
          <FlatList
            data={SERVICES}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.serviceCard}
                onPress={() => navigation.navigate('Detalhe', { service: item })}
              >
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.serviceCategory}>{item.category}</Text>
                <View style={styles.serviceMeta}>
                  <Text style={styles.serviceRating}>⭐ {item.rating}</Text>
                  <Text style={styles.serviceDistance}>{item.distance}</Text>
                </View>
                <View style={styles.ctaButton}>
                  <Text style={styles.ctaText}>Contactar via WhatsApp</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailScreen({ route }) {
  const { service } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailHeader}>
        <Text style={styles.detailTitle}>{service?.name}</Text>
        <Text style={styles.detailCategory}>{service?.category}</Text>
      </View>
      <View style={styles.detailBody}>
        <Text style={styles.detailText}>Avaliacao: ⭐ {service?.rating}</Text>
        <Text style={styles.detailText}>Distancia: {service?.distance}</Text>
        <Text style={styles.detailDescription}>
          Profissional de referencia na zona, com disponibilidade imediata.
        </Text>
      </View>
      <TouchableOpacity style={styles.ctaButtonLarge}>
        <Text style={styles.ctaText}>Contactar via WhatsApp</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#FF6B35' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '700' }
        }}
      >
        <Stack.Screen name="Inicio" component={HomeScreen} />
        <Stack.Screen name="Detalhe" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  content: {
    paddingBottom: 24
  },
  header: {
    padding: 20,
    backgroundColor: '#FF6B35'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff'
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.85
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 18
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  categoryCard: {
    width: '31%',
    backgroundColor: '#f4f4f4',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12
  },
  categoryIcon: {
    fontSize: 26,
    marginBottom: 6
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600'
  },
  serviceCard: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#eeeeee',
    marginBottom: 12
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '700'
  },
  serviceCategory: {
    color: '#666666',
    marginTop: 4
  },
  serviceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  serviceRating: {
    fontWeight: '600'
  },
  serviceDistance: {
    color: '#FF6B35',
    fontWeight: '600'
  },
  ctaButton: {
    marginTop: 12,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center'
  },
  ctaText: {
    color: '#ffffff',
    fontWeight: '700'
  },
  detailHeader: {
    padding: 20,
    backgroundColor: '#FF6B35'
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff'
  },
  detailCategory: {
    marginTop: 4,
    color: '#ffffff',
    opacity: 0.9
  },
  detailBody: {
    padding: 20
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8
  },
  detailDescription: {
    marginTop: 8,
    fontSize: 14,
    color: '#666666'
  },
  ctaButtonLarge: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center'
  }
});
