import React, {useState, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

import api from '../../services/api';

import styles from './styles';

export default function Favorites() {
  const navigation = useNavigation();
  const route = useRoute();

  const userName = route.params.user;
  const [user, setUser] = useState([]);

  useEffect(() => {
    async function carregar() {
      try {
        const {data: result} = await api.get(`users/${userName.login}/repos`);
        setUser(result);
      } catch (error) {
        // eslint-disable-next-line no-alert
        alert('[ERRO] - Tente novamente');
      }
    }
    carregar();
  }, [userName.login]);

  async function setStore(dev) {
    try {
      // await AsyncStorage.setItem('@MySuperStore:key', dev.html_url);
      await AsyncStorage.setItem(dev.name, dev.html_url);
    } catch (error) {
      console.log(error);
    }
    try {
      const value = await AsyncStorage.getItem('@MySuperStore:key');
      if (value !== null) {
        console.log(value);
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  return (
    <View style={styles.dados}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Repositórios.</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.repos}>
        {user.map(dev => (
          <View key={dev.id} style={styles.viewMap}>
            <Text
              style={styles.headerText}
              onPress={() =>
                navigation.navigate('detailRepo', {dev, userName})
              }>
              {dev.name}
            </Text>
            <TouchableOpacity>
              <Icon
                name="star"
                size={18}
                color="#000"
                onPress={() => setStore(dev)}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.action}
        onPress={() => navigation.navigate('Home')}>
        <Icon name="home" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
