import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import WeatherIcon from '../components/WeatherIcon';
import SunInfo from '../components/SunInfo';

function WeatherDetails({ wind, humidity, rain }) {
  return (
    <View style={styles.detailsContainer}>
      <View style={styles.detailBlock}>
        <Text style={styles.detailValue}>{humidity}%</Text>
        <Text style={styles.detailLabel}>Umidade</Text>
      </View>

      <View style={styles.detailBlock}>
        <Text style={styles.detailValue}>{rain}%</Text>
        <Text style={styles.detailLabel}>Chuva</Text>
      </View>

      <View style={styles.detailBlock}>
        <Text style={styles.detailValue}>{wind}</Text>
        <Text style={styles.detailLabel}>Vento</Text>
      </View>
    </View>
  );
}

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [location, setLocation] = useState('Recife,PE');
  const [inputValue, setInputValue] = useState(location);
  const [error, setError] = useState(false);

  // 🔥 IMPORTANTE: ajuste aqui se usar celular
  const BASE_URL =
    Platform.OS === 'web'
      ? 'http://localhost:3000'
      : 'http://192.168.1.7:3000'; // ⚠️ troque pelo seu IP

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchWeatherByCity(location);
  }, [location]);

  const fetchWeatherByCity = async (city) => {
    try {
      setError(false);

      console.log('Buscando cidade:', city);

      const response = await axios.get(
        `${BASE_URL}/weather?city=${city}`
      );

      console.log('BACKEND RESPONSE:', response.data);

      if (response.data) {
        setWeather(response.data);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Erro no backend:', error.message);
      setError(true);
    }
  };

  const onSearch = () => {
    if (!inputValue.trim()) return;
    Keyboard.dismiss();
    setLocation(inputValue);
  };

  const isNight = currentHour < 6 || currentHour >= 18;

  const getBackgroundGradient = () =>
    isNight
      ? ['#0f2027', '#203a43', '#2c5364']
      : ['#4facfe', '#00f2fe'];

  const topIcon = isNight
    ? require('../../assets/icons/moon.png')
    : require('../../assets/icons/sun.png');

  // 🔴 ERRO
  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Erro ao carregar dados</Text>
        <Text style={{ color: '#fff' }}>
          Verifique backend ou conexão
        </Text>
      </View>
    );
  }

  // ⏳ LOADING
  if (!weather) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={getBackgroundGradient()} style={styles.container}>
      {/* BUSCA */}
      <View style={styles.searchContainer}>
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Digite a cidade, ex: Recife,PE"
          placeholderTextColor="#ccc"
          style={styles.searchInput}
          onSubmitEditing={onSearch}
        />

        <TouchableOpacity onPress={onSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* ÍCONE TOPO */}
      <View style={styles.topIconContainer}>
        <Image source={topIcon} style={{ width: 100, height: 100 }} />
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.city}>{weather.city}</Text>
        <Text style={styles.temp}>{weather.temp}°C</Text>
        <Text style={styles.desc}>{weather.description}</Text>

        <SunInfo sunrise={weather.sunrise} sunset={weather.sunset} />

        <WeatherDetails
          wind={weather.wind_speedy}
          humidity={weather.humidity}
          rain={weather.rain ?? 0}
        />

        {/* FORECAST */}
        <View style={styles.forecastContainer}>
          <Text style={styles.forecastTitle}>Próximos dias</Text>

          <FlatList
            data={weather.forecast || []}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.forecastCard}>
                <View>
                  <Text style={styles.forecastWeekday}>{item.weekday}</Text>
                  <Text style={styles.forecastDate}>{item.date}</Text>
                </View>

                <WeatherIcon
                  description={item.description}
                  currently={isNight ? 'noite' : 'dia'}
                  size={40}
                />

                <Text style={styles.forecastTemp}>
                  {item.max}° / {item.min}°
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4facfe',
  },

  loadingText: { color: '#fff', fontSize: 18 },

  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 40,
    marginBottom: 10,
    alignItems: 'center',
  },

  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 15,
    color: '#fff',
  },

  searchButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },

  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  topIconContainer: {
    marginTop: 20,
    alignItems: 'center',
  },

  card: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
  },

  city: { fontSize: 28, color: '#fff' },
  temp: { fontSize: 60, fontWeight: 'bold', color: '#fff' },
  desc: { fontSize: 18, color: '#fff', marginBottom: 10 },

  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },

  detailBlock: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    width: 90,
  },

  detailValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  detailLabel: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 5,
  },

  forecastContainer: {
    marginTop: 20,
    width: '100%',
  },

  forecastTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },

  forecastCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 15,
    marginBottom: 10,
    borderRadius: 15,
  },

  forecastWeekday: {
    color: '#fff',
    fontWeight: 'bold',
  },

  forecastDate: {
    color: '#ccc',
    fontSize: 12,
  },

  forecastTemp: {
    color: '#fff',
    fontSize: 16,
  },
});