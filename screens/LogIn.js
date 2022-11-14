import * as eva from "@eva-design/eva";
import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import Constants from 'expo-constants';

import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, View, BackHandler, Image, TouchableOpacity, Dimensions, Alert, Platform, ScrollView} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import * as MailComposer from 'expo-mail-composer';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Linking from 'expo-linking';
import * as DocumentPicker from 'expo-document-picker';
import YoutubePlayer from 'react-native-youtube-iframe';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createStackNavigator} from '@react-navigation/stack';
import {List, ListItem, Divider, Text, Button} from '@ui-kitten/components';
import * as FileSystem from 'expo-file-system';
import NativeModules from "react-native";
import {startActivityAsync, ActivityAction} from 'expo-intent-launcher';
import launch from 'react-native-mail-launcher';
import launchMailApp from 'react-native-mail-launcher';
import { SafeAreaView, FlatList } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { StackRouter } from 'react-navigation';
import { MenuProvider } from 'react-native-popup-menu';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuContext,
} from 'react-native-popup-menu';

import {ApplicationProvider, BottomNavigation, BottomNavigationTab} from '@ui-kitten/components';

const { width } = Dimensions.get('window');


export default function LogIn () {

    const navigation = useNavigation();
    const [datos, setDatos] = useState([]);  //guardamos los datos del usuario en un array con nombre: datos[0] y email: datos[1]
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");


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
        //navigation.navigate('LogIn');
      }
      return true;
    };

    useEffect(() => {
      isMounted = true;

      if(isMounted){
        BackHandler.addEventListener('hardwareBackPress', backAction);
      }
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => {
        backHandler.remove();
      };
        
      }, []);


    const guardarDatos = async() => {
        /*
        var f = [''];
        f.length=0;
        console.log('Al vaciar array datos el resultado es: ', f)  
        setDatos(f);

        await AsyncStorage.setItem("DATOS", JSON.stringify(f));
        */

        var listaDatos = {};
        listaDatos.nombre = nombre;
        listaDatos.email = email;
        var jsonDatos = JSON.stringify(listaDatos);

        await AsyncStorage.setItem("DATOS", JSON.stringify(jsonDatos));

        AsyncStorage.getItem("DATOS").then((datos) => {
          setDatos(JSON.parse(datos));    //guardamos cada lista en formato string en listas
          navigation.navigate("Usuario");
        });

        console.log('Los datos que tenemos son: ', datos)

    }

  return (
    <View style={styles.container}>
      <View>
          <Text style={styles.title}>
            Login
          </Text>
      </View>
      <View>
          <TextInput
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
              style={styles.input}
              multiline={false}
              selectionColor='#fff'
          />
          <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              multiline={false}
              selectionColor='#fff'
          />  
          <Button
              title="Guardar datos"
              style={styles.button}
              onPress={guardarDatos}>
                <Text>Login</Text>
          </Button>
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
  button: {
    backgroundColor: '#1B4B95',
    padding: 8,
    marginTop: 0,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 2,
    borderRadius: 5,
  },
  bottom: {
    backgroundColor: '#FAFAFF',
    height: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    marginTop: 30,
    left: 10,
    padding: 10,
  },
  input: {
    textAlignVertical: 'top',
    borderColor: "#4630eb",
    borderRadius: 4,
    borderWidth: 1,
    height: 40,
    padding: 10,
    margin: 3,
    fontSize: 16,
    width: width - 20,
  },
  bottomtext: {
    color: 'white',
    fontSize: 14,
  },
  imagen: {
    height: 75,
    width: 75,
    borderRadius: 400/2,
  },
  imagen2: {
    height: 35,
    width: 35,
    marginLeft: 10,
    borderRadius: 400/2,
  }
});
