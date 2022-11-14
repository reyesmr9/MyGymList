import * as eva from "@eva-design/eva";
import 'react-native-gesture-handler';
import React, {useState, useEffect, useCallback, useRef} from 'react';
import Constants from 'expo-constants';

import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, Modal, View, BackHandler, Image, TouchableOpacity, Dimensions, 
  Alert, Platform, ScrollView} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import * as MailComposer from 'expo-mail-composer';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Linking from 'expo-linking';
import * as DocumentPicker from 'expo-document-picker';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Video, AVPlaybackStatus } from 'expo-av';
import { NavigationContainer, useNavigation, useFocusEffect } from '@react-navigation/native';
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


export default function Historial ({route}) {

    const navigation = useNavigation();
    const {listHistorial, itemIdHistorial} = route.params;
    let listaHActual = listHistorial;
    const listaInicial = JSON.parse(listHistorial);
    //const [listaActual, setListaActual] = useState('');
    const [modo, setModo] = useState([]);  //guardamos los datos del usuario en un array con nombre: datos[0]
    const [flagModo, setFlagModo] = useState(false);
    const [modalVisibleHistorial, setModalVisibleHistorial] = useState(false);
    const [listActualH, setListActualH] = useState([]);
    //const [listH, setListH] = useState([]);
    const videoLocalReference = useRef(null);
    const [statusVideoR, setStatusVideoR] = useState({});
 
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
        //setListH('');
        let listat = listActualH;
        listat.length = 0;
        setListActualH(listat);
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Lista',
              params: { singleList: listHistorial,
                        itemId: JSON.parse(listHistorial).listaid,
                      },
            },
          ],
        })
        navigation.navigate("Lista", {
          singleList: listHistorial,
          itemId: JSON.parse(listHistorial).listaid,
        });
      }
      return true;
    };
    
    /*
    const getDatos = async() => {

      
      await AsyncStorage.getItem("USUARIO").then((datos) => {
        console.log('El tipo de usuario es: ', datos)
        setUsuario(JSON.parse(datos));
        navigation.navigate("AllLists");
      });
        
    }
    */

    const getLista = async() => {
      /*
      var f = [''];
      f.length=0;
      console.log('Al vaciar array datos el resultado es: ', f)  
      setDatos(f);

      await AsyncStorage.setItem("DATOS", JSON.stringify(f));
      */
    try {
      if((listaInicial.videolista) !== undefined){             
        //setListH(JSON.parse(listHistorial).historial);
        console.log('la lista Historial es: ', listaInicial)
      }
    
    } catch (error){
      console.log(error)
    }

  }

  useFocusEffect(
    React.useCallback(() => {
    isMounted = true;

    if(isMounted){
      getLista();
      BackHandler.addEventListener('hardwareBackPress', backAction);
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
      isMounted = false;
      //setListH('');
    };
      
    }, []));

    const borrarHistorial = async() => {    
      const valorListas = await AsyncStorage.getItem("LISTAS");
      const l = valorListas ? JSON.parse(valorListas) : [];

      let newLists = '';
      let listaAhoraH = JSON.parse(listHistorial);
      listaAhoraH.historial = '';
      if(listActualH !== '') {
        newLists = l.filter((lista) => lista !== listActualH);
      }
      else {
        newLists = l.filter((lista) => lista !== listHistorial);
      }
      //let newLists = l.filter((lista) => lista !== listHistorial);

      newLists.push(JSON.stringify(listaAhoraH));

      await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));

      await AsyncStorage.getItem("LISTAS").then((listas) => {
        console.log('Las lista historial tras borrar el historial es: ', listaAhoraH)
        setListActualH(JSON.stringify(listaAhoraH));
        //setFlagList(!flagList);                           
      });
      
      console.log('Se ha borrado el historial')
    }

  

  const renderItem = ({ item, index }) => {
    try {
      if (item !== undefined || item !== null){
        //let duracion = (JSON.parse(item).titulo).length * 135;
          return (
            <View>        
            <View style={styles.textHistorial2}>     
            <ListItem
              title={() => 
                <Text 
                style={styles.tituloLista}>
                  {"id: " + JSON.parse(item).idHistorial + "\n"}
                  {"fecha: " + JSON.parse(item).fechaRealizado + "\n"}
                  {"tiempo total: " + JSON.parse(item).tiempoTotal + "\n"}
                </Text>}
                onPress={async() => {
                try{
                  setModalVisibleHistorial(true);
                } catch(error){
                  console.log(error)
                }
                }
  
              }
              style={styles.border2}
            />
            </View>
            <Modal 
            visible={modalVisibleHistorial} 
            animationType='fade' 
            transparent={true}>
            <View style={styles.modalStyle3}>
              <FlatList 
                data={(listHistorial !== '') ? JSON.parse(item).tiemposEjercicios : []}
                keyExtractor={( item , index) => index.toString()}
                renderItem={({ item, index }) => (
                <View style={styles.border3}>
                  <View style={styles.textHistorial}>
                    <Text>
                      {"id: " + JSON.parse(item).id + "\n"}
                    </Text>
                  </View>
                  <View style={styles.textHistorial}>
                    <Text>
                      {JSON.parse(item).series + "\n"}
                    </Text>
                  </View>
                  <View style={styles.textHistorial}>
                    <Text>
                      {JSON.parse(item).repeticiones + "\n"}
                    </Text>
                  </View>
                  <View style={styles.textHistorial}>
                    <Text>
                      {"tiempo de realización: " + JSON.parse(item).tiempoRealizacion + "\n"}
                    </Text>
                  </View>
                  <View style={styles.textHistorial}>
                    <Text>
                      {"tiempo de descanso: " + JSON.parse(item).tiempoDescanso + "\n"}
                    </Text>
                  </View> 
                  {((JSON.parse(item).video).includes("file")) ? 
                  (
                    <Video
                      ref={videoLocalReference}
                      source={{ uri: JSON.parse(item).video }}
                      useNativeControls
                      resizeMode="contain"
                      isLooping={false}
                      isMuted={false}
                      style={styles.videoPlayer2}
                      onPlaybackStatusUpdate={status => setStatusVideoR(() => status)}
                    />
                  ) : 
                  (
                  <YoutubePlayer
                    height={280}
                    width={280}
                    play={false}
                    videoId={JSON.parse(item).video}
                  />   
                  )}                               
                </View>
                )}
               />
              <View style={{marginTop: 10, top: 6}}>
                <Button style={styles.button}
                  onPress={() => {
                    setModalVisibleHistorial(!modalVisibleHistorial);
                  }}>
                  <Text>Atrás</Text>
                </Button>
              </View>
            </View>
          </Modal>
          </View>
          );
      }
      else {
        return null;
      }
    } catch (error) {
      console.log(error)
    }
  }

    const guardarConfiguracion = async() => {
      /*
      var f = [''];
      f.length=0;
      console.log('Al vaciar array datos el resultado es: ', f)  
      setDatos(f);

      await AsyncStorage.setItem("DATOS", JSON.stringify(f));
      */

      var listaDatos = {};
      listaDatos.tipo = "Configuracion";

      var jsonDatos = JSON.stringify(listaDatos);

      setFlagModo(true);

      await AsyncStorage.setItem("MODO", JSON.stringify(jsonDatos));

      AsyncStorage.getItem("MODO").then((datos) => {
        setModo(JSON.parse(datos));
        navigation.navigate("AllLists");
      });

      console.log('El tipo de pantalla es: ', modo)

  }

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.title} category="h1"> 
          Historial
        </Text>

        {((listActualH.length !== 0) ? (JSON.parse(listActualH).historial !== '') : 
        (JSON.parse(listHistorial).historial !== '')) ? 
        (<View style={{backgroundColor: 'rgba(52, 52, 52, 0)', flex:1, marginTop: -5, marginBottom: -40}}>
          <List
            style={{width: Dimensions.get("window").width}}
            data={JSON.parse(listHistorial).historial}
            renderItem={renderItem}
          />
        </View>
        ) :
        (<View style={{backgroundColor: '#fafafd', flex:1, width: Dimensions.get("window").width, 
        alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.textoH}>El historial está vacío</Text>
        </View>
        )}
        <View style={{backgroundColor: '#fafafd', width: Dimensions.get("window").width, 
          alignItems: 'center', justifyContent: 'center'}}>
        <Button style={styles.button14}
          onPress={() => {
            Alert.alert('Borrar historial',
              "¿Está seguro de borrar el historial?", [
              {
                text: 'No',
                onPress: () => null,
                style:"cancel"
              },
              {text: "Sí", onPress: () => {borrarHistorial();}}
              ]
            );                 
          }}>
          <Text>Borrar historial</Text>
        </Button>
       
        <Button
          title="Atrás"
          style={styles.button}
          onPress={() => {
            isMounted = false;
            //setListH('');
            let listat = listActualH;
            listat.length = 0;
            setListActualH(listat);
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Lista',
                  params: { singleList: listHistorial,
                            itemId: JSON.parse(listHistorial).listaid,
                          },
                },
              ],
            })
            navigation.navigate("Lista", {
              singleList: ((listActualH.length!==0) ? listActualH : listHistorial),
              itemId: JSON.parse(listHistorial).listaid,
            });
          }}>
            <Text>Atrás</Text>
        </Button>
        </View>
      </View>
    </View>
  );
}
/*
backgroundColor: '#fcfcfc'

        <FlatList 
          data={listH ? listH : JSON.parse(listHistorial).historial}
          initialNumToRender={1}
          initialScrollIndex={0}
          keyExtractor={( item , index) => index.toString()}
          renderItem={renderItem}
        />
*/

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      color: "white",
      width: Dimensions.get("window").width
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: "white",
    width: Dimensions.get("window").width,
    right: 15,
},
  border: {
    marginTop: 30,
    borderColor: '#949699',
    borderWidth: 1,
    borderRadius: 9,
    width: width-30,
    height: 550,
    backgroundColor: '#fff',
  },
  border2: {
    marginTop: 30,
    marginLeft: 28,
    borderColor: '#949699',
    borderWidth: 1,
    borderRadius: 9,
    width: width-30,
    height: 150,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  border3: {
    marginTop: 30,
    marginLeft: 0,
    borderColor: '#949699',
    borderWidth: 1,
    borderRadius: 9,
    width: width-30,
    height: 600,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#1B4B95',
    padding: 0,
    marginBottom: 25,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: width-310,
  },
  button2: {
    //backgroundColor: '#1B4B95',
    padding: 0,
    marginBottom: 0,
    marginTop: 3,
    marginLeft: 20,
    left: 5,
    bottom: 2,
    borderRadius: 5,
    width: width - 230,
    height: 50,
    alignItems: 'center',
  },
  button3: {
    //backgroundColor: '#1B4B95',
    padding: 4,
    marginBottom: 0,
    right: 25,
    borderRadius: 400/2,
    width: width - 230,
    height: 35,
    alignItems: 'center',
  },
  button4: {
    //backgroundColor: '#1B4B95',
    position: 'absolute',
    right: 5,
    marginBottom: 0,
    height: 40,
    width: 40,
    marginTop: 15,
    borderRadius: 400/2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button5: {
    //backgroundColor: '#1B4B95',
    padding: 0,
    marginBottom: 0,
    borderRadius: 400/2,
    height: 35,
  },
  button6: {
    //backgroundColor: '#1B4B95',
    position: 'absolute',
    padding: 0,
    marginBottom: 0,
    borderRadius: 400/2,
    height: 45,
    width: 170,
    top: 320,
    marginLeft: 135,
  },
  button7: {
    bottom: 100,
    padding: 8,
    marginRight: 10,
    marginBottom: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 270,
  },
  button8: {
    backgroundColor: '#214ca3',
    borderRadius: 400/2,
    height: 45,
    width: 100,
    marginLeft: 140,
    bottom: 160,
  },
  button9: {
    backgroundColor: '#214ca3',
    borderRadius: 400/2,
    height: 45,
    width: 100,
    marginLeft: 140,
    bottom: 145,
  },
  button10: {
    backgroundColor: '#214ca3',
    borderRadius: 400/2,
    height: 45,
    width: 100,
    marginLeft: 140,
    marginBottom: 20,
    bottom: 140,
  },
  button11: {
    //backgroundColor: '#1B4B95',
    position: 'absolute',
    padding: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    borderRadius: 400/2,
    height: 35,
    left: 225,
    top: 4,
  },
  button12: {
    //backgroundColor: '#1B4B95',
    padding: 0,
    marginBottom: 40,
    marginLeft: 10,
    right: 60,
    borderRadius: 400/2,
    width: width - 230,
    height: 35,
    alignItems: 'center',
  },
  button13: {
    backgroundColor: '#1B4B95',
    padding: 8,
    marginBottom: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button14: {
    backgroundColor: '#1B4B95',
    padding: 0,
    marginBottom: 25,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: 60,
    width: width-250,
  },
  foto2: {
    //backgroundColor: '#1B4B95',
    height: 150,
    width: 150,
  },
  foto3: {
    //backgroundColor: '#1B4B95',
    height: 280,
    width: 280,
    marginBottom: 50,
  },
  viewFoto: {
    //backgroundColor: '#1B4B95',
    marginTop: 40,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewSeries: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCamera: {
    backgroundColor: '#1B4B95',
    padding: 8,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  camera: {
    width: width,
    height: Dimensions.get("window").height,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
  textoH: {
    fontSize: 16,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    flexDirection: 'row',
    marginBottom: 36,
  },
  title: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 26,
    marginTop: 40,
    right: 10,
    marginBottom: 10,
    color: 'black',
  },
  titleVideo: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
    color: 'black',
  },
  textHistorial: {
    //backgroundColor: '#1B4B95',
    padding: 10,
    marginRight: 30,
    fontSize: 16,
    backgroundColor:'rgba(52, 52, 52, 0.010)',
  },
  textHistorial2: {
    //backgroundColor: '#1B4B95',
    padding: 0,
    marginRight: 30,
    fontSize: 16,
    backgroundColor:'rgba(52, 52, 52, 0.010)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tituloLista: {
    fontSize: 16,
    marginLeft: 10,
  },
  imagen: {
    height: 55,
    width: 55,
    borderRadius: 400/2,
    marginBottom: 15,
  },
  imagen2: {
    position: 'absolute',
    right: 130,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    width: 35,
    marginTop: 30,
    borderRadius: 400/2,
  },
  imagen3: {
    right: 0,
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    width: 35,
    top: 10,
    marginLeft: 160,
    borderRadius: 400/2,
  },
  imagen4: {
    right: 35,
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    width: 35,
    top: 10,
    marginLeft: 5,
    borderRadius: 400/2,
  },
  imagen5: {
    right: 5,
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    width: 40,
    top: 8,
    marginLeft: 15,
    borderRadius: 400/2,
  },
  imagen6: {
    right: 70,
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    width: 40,
    top: 30,
    marginLeft: 5,
    borderRadius: 400/2,
  },
  imagen7: {
    //backgroundColor: '#1B4B95',
    height: 70,
    width: 70,
    borderRadius: 400/2,
  },
  imagen8: {
    //backgroundColor: '#1B4B95',
    marginTop: 10,
    left: 20,
    height: 60,
    width: 60,
    borderRadius: 400/2,
  },
  imagen9: {
    padding: 3,
    marginBottom: 0,
    marginTop: 4,
    marginLeft: 40,
    borderRadius: 5,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imagen10: {
    //backgroundColor: '#1B4B95',
    padding: 3,
    marginBottom: 0,
    marginTop: 4,
    marginLeft: 70,
    borderRadius: 5,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imagen11: {
    //backgroundColor: '#1B4B95',
    padding: 3,
    marginBottom: 0,
    marginTop: 4,
    marginLeft: 100,
    right: 20,
    borderRadius: 5,
    width: 50,
    height: 50,
    alignItems: 'center',
  },
  imagen12: {
    height: 40,
    width: 40,
    left: 0,
    marginBottom: 0,
    borderRadius: 400/2,
  },
  imagen13: {
    flex: 1,
    justifyContent: "center"
  },
  imagen14: {
    height: 52,
    width: 52,
    borderRadius: 400/2,
    marginBottom: 15,
  },
  imagen15: {
    height: 52,
    width: 52,
    borderRadius: 400/2,
    marginBottom: 15,
    right: 3,
  },
  listaRealizadoIm: {
    //backgroundColor: '#1B4B95',
    padding: 0,
    left: 30,
    marginBottom: 0,
    borderRadius: 400/2,
    height: 35,
  },
  modalStyle: {
    borderColor: '#949699',
    borderWidth: 1,
    borderRadius: 9,
    width: width-30,
    height: Dimensions.get("window").height,
    marginLeft: 15,
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#79aad1',
  },
  modalStyle2: {
    borderColor: '#949699',
    borderWidth: 1,
    borderRadius: 9,
    width: width,
    height: Dimensions.get("window").height,
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#79aad1',
  },
  modalStyle3: {
    borderColor: '#949699',
    borderWidth: 1,
    borderRadius: 9,
    width: width,
    height: Dimensions.get("window").height,
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#79aad1',
  },
  modalStyleEm: {
    borderColor: '#949699',
    borderWidth: 1,
    borderRadius: 9,
    width: width-30,
    height: Dimensions.get("window").height-500,
    marginLeft: 15,
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#79aad1',
  },
  input2: {
    textAlignVertical: 'top',
    borderColor: "#4630eb",
    borderRadius: 4,
    borderWidth: 1,
    height: 40,
    padding: 10,
    margin: 3,
    fontSize: 16,
    width: width - 100,
  },
  input3: {
    textAlignVertical: 'top',
    borderColor: "#2D1F87",
    borderRadius: 4,
    borderWidth: 1,
    height: 40,
    padding: 10,
    fontSize: 15,
    marginTop: 5,
    marginBottom: 8,
    right: 24,
    width: width - 150,
  },
  input4: {
    textAlignVertical: 'top',
    borderColor: "#4630eb",
    color: '#111111',
    borderRadius: 4,
    borderWidth: 1,
    height: 40,
    padding: 10,
    margin: 3,
    fontSize: 16,
    width: width - 300,
  },
  pickerStyle3: {
    padding: 0,
    marginBottom: 5,
    bottom: 70,
    right: 40,
    borderRadius: 5,
    width: 100,
  },
  pickerStyle4: {
    padding: 0,
    marginBottom: 5,
    top: 2,
    left: 50,
    borderRadius: 5,
    width: 100,
  },
  pickerStyle5: {
    padding: 0,
    marginBottom: 5,
    top: 35,
    left: 10,
    borderRadius: 5,
    width: 110,
  },
  videoPlayer: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  videoPlayer2: {
    alignSelf: 'center',
    width: 280,
    height: 200,
    marginBottom: 40,
  },
  textTimer: {
    fontSize: 30,
    marginLeft: 25,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 50,
    marginLeft: 25,
  },
});
