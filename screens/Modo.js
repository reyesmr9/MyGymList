import 'react-native-gesture-handler';
import React, {useState} from 'react';
import { StyleSheet, View, BackHandler, TouchableOpacity, Dimensions, Alert} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Text} from '@ui-kitten/components';

const {width} = Dimensions.get('window');

export default function Modo () {

  const navigation = useNavigation();

  let isMounted = true;
       
  const backAction = () => {
    if(!navigation.canGoBack()){
      Alert.alert('', '¿Seguro que quieres salir de la app?', [
        {
          text: 'Cancelar',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'Sí', onPress: () => {BackHandler.exitApp()}},
      ]);
    }
    else {
      isMounted = false;
      Alert.alert('', '¿Seguro que quieres salir de la app?', [
        {
          text: 'Cancelar',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'Sí', onPress: () => {BackHandler.exitApp()}},
      ]);
    }
    return true;
  };
    
  useFocusEffect(
    React.useCallback(() => {
      isMounted = true;

      if(isMounted){
        BackHandler.addEventListener('hardwareBackPress', backAction);
      }
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => {
        backHandler.remove();
      };
        
  }, []));

  

  const guardarEntrenamiento = async() => {
    var listaDatos = {};
    listaDatos.tipo = "Entrenamiento";

    var jsonDatos = JSON.stringify(listaDatos);
    // Guardamos el modo Entrenamiento en la base de datos
    await AsyncStorage.setItem("MODO", JSON.stringify(jsonDatos));

    // Si se ha guardado el modo Entrenamiento, navegamos a la pantalla AllLists
    AsyncStorage.getItem("MODO").then((datosModo) => {
      navigation.navigate("AllLists");
    });
  }

  const guardarConfiguracion = async() => {
    var listaDatos = {};
    listaDatos.tipo = "Configuracion";

    var jsonDatos = JSON.stringify(listaDatos);
    // Guardamos el modo Configuración en la base de datos
    await AsyncStorage.setItem("MODO", JSON.stringify(jsonDatos));

    // Si se ha guardado el modo Configuración, navegamos a la pantalla AllLists
    AsyncStorage.getItem("MODO").then((datosModo) => {
      navigation.navigate("AllLists");
    });
  }

  return (
    <View style={styles.container}>
      <View>
          <TouchableOpacity
              title="Entrenamiento"
              style={styles.botonEntrenamiento}
              onPress={guardarEntrenamiento}>
                <Text style={styles.buttonText}>Entrenamiento</Text>
          </TouchableOpacity>
          <TouchableOpacity
              title="Configuracion"
              style={styles.botonConfiguracion}
              onPress={guardarConfiguracion}>
                <Text style={styles.buttonText}>Configuración</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
  },
  botonEntrenamiento: {
    backgroundColor: '#63c0eb',
    borderColor: "#5bb1d9",
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
    borderRadius: 15,
    height: 70,
    width: 170,
  },
  botonConfiguracion: {
    backgroundColor: '#ebae63',
    borderColor: "#d69e5a",
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginTop: 80,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
    borderRadius: 15,
    height: 70,
    width: 170,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});
