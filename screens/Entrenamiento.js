import * as eva from "@eva-design/eva";
import 'react-native-gesture-handler';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import Constants from 'expo-constants';

import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, View, BackHandler, Image, TouchableOpacity, Dimensions, 
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
import {List, ListItem, Divider, Icon, Text, Button} from '@ui-kitten/components';
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


export default function Entrenamiento ({route}) {

    const navigation = useNavigation();
    const [modo, setModo] = useState([]);  //guardamos los datos del usuario en un array con nombre: datos[0]
    const [flagPlay, setFlagPlay] = useState(false);
    const {listPlay, itemIdPlay} = route.params;
    const [listas, setListas] = useState([]);
    const [listT, setListT] = useState([]);
    const listaInicialT = JSON.parse(listPlay);
    const [listaActualT, setlistaActualT] = useState('');
    const flatListRef = useRef(null);
    const [flagTiempo, setFlagTiempo] = useState(false);
    const [flagTiempoGuardar, setFlagTiempoGuardar] = useState(false);
    const [flagTiempoPress, setFlagTiempoPress] = useState(false);
    const [flagSaveTime, setFlagSaveTime] = useState(false);
    const [flagOneVideo, setFlagOneVideo] = useState(false);
    const [flagTiempoInicial, setFlagTiempoInicial] = useState(false);
    const [flagButton, setFlagButton] = useState(false);
    const [flagButtonGuardar, setFlagButtonGuardar] = useState(false);
    const [flagTimer, setFlagTimer] = useState(false);
    const [tiempoInicio, setTiempoInicio] = useState("");
    const [tiempoFinal, setTiempoFinal] = useState("");
    const [tiempoTotal, setTiempoTotal] = useState("");
    const [itemPlay, setItemPlay] = useState(false);
    const [statusVideo, setStatusVideo] = useState({});
    let previewVideoPlay = null;
    let youtubeVideoPlay = null;
    let videoGuardar = false;
    let videoSiguiente = false;
    let listaAhora = listPlay;
    const videoLocalRef = useRef(null);

    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [hours, setHours] = useState(0);
    const [customInterval, setCustomInterval] = useState();
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

    let isMounted = true;

    const iconRef = React.useRef();
    const siguienteIcon = (props) => (
      <Icon
        {...props}
        ref={iconRef}
        name='arrow-circle-right'
      />
    );

    const startTimer = () => {
      setCustomInterval(
        setInterval(() => {
          changeTime();
        }, 1000)
      );
    }

    const stopTimer = () => {
      if(customInterval){
        clearInterval(customInterval);
      }
    }

    const clear = () => {
      stopTimer();
      setSeconds(0);
      setMinutes(0);
      setHours(0);
      return;
    }

    const changeTime = () => {     
      setSeconds((prevState) => {
        if((prevState + 1) == 60){
          setMinutes((prevMinutes) => {
            if((minutes + 1) == 60){
              console.log('los minutos previos son: ', prevMinutes)
              console.log('los minutos ahora son: ', minutes)
              setHours((prevHours) => {
                if((hours + 1) == 60){
                  clear();
                  return 0;
                }
                return hours + 1;
              });
              return 0;
            }
            return minutes + 1;
          });
          return 0;
        }
        return prevState + 1;
      });      
    }

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
        let listaf = listT;
        listaf.length=0;
        setListT(listaf);
        setFlagTiempo(false);
        setFlagTiempoGuardar(false);
        setFlagTiempoPress(false);
        setFlagSaveTime(false);
        setFlagOneVideo(false);
        setFlagButton(false);
        setFlagButtonGuardar(false);
        setFlagTiempoInicial(false);
        previewVideoPlay=null;
        youtubeVideoPlay=null;
        videoGuardar=false;
        videoSiguiente=false;
        setCurrentSectionIndex(0);
        
        if(customInterval){
          clearInterval(customInterval);
          setSeconds(0);
          setMinutes(0);
          setHours(0);
        }
              
        const varray = [];
        var f=varray;
        varray.length=0;

        AsyncStorage.setItem("TIEMPO", JSON.stringify(f));
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Lista',
              params: { singleList: ((listaActualT !== '') ? listaActualT : listPlay),
                        itemId: JSON.parse(listPlay).listaid,
                      },
            },
          ],
        })
        navigation.navigate("Lista", {
          singleList: ((listaActualT !== '') ? listaActualT : listPlay),
          itemId: JSON.parse(listPlay).listaid,
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
        /*
        let listaf = listT;
        listaf.length=0;
        setListT(listaf);
        setFlagTiempo(false);
        setFlagTiempoGuardar(false);
        setFlagTiempoPress(false);
        setFlagSaveTime(false);
        setFlagOneVideo(false);
        setFlagButton(false);
        setFlagButtonGuardar(false);
        setFlagTiempoInicial(false);
        previewVideoPlay=null;
        youtubeVideoPlay=null;
        videoGuardar=false;
        videoSiguiente=false;
        setCurrentSectionIndex(0);
        
        if(customInterval){
          clearInterval(customInterval);
          setSeconds(0);
          setMinutes(0);
          setHours(0);
        }
        */
      };
        
      }, [flagButtonGuardar]));


      useEffect(() => {
        //setList(listmenuinicial);
        if(isMounted===true){
        //let listmenu = [''];
        if(flagOneVideo === false && flagTiempoInicial === true){
          //setList((singleList.split('[')[1]).split(','));
          console.log('Se ha abierto listtiempo useeffect')
          onButtonPress();
          let it = itemPlay;
          /*
          for(let i=0; i < listaInicialT.videolista.length; i++){
            if(it.id == JSON.parse(listaInicialT.videolista)[i].id) {
              console.log('el video esta en la lista')
            }
          }
          */
          //setFlagButtonGuardar(true);
          //BackHandler.addEventListener('hardwareBackPress', backAction);
          if(currentSectionIndex >= ((listaActualT !== '') ? 
          (JSON.parse(listaActualT).videolista.length-2) : (listaInicialT.videolista.length-2))) {
            setFlagButtonGuardar(true);
            console.log('se ha pulsado flagbuttonguardar true y el final de la lista useffect flagtiempo')
            /*
            if(customInterval){
              clearInterval(customInterval);
              setSeconds(0);
              setMinutes(0);
              setHours(0);
            }
            */
          }
          if(flagTiempoGuardar === true){
            //setFlagTiempo(false);
            /*
            if(customInterval){
              clearInterval(customInterval);
              setSeconds(0);
              setMinutes(0);
              setHours(0);
            }
            */
            console.log('Se ha borrado listtiempo useeffect')
          }
        }
        if(flagTiempoPress === true){
          guardarTiempoVideo();
        }
        }
        return () => {
          isMounted = false;
        };
  
      }, [flagTiempo]);

  

    const getLista = async() => {
        /*
        var f = [''];
        f.length=0;
        console.log('Al vaciar array datos el resultado es: ', f)  
        setDatos(f);

        await AsyncStorage.setItem("DATOS", JSON.stringify(f));
        */
      try {
        if(flagSaveTime === false){
          console.log('iniciamos play')
          if((listaInicialT.videolista) !== undefined){             
            setListT(listaInicialT.videolista);
            if (listaActualT == ''){
              setlistaActualT(listPlay);
            }
            if(currentSectionIndex!==0 && seconds == 0 && minutes == 0 && hours == 0){
              setCurrentSectionIndex(0);
            }
            setCurrentSectionIndex(0);
            setFlagTiempo(false);
            setFlagTiempoGuardar(false);
            setFlagTiempoPress(false);
            setFlagSaveTime(false);
            setFlagOneVideo(false);
            setFlagButton(false);
            setFlagButtonGuardar(false);
            setFlagTiempoInicial(false);
          }
        }
        if(currentSectionIndex >= ((listaActualT !== '') ? 
        (JSON.parse(listaActualT).videolista.length-1) : (listaInicialT.videolista.length-1))) {
          //setFlagButtonGuardar(true);
          console.log('se ha pulsado flagbuttonguardar true y final de lista getlista')
          /*
          if(customInterval){
            clearInterval(customInterval);
            setSeconds(0);
            setMinutes(0);
            setHours(0);
          }
          */
        }
      } catch (error){
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

  const renderItemPlay = ({ item, index }) => {
    if((JSON.parse(item).videos).includes("file") && isMounted==true){
      previewVideoPlay = JSON.parse(item).videos;
    }
    else {
      youtubeVideoPlay = JSON.parse(item).videos;
    }

    if (currentSectionIndex >= ((listaActualT !== '') ? 
      (JSON.parse(listaActualT).videolista.length-1) : (listaInicialT.videolista.length-1))) {
      videoGuardar = true;
      console.log('SE HA PULSADO VIDEOGUARDAR')
    }
    else {
      videoSiguiente = true;
      console.log('SE HA PULSADO VIDEOSIGUIENTE')
    }
    return(
      <View style={styles.container2}>
        <View style={{marginBottom: 15, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.textTimer}>
            {(hours < 10) ? ("0" + hours) : hours}
            {":"}
            {(minutes < 10) ? ("0" + minutes) : minutes}
            {":"}
            {(seconds < 10) ? ("0" + seconds) : seconds}
          </Text>
        </View>
        <View style={{marginBottom: 15, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.textSeries}>
            {JSON.parse(item).series + "\n"}
            {JSON.parse(item).repeticiones + "\n"}
            {JSON.parse(item).tiempo + "\n"}
          </Text>
        </View>
        
        <View style={{marginTop: 20, marginLeft: 22, alignItems: 'center', justifyContent: 'center'}}>
        {youtubeVideoPlay && <YoutubePlayer
          height={320}
          width={320}
          play={false}
          videoId={JSON.parse(item).videos}
        />}
        </View>
        <View style={{marginTop: 20, marginLeft: 22, alignItems: 'center', justifyContent: 'center'}}>
        {previewVideoPlay &&
          <Video
            ref={videoLocalRef}
            source={{ uri: previewVideoPlay }}
            useNativeControls
            resizeMode="contain"
            isLooping={false}
            isMuted={false}
            style={styles.videoPlayer2}
            onPlaybackStatusUpdate={status => setStatusVideo(() => status)}
        />}
        </View>
        {videoGuardar &&
        ((flagButton === false) ?
        (<Button
          style={{marginLeft: 20, alignItems: 'center', justifyContent: 'center'}}
          onPress={() => {tiempoVideoButton(item)}}>
          Comenzar ejercicio
        </Button>) : 
        (<View style={{marginLeft: 20, alignItems: 'center', justifyContent: 'center'}}>
          <Button style={styles.button}
            onPress={() => {
            console.log('se ha guardado play')
            //guardarTiempoVideo(item);
            //clear();              
            tiempoVideo(item);             
            setFlagTiempoGuardar(true);
            setFlagTiempoPress(true);
            setFlagButtonGuardar(false);             
            //setModalVisiblePlay(!modalVisiblePlay);
            setFlagTiempoInicial(false);
            setFlagTiempo(!flagTiempo);
            setCurrentSectionIndex(0);
            if(customInterval){
              clearInterval(customInterval);
              setSeconds(0);
              setMinutes(0);
              setHours(0);
            }              
            //setFlagList(!flagList);
            let listaf = listT;
            listaf.length=0;
            setListT(listaf);
            isMounted = false;
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Lista',
                  params: { singleList: ((listaActualT !== '') ? listaActualT : listPlay),
                            itemId: JSON.parse(listPlay).listaid,
                          },
                },
              ],
            })
            navigation.navigate("Lista", {
              singleList: ((listaActualT !== '') ? listaActualT : listPlay),
              itemId: JSON.parse(listPlay).listaid,
            });
            
            }}>
            <Text>Guardar</Text>
          </Button>
        </View>))
        }
        {videoSiguiente &&
        ((flagButton === false) ? 
        (<Button
          style={{marginLeft: 20, alignItems: 'center', justifyContent: 'center'}}
          onPress={() => {tiempoVideoButton(item)}}>
          Comenzar ejercicio
        </Button>) :
        (<Button
          style={{marginLeft: 20, alignItems: 'center', justifyContent: 'center'}}
          status='success'
          accessoryRight={siguienteIcon}
          onPress={() => {tiempoVideoPress(item)}}>
          Siguiente
        </Button>)
        )}
      </View>
    );
  }

  const onButtonPress = () => {
    if (currentSectionIndex >= ((listaActualT !== '') ? 
      (JSON.parse(listaActualT).videolista.length-1) : (listaInicialT.videolista.length-1))) {
      console.log('he llegado al final de la lista')
      setFlagButtonGuardar(true);
      setCurrentSectionIndex(0);
      flatListRef.current.scrollToIndex({
        index: currentSectionIndex,
      });        
      /*
      if(customInterval){
        clearInterval(customInterval);
        setSeconds(0);
        setMinutes(0);
        setHours(0);
      }
      */
      return;
    } else if (flatListRef.current){
      // Go to the next item
      console.log('no he llegado al final de la lista, seguimos')
      if (currentSectionIndex >= ((listaActualT !== '') ? 
        (JSON.parse(listaActualT).videolista.length-1) : (listaInicialT.videolista.length-1))) {
        console.log('he llegado al final de la lista2')
        setFlagButtonGuardar(true);
        setCurrentSectionIndex(0);
        flatListRef.current.scrollToIndex({
          index: currentSectionIndex,
        });
        /*
        if(customInterval){
          clearInterval(customInterval);
          setSeconds(0);
          setMinutes(0);
          setHours(0);
        }
        */
        return;
      }
      else {
        
        flatListRef.current.scrollToIndex({
          index: currentSectionIndex + 1,
        });
        
        console.log('EL INDEX ES: ', currentSectionIndex)
        console.log('LA LISTA ES AHORA: ', listaActualT)

        setCurrentSectionIndex(currentSectionIndex + 1);
        
        return;
      }
    }       
    console.log('saliendo del callback')
  }


  const guardarTiempoVideo = async() => {
    try{
      const valorListas = await AsyncStorage.getItem("LISTAS");
      const l = valorListas ? JSON.parse(valorListas) : [];

      const valorTiempo = await AsyncStorage.getItem("TIEMPO");
      const t = valorTiempo ? JSON.parse(valorTiempo) : [];

      //const valorHistorial = await AsyncStorage.getItem("HISTORIAL");
      //const h = valorHistorial ? JSON.parse(valorHistorial) : [];

      var dia = new Date().getDate(); //To get the Current Date
      var mes = new Date().getMonth() + 1; //To get the Current Month
      var año = new Date().getFullYear(); //To get the Current Year
      var fecha = dia + '-' + mes + '-' + año;

      var listaHistorial = {};
      listaHistorial.idHistorial = (Math.round(Math.random() * 1000)).toString();
      listaHistorial.fechaRealizado = fecha;

      let tiempoT = tiempoTotal;
      let horasTotal = '';
      let minutosTotal = '';
      let segundosTotal = '';
      if(tiempoT.split(":")[0] < 10){
        horasTotal = "0" + tiempoT.split(":")[0];
      }
      else{
        horasTotal = tiempoT.split(":")[0];
      }
      if(tiempoT.split(":")[1] < 10){
        minutosTotal = "0" + tiempoT.split(":")[1];
      }
      else{
        minutosTotal = tiempoT.split(":")[1];
      }
      if(tiempoT.split(":")[2] < 10){
        segundosTotal = "0" + tiempoT.split(":")[2];
      }
      else{
        segundosTotal = tiempoT.split(":")[2];
      }

      listaHistorial.tiempoTotal = horasTotal + ":" + minutosTotal + ":" + segundosTotal;
      listaHistorial.tiemposEjercicios = t;    

      //let tiempos = listaHistorial.tiemposEjercicios;
      //tiempos.push(t);

      //listaHistorial.tiemposEjercicios = JSON.stringify(tiempos);

      if(t.length !== 0){
      let jsonListTiempo = null;
      let jsonListTiempoVideos = '';
      let listFilterVideos = t;
      let historialList = '';

      console.log('LOS VIDEOS CON EL TIEMPO SON: ', listFilterVideos)

      if (listaActualT !== '' && listaActualT !== undefined) {              
        jsonListTiempo = JSON.parse(listaActualT);                 

        //console.log('El tiempo de realización es: ', tiempoRealizacion)
      }
      else {              
        jsonListTiempo = listaInicialT;  //listaEm

        //console.log('El tiempo de realización es: ', tiempoRealizacion)
      }

      jsonListTiempoVideos = jsonListTiempo.videolista;
        
      jsonListTiempo.videolista = listFilterVideos;
      let listaNueva = JSON.stringify(jsonListTiempo);
      console.log('LA LISTA DE VIDEOS LLEGA HASTA AQUI')

      let newLists = '';
      let listaH = null;
      let newVideoList = '';

      for (let i = 0; i < l.length; i++){
        if(jsonListTiempo.idlista === (JSON.parse(l[i]).idlista)) {
          
          if (listaActualT !== '' && listaActualT !== undefined) {              
            newVideoList = JSON.parse(listaActualT).videolista;                 
          }
          else {              
            newVideoList = listaInicialT.videolista;  
          }
          
          console.log('LA LISTA DE VIDEOS LLEGA HASTA AQUI2: ', t)

          
          if (listaActualT !== '' && listaActualT !== undefined) {              
            listaH = JSON.parse(listaActualT);                 
  
            //console.log('El tiempo de realización es: ', tiempoRealizacion)
          }
          else {              
            listaH = listaInicialT;  //listaEm
  
            //console.log('El tiempo de realización es: ', tiempoRealizacion)
          }

          let arrayListaH = [];

          if(JSON.parse(l[i]).historial == ''){
            arrayListaH = [];
            console.log('el historial está inicialmente vacío')
          }
          else{
            arrayListaH = JSON.parse(l[i]).historial;
            console.log('existe ya un historial')
          }

          //historialList.push(JSON.stringify(listaHistorial));
          arrayListaH.push(JSON.stringify(listaHistorial));

          listaH.historial = arrayListaH;
          
          break;     
        }
      }
      //setDatList(listFilterVideos);
      //setList(listFilterVideos);
      setFlagSaveTime(true);
      setFlagTiempoPress(false);
      setFlagOneVideo(false);
      //newLists.push(listaNueva); //guardamos la lista en LISTAS

      //l.push(JSON.stringify(listaH));

      if(listaActualT !== '') {
        newLists = l.filter((lista) => lista !== listaActualT);
      }
      else {
        newLists = l.filter((lista) => lista !== listPlay);
      }
      console.log('NEWVIDEOLIST ES: ', newVideoList)

      newLists.push(JSON.stringify(listaH));
      console.log('NEWLISTS ENTRENAMIENTO ES: ', JSON.stringify(newLists))
      const vid = AsyncStorage.getItem("TIEMPO");
      //const v = vid ? JSON.parse(vid) : [];
      const varray = [vid];
      var f=varray;
      f.length=0;
      await AsyncStorage.setItem("TIEMPO", JSON.stringify(f));
      //await AsyncStorage.setItem("HISTORIAL", JSON.stringify(f));
            
      await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));

      await AsyncStorage.getItem("LISTAS").then((listas) => {
        setListas(JSON.parse(listas)); 
        console.log('Las listas definitivas son: ', listas)
        setlistaActualT(listaNueva);
        //setFlagList(!flagList);                           
      });
      
    }
    else {
      console.log('No se ha guardado el tiempo en ninguno de LOS VIDEOS')
      setFlagTiempoPress(false);
    }
      
    } catch(error){
      console.log(error)
    }

  }

  const tiempoVideo = async(item) => {
    try{
      setTiempoFinal(hours + ":" + minutes + ":" + seconds);
      setTiempoTotal(hours + ":" + minutes + ":" + seconds);
      //let tiempoFinalPress = hours + ":" + minutes + ":" + seconds;

      const valorTiempo = await AsyncStorage.getItem("TIEMPO");
      const t = valorTiempo ? JSON.parse(valorTiempo) : [];
           
      if(t.length==0){
        //let listArray = t;
        //let jsonListArray = '';
        //let listVideo = '';
        //let videoArray = '';

        var listaTiempo = {};
        listaTiempo.id = JSON.parse(item).id;
        listaTiempo.series = JSON.parse(item).series;
        listaTiempo.repeticiones = JSON.parse(item).repeticiones;

        let horas = '';
        let minutos = '';
        let segundos = '';
        if(hours < 10){
          horas = "0" + hours;
        }
        else {
          horas = hours;
        }
        if(minutes < 10){
          minutos = "0" + minutes;
        }
        else {
          minutos = minutes;
        }
        if(seconds < 10){
          segundos = "0" + seconds;
        }
        else {
          segundos = seconds;
        }

        listaTiempo.tiempoRealizacion = horas + ":" + minutos + ":" + segundos;
        listaTiempo.tiempoDescanso = '';
        listaTiempo.video = JSON.parse(item).videos;

        let jsonListTiempo = null;
        //let jsonListTiempoVideos = '';
        //let listFilterVideos = t;

        if (listaActualT !== '' && listaActualT !== undefined) {              
          jsonListTiempo = JSON.parse(listaActualT);                 
        }
        else {              
          jsonListTiempo = listaInicialT;
        }

        //jsonListTiempoVideos = jsonListTiempo.videolista;

        let newTiempo6 = t;

        var jsonLista = JSON.stringify(listaTiempo);       

        newTiempo6.push(jsonLista);

        await AsyncStorage.setItem("TIEMPO", JSON.stringify(newTiempo6));

        await AsyncStorage.getItem("TIEMPO").then((tiempo) => {
          console.log('EL TIEMPO AHORA ES GUARDANDO Y DARLE A SIGUIENTE: ', tiempo)
          //setListTiempo(tiempo);
        });

          //videolista = videolista.push(series + '\n' + repeticiones + '\n' + tiempo + '\n' + video(link));
          //const ti = await AsyncStorage.getItem("TIEMPO");
          //const td = ti ? JSON.parse(ti) : [];
          //setListTiempo(listFilterVideos);           
          console.log('Funciona hasta abrirVideo1 videopress: ')
          console.log('El tiempo de realización FINAL del video anterior es videopress: ', 
            listaTiempo.tiempoRealizacion)
          console.log('La lista de tiempos es videopress: ', t)
          setFlagButton(false);
          if(flagOneVideo === false){
            setFlagTiempoInicial(true);
          }
          setFlagTiempo(!flagTiempo);
      }

      else {

        if(tiempoInicio !== ""){
          let listArray = t;
          let listVideo = '';
          let videoArray = '';

          for (let i = 0; i < listaInicialT.videolista.length; i++){
            if((JSON.parse(item).id) == (JSON.parse(listaInicialT.videolista[i]).id)){
              let tiempoEjInicial = tiempoInicio;
              let horasInicial = (tiempoEjInicial.split(":")[0]) * 3600;
              let minutosInicial = tiempoEjInicial.split(":")[1] * 60;
              console.log('minutosInicial en segundos es: ', minutosInicial)
              let segundosInicial = tiempoEjInicial.split(":")[2];

              let segundosTotalActual = (hours * 3600) + (minutes * 60) + seconds;
              let segundosTotalInicial = horasInicial + minutosInicial + segundosInicial;
                  
              let segundosRealizacionTotal = segundosTotalActual - segundosTotalInicial;
              /*
              let horasRealizacion = Math.round(segundosRealizacionTotal/3600);
              let minutosRealizacion = segundosRealizacionTotal % 3600;
              let segundosRealizacion = segundosRealizacionTotal % 60;

              

              if(horasRealizacion < 10){
                horasRealizacion = "0" + horasRealizacion;
              }
              if(minutosRealizacion < 10){
                minutosRealizacion = "0" + minutosRealizacion;
              }
              if(segundosRealizacion < 10){
                segundosRealizacion = "0" + segundosRealizacion;
              }
              */
              listVideo = JSON.parse(listaInicialT.videolista[i]);
              videoArray = JSON.parse(listaInicialT.videolista[i]);

              let horasRealizacion = Math.round(segundosRealizacionTotal/60/60);
              let segundosRhoras = segundosRealizacionTotal - (horasRealizacion * 60 * 60);
              let minutosRealizacion = Math.round(segundosRhoras/60);
              let segundosRminutos = segundosRhoras - (minutosRealizacion * 60);
              //let segundosDescanso = Math.round(segundosDescansoTotal % 60);

              if(horasRealizacion < 10){
                horasRealizacion = "0" + horasRealizacion;
              }
              if(minutosRealizacion < 10){
                minutosRealizacion = "0" + minutosRealizacion;
              }
              if(segundosRminutos < 10){
                segundosRminutos = "0" + segundosRminutos;
              }
              
              listVideo.tiempoRealizacion = horasRealizacion + ":" + minutosRealizacion + ":" + segundosRminutos;
              //videoArray.tiempoRealizacion = horasRealizacion + ":" + minutosRealizacion + ":" + segundosRealizacion;

              break;
            }
          }

          var listaTiempo = {};
          listaTiempo.id = JSON.parse(item).id;
          listaTiempo.series = JSON.parse(item).series;
          listaTiempo.repeticiones = JSON.parse(item).repeticiones;
          if(listVideo !== ''){
            listaTiempo.tiempoRealizacion = listVideo.tiempoRealizacion;
          }
          else{
            listaTiempo.tiempoRealizacion = '';
          }
          listaTiempo.tiempoDescanso = '';
          listaTiempo.video = JSON.parse(item).videos;


        let jsonListTiempo = null;
        //let jsonListTiempoVideos = '';
        //let listFilterVideos = t;

        if (listaActualT !== '' && listaActualT !== undefined) {              
          jsonListTiempo = JSON.parse(listaActualT);                 
        }
        else {              
          jsonListTiempo = listaInicialT;
        }

        //jsonListTiempoVideos = jsonListTiempo.videolista;

        let newTiempo1 = '';

        if(videoArray !== ''){
          //listFilterVideos.push(JSON.stringify(listVideo));
          newTiempo1 = t.filter((lista) => lista !== videoArray);
          //t.push(JSON.stringify(listVideo))
        }

        var jsonLista = JSON.stringify(listaTiempo);       

        newTiempo1.push(jsonLista);

        await AsyncStorage.setItem("TIEMPO", JSON.stringify(newTiempo1));

        await AsyncStorage.getItem("TIEMPO").then((tiempo) => {
          console.log('EL TIEMPO AHORA ES GUARDANDO Y DARLE A SIGUIENTE: ', tiempo)
          //setListTiempo(tiempo);
        });

          //videolista = videolista.push(series + '\n' + repeticiones + '\n' + tiempo + '\n' + video(link));
          //const ti = await AsyncStorage.getItem("TIEMPO");
          //const td = ti ? JSON.parse(ti) : [];
          //setListTiempo(listFilterVideos);           
          console.log('Funciona hasta abrirVideo1 videopress: ')
          console.log('El tiempo de realización FINAL del video anterior es videopress: ', 
            listaTiempo.tiempoRealizacion)
          console.log('La lista de tiempos es videopress: ', t)
          setFlagButton(false);
          if(flagOneVideo === false){
            setFlagTiempoInicial(true);
          }
          setFlagTiempo(!flagTiempo);

        }
      }
      /*
      if(hours === 0 && minutes === 0 && seconds === 0){
        const valorTiempo = await AsyncStorage.getItem("TIEMPO");
        const t = valorTiempo ? JSON.parse(valorTiempo) : [];

        let jsonListTiempo = null;
        let jsonListTiempoVideos = '';
        let listFilterVideos = t;

        if (listaActualT !== '' && listaActualT !== undefined) {              
          jsonListTiempo = JSON.parse(listaActualT);                 

          //console.log('El tiempo de realización es: ', tiempoRealizacion)
        }
        else {              
          jsonListTiempo = listaInicialT;  //listaEm

          //console.log('El tiempo de realización es: ', tiempoRealizacion)
        }

        jsonListTiempoVideos = jsonListTiempo.videolista;

        for (let i = 0; i < jsonListTiempo.videolista.length; i++){
          if((JSON.parse(item).id) == (JSON.parse(jsonListTiempoVideos[i]).id)){
            if(listFilterVideos.length > 0){
              listFilterVideos = listFilterVideos.filter((lista) => ((JSON.parse(lista).id) !== 
              (JSON.parse(jsonListTiempoVideos[i]).id)));
            }
            let videoItem = JSON.parse(item);

            videoItem.tiempoRealizacion = JSON.parse(item).tiempoRealizacion;
            
            if(listFilterVideos.length > 0){
              listFilterVideos.push(JSON.stringify(videoItem));
              //t.push(JSON.stringify(videoItem))
            }
            //await AsyncStorage.setItem("TIEMPO", JSON.stringify(listFilterVideos));
            console.log('no se ha guardado el tiempo de realización tiempovideo')
            console.log('La lista de tiempos es si no se ha guardado el tiempovideo: ', listFilterVideos)
            if(flagTiempo === false){
              setFlagOneVideo(true);
              setFlagButton(false);
              setFlagTiempo(!flagTiempo);
            }
          }
        }
      }
      else {
      const valorTiempo = await AsyncStorage.getItem("TIEMPO");
      const t = valorTiempo ? JSON.parse(valorTiempo) : [];

      let jsonListTiempo = null;
      let jsonListTiempoVideos = '';
      let listFilterVideos = t;

      if (listaActualT !== '' && listaActualT !== undefined) {              
        jsonListTiempo = JSON.parse(listaActualT);                 

        //console.log('El tiempo de realización es: ', tiempoRealizacion)
      }
      else {              
        jsonListTiempo = listaInicialT;  //listaEm

        //console.log('El tiempo de realización es: ', tiempoRealizacion)
      }

      jsonListTiempoVideos = jsonListTiempo.videolista;

      for (let i = 0; i < jsonListTiempo.videolista.length; i++){
        if((JSON.parse(item).id) == (JSON.parse(jsonListTiempoVideos[i]).id)){
          listFilterVideos = listFilterVideos.filter((lista) => ((JSON.parse(lista).id) !== 
            (JSON.parse(jsonListTiempoVideos[i]).id)));
          let videoItem = JSON.parse(item);
          let horas = '';
          let minutos = '';
          let segundos = '';
          if(hours<10){
            horas = "0" + hours;             
          }
          else {
            horas = hours;
          }
          if(minutes<10){
            minutos = "0" + minutes;             
          }
          else {
            minutos = minutes;
          }
          if(seconds<10){
            segundos = "0" + seconds;             
          }
          else {
            segundos = seconds;
          }

          videoItem.tiempoRealizacion = horas + ":" + minutos + ":" + segundos;
          
          if(listFilterVideos){
            listFilterVideos.push(JSON.stringify(videoItem));
            //t.push(JSON.stringify(videoItem))
          }
          //await AsyncStorage.setItem("TIEMPO", JSON.stringify(listFilterVideos));
          await AsyncStorage.getItem("TIEMPO").then((tiempo) => {
            //setListTiempo(tiempo);
          });
          //videolista = videolista.push(series + '\n' + repeticiones + '\n' + tiempo + '\n' + video(link));
          //const ti = await AsyncStorage.getItem("TIEMPO");
          //const td = ti ? JSON.parse(ti) : [];
          //setListTiempo(listFilterVideos);           
          console.log('Funciona hasta abrirVideo1 video: ', JSON.parse(jsonListTiempo.videolista[i]).tiempoRealizacion)
          console.log('El tiempo de realización FINAL del video es: ', videoItem.tiempoRealizacion)
          console.log('La lista de tiempos es video: ', listFilterVideos)
          if(flagTiempo === false){
            setFlagOneVideo(true);
            setFlagButton(false);
            setFlagTiempo(!flagTiempo);
          }
        }              
      }        

      }
      */


    } catch(error){
      console.log(error)
    }
  }


  const tiempoVideoPress = async(item) => {
    try{
      setTiempoFinal(hours + ":" + minutes + ":" + seconds);

      //let tiempoFinalPress = hours + ":" + minutes + ":" + seconds;

      const valorTiempo = await AsyncStorage.getItem("TIEMPO");
      const t = valorTiempo ? JSON.parse(valorTiempo) : [];
           
      if(t.length==0){
        //let listArray = t;
        //let jsonListArray = '';
        //let listVideo = '';
        //let videoArray = '';

        var listaTiempo = {};
        listaTiempo.id = JSON.parse(item).id;
        listaTiempo.series = JSON.parse(item).series;
        listaTiempo.repeticiones = JSON.parse(item).repeticiones;

        let horas = '';
        let minutos = '';
        let segundos = '';
        if(hours < 10){
          horas = "0" + hours;
        }
        else {
          horas = hours;
        }
        if(minutes < 10){
          minutos = "0" + minutes;
        }
        else {
          minutos = minutes;
        }
        if(seconds < 10){
          segundos = "0" + seconds;
        }
        else {
          segundos = seconds;
        }

        listaTiempo.tiempoRealizacion = horas + ":" + minutos + ":" + segundos;
        listaTiempo.tiempoDescanso = '';
        listaTiempo.video = JSON.parse(item).videos;

        let jsonListTiempo = null;
        //let jsonListTiempoVideos = '';
        //let listFilterVideos = t;

        if (listaActualT !== '' && listaActualT !== undefined) {              
          jsonListTiempo = JSON.parse(listaActualT);                 
        }
        else {              
          jsonListTiempo = listaInicialT;
        }

        //jsonListTiempoVideos = jsonListTiempo.videolista;

        let newTiempo3 = t;

        var jsonLista = JSON.stringify(listaTiempo);       

        newTiempo3.push(jsonLista);

        await AsyncStorage.setItem("TIEMPO", JSON.stringify(newTiempo3));

        await AsyncStorage.getItem("TIEMPO").then((tiempo) => {
          console.log('EL TIEMPO AHORA ES GUARDANDO Y DARLE A SIGUIENTE: ', tiempo)
          //setListTiempo(tiempo);
        });

          //videolista = videolista.push(series + '\n' + repeticiones + '\n' + tiempo + '\n' + video(link));
          //const ti = await AsyncStorage.getItem("TIEMPO");
          //const td = ti ? JSON.parse(ti) : [];
          //setListTiempo(listFilterVideos);           
          console.log('Funciona hasta abrirVideo1 videopress: ')
          console.log('El tiempo de realización FINAL del video anterior es videopress: ', 
            listaTiempo.tiempoRealizacion)
          console.log('La lista de tiempos es videopress: ', t)
          setFlagButton(false);
          if(flagOneVideo === false){
            setFlagTiempoInicial(true);
          }
          setFlagTiempo(!flagTiempo);
      }

      else {

        if(tiempoInicio !== ""){
          let listArray = t;
          let listVideo = '';
          let videoArray = '';

          for (let i = 0; i < listaInicialT.videolista.length; i++){
            if((JSON.parse(item).id) == (JSON.parse(listaInicialT.videolista[i]).id)){
              let tiempoEjInicial = tiempoInicio;
              let horasInicial = (tiempoEjInicial.split(":")[0]) * 3600;
              let minutosInicial = tiempoEjInicial.split(":")[1] * 60;
              console.log('minutosInicial en segundos es: ', minutosInicial)
              let segundosInicial = tiempoEjInicial.split(":")[2];

              let segundosTotalActual = (hours * 3600) + (minutes * 60) + seconds;
              let segundosTotalInicial = horasInicial + minutosInicial + segundosInicial;
                  
              let segundosRealizacionTotal = segundosTotalActual - segundosTotalInicial;
              /*
              let horasRealizacion = Math.round(segundosRealizacionTotal/3600);
              let minutosRealizacion = segundosRealizacionTotal % 3600;
              let segundosRealizacion = segundosRealizacionTotal % 60;

              if(horasRealizacion < 10){
                horasRealizacion = "0" + horasRealizacion;
              }
              if(minutosRealizacion < 10){
                minutosRealizacion = "0" + minutosRealizacion;
              }
              if(segundosRealizacion < 10){
                segundosRealizacion = "0" + segundosRealizacion;
              }
              */

              listVideo = JSON.parse(listaInicialT.videolista[i]);
              videoArray = JSON.parse(listaInicialT.videolista[i]);

              let horasRealizacion = Math.round(segundosRealizacionTotal/60/60);
              let segundosRhoras = segundosRealizacionTotal - (horasRealizacion * 60 * 60);
              let minutosRealizacion = Math.round(segundosRhoras/60);
              let segundosRminutos = segundosRhoras - (minutosRealizacion * 60);
              //let segundosDescanso = Math.round(segundosDescansoTotal % 60);

              if(horasRealizacion < 10){
                horasRealizacion = "0" + horasRealizacion;
              }
              if(minutosRealizacion < 10){
                minutosRealizacion = "0" + minutosRealizacion;
              }
              if(segundosRminutos < 10){
                segundosRminutos = "0" + segundosRminutos;
              }
              
              listVideo.tiempoRealizacion = horasRealizacion + ":" + minutosRealizacion + ":" + segundosRminutos;
              //videoArray.tiempoRealizacion = horasRealizacion + ":" + minutosRealizacion + ":" + segundosRealizacion;

              break;
            }
          }

          var listaTiempo = {};
          listaTiempo.id = JSON.parse(item).id;
          listaTiempo.series = JSON.parse(item).series;
          listaTiempo.repeticiones = JSON.parse(item).repeticiones;
          if(listVideo !== ''){
            listaTiempo.tiempoRealizacion = listVideo.tiempoRealizacion;
          }
          else{
            listaTiempo.tiempoRealizacion = '';
          }
          listaTiempo.tiempoDescanso = '';
          listaTiempo.video = JSON.parse(item).videos;


        let jsonListTiempo = null;
        //let jsonListTiempoVideos = '';
        //let listFilterVideos = t;

        if (listaActualT !== '' && listaActualT !== undefined) {              
          jsonListTiempo = JSON.parse(listaActualT);                 
        }
        else {              
          jsonListTiempo = listaInicialT;
        }

        //jsonListTiempoVideos = jsonListTiempo.videolista;

        let newTiempo4 = '';

        if(videoArray !== ''){
          //listFilterVideos.push(JSON.stringify(listVideo));
          newTiempo4 = t.filter((lista) => lista !== videoArray);
          //t.push(JSON.stringify(listVideo))
        }

        var jsonLista = JSON.stringify(listaTiempo);       

        newTiempo4.push(jsonLista);

        await AsyncStorage.setItem("TIEMPO", JSON.stringify(newTiempo4));

        await AsyncStorage.getItem("TIEMPO").then((tiempo) => {
          console.log('EL TIEMPO AHORA ES GUARDANDO Y DARLE A SIGUIENTE: ', tiempo)
          //setListTiempo(tiempo);
        });

          //videolista = videolista.push(series + '\n' + repeticiones + '\n' + tiempo + '\n' + video(link));
          //const ti = await AsyncStorage.getItem("TIEMPO");
          //const td = ti ? JSON.parse(ti) : [];
          //setListTiempo(listFilterVideos);           
          console.log('Funciona hasta abrirVideo1 videopress: ')
          console.log('El tiempo de realización FINAL del video anterior es videopress: ', 
            listaTiempo.tiempoRealizacion)
          console.log('La lista de tiempos es videopress: ', t)
          setFlagButton(false);
          if(flagOneVideo === false){
            setFlagTiempoInicial(true);
          }
          setFlagTiempo(!flagTiempo);

        }
      }

      /*
      if(hours === 0 && minutes === 0 && seconds === 0){
      const valorTiempo = await AsyncStorage.getItem("TIEMPO");
      const t = valorTiempo ? JSON.parse(valorTiempo) : [];

      let jsonListTiempo = null;
      let jsonListTiempoVideos = '';
      let listFilterVideos = t;
      let listArray = t;

      if (listaActualT !== '' && listaActualT !== undefined) {              
        jsonListTiempo = JSON.parse(listaActualT);                 

        //console.log('El tiempo de realización es: ', tiempoRealizacion)
      }
      else {              
        jsonListTiempo = listaInicialT;  //listaEm

        //console.log('El tiempo de realización es: ', tiempoRealizacion)
      }

      jsonListTiempoVideos = jsonListTiempo.videolista;

      for (let i = 0; i < jsonListTiempo.videolista.length; i++){
        if((JSON.parse(item).id) == (JSON.parse(jsonListTiempoVideos[i]).id)){
          listFilterVideos = jsonListTiempo.videolista.filter((lista) => ((JSON.parse(lista).id) !== 
            (JSON.parse(jsonListTiempoVideos[i]).id)));
          let videoItem = JSON.parse(item);

          videoItem.tiempoRealizacion = JSON.parse(item).tiempoRealizacion;
          
          for (let i = 0; i < listArray.length; i++){
            if((JSON.parse(listArray[i]).id) == (JSON.parse(jsonListTiempoVideos[i]).id)){
              let tiempoEjRealizado = JSON.parse(listArray[i]).tiempoRealizacion;
              let horaRealizado = tiempoEjRealizado.split(":")[0]
              JSON.parse(listArray[i]).tiempoDescanso = 0;
            }
          }
          
          if(listFilterVideos){
            listFilterVideos.push(JSON.stringify(videoItem));
            //t.push(JSON.stringify(videoItem))
          }
          //await AsyncStorage.setItem("TIEMPO", JSON.stringify(listFilterVideos));
          await AsyncStorage.getItem("TIEMPO").then((tiempo) => {
            console.log('EL TIEMPO AHORA ES SIN GUARDAR Y DARLE A SIGUIENTE: ', tiempo)
            //setListTiempo(tiempo);
          });
          console.log('no se ha guardado el tiempo de realización tiempovideopress')
          console.log('La lista de tiempos es si no se ha guardado el tiempovideopress: ', listFilterVideos)
          setFlagButton(false);
          if(flagOneVideo === false){
            setFlagTiempoInicial(true);
          }
          setFlagTiempo(!flagTiempo);
        }
      }
      }
      else {
      const valorTiempo = await AsyncStorage.getItem("TIEMPO");
      const t = valorTiempo ? JSON.parse(valorTiempo) : [];

      let jsonListTiempo = null;
      let jsonListTiempoVideos = '';
      let listFilterVideos = t;
      let listArray = t;
      let jsonListArray = '';

      if (listaActualT !== '' && listaActualT !== undefined) {              
        jsonListTiempo = JSON.parse(listaActualT);                 

        //console.log('El tiempo de realización es: ', tiempoRealizacion)
      }
      else {              
        jsonListTiempo = listaInicialT;  //listaEm

        //console.log('El tiempo de realización es: ', tiempoRealizacion)
      }

      jsonListTiempoVideos = jsonListTiempo.videolista;

      for (let i = 0; i < jsonListTiempo.videolista.length; i++){
        if((JSON.parse(item).id) == (JSON.parse(jsonListTiempoVideos[i]).id)){
          listFilterVideos = jsonListTiempo.videolista.filter((lista) => ((JSON.parse(lista).id) !== 
            (JSON.parse(jsonListTiempoVideos[i]).id)));
          let videoItem = JSON.parse(item);
          let horas = '';
          let minutos = '';
          let segundos = '';
          if(hours<10){
            horas = "0" + hours;             
          }
          else {
            horas = hours;
          }
          if(minutes<10){
            minutos = "0" + minutes;             
          }
          else {
            minutos = minutes;
          }
          if(seconds<10){
            segundos = "0" + seconds;             
          }
          else {
            segundos = seconds;
          }

          videoItem.tiempoRealizacion = horas + ":" + minutos + ":" + segundos;

          for (let i = 0; i < listArray.length; i++){
            if((JSON.parse(item).id) == (JSON.parse(listArray[i]).id)){
              let tiempoEjRealizado = JSON.parse(listArray[i]).tiempoRealizacion;
              let horasRealizado = (tiempoEjRealizado.split(":")[0]) * 3600;
              let minutosRealizado = tiempoEjRealizado.split(":")[1] * 60;
              let segundosRealizado = tiempoEjRealizado.split(":")[2];

              let segundosTotalActual = (horas * 3600) + (minutos * 60) + (segundos * 60);
              let segundosTotalRealizado = horasRealizado + minutosRealizado + segundosRealizado;
              
              let segundosFinal = segundosTotalActual - segundosTotalRealizado;

              let horasDescanso = segundosFinal/3600;
              let minutosDescanso = segundosFinal % 3600;
              let segundosDescanso = segundosFinal % 60;

              let listVideo = JSON.parse(listArray[i]);
              listVideo.tiempoDescanso = horasDescanso + ":" + minutosDescanso + ":" + segundosDescanso;

              jsonListArray = JSON.stringify(listVideo);
              console.log('El tiempo de descanso final es: ', JSON.parse(listArray[i]).tiempoDescanso)
              break;
            }
          }

          if(listFilterVideos){
            listFilterVideos.push(JSON.stringify(videoItem));
            //t.push(JSON.stringify(videoItem))
          }

          let newTime = t.filter((lista) => ((JSON.parse(lista).id) !== 
          (JSON.parse(jsonListTiempoVideos[i]).id)));
          newTime.push(jsonListArray);

          await AsyncStorage.setItem("TIEMPO", JSON.stringify(newTime));
          await AsyncStorage.getItem("TIEMPO").then((tiempo) => {
            console.log('EL TIEMPO AHORA ES GUARDANDO Y DARLE A SIGUIENTE: ', tiempo)
            //setListTiempo(tiempo);
          });
          //videolista = videolista.push(series + '\n' + repeticiones + '\n' + tiempo + '\n' + video(link));
          //const ti = await AsyncStorage.getItem("TIEMPO");
          //const td = ti ? JSON.parse(ti) : [];
          //setListTiempo(listFilterVideos);           
          console.log('Funciona hasta abrirVideo1 videopress: ')
          console.log('El tiempo de realización FINAL del video es videopress: ', videoItem.tiempoRealizacion)
          console.log('La lista de tiempos es videopress: ', t)
          let it = item;
          setItemPlay(it);
          if(flagOneVideo === false){
            setFlagTiempoInicial(true);
          }
          setFlagButton(false);
          setFlagTiempo(!flagTiempo);
        }              
      }        

      }
      */
    } catch(error){
      console.log(error)
    }
  }


  const tiempoVideoButton = async(item) => {
    try{
      setTiempoInicio(hours + ":" + minutes + ":" + seconds);

      const valorTiempo = await AsyncStorage.getItem("TIEMPO");
      const t = valorTiempo ? JSON.parse(valorTiempo) : [];
           
      if(t.length==0){
        startTimer();
        setFlagSaveTime(true);
        setFlagButton(true);
      }
      else {
        if(tiempoFinal !== ""){

          let listArray = t;
          let jsonListArray = '';
          let listVideo = '';
          let videoArray = '';

          for (let i = 0; i < listaInicialT.videolista.length; i++){
            if(listaActualT == ''){
              if((JSON.parse(item).id) == (JSON.parse(listaInicialT.videolista[i]).id)){
                let tiempoEjFinal = tiempoFinal;
                let horasFinal = (tiempoEjFinal.split(":")[0]) * 3600;
                let minutosFinal = (tiempoEjFinal.split(":")[1]) * 60;
                console.log('minutosFinal es: ', minutosFinal)
                let segundosFinal = tiempoEjFinal.split(":")[2];

                let segundosTotalActual = (hours * 3600) + (minutes * 60) + seconds;
                let segundosTotalFinal = horasFinal + minutosFinal + segundosFinal;
                
                let segundosDescansoTotal = segundosTotalActual - segundosTotalFinal;

                let horasDescanso = Math.round(segundosDescansoTotal/60/60);
                let segundosDhoras = segundosDescansoTotal - (horasDescanso * 60 * 60);
                let minutosDescanso = Math.round(segundosDhoras/60);
                let segundosDminutos = segundosDhoras - (minutosDescanso * 60);
                //let segundosDescanso = Math.round(segundosDescansoTotal % 60);

                videoArray = listArray[i-1];
                listVideo = JSON.parse(listArray[i-1]);

                if(horasDescanso < 10){
                  horasDescanso = "0" + horasDescanso;
                }
                if(minutosDescanso < 10){
                  minutosDescanso = "0" + minutosDescanso;
                }
                if(segundosDminutos < 10){
                  segundosDminutos = "0" + segundosDminutos;
                }
                listVideo.tiempoDescanso = horasDescanso + ":" + minutosDescanso + ":" + segundosDminutos;

                jsonListArray = JSON.stringify(listVideo);
                console.log('El tiempo de descanso final es: ', listVideo.tiempoDescanso)
                break;
              }
            }
            else {
              if((JSON.parse(item).id) == (JSON.parse((JSON.parse(listaActualT)).videolista[i]).id)){
                let tiempoEjFinal = tiempoFinal;
                let horasFinal = (tiempoEjFinal.split(":")[0]) * 3600;
                let minutosFinal = tiempoEjFinal.split(":")[1] * 60;
                console.log('minutosFinal es: ', minutosFinal)
                let segundosFinal = tiempoEjFinal.split(":")[2];

                let segundosTotalActual = (hours * 3600) + (minutes * 60) + seconds;
                let segundosTotalFinal = horasFinal + minutosFinal + segundosFinal;
                
                let segundosDescansoTotal = segundosTotalActual - segundosTotalFinal;
                /*
                let horasDescanso = Math.round(segundosDescansoTotal/3600);
                let minutosDescanso = Math.round(segundosDescansoTotal % 3600);
                let segundosDescanso = Math.round(segundosDescansoTotal % 60);

                videoArray = listArray[i-1];
                listVideo = JSON.parse(listArray[i-1]);

                if(horasDescanso < 10){
                  horasDescanso = "0" + horasDescanso;
                }
                if(minutosDescanso < 10){
                  minutosDescanso = "0" + minutosDescanso;
                }
                if(segundosDescanso < 10){
                  segundosDescanso = "0" + segundosDescanso;
                }
                listVideo.tiempoDescanso = horasDescanso + ":" + minutosDescanso + ":" + segundosDescanso;
                */
                let horasDescanso = Math.round(segundosDescansoTotal/60/60);
                let segundosDhoras = segundosDescansoTotal - (horasDescanso * 60 * 60);
                let minutosDescanso = Math.round(segundosDhoras/60);
                let segundosDminutos = segundosDhoras - (minutosDescanso * 60);
                //let segundosDescanso = Math.round(segundosDescansoTotal % 60);

                videoArray = listArray[i-1];
                listVideo = JSON.parse(listArray[i-1]);

                if(horasDescanso < 10){
                  horasDescanso = "0" + horasDescanso;
                }
                if(minutosDescanso < 10){
                  minutosDescanso = "0" + minutosDescanso;
                }
                if(segundosDminutos < 10){
                  segundosDminutos = "0" + segundosDminutos;
                }
                listVideo.tiempoDescanso = horasDescanso + ":" + minutosDescanso + ":" + segundosDminutos;
                jsonListArray = JSON.stringify(listVideo);
                console.log('El tiempo de descanso final es: ', listVideo.tiempoDescanso)
                break;
                }
              }
          }

          var listaTiempo = {};
          listaTiempo.id = JSON.parse(jsonListArray).id;
          listaTiempo.series = JSON.parse(jsonListArray).series;
          listaTiempo.repeticiones = JSON.parse(jsonListArray).repeticiones;
          listaTiempo.tiempoRealizacion = JSON.parse(jsonListArray).tiempoRealizacion;
          if(jsonListArray !== ''){
            listaTiempo.tiempoDescanso = JSON.parse(jsonListArray).tiempoDescanso;
          }
          else {
            listaTiempo.tiempoDescanso = '';
          }
          listaTiempo.video = JSON.parse(item).videos;

          let jsonListTiempo = null;
          let jsonListTiempoVideos = '';
          let listFilterVideos = t;

          if (listaActualT !== '' && listaActualT !== undefined) {              
            jsonListTiempo = JSON.parse(listaActualT);                 
          }
          else {              
            jsonListTiempo = listaInicialT;
          }

          //jsonListTiempoVideos = jsonListTiempo.videolista;

          let newTiempo5 = '';

          if(listVideo !== ''){
            //listFilterVideos.push(JSON.stringify(listVideo));
            newTiempo5 = t.filter((lista) => lista !== videoArray);
            //t.push(JSON.stringify(listVideo))
          }

          var jsonLista = JSON.stringify(listaTiempo);       

          newTiempo5.push(jsonLista);
          await AsyncStorage.setItem("TIEMPO", JSON.stringify(newTiempo5));

          await AsyncStorage.getItem("TIEMPO").then((tiempo) => {
            console.log('EL TIEMPO AHORA ES GUARDANDO Y DARLE A EJERCICIO TERMINADO: ', tiempo)
            //setListTiempo(tiempo);
          });

          //videolista = videolista.push(series + '\n' + repeticiones + '\n' + tiempo + '\n' + video(link));
          //const ti = await AsyncStorage.getItem("TIEMPO");
          //const td = ti ? JSON.parse(ti) : [];
          //setListTiempo(listFilterVideos);           
          console.log('Funciona hasta abrirVideo1 videobutton: ')
          console.log('El tiempo de realización FINAL del video anterior es videobutton: ', 
            listaTiempo.tiempoRealizacion)
          console.log('La lista de tiempos es videobutton: ', t)
          setFlagSaveTime(true);
          setFlagButton(true);

        }
      }
      /*
      var listaTiempo = {};
      listaTiempo.id = JSON.parse(item).id;
      listaTiempo.series = JSON.parse(item).series;
      listaTiempo.repeticiones = JSON.parse(item).repeticiones;
      listaTiempo.tiempoRealizacion = '';
      listaTiempo.tiempoDescanso = '';

      if(hours === 0 && minutes === 0 && seconds === 0){
      const valorTiempo = await AsyncStorage.getItem("TIEMPO");
      const t = valorTiempo ? JSON.parse(valorTiempo) : [];

      let jsonListTiempo = null;
      let jsonListTiempoVideos = '';
      let listFilterVideos = t;
      //let listArray = t;

      if (listaActualT !== '' && listaActualT !== undefined) {              
        jsonListTiempo = JSON.parse(listaActualT);                 

        //console.log('El tiempo de realización es: ', tiempoRealizacion)
      }
      else {              
        jsonListTiempo = listaInicialT;  //listaEm

        //console.log('El tiempo de realización es: ', tiempoRealizacion)
      }

      jsonListTiempoVideos = jsonListTiempo.videolista;

      for (let i = 0; i < jsonListTiempo.videolista.length; i++){
        if((JSON.parse(item).id) == (JSON.parse(jsonListTiempoVideos[i]).id)){
          listFilterVideos = jsonListTiempo.videolista.filter((lista) => ((JSON.parse(lista).id) !== 
            (JSON.parse(jsonListTiempoVideos[i]).id)));
          let videoItem = JSON.parse(item);

          videoItem.tiempoRealizacion = JSON.parse(item).tiempoRealizacion;
          listaTiempo.tiempoRealizacion = JSON.parse(item).tiempoRealizacion;

          var jsonLista = JSON.stringify(listaTiempo);

          if(listFilterVideos){
            listFilterVideos.push(JSON.stringify(videoItem));
            
            //t.push(JSON.stringify(videoItem))
          }

          //t.push(jsonLista);
          //await AsyncStorage.setItem("TIEMPO", JSON.stringify(t));
          
          await AsyncStorage.getItem("TIEMPO").then((tiempo) => {
            console.log('EL TIEMPO AHORA ES SIN GUARDAR Y DARLE A EJERCICIO TERMINADO: ', tiempo)
            //setListTiempo(tiempo);
          });
          console.log('no se ha guardado el tiempo de realización tiempovideopress')
          console.log('La lista de tiempos es si no se ha guardado el tiempovideopress: ', t)
          setFlagSaveTime(true);
          setFlagButton(true);
          break;
        }
      }
      }
      else {
      const valorTiempo = await AsyncStorage.getItem("TIEMPO");
      const t = valorTiempo ? JSON.parse(valorTiempo) : [];
      
      let jsonListTiempo = null;
      let jsonListTiempoVideos = '';
      let listFilterVideos = t;

      if (listaActualT !== '' && listaActualT !== undefined) {              
        jsonListTiempo = JSON.parse(listaActualT);                 

        //console.log('El tiempo de realización es: ', tiempoRealizacion)
      }
      else {              
        jsonListTiempo = listaInicialT;  //listaEm

        //console.log('El tiempo de realización es: ', tiempoRealizacion)
      }

      jsonListTiempoVideos = jsonListTiempo.videolista;

      for (let i = 0; i < jsonListTiempo.videolista.length; i++){
        if((JSON.parse(item).id) == (JSON.parse(jsonListTiempoVideos[i]).id)){
          listFilterVideos = jsonListTiempo.videolista.filter((lista) => ((JSON.parse(lista).id) !== 
            (JSON.parse(jsonListTiempoVideos[i]).id)));
          let videoItem = JSON.parse(item);
          let horas = '';
          let minutos = '';
          let segundos = '';
          if(hours<10){
            horas = "0" + hours;             
          }
          else {
            horas = hours;
          }
          if(minutes<10){
            minutos = "0" + minutes;             
          }
          else {
            minutos = minutes;
          }
          if(seconds<10){
            segundos = "0" + seconds;             
          }
          else {
            segundos = seconds;
          }

          videoItem.tiempoRealizacion = horas + ":" + minutos + ":" + segundos;
          listaTiempo.tiempoRealizacion = horas + ":" + minutos + ":" + segundos;

          var jsonLista = JSON.stringify(listaTiempo);

          if(listFilterVideos){
            listFilterVideos.push(JSON.stringify(videoItem));
            //t.push(JSON.stringify(videoItem))
          }
          t.push(jsonLista);
          await AsyncStorage.setItem("TIEMPO", JSON.stringify(t));

          await AsyncStorage.getItem("TIEMPO").then((tiempo) => {
            console.log('EL TIEMPO AHORA ES GUARDANDO Y DARLE A EJERCICIO TERMINADO: ', tiempo)
            //setListTiempo(tiempo);
          });

          //videolista = videolista.push(series + '\n' + repeticiones + '\n' + tiempo + '\n' + video(link));
          //const ti = await AsyncStorage.getItem("TIEMPO");
          //const td = ti ? JSON.parse(ti) : [];
          //setListTiempo(listFilterVideos);           
          console.log('Funciona hasta abrirVideo1 videopress: ')
          console.log('El tiempo de realización FINAL del video es videopress: ', videoItem.tiempoRealizacion)
          console.log('La lista de tiempos es videopress: ', t)
          setFlagSaveTime(true);
          setFlagButton(true);
          break;
        }              
      }        

      }
      */
    } catch(error){
      console.log(error)
    }
  }

  const cancelarEntrenamiento = async() => {
    console.log('se ha cancelado el entrenamiento')
      
    setFlagPlay(!flagPlay);
    isMounted = false;
    let listaf = listT;
    listaf.length=0;
    setListT(listaf);
    setFlagTiempo(false);
    setFlagTiempoGuardar(false);
    setFlagTiempoPress(false);
    setFlagSaveTime(false);
    setFlagOneVideo(false);
    setFlagButton(false);
    setFlagButtonGuardar(false);
    setFlagTiempoInicial(false);
    previewVideoPlay=null;
    youtubeVideoPlay=null;
    videoGuardar=false;
    videoSiguiente=false;
    setCurrentSectionIndex(0);
    if(customInterval){
      clearInterval(customInterval);
      setSeconds(0);
      setMinutes(0);
      setHours(0);
    }
    
    const varray = [];
    var f=varray;
    varray.length=0;
    
    AsyncStorage.setItem("TIEMPO", JSON.stringify(f));
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Lista',
          params: { singleList: ((listaActualT !== '') ? listaActualT : listPlay),
                    itemId: JSON.parse(listPlay).listaid,
                  },
        },
      ],
    })
    navigation.navigate("Lista", {
      singleList: ((listaActualT !== '') ? listaActualT : listPlay),
      itemId: JSON.parse(listPlay).listaid,
    });
  }



  return (
    <View style={styles.container}>
      <View style={styles.modalStyle2}>
        <FlatList
          ref={flatListRef}
          pagingEnabled
          horizontal
          scrollEnabled={false}
          initialScrollIndex={0}
          extraData={flagButtonGuardar}
          data={listaInicialT.videolista}
          keyExtractor={( item , index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItemPlay}
        />
        <Button style={styles.button}
          onPress={() => {
            Alert.alert('',
            "¿Está seguro de cancelar el entrenamiento?", [
                {
                text: 'No',
                onPress: () => null,
                style:"cancel"
                },
                {text: "Sí", onPress: () => {cancelarEntrenamiento();}}
            ]
            );
          }}>
            <Text>Cancelar</Text>
        </Button>
      </View>
    </View>
  );
}

/*
        <View style={styles.buttonContainer}>
          <Button title="start"
            onPress={startTimer}>
              START
          </Button>
          <Button title="stop"
            onPress={stopTimer}>
              STOP
          </Button>
          <Button title="reset"
            onPress={clear}>
              RESET
          </Button>
        </View>
*/

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      //color: "white",
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
  },
  container2: {
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
  button: {
    backgroundColor: '#1B4B95',
    padding: 8,
    marginBottom: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
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
  bottom: {
    flexDirection: 'row',
    marginBottom: 36,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginTop: 30,
    right: 10,
    marginBottom: 20,
    color: 'black',
  },
  titleVideo: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
    color: 'black',
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
    borderColor: '#8bbdf0',
    borderWidth: 1,
    borderRadius: 9,
    width: width,
    height: Dimensions.get("window").height,
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#8bbdf0',
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
    width: 320,
    height: 200,
    marginBottom: 40,
  },
  textTimer: {
    fontSize: 30,
    marginLeft: 20,
    marginBottom: 10,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  textSeries: {
    fontSize: 22,
    marginLeft: 40,
    marginTop: 10,
    alignItems: 'center', 
    justifyContent: 'center',
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
