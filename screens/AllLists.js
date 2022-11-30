import 'react-native-gesture-handler';
import React, {useState, useEffect, useRef} from 'react';
import Constants from 'expo-constants';

import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, View,  Modal, Image, ImageBackground, AppState, BackHandler, TouchableOpacity, 
  Alert, Platform, ScrollView, Dimensions, KeyboardAvoidingView } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import * as MailComposer from 'expo-mail-composer';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Linking from 'expo-linking';
import * as DocumentPicker from 'expo-document-picker';
import YoutubePlayer from 'react-native-youtube-iframe';
import { NavigationContainer, useNavigation, useFocusEffect } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as FileSystem from 'expo-file-system';
import NativeModules from "react-native";
import {startActivityAsync, ActivityAction} from 'expo-intent-launcher';
import launch from 'react-native-mail-launcher';
import launchMailApp from 'react-native-mail-launcher';
import { SafeAreaView, FlatList } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { StackRouter } from 'react-navigation';
import AccountManager from 'react-native-account-manager';
import RNUserIdentity, { ICLOUD_ACCESS_ERROR } from 'react-native-user-identity';
import {Card} from 'react-native-paper';
import NumberPlease from 'react-native-number-please';
import {Picker} from '@react-native-picker/picker';
import TextTicker from 'react-native-text-ticker';
import {
  // Pickers
  PickerTime,
  PickerDate,
  PickerDateTime,
  PickerDateRange,
  // Dropdowns
  DropdownList,
  DropdownMeasurements,
  DropdownNumber,
  DropdownState,
  // TypeScript Types
  PickerItem,
} from 'react-native-ultimate-modal-picker';
import DropDownPicker from 'react-native-dropdown-picker';

import SegmentedPicker, {
  PickerOptions,
  Selections,
} from 'react-native-segmented-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Imagenes } from '../components/Images';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {List, ListItem, Divider, Text, Button} from '@ui-kitten/components';
import { MenuProvider } from 'react-native-popup-menu';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuContext,
} from 'react-native-popup-menu';


export default function AllLists () {

    const [listas, setListas] = useState([]);  //listas es un array de listas
    const [usuario, setUsuario] = useState([]);
    const [selectedTime, setSelectedTime] = useState();
    const [opened, setOpened] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const initialValues = [{ id: 'date', value: 2 }];
    const [date, setDate] = useState(initialValues);
    const dateNumbers = [{ id: 'date', label: "<3", min: 1, max: 31 }];
    const [city, setCity] = useState();
    const CITIES = 'Jakarta,Bandung,Sumbawa,Taliwang,Lombok,Bima'.split(',');
    const [openList, setOpenList] = useState(false);
    const [flagList, setFlagList] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    //const [flag, setFlag] = useState(false);
    let componentBackground = null;
    const navigation = useNavigation();
    //const appState = useRef(AppState.currentState);
    //const [appStateVisible, setAppStateVisible] = useState(appState.current);
    let file = null;
    let list = null;
    let num = 3;
    let valueNumber = '';
    let isMounted = true;
    //let componentItem = null;
    const [valuelist, setvaluelist] = useState([]);
    const [numeros, setNumeros] = useState([
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' },
      { label: '5', value: '5' },
      { label: '6', value: '6' },
      { label: '7', value: '7' },
      { label: '8', value: '8' },
      { label: '9', value: '9' },
      { label: '10', value: '10' },
      { label: '11', value: '11' },
      { label: '12', value: '12' },
    ]);
    const meses = [
      { label: 'meses', value: 'meses' },
      { label: 'dias', value: 'dias' },
    ];

    const [ listValueNumber, setListValueNumber ] = useState('');
    const [ listValueDay, setListValueDay ] = useState('');

    const pickerRef = useRef();

    function open() {
      pickerRef.current.focus();
    }

    function close() {
      pickerRef.current.blur();
    }


    const [datos, setDatos] = useState([
      { id: '3', image: Imagenes.uno },
      { id: '6', image: Imagenes.cuatro },
      { id: '10', image: Imagenes.ocho },
      { id: '13', image: Imagenes.once },
      { id: '15', image: Imagenes.trece },
      { id: '21', image: Imagenes.diecinueve },
      { id: '22', image: Imagenes.veinte },
    ]);

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
    ]);

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
        setOpened(false);
        isMounted = false;
        navigation.goBack();
      }
     
      return true;
    };

    const onBackdropPress = () => {
      setOpened(false);
    }

    const onTriggerPress = () => {
      setOpened(true);
    }
  
    const onOptionSelect = (value) => {
      setOpened(false);
    }

    const eliminarListas = () => {
      setOpened(false);
      setModalVisible(true);
    }

    useFocusEffect(
      React.useCallback(() => {
      isMounted = true;

      if(isMounted){
        BackHandler.addEventListener('hardwareBackPress', backAction);
      }
      
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      //return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
      //const subscription = AppState.addEventListener("change", _handleAppStateChange);
      return () => {
        backHandler.remove();
        isMounted = false;
        //subscription.remove();
      };
      
    }, [flagList]));

    useFocusEffect(
      React.useCallback(() => {
        
        isMounted = true;

        if(isMounted){
          getListas();
          BackHandler.addEventListener('hardwareBackPress', backAction);
        }
        
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        //return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
        //const subscription = AppState.addEventListener("change", _handleAppStateChange);
        return () => {
          backHandler.remove();
          isMounted = false;
          //subscription.remove();
        };
      }, []));
/*
    const _handleAppStateChange = nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
      }
  
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    };
*/
    const getListas = async () => {
        /*
        var f = [''];
        f.length=0;
        console.log('Al vaciar array videos el resultado es: ', f)  
        setListas(f);        
        //convertimos el array de listas 'l' en un string usando JSON.stringify(l) y lo pasamos a AllLists.js
        AsyncStorage.setItem("LISTAS", JSON.stringify(f));
        */
       
        AsyncStorage.getItem("USUARIO").then((datos) => {
          setUsuario(JSON.parse(datos));
        });
        
        AsyncStorage.getItem("LISTAS").then((listas) => {
          setListas(JSON.parse(listas));    //guardamos cada lista en formato string en listas
        });

        if(selectedImage==null){
          /*
          const valorFondo = await AsyncStorage.getItem("FONDO");
          const fondoAllLists = valorFondo ? JSON.parse(valorFondo) : [];
          if(fondoAllLists.length!==0){
            setSelectedImage ({localUri: (fondoAllLists.valor)});
            console.log('FONDO ES: ', fondoAllLists.valor)
          }
          */
        }

        console.log('las LISTAS que tenemos son: ', listas)
    }

/* 
   const openMailApp = () => {
      try{
        if (Platform.OS === 'android') {
          //NativeModules.UIMailLauncher.launchMailApp();
          //WebBrowser.openBrowserAsync('https://gmail.com');
          //Linking.openURL('https://gmail.com');
          Linking.openURL('inbox-gmail://');
          //Linking.openURL('mailto:reyesmr97@gmail.com?subject=SendMail&body=Description');
          return;
        }
        else {
          Linking.openURL('message:0'); // iOS
        return;
        }
      }
      catch (error){
        console.log(error)
      }
    }
*/

    const openMailClientIOS = async() => {
      Linking.canOpenURL('message:0')
        .then(supported => {
          if (!supported) {
            console.log('Cant handle url')
          } else {
            return Linking.openURL('message:0')
              .catch(this.handleOpenMailClientErrors)
          }
        })
        .catch(this.handleOpenMailClientErrors)
    }

  
    const openMailClientAndroid = async() => {
      
      const activityAction = 'android.intent.action.MAIN'; // Intent.ACTION_MAIN   
      //const activityAction = 'android.intent.action.VIEW';  // solo cuando usamos packageName, para acceder a los archivos y a más aplicaciones
      let intentParams = {
        category: 'android.intent.category.APP_EMAIL', // Intent.CATEGORY_APP_EMAIL
        //data: 'googlegmail://',
        flags: 268435456 // 268435456 is the constant value for Intent.FLAG_ACTIVITY_NEW_TASK, 989680
        //packageName: ''
      }
      //const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      /*
      Linking.sendIntent('android.intent.action.MAIN', 'FLAG_ACTIVITY_NEW_TASK').then(supported => {
        if (supported) {
        console.log('hemos entrado en gmail')
        }
      });
      */
      
      IntentLauncher.startActivityAsync(activityAction, intentParams)
        .catch((error) => {
          console.log('Ha habido un error al volver a la app desde gmail')
        });
      
    /*
            .then(resultCode => {
          if(resultCode){
            if(appState.current==="background"){
              console.log('hemos entrado en gmail app')
              
            }
          }
        })
    */
     /*
      Linking.canOpenURL('com.google.android.gm').then(supported => {
        if (supported) {
           return Linking.openURL('com.google.android.gm');
        } else {
           return Linking.openURL('https://www.gmail.com/');
        }
      });
      */
    }

    const abrirEmail = () => {
      if(Platform.OS === "ios"){
        openMailClientIOS();
      }
      if(Platform.OS === "android"){
        openMailClientAndroid();
      }
      else{
        return;
      }
    };

    const abrirYoutube = async() => {
      
      Linking.canOpenURL('vnd.youtube://').then(supported => {
        if (supported) {
           return Linking.openURL('vnd.youtube://');
        } else {
           return Linking.openURL('https://www.youtube.com/');
        }
     });
          
    }

    const nuevaLista = () => 
      Alert.alert(
        "",
        "Crear Lista", [
          {text: "Cancelar", onPress: () => {return;}, style:"cancel"},
          {text: "Añadir vídeos en local", onPress: () => navigation.navigate('NuevaListaLocal')},
          {
            text: 'Añadir vídeos de Youtube',
            onPress: () => navigation.navigate('NuevaLista')
          },
        ]
      );
    

    /*
    const renderItem = () => {
        listas.map((item, i) => (
          <ListItem key={i} bottomDivider onPress={() => navigation.navigate("Lista", {
            singleList: item
          })}>
            <Icon name={item.icon} />
            <ListItem.Content>
              <ListItem.Title>{item.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))
    }
    */
    const component = (item) => {
      if (item !== undefined || item !== null){
        for (let i = 0; i<datos.length; i++){
          if((JSON.parse(item).imagen) == datos[i].image){
            num=i;
          }     
        }
    
        if((JSON.parse(item).imagen) == datos[num].image){
          return ( <Image
          //source={{uri: 'https://picsum.photos/200/200'}}
          source={datos[num].image}
          style={styles.imagen2}
          //si existe el estado (si es distinto de null), se pinta una imagen (de la uri) que escogemos en la galeria. 
          //Si no existe el estado (si es null), se muestra la imagen 'picsum.photos' por defecto
          />
          );
        }
        else {
          return( <Image
          //source={{uri: 'https://picsum.photos/200/200'}}
          //la listaInicial puede que tenga que ser un string
          source={{uri: JSON.parse(item).imagen.toString() }}
          style={styles.imagen2}
          //si existe el estado (si es distinto de null), se pinta una imagen (de la uri) que escogemos en la galeria. 
          //Si no existe el estado (si es null), se muestra la imagen 'picsum.photos' por defecto
          />
          );
        }
      }
    }

    let cambiarEmail = async() => {
      setOpened(false);
      Alert.alert('', '¿Seguro que quieres cambiar el correo electrónico?', [
        {
          text: 'Cancelar',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'Sí', onPress: async() => {
          var f = [''];
          f.length=0;   
          //convertimos el array de listas 'l' en un string usando JSON.stringify(l) y lo pasamos a AllLists.js
          await AsyncStorage.setItem("DATOS", JSON.stringify(f));
          navigation.navigate('LogIn');
          isMounted = false;
        }},
      ]);
      
    };


    const renderItem = ({ item, index }) => {
      try {
        if (item !== undefined || item !== null){
          let duracion = (JSON.parse(item).titulo).length * 135;
            return (        
              <View style={{backgroundColor:'rgba(52, 52, 52, 0.010)'}}>     
              <ListItem
                title={() => 
                  <Text 
                  style={styles.tituloLista}>
                    {JSON.parse(item).titulo}
                  </Text>}
                onPress={async() => {                 
                  //BackHandler.removeEventListener('hardwareBackPress', backAction);
                  //Cada Lista está en formato JSON string
                  const valorModo = await AsyncStorage.getItem("MODO");
                  const m = valorModo ? JSON.parse(valorModo) : [];
                  console.log('MODO es: ', m)
                  
                  try{
                    if (JSON.parse(m).tipo === "Entrenamiento"){
                      navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: 'Lista',
                            params: { singleList: item,
                                      itemId: index, 
                                    },
                          },
                        ],
                      })
                    }
                    if (JSON.parse(m).tipo === "Configuracion"){
                      navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: 'ListaConfiguracion',
                            params: { singleList: item,
                                      itemId: index, 
                                    },
                          },
                        ],
                      })
                    }
                  if (JSON.parse(m).tipo === "Entrenamiento"){
                    navigation.navigate("Lista", {
                      singleList: item,
                      itemId: index,
                    })}
                  if (JSON.parse(m).tipo === "Configuracion"){
                    navigation.navigate("ListaConfiguracion", {
                      singleList: item,
                      itemId: index,
                    })}
                  else {
                    return;
                  }
                  isMounted = false;
                  } catch(error){
                    console.log(error)
                  }
                  }

                }
                accessoryLeft={() => component(item)}
                accessoryRight={() => menuLista(item)}
                style={styles.border}
              />
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

    const importarLista = async() => {
      try{
        let result = await DocumentPicker.getDocumentAsync({
            type: "*/*",   //all files
            /*
            type: "image/*", // all images files
            type: "audio/*", // all audio files
            type: "application/*", // for pdf, doc and docx
            type: "application/pdf", // .pdf
            type: "application/msword", // .doc
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
            type: "vnd.ms-excel", // .xls
            type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
            type: "text/csv", // .csv
            */
        });

        if (!result.cancelled) {
          file = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.UTF8 });
          list = JSON.parse(file);
          /*
          list.imagen = (singleList.split('\n'))[0];
          list.titulo = (singleList.split('\n'))[1];
          list.series = (singleList.split('\n'))[2];
          list.repeticiones = (singleList.split('\n'))[3];
          list.tiempo = (singleList.split('\n'))[4];
          list.videos = (singleList.split('\n'))[5];
          */

          try{
            if (list.imagen !== null){
              const valor = await AsyncStorage.getItem("LISTAS");
              const l = valor ? JSON.parse(valor) : [];
              let num = '';
/*
              let j = '[';
              let vids = '[';
              for(let i = 1; i<list.series.split(',').length; i++) {
                vids = vids + (list.series.split(',')[i] + '\n' + list.repeticiones.split(',')[i] + '\n' + list.tiempo.split(',')[i] + '\n' + list.videos.split(',')[i] + '\n' + list.id.split(',')[i]) + ',';
              }
              vids = vids.substring(0, vids.length - 1);
              console.log('el valor de vids de AllLists es: ', vids)
*/            for (let i=0; i < l.length; i++){
                if((JSON.parse(l[i])).idlista == list.idlista){
                    Alert.alert('', 'Esta lista ya existe, ¿Quieres actualizarla o crear una copia?', [
                      {
                        text: 'Actualizar',
                        onPress: async() => {
                          const newListas = l.filter((lista) => JSON.parse(lista).idlista !== list.idlista);
                          newListas.push(file);
                          console.log('se ha añadido la lista = ', file);
                          await AsyncStorage.setItem("LISTAS", JSON.stringify(newListas));
                          AsyncStorage.getItem("LISTAS").then((listas) => {
                            setListas(JSON.parse(listas));    //guardamos cada lista en formato string en listas
                            setFlagList(!flagList);
                          });

                        }
                      },
                      { text: 'Crear copia', onPress: () => {
                        duplicarLista(file);
                      }},
                      {text: "Cancelar", onPress: () => {return;}, style: 'cancel'},
                    ]);
                    num=i;
                    break;                
                }
              }

              if(num === ''){
                const listarray = [l];       
                l.push(file);
                console.log('se ha añadido la lista = ', l);
                await AsyncStorage.setItem("LISTAS", JSON.stringify(l));
                AsyncStorage.getItem("LISTAS").then((listas) => {
                  setListas(JSON.parse(listas));    //guardamos cada lista en formato string en listas
                  setFlagList(!flagList);
                });
              }
            } else {
                Alert.alert("No se puede añadir la lista");
            }
          }
          catch(error){
              console.log(error);
              Alert.alert("No se puede añadir la lista");
          }

          

        }
      }
      catch(error){
        console.log("No se ha importado la lista: ", error);
        return;
      }
    }
    
    const duplicarLista = async (item) => {

      const valor = await AsyncStorage.getItem("LISTAS");
      const l = valor ? JSON.parse(valor) : [];

      var lista = {};
      lista.imagen = JSON.parse(item).imagen;
      lista.titulo = (JSON.parse(item).titulo) + "(1)";

      /*
      if((JSON.parse(item).titulo) == ((JSON.parse(listas[i])).titulo)){
        lista.titulo = JSON.parse(item).titulo;
      }
      
      if((JSON.parse(item).titulo).includes("(")){
        let title = ((JSON.parse(item).titulo.split("("))[0]) + "(" + i.toString() + ")"
        for (let j=1; j<1000; j++){
          if((JSON.parse(item).titulo) == title) {
            lista.titulo = (JSON.parse(item).titulo) + "(" + j.toString() + ")";
            console.log('va hasta lista.titulo con (')
          }
        }
      }
      else {
        console.log('va hasta lista.titulo sin (')
        lista.titulo = (JSON.parse(item).titulo) + "(1)";
      }
      */
      
      lista.videolista = JSON.parse(item).videolista;
      lista.email = JSON.parse(item).email;

      const idList = (Math.round(Math.random() * 1000)).toString();

      let idVideos = "";

      for (let i=0; i < l.length; i++){
        if(idList !== (JSON.parse(l[i]).idlista)) {
          idVideos = idList;
        }
      }
      if(idVideos === "")
      {
        idVideos = (Math.round(Math.random() * 1000)).toString();
      }

      lista.idlista = idVideos;
      lista.fechacreacion = JSON.parse(item).fechacreacion;
      lista.listaRealizado = JSON.parse(item).listaRealizado;
      lista.imagenListaRealizado = JSON.parse(item).imagenListaRealizado;
      lista.historial = JSON.parse(item).historial;
      lista.fondo = JSON.parse(item).fondo;
      //lista.emoticono = JSON.parse(item).emoticono;
      //lista.foto = JSON.parse(item).foto;

      var jsonLista = JSON.stringify(lista);
      l.push(jsonLista);
      //console.log('se ha añadido la lista = ', l);
      await AsyncStorage.setItem("LISTAS", JSON.stringify(l));
      AsyncStorage.getItem("LISTAS").then((listas) => {
        setListas(JSON.parse(listas));
      });

    }


    let abrirFondo = async() => {
      /*
      for (let i=0; i<Imagenes.length; i++) {
        Imagenes.push(Imagenes[i]);
      }
      */
      setOpened(false);
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      //si el usuario ha denegado el permiso para acceder a su galeria, entonces sale una alerta
      if (permissionResult.granted == false) {
      alert('Permisos para acceder a la camara son requeridos');
      return;
      }
      //cuando el usuario escoge una imagen de su galeria, pickerResult retorna la imagen que escogio. Se pone 'await' porque es asincrono.
      const pickerResult = await ImagePicker.launchImageLibraryAsync();
      
      if (pickerResult.cancelled === true) {
      return; //al poner solo return, si no se escoge ninguna imagen, no da error
      }
      
      setSelectedImage ({localUri: pickerResult.uri});  //de esta forma, estaria actualizado el estado
      var listaFondo = {};
        listaFondo.valor = pickerResult.uri;
      var jsonDatos = JSON.stringify(listaFondo);
      await AsyncStorage.setItem("FONDO", jsonDatos);
      AsyncStorage.getItem("FONDO").then(() => {
        console.log('FONDO ES AL INICIO: ', jsonDatos)
      });
      //console.log('FONDO ES AL INICIO: ', jsonDatos)
      //setFlag(true);
      
    };

/*
    try{
      if(selectedImage !== null) { 
        componentBackground = <View>
        <ImageBackground source={{uri: selectedImage.localUri}} resizeMode="cover" style={styles.imagen4}>
        <View style={styles.container}>
        
        <View style={{ flexDirection: 'row', bottom: 40}}>
          <View>
            <Text style={styles.title}>
				      Listas
			      </Text>
          </View>
          <View style={{left: 100, top: 63, height: 25, width: 25, justifyContent: 'center', alignItems: 'center'}}>
              <Menu
                opened={opened}
                onBackdropPress={() => onBackdropPress()}
                onSelect={value => onOptionSelect(value)}>
                  <MenuTrigger
                    onPress={() => onTriggerPress()}
                    style={{height: 35, width: 35}}>
                    <Entypo name="dots-three-vertical" size={24} color="black" />
                  </MenuTrigger>
                    <MenuOptions optionsContainerStyle={{width:200,height:160}}>
                      <MenuOption value={1}
                        style={{marginLeft: 30, marginTop: 0}}
                        onSelect={() => abrirFondo()}
                        text="Añadir fondo de pantalla" />
                      <MenuOption value={2} 
                        style={{marginLeft: 30, marginTop: 3}}
                        onSelect={() => eliminarListas()}
                        text="Añadir recordatorio"/>
                    </MenuOptions>
              </Menu>
          </View>
        </View>

          <Modal
            visible={modalVisible} 
            animationType='fade' 
            transparent={true}>
            <View style={styles.modalStyle}>
            <View style={{ flexDirection: 'row'}}>
                <View style={{left: 70}}>
                  <Text>Eliminar elementos creados hace más de </Text>
                </View>
                <View style={{ flexDirection: 'row'}}>
                  <View style={styles.pickerStyle3}>
                    <DropDownPicker
                      placeholder='Selecciona un número'
                      open={openList}
                      value={valuelist}
                      items={numeros}
                      setOpen={setOpenList}
                      setValue={setvaluelist}
                      setItems={setNumeros}
                      onChangeValue={(value) => {
                        setListValueNumber(value);
                      }}
                      theme="DARK"
                      mode="BADGE"
                      badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                    />
                  </View>
                  <View style={{justifyContent: 'center', right: 110, top: 10}}>
                    <Text>Meses</Text>
                  </View>

                </View>
                

            </View>

    
            <Button onPress={async() => {

              //var listlistValueNumber
              //var fecha = dia + '-' + mes + '-' + año;
              var dia = new Date().getDate();
              var mes = new Date().getMonth() + 1; //To get the Current Month
 
              const valorListas = await AsyncStorage.getItem("LISTAS");
              const l = valorListas ? JSON.parse(valorListas) : [];             

              const listMonth = l.filter((lista) => ((JSON.parse(lista).fechacreacion.split('-')[1]) >= (mes-listValueNumber)));  
              await AsyncStorage.setItem("LISTAS", JSON.stringify(listMonth))
              //const newListas = l.filter((lista) => lista.fechacreacion == singleList);
              //const nuevasListas = newListas.filter((lista) => lista !== jsonListIni);
              await AsyncStorage.getItem("LISTAS").then((listas) => {       
                setListas(JSON.parse(listas));       
                setFlagList(!flagList);            
              });
              console.log('Se han eliminado los elementos creados hace más de x meses', listValueNumber)
              setModalVisible(false);
            }}
              style={styles.button8}>
                <Text>Guardar</Text>
            </Button>
            <Button onPress={() => {
              setModalVisible(false);
              }}
              style={styles.button9}>
              <Text>Cancelar</Text>
            </Button>
            </View>
          </Modal>
          
            <View style={{backgroundColor: 'rgba(52, 52, 52, 0)', flex:1, marginTop: -5, marginBottom: -40}}>
            <ImageBackground source={{uri: selectedImage.localUri}} style={{width: Dimensions.get("window").width}}>           
            <List
              style={{width: Dimensions.get("window").width}}
              data={listas.reverse()}
              renderItem={renderItem}
            />
            </ImageBackground>           
            </View>

            <View style={{ flexDirection: 'row', marginTop: 10, right: 50, top: 35}}>
              <View style={styles.button3}>
              <TouchableOpacity onPress={importarLista}>
                <Image
                  source={datosIm[14].image}
                  style={styles.imagen}
                />
              </TouchableOpacity>
              </View>
              <View style={styles.button3}>
              <TouchableOpacity onPress={showEmail}>
                <Image
                  source={datosIm[15].image}
                  style={styles.imagen}
                />
              </TouchableOpacity>
              </View>
              <View style={styles.button2}>
              <TouchableOpacity onPress={openYoutubeApp}>
                <Image
                  source={datosIm[16].image}
                  style={styles.imagen}
                />
              </TouchableOpacity>
              </View>
            </View>
            <View style={styles.button4}>
              <TouchableOpacity onPress={newList}>
                <Image
                  source={datosIm[17].image}
                  style={styles.imagen3}
                />
              </TouchableOpacity>
            </View>
            

          
        </View>
        </ImageBackground>
        </View>
      }
 
        else {
            componentBackground = <View>
            <ImageBackground source={datosIm[20].image} resizeMode="cover" style={styles.imagen4}>
        <View style={styles.container}>
        
        <View style={{ flexDirection: 'row', bottom: 40}}>
          <View>
            <Text style={styles.title}>
				      Listas
			      </Text>
          </View>
          <View style={{left: 100, top: 63, height: 25, width: 25, justifyContent: 'center', alignItems: 'center'}}>
              <Menu
                opened={opened}
                onBackdropPress={() => onBackdropPress()}
                onSelect={value => onOptionSelect(value)}>
                  <MenuTrigger
                    onPress={() => onTriggerPress()}
                    style={{height: 35, width: 35}}>
                    <Entypo name="dots-three-vertical" size={24} color="black" />
                  </MenuTrigger>
                    <MenuOptions optionsContainerStyle={{width:200,height:160}}>
                      <MenuOption value={1}
                        style={{marginLeft: 30, marginTop: 0}}
                        onSelect={() => abrirFondo()}
                        text="Añadir fondo de pantalla" />
                      <MenuOption value={2} 
                        style={{marginLeft: 30, marginTop: 3}}
                        onSelect={() => eliminarListas()}
                        text="Añadir recordatorio"/>
                    </MenuOptions>
              </Menu>
          </View>
        </View>

          <Modal
            visible={modalVisible} 
            animationType='fade' 
            transparent={true}>
            <View style={styles.modalStyle}>
            <View style={{ flexDirection: 'row'}}>
                <View style={{left: 70}}>
                  <Text>Eliminar elementos creados hace más de </Text>
                </View>
                <View style={{ flexDirection: 'row'}}>
                  <View style={styles.pickerStyle3}>
                    <DropDownPicker
                      placeholder='Selecciona un número'
                      open={openList}
                      value={valuelist}
                      items={numeros}
                      setOpen={setOpenList}
                      setValue={setvaluelist}
                      setItems={setNumeros}
                      onChangeValue={(value) => {
                        setListValueNumber(value);
                      }}
                      theme="DARK"
                      mode="BADGE"
                      badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                    />
                  </View>
                  <View style={{justifyContent: 'center', right: 110, top: 10}}>
                    <Text>Meses</Text>
                  </View>

                </View>
                

            </View>

    
            <Button onPress={async() => {

              //var listlistValueNumber
              //var fecha = dia + '-' + mes + '-' + año;
              var dia = new Date().getDate();
              var mes = new Date().getMonth() + 1; //To get the Current Month
 
              const valorListas = await AsyncStorage.getItem("LISTAS");
              const l = valorListas ? JSON.parse(valorListas) : [];             

              const listMonth = l.filter((lista) => ((JSON.parse(lista).fechacreacion.split('-')[1]) >= (mes-listValueNumber)));  
              await AsyncStorage.setItem("LISTAS", JSON.stringify(listMonth))
              //const newListas = l.filter((lista) => lista.fechacreacion == singleList);
              //const nuevasListas = newListas.filter((lista) => lista !== jsonListIni);
              await AsyncStorage.getItem("LISTAS").then((listas) => {       
                setListas(JSON.parse(listas));       
                setFlagList(!flagList);            
              });
              console.log('Se han eliminado los elementos creados hace más de x meses', listValueNumber)
              setModalVisible(false);
            }}
              style={styles.button8}>
                <Text>Guardar</Text>
            </Button>
            <Button onPress={() => {
              setModalVisible(false);
              }}
              style={styles.button9}>
              <Text>Cancelar</Text>
            </Button>
            </View>
          </Modal>
          
            <View style={{backgroundColor: 'rgba(52, 52, 52, 0)', flex:1, marginTop: -5, marginBottom: -40}}>
            <ImageBackground source={datosIm[20].image} style={{width: Dimensions.get("window").width}}>           
            <List
              style={{width: Dimensions.get("window").width}}
              data={listas.reverse()}
              renderItem={renderItem}
            />
            </ImageBackground>           
            </View>

            <View style={{ flexDirection: 'row', marginTop: 10, right: 50, top: 35}}>
              <View style={styles.button3}>
              <TouchableOpacity onPress={importarLista}>
                <Image
                  source={datosIm[14].image}
                  style={styles.imagen}
                />
              </TouchableOpacity>
              </View>
              <View style={styles.button3}>
              <TouchableOpacity onPress={showEmail}>
                <Image
                  source={datosIm[15].image}
                  style={styles.imagen}
                />
              </TouchableOpacity>
              </View>
              <View style={styles.button2}>
              <TouchableOpacity onPress={openYoutubeApp}>
                <Image
                  source={datosIm[16].image}
                  style={styles.imagen}
                />
              </TouchableOpacity>
              </View>
            </View>
            <View style={styles.button4}>
              <TouchableOpacity onPress={newList}>
                <Image
                  source={datosIm[17].image}
                  style={styles.imagen3}
                />
              </TouchableOpacity>
            </View>
            

          
        </View>
        </ImageBackground>
        </View>
        }
      } catch (error){
        console.log(error)
      }
    
*/
const mesFecha = (lista) => {
  var mes = new Date().getMonth() + 1; //Para obtener el mes actual

  let diaLista = (JSON.parse(lista).fechacreacion).split('-')[0];
  let mesLista = (JSON.parse(lista).fechacreacion).split('-')[1];
  let añoLista = (JSON.parse(lista).fechacreacion).split('-')[2];

  var fechaLista = new Date(añoLista, mesLista, diaLista);

  var diaIndicado = (JSON.parse(lista).fechacreacion).split('-')[0];
  var mesIndicado = mes-listValueNumber;
  var añoIndicado = (JSON.parse(lista).fechacreacion).split('-')[2];
  var fechaIndicada = new Date(añoIndicado, mesIndicado, diaIndicado);

  console.log(fechaLista >= fechaIndicada)
  if((mes-listValueNumber) >= 0){
    if((mesLista >= (mes-listValueNumber)) && (fechaLista >= fechaIndicada)){
      console.log('la lista se quedaaaaaa')
      return lista;
    }
  }
  else{
    return;
  }

}


    const menuLista = (item) => {
      return (
        <Menu>
          <MenuTrigger style={{marginLeft: 25, left: 6, top: 3, height: 30, width: 30}}>
            <Entypo name="dots-three-vertical" size={24} color="black" />
          </MenuTrigger> 
            <MenuOptions optionsContainerStyle={{width:150,height:40}}>
              <MenuOption onSelect={() => duplicarLista(item)}
                style={{marginLeft: 10, marginTop: 0}}
                text={"Duplicar lista"} />

            </MenuOptions>
        </Menu>
      );
    }

    const onConfirm = (selections) => {
      console.log(selections);
      // => { col_1: "option_1", col_2: "option_3" }
    }


      return (
        <ImageBackground source={{uri: 
          selectedImage !== null ?
          selectedImage.localUri : 
         'https://images.pexels.com/photos/3927386/pexels-photo-3927386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
         }} resizeMode="cover" style={styles.imagen4}>
        <View style={styles.container}>
        
        <View style={{ flexDirection: 'row', bottom: 40}}>
          <View>
            <Text style={styles.title}>
				      Listas
			      </Text>
          </View>
          <View style={{left: 100, top: 63, height: 25, width: 25, justifyContent: 'center', alignItems: 'center'}}>
              <Menu
                opened={opened}
                onBackdropPress={() => onBackdropPress()}
                onSelect={value => onOptionSelect(value)}>
                  <MenuTrigger
                    onPress={() => onTriggerPress()}
                    style={styles.button11}>
                    <MaterialIcons name="menu" size={30} color="black" />
                  </MenuTrigger>
                    <MenuOptions optionsContainerStyle={{width:200,height:100}}>
                      <MenuOption value={1}
                        style={{marginLeft: 10, marginTop: 0}}
                        onSelect={() => abrirFondo()}
                        text="Añadir fondo de pantalla" />
                      <MenuOption value={2} 
                        style={{marginLeft: 10, marginTop: 3}}
                        onSelect={() => eliminarListas()}
                        text="Eliminar listas"/>
                      <MenuOption value={3}
                        style={{marginLeft: 10, marginTop: 0}}
                        onSelect={() => cambiarEmail()}
                        text="Cambiar correo electrónico" />
                    </MenuOptions>
              </Menu>
          </View>
        </View>

          <Modal
            visible={modalVisible} 
            animationType='fade' 
            transparent={true}>
            <View style={styles.modalStyle}>
            <View style={{flexDirection: 'column'}}>
                <View>
                  <Text style={{fontSize: 16}}>Eliminar listas creadas hace más de: </Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                  <View style={styles.pickerStyle3}>
                    <DropDownPicker
                      placeholder='Selecciona un número'
                      open={openList}
                      value={valuelist}
                      items={numeros}
                      setOpen={setOpenList}
                      setValue={setvaluelist}
                      setItems={setNumeros}
                      onChangeValue={(value) => {
                        setListValueNumber(value);
                      }}
                      theme="LIGHT"
                      mode="BADGE"
                      badgeColors={["#95bddb"]}
                      style={{
                        backgroundColor: '#5a9ed1'
                      }}
                    />
                  </View>
                  <View style={{marginTop: 95}}>
                    <Text>Meses</Text>
                  </View>
                </View>
            </View>

    
            <Button onPress = { async() => {
              var dia = new Date().getDate();
              var mes = new Date().getMonth() + 1; //Para obtener el mes actual
              var año = new Date().getFullYear();
 
              const valorListas = await AsyncStorage.getItem("LISTAS");
              const l = valorListas ? JSON.parse(valorListas) : [];   

              let diaFechaCreacion = '';
              let mesFechaCreacion = '';
              /*
              for(let i = 0; i<l.length; i++){
                if(((JSON.parse(l[i]).fechacreacion).split('-')[0] !== ('10' || '20' || '30')) && 
                  ((JSON.parse(l[i]).fechacreacion).split('-')[0].includes('0'))){
                    diaFechaCreacion = ((JSON.parse(l[i]).fechacreacion).split('-')[0]).substring(1);
                }
                else {
                  diaFechaCreacion = (JSON.parse(l[i]).fechacreacion).split('-')[0];
                }

                if(((JSON.parse(l[i]).fechacreacion).split('-')[1] !== '10') && 
                  ((JSON.parse(l[i]).fechacreacion).split('-')[1].includes('0'))){
                    mesFechaCreacion = ((JSON.parse(l[i]).fechacreacion).split('-')[1]).substring(1);
                }
                else {
                  mesFechaCreacion = (JSON.parse(l[i]).fechacreacion).split('-')[1];
                }

              }
              */

              const listMonth = l.filter((lista) => (mesFecha(lista)));  
              await AsyncStorage.setItem("LISTAS", JSON.stringify(listMonth))

              await AsyncStorage.getItem("LISTAS").then((listas) => {       
                setListas(JSON.parse(listas));       
                setFlagList(!flagList);            
              });
              console.log('Se han eliminado los elementos creados hace más de x meses', listValueNumber)
              setModalVisible(false);
              }
            }
              style={styles.botonGuardar}>
                <Text>Guardar</Text>
            </Button>
            <Button onPress={() => {
              setModalVisible(false);
              }}
              style={styles.botonCancelar}>
              <Text>Cancelar</Text>
            </Button>
            </View>
          </Modal>
          
            <View style={{backgroundColor: 'rgba(52, 52, 52, 0)', flex:1, marginTop: -5, marginBottom: -40}}>
            <ImageBackground source={{uri: 
          selectedImage !== null ?
          selectedImage.localUri : 
         'https://images.pexels.com/photos/3927386/pexels-photo-3927386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
         }} style={{width: Dimensions.get("window").width}}>           
            <List
              style={{width: Dimensions.get("window").width}}
              data={(listas!==null) ? listas.reverse() : []}
              renderItem={renderItem}
            />
            </ImageBackground>           
            </View>

            <View style={{ flexDirection: 'row', marginTop: 10, right: 50, top: 35}}>
              <View style={styles.botonImportarLista}>
                <TouchableOpacity onPress={importarLista}>
                  <Image
                    source={datosIm[22].image}
                    style={styles.imagen5}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.botonEmail}>
                <TouchableOpacity onPress={abrirEmail}>
                  <Image
                    source={datosIm[15].image}
                    style={styles.imagen}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.botonYoutube}>
                <TouchableOpacity onPress={abrirYoutube}>
                  <Image
                    source={datosIm[16].image}
                    style={styles.imagen}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.viewLeft}>
              </View>
            </View>
            <View style={styles.botonNuevaLista}>
              <TouchableOpacity onPress={nuevaLista} style={{bottom: 17}}>
                <Image
                  source={datosIm[23].image}
                  style={styles.imagen3}
                />
              </TouchableOpacity>
            </View>
            

          
        </View>
        </ImageBackground>
      );
  
}

/*
          <View style={{left: 100, top: 63, height: 25, width: 25}}>
            <TouchableOpacity style={styles.button10} onPress={eliminarListas}>
              <MaterialIcons name="menu" size={30} color="black" />
            </TouchableOpacity>
          </View>

                  <View style={styles.pickerStyle4}>
                  <DropdownList
                    title=""
                    items={meses}
                    onChange={(valor) => console.log('funciona')}
                  />
                  </View>

                  <NumberPlease
                    digits={dateNumbers}
                    values={date}
                    onChange={(values) => setDate(values)}
                  />
                <View style={styles.pickerStyle2}>
                  <Picker
                    selectedValue={selectedTime}
                    onValueChange={(itemValue, itemIndex) =>
                    setSelectedTime(itemValue)
                    }>
                    <Picker.Item label="Días" value="Días" />
                    <Picker.Item label="Meses" value="Meses" />
                    <Picker.Item label="Años" value="Años" />
                  </Picker>
                </View>


          <Menu
            opened={opened}
            onBackdropPress={() => onBackdropPress()}
            onSelect={value => onOptionSelect(value)}>
              <MenuTrigger
                onPress={() => onTriggerPress()}
                style={{left: 38, top: 35, height: 35, width: 35}}>
                <Entypo name="dots-three-vertical" size={24} color="black" />
              </MenuTrigger>
                <MenuOptions optionsContainerStyle={{width:200,height:120}}>
                  <MenuOption
                    style={{marginLeft: 30, marginTop: 3}}
                    onSelect={() => eliminarListas()}
                    text="Eliminar listas"/>
                </MenuOptions>
          </Menu>

          <TouchableOpacity onPress={eliminarListas}>
            <Entypo name="dots-three-vertical" size={24} color="black" />
          </TouchableOpacity>

            <List 
              style={{width: Dimensions.get("window").width, backgroundColor: '#FAFAFF'}}
              data={listas.reverse()}
              ItemSeparatorComponent={Divider}
              renderItem={renderItem}
            />



 <View style={{backgroundColor: '#FAFAFA'}}>
          <TouchableOpacity style={styles.button}
            title="Importar lista"
            onPress={importarLista}>
            <Text>Importar lista</Text>
          </TouchableOpacity>
*/

const { width } = Dimensions.get('window');
const windowheight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      color: "white",
      padding: 30,
      width: Dimensions.get("window").width,
      height: windowheight,
  },
  button: {
    padding: 3,
    marginBottom: 20,
    marginLeft: 115,
    marginTop: 0,
    borderRadius: 5,
    width: width - 230,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    alignItems: 'center',
  },
  botonYoutube: {
    //backgroundColor: '#1B4B95',
    padding: 0,
    marginBottom: 30,
    borderRadius: 400/2,
    height: 35,
    width: 35,
  },
  viewLeft: {
    width: width-245,
  },
  botonEmail: {
    //backgroundColor: '#1B4B95',
    padding: 0,
    marginBottom: 30,
    borderRadius: 400/2,
    height: 35,
  },
  botonNuevaLista: {
    //backgroundColor: '#1B4B95',
    top: 10,
    borderRadius: 1000,
    justifyContent: 'flex-end',
    backgroundColor: '#9dcfd4',
    height: 78,
    width: 77,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  botonGuardar: {
    backgroundColor: '#2d65c4',
    borderRadius: 400/2,
    borderWidth: 1,
    borderColor: '#2a5db5',
    height: 45,
    width: 100,
    top: 200,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonCancelar: {
    backgroundColor: '#d1453d',
    borderRadius: 400/2,
    borderWidth: 1,
    borderColor: '#bd3c35',
    height: 45,
    width: 100,
    top: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button10: {
    backgroundColor: '#cbd1d4',
    borderRadius: 400/2,
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button11: {
    backgroundColor: '#cbd1d4',
    borderRadius: 400/2,
    height: 35,
    width: 35,
    left: 8, 
    top: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonImportarLista: {
    backgroundColor: '#9dcfd4',
    borderRadius: 1000,
    height: 48,
    width: 47,
    justifyContent: "center",
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottom: {
    backgroundColor: '#FAFAFF',
    justifyContent: 'flex-end',
    marginBottom: 30,
    marginLeft: width-80,
    width: 50,
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    marginTop: 50,
    left: 10,
    padding: 10,
  },
  tituloLista: {
    fontSize: 16,
    marginLeft: 10,
  },
  imagen: {
    height: 50,
    width: 50,
    borderRadius: 400/2,
    marginTop: 0,
  },
  imagen2: {
    height: 30,
    width: 30,
    borderRadius: 400/2,
  },
  imagen3: {
    height: 75,
    width: 75,
    borderRadius: 1000,
    top: 15,
  },
  imagen4: {
    flex: 1,
    justifyContent: "center",
  },
  imagen5: {
    height: 45,
    width: 45,
    borderRadius: 400/2,
    marginTop: 0,
  },
  border: {
    marginTop: 2,
    marginBottom: 2,
    marginLeft: 5,
    borderColor: '#949699',
    backgroundColor:'rgba(52, 52, 52, 0)',
    borderWidth: 1,
    borderRadius: 9,
    width: width-10,
    height: 50,
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
    backgroundColor: '#95bddb',
  },
  pickerStyle: {
    padding: 8,
    marginBottom: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 270,
  },
  pickerStyle2: {
    padding: 8,
    marginBottom: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 270,
  },
  pickerStyle3: {
    padding: 0,
    marginBottom: 45,
    marginTop: 82,
    right: 0,
    borderRadius: 5,
    width: 140,
  },
  pickerStyle4: {
    padding: 0,
    marginBottom: 25,
    marginTop: 30,
    marginLeft: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
});