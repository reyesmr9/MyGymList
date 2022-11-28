import * as eva from "@eva-design/eva";
import 'react-native-gesture-handler';
import React, {useState, useEffect, useRef} from 'react';
import Constants from 'expo-constants';

import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, View, BackHandler, Image, TouchableOpacity, Dimensions, Alert, Platform, ScrollView} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Imagenes } from '../components/Images';
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
import {List, ListItem, Divider, Icon, Input, Text, Button} from '@ui-kitten/components';
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

    const [datosIm, setDatosIm] = useState([
      { id: '23', image: Imagenes.veintitres },
      { id: '24', image: Imagenes.veinticuatro },
      { id: '25', image: Imagenes.veinticinco },
      { id: '26', image: Imagenes.veintiseis },
      { id: '27', image: Imagenes.veintisiete },
      { id: '30', image: Imagenes.treinta },
      { id: '33', image: Imagenes.treintaytres },   //datosIm[6]
      { id: '34', image: Imagenes.treintaycuatro },
      { id: '35', image: Imagenes.treintaycinco },
      { id: '36', image: Imagenes.treintayseis },
      { id: '38', image: Imagenes.treintayocho },
      { id: '43', image: Imagenes.cuarentaytres },
      { id: '44', image: Imagenes.cuarentaycuatro },
      { id: '45', image: Imagenes.cuarentaycinco },
      { id: '28', image: Imagenes.veintiocho },
      { id: '31', image: Imagenes.treintayuno },
      { id: '32', image: Imagenes.treintaydos },    //datosIm[16]
      { id: '37', image: Imagenes.treintaysiete },
      { id: '29', image: Imagenes.veintinueve },   
      { id: '32', image: Imagenes.treintaydos },
      { id: '46', image: Imagenes.cuarentayseis },  //datosIm[20]
      { id: '47', image: Imagenes.cuarentaysiete },
      { id: '48', image: Imagenes.cuarentayocho },
      { id: '49', image: Imagenes.cuarentaynueve },
      { id: '50', image: Imagenes.cincuenta },
    ]);

    const nombreRef = React.useRef();
    const emailRef = React.useRef();

    const nombreIcon = (props) => (
      <Icon {...props}
        ref={nombreRef}
        name='person-outline'
      />
    );

    const emailIcon = (props) => (
      <Icon {...props}
        ref={emailRef}
        name='email-outline'
      />
    );


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
          navigation.navigate("Modo");
        });

        console.log('Los datos que tenemos son: ', datos)

    }

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <View>
            <Text style={styles.title} category="h1">
              Login
            </Text>
        </View>
        <View style={styles.iconoAppView}>
          <Image
            source={datosIm[24].image}
            style={styles.imagenApp}
          />
        </View>
        <View>
            <Input
                label="Nombre"
                placeholder="NOMBRE"
                value={nombre}
                onChangeText={nombreSiguiente => setNombre(nombreSiguiente)}
                style={styles.inputEmail}
                accessoryLeft={nombreIcon}
                multiline={false}
                selectionColor='#000'
            />
            <Input
                label="Email"
                placeholder="CORREO ELECTRÓNICO"
                value={email}
                onChangeText={email => setEmail(email)}
                style={styles.inputNombre}
                accessoryLeft={emailIcon}
                multiline={false}
                selectionColor='#000'
            />  
            <Button
                title="Guardar datos"
                style={styles.botonLogin}
                onPress={guardarDatos}>
                  <Text>Iniciar Sesión</Text>
            </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: "white",
    width: Dimensions.get("window").width
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
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 26,
    bottom: 130,
    color: 'black',
  },
  inputNombre: {
    textAlignVertical: 'top',
    borderColor: "#4630eb",
    borderRadius: 4,
    borderWidth: 1,
    height: 60,
    padding: 10,
    margin: 3,
    fontSize: 16,
    width: width - 40,
    marginBottom: 10,
    bottom: 40,
  },
  inputEmail: {
    textAlignVertical: 'top',
    borderColor: "#4630eb",
    borderRadius: 4,
    borderWidth: 1,
    height: 60,
    padding: 10,
    margin: 3,
    fontSize: 16,
    width: width - 40,
    marginBottom: 10,
    bottom: 40,
  },
  imagenApp: {
    height: 150,
    width: 150,
  },
  botonLogin: {
    backgroundColor: '#48BEEA',
    borderWidth: 1,
    borderColor: '#48BEEA',
    borderRadius: 100,
    alignItems: 'center', 
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    width: width - 60,
    bottom: 10,
    marginTop: 20,
  },
  iconoAppView: {
    marginTop: 5,
    width: 150,
    height: 150,
    bottom: 110,
    alignItems: 'center',
    justifyContent: 'center',
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
