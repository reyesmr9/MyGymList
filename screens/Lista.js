import 'react-native-gesture-handler';
import React, {useState, useEffect, useRef} from 'react';
import * as Sharing from 'expo-sharing';
import {StyleSheet, Modal, TextInput, View, Image, ImageBackground, TouchableOpacity, 
  Alert, Platform, BackHandler, Dimensions, PermissionsAndroid} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import YoutubePlayer from 'react-native-youtube-iframe';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { FlatList } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Imagenes } from '../components/Images';
import { Video} from 'expo-av';
import { Camera } from 'expo-camera';
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from 'react-native-root-toast';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import { Button, Icon, Text } from "@ui-kitten/components";
import DropDownPicker from 'react-native-dropdown-picker';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

Notifications.setNotificationHandler({
  handleNotification: async () => {
  return {
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }}
})

export default function Lista ({route}) {
  const [videos, setVideos] = useState([]);
  const {singleList, itemId} = route.params;
  let component = null;
  let fileUri = null;
  const navigation = useNavigation();

  const listaInicial = JSON.parse(singleList);
  let listmenuinicial = listaInicial.videolista;

  let isMounted = true;

  const [flag, setFlag] = useState(false);
  const [flagList, setFlagList] = useState(false);
  const [dat, setDat] = useState(false);
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [flagEdit, setFlagEdit] = useState(false);
  const [flagTiempo, setFlagTiempo] = useState(false);
  const [flagTiempoGuardar, setFlagTiempoGuardar] = useState(false);
  const [flagTiempoPress, setFlagTiempoPress] = useState(false);
  const [flagSaveTime, setFlagSaveTime] = useState(false);
  const [flagOneVideo, setFlagOneVideo] = useState(false);
  const [flagButton, setFlagButton] = useState(false);
  const [flagButtonGuardar, setFlagButtonGuardar] = useState(false);
  const [flagHistorial, setFlagHistorial] = useState(false);

  const [datList, setDatList] = useState([]);

  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');

  let datepick = null;
  let editButton = null;
  let previewVideo = null;
  let youtubeVideo = null;

  const [opened, setOpened] = useState(false);
  const [openedMenu, setOpenedMenu] = useState(false);

  const [modalVisibleRecordatorio, setModalVisibleRecordatorio] = useState(false);
  const [dateVisible, setDateVisible] = useState(false);
  const [realizado, setRealizado] = useState('');
  const [listaRealizado, setListaRealizado] = useState('');

  const [list, setList] = useState([]);
  const [listaActual, setListaActual] = useState('');
  const [listaHistorialL, setListaHistorialL] = useState('');
  const videoLocalRef = useRef([]);
  let cameraRef = useRef();
  const [statusVideo, setStatusVideo] = useState({});

  const [openList, setOpenList] = useState(false);
  const [valuelist, setvaluelist] = useState([]);
  const [ listValueNumber, setListValueNumber ] = useState('');
  const [numeros, setNumeros] = useState([
    { label: '0', value: '0' },
    { label: '10', value: '10' },
    { label: '15', value: '15' },
    { label: '30', value: '30' },
    { label: '60', value: '60' },
  ]);

  const [ listValueNumberRep, setListValueNumberRep] = useState('');

  const [modalVisibleEmoticon, setModalVisibleEmoticon] = useState(false);
  const [modalVisibleFoto, setModalVisibleFoto] = useState(false);
  const [modalVisiblePreview, setModalVisiblePreview] = useState(false);
  const [modalVisibleFecha, setModalVisibleFecha] = useState(false);
  const [cameraPermission, setCameraPermission] = useState();
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [fotoVideo, setfotoVideo] = useState('');
  const [flagEm, setFlagEm] = useState(false);
  const [flagTitle, setFlagTitle] = useState(false);
  const [itemFotoFlag, setItemFotoFlag] = useState(false);
  const [flagFondo, setFlagFondo] = useState(false);
  const [tiempoRealizacion, setTiempoRealizacion] = useState("");
  const [im, setIm] = useState("");
  const [itemFlag, setItemFlag] = useState(false);
  const [videoFlag, setVideoFlag] = useState(false);
  const [imFlag, setImFlag] = useState("");
  const [fotoFlag, setFotoFlag] = useState(false);
  const [flagFotoModal, setFlagFotoModal] = useState(false);
  const [flagBackground, setFlagBackground] = useState(false);
  const [flagLocalVideo, setFlagLocalVideo] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [customInterval, setCustomInterval] = useState();
  const [listTiempo, setListTiempo] = useState([]);

  const iconDiaRef = React.useRef();
  const iconHoraRef = React.useRef();
  
  const diaIcon = (props) => (
    <Icon
      {...props}
      ref={iconDiaRef}
      name='calendar-outline'
    />
  );

  const horaIcon = (props) => (
    <Icon
      {...props}
      ref={iconHoraRef}
      name='clock-outline'
    />
  );

  const iconoEntrenamientoRef = React.useRef();

  const iconoEntrenamiento = (props) => (
    <Icon
      {...props}
      ref={iconoEntrenamientoRef}
      name='play-circle-outline'
    />
  );

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const showMode = (currentMode) => {
    setDateVisible(true);
    setModalVisibleFecha(true);
    setMode(currentMode);
  }

  const seleccionarFecha = () => {
    showMode('date');
  }

  const seleccionarTiempo = () => { 
    showMode('time');
  }

  const backAction = async() => {
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
    else{
      setOpened(false);
      setOpenedMenu(false);
      if(statusVideo.isPlaying){
        if(videoLocalRef !== null && videoLocalRef.length !== 0) {
          for(let i = 0; i<videoLocalRef.current.length; i++){
            videoLocalRef.current[i].pauseAsync();
          }
        }
      }
      setEdit(false); 
      setFlag(false);
      setFlagEdit(false);
      let listaf = list;
      listaf.length=0;
      setList(listaf);
      setDatList('');
      setListaActual('');
      setTitle('');
      setFlagEm(false);
      setItemFlag(false);
      setVideoFlag(false);
      setFlagFotoModal(false);
      setFlagTitle(false);
      setFlagFondo(false);
      setFotoFlag(false);
      setFlagTiempo(false);
      setFlagTiempoGuardar(false);
      setFlagTiempoPress(false);
      setFlagSaveTime(false);
      setFlagOneVideo(false);
      setFlagButton(false);
      setFlagButtonGuardar(false);
      setFlagLocalVideo(false);
      setTiempoRealizacion('');
      videoGuardar=false;
      videoSiguiente=false;
      setCurrentSectionIndex(currentSectionIndex-currentSectionIndex); 
      const vid = AsyncStorage.getItem("EJERCICIOS");
      const varray = [vid];
      var f=varray;
      varray.length=0;

      setVideos(varray);
      setListTiempo(varray);
      AsyncStorage.setItem("EJERCICIOS", JSON.stringify(varray));
      AsyncStorage.setItem("TIEMPO", JSON.stringify(varray));
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'AllLists'
          },
        ],
      })
      navigation.navigate('AllLists');
      isMounted = false;
    }
    return true;
  };


  useFocusEffect(
    React.useCallback(() => {
      isMounted=true;

      if(isMounted === true){
        // Si se ha montado la pantalla, se obtienen las listas y vídeos de la lista
        getListas();
        getVideos();
        BackHandler.addEventListener('hardwareBackPress', backAction);
      }
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    
      return () => {
        backHandler.remove();
        isMounted = false;         
      };
  }, [flagList]));
  
  
  useEffect(() => {
    if(isMounted===true){
      if(flagTiempo===true && flagOneVideo===false){
        if(flagTiempoGuardar === true){
          if(customInterval){
            clearInterval(customInterval);
            setSeconds(0);
            setMinutes(0);
            setHours(0);
          }
        }
      }
    }
  }, [flagTiempo]);

  let num = 3;

  // Los iconos y otras imágenes
  const [datos, setDatos] = useState([
    { id: '3', image: Imagenes.uno },
    { id: '6', image: Imagenes.cuatro },
    { id: '10', image: Imagenes.ocho },
    { id: '13', image: Imagenes.once },
    { id: '15', image: Imagenes.trece },
    { id: '21', image: Imagenes.diecinueve },
    { id: '22', image: Imagenes.veinte },
  ]);
  // Imágenes de botones o estados
  const [datosIm, setDatosIm] = useState([
    { id: '23', image: Imagenes.veintitres },
    { id: '24', image: Imagenes.veinticuatro },
    { id: '25', image: Imagenes.veinticinco },
    { id: '26', image: Imagenes.veintiseis },
    { id: '27', image: Imagenes.veintisiete },
    { id: '30', image: Imagenes.treinta },
    { id: '33', image: Imagenes.treintaytres },
    { id: '34', image: Imagenes.treintaycuatro },
    { id: '35', image: Imagenes.treintaycinco },
    { id: '36', image: Imagenes.treintayseis },
    { id: '38', image: Imagenes.treintayocho },
    { id: '43', image: Imagenes.cuarentaytres },
    { id: '44', image: Imagenes.cuarentaycuatro },
    { id: '45', image: Imagenes.cuarentaycinco },
    { id: '28', image: Imagenes.veintiocho },
    { id: '31', image: Imagenes.treintayuno },
    { id: '32', image: Imagenes.treintaydos },
    { id: '37', image: Imagenes.treintaysiete },
    { id: '29', image: Imagenes.veintinueve },   
    { id: '32', image: Imagenes.treintaydos },
    { id: '46', image: Imagenes.cuarentayseis },
    { id: '47', image: Imagenes.cuarentaysiete },
  ]);

  const [emoticonos, setEmoticonos] = useState([
    { id: '39', image: Imagenes.treintaynueve },
    { id: '40', image: Imagenes.cuarenta },
    { id: '41', image: Imagenes.cuarentayuno },
    { id: '42', image: Imagenes.cuarentaydos },
  ]);

  useEffect(() => {
    isMounted = true;

    if(isMounted){
      if(previewVideo !== null) {
        setFlagLocalVideo(true);
      }
    }

  }, [previewVideo]);


  const getVideos = async () => {      
    await AsyncStorage.getItem("EJERCICIOS").then((videos) => {
      setVideos(JSON.parse(videos));    
    }); 
  }

  useFocusEffect(
    React.useCallback(() => {
      isMounted=true;
      if(isMounted === true){
        getListasInicial();
      }
        
    }, [flagHistorial]));


  const getListasInicial = async() => {
    let listasIniciales = '';
    let listaConHistorial = '';
    await AsyncStorage.getItem("LISTAS").then((listas) => {
      listasIniciales = listas;
    });
    if(flag === false && itemFlag === false && fotoFlag === false && flagTitle === false && videoFlag === false 
      && flagFondo === false && flagSaveTime === false){
      if((listaInicial.videolista) !== undefined){             
        listmenuinicial=listaInicial.videolista;
        setTitle(listaInicial.titulo);
        if(listaInicial.fondo !== ''){
          setSelectedImage(listaInicial.fondo);
        }
        setList(listmenuinicial);
        if (listaActual == ''){
          setListaActual(singleList);
        }
        if(currentSectionIndex!==0 && seconds == 0 && minutes == 0 && hours == 0){
          setCurrentSectionIndex(currentSectionIndex-currentSectionIndex);
        }

        // Buscamos la lista con el historial actualizado
        for(let i=0; i<(JSON.parse(listasIniciales)).length; i++){
          let listaActualizada = (JSON.parse(listasIniciales))[i];
          if(JSON.parse(listaActualizada).idlista == JSON.parse(singleList).idlista){
            listaConHistorial = listaActualizada;
          }
        }
        // Establecemos la lista, que contiene el historial actualizado
        if(listaConHistorial !== ''){
          setListaHistorialL(listaConHistorial);
        }
        else{
          setListaHistorialL(singleList);
        }
      }
    }
  }


  const getListas = async () => {
    try {
      if(flag === false && itemFlag === false && fotoFlag === false && flagTitle === false && videoFlag === false 
        && flagFondo === false && flagSaveTime === false){
          let listasIniciales = '';
          let listaConHistorial = '';
          await AsyncStorage.getItem("LISTAS").then((listas) => {
            //guardamos el valor de "LISTAS" en listasIniciales
            listasIniciales = listas;
          });             
          if(JSON.parse(singleList).historial !== ''){
            //buscamos la lista con el historial actualizado
            for(let i=0; i<(JSON.parse(listasIniciales)).length; i++){
              let listaActualizada = (JSON.parse(listasIniciales))[i];
              if(JSON.parse(listaActualizada).idlista == JSON.parse(singleList).idlista){
                listaConHistorial = listaActualizada;
              }
            }
            //establecemos la lista, que contiene el historial actualizado
            if(listaConHistorial !== ''){
              setListaHistorialL(listaConHistorial);
            }
            else{
              setListaHistorialL(singleList);
            }
          }
        }
        else {
        if((listaInicial.videolista) !== undefined){    
          if(list.length > 1){
            const valorListas = await AsyncStorage.getItem("LISTAS");
            const l = valorListas ? JSON.parse(valorListas) : [];
            
            if(flagSaveTime===true){
              if(currentSectionIndex!==0 && seconds == 0 && minutes == 0 && hours == 0){
                setCurrentSectionIndex(currentSectionIndex-currentSectionIndex);
              }
            }
            else{
            const nuevasListas = l.filter((lista) => lista !== singleList); 
            const newLists = nuevasListas.filter((lista) => lista !== datList);
            await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));
            console.log('NUEVASLISTAS es al final1: ', newLists)
            if(currentSectionIndex!==0 && seconds == 0 && minutes == 0 && hours == 0){
              setCurrentSectionIndex(currentSectionIndex-currentSectionIndex);
            }
            }
          }
          if (list.length < 1) {
            isMounted = false;
            setFlag(false);
            let listini = listaInicial;
            listini.videolista = datList;
            let jsonListIni = JSON.stringify(listini);
            
            const valorListas = await AsyncStorage.getItem("LISTAS");
            const l = valorListas ? JSON.parse(valorListas) : [];

            const nuevasListas = l.filter((lista) => lista !== singleList); 
            const newLists = nuevasListas.filter((lista) => lista !== jsonListIni);
            await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists))
              .then(() => {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'AllLists'
                    },
                  ],
                })
                navigation.navigate("AllLists")
              });
          }                   
          if (dat === true){
            BackHandler.removeEventListener('hardwareBackPress', backAction);
            console.log('La longitud de la lista es < 1: ', list)     
            setDat(false);
            let listaf = list;
            listaf.length=0;
            setList(listaf);
            setDatList('');     
          }
        }
      }       
    } catch (error){
      console.log(error)
    }               
  }

  const eliminarLista = async () => {
    Alert.alert(
      "Eliminar lista",
      "¿Está seguro de eliminar la lista?", [
          {
            text: 'No',
            onPress: () => null,
            style:"cancel"
          },
          {text: "Sí", onPress: async() => {
            let listini = listaInicial;
            listini.videolista = datList;
            let jsonListIni = JSON.stringify(listini);
            
            setFlag(false);
            let listaf = list;
            listaf.length=0;
            setList(listaf);
            setDatList('');
            setListaActual('');

            BackHandler.removeEventListener('hardwareBackPress', backAction);
            const valorListas = await AsyncStorage.getItem("LISTAS");
            const l = valorListas ? JSON.parse(valorListas) : [];
            const newListas = l.filter((lista) => lista !== singleList);
            // Creamos una nueva matriz con todas las listas que no coinciden con la lista actual
            const nuevasListas = newListas.filter((lista) => lista !== jsonListIni);
            // Guardamos la lista en la base de datos y navegamos a la pantalla de AllLists 
            await AsyncStorage.setItem("LISTAS", JSON.stringify(nuevasListas))
                .then(() => {
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'AllLists'
                      },
                    ],
                  })
                  navigation.navigate("AllLists")
                });
              isMounted = false;
          }
          }
    ])
  }

  const abrirMenu = async (item) => {
    try{
      setOpenedMenu(false)
      if((JSON.parse(item)).realizado == "no") {
        setRealizado("si");
        var dia = new Date().getDate();
        var mes = new Date().getMonth() + 1;
        var año = new Date().getFullYear();
        var fecha = dia + '-' + mes + '-' + año;

        let jsonListMenu = '';
        let jsonListaFinal = '';

        if (flag === true || itemFlag === true || fotoFlag === true || videoFlag === true || flagSaveTime === true) {
          if (datList.length > 0) {
            jsonListMenu = datList;
            
            for (let i = 0; i < datList.length; i++){
                if((JSON.parse(item).id) == ((JSON.parse(datList[i])).id)){
                  jsonListaFinal = JSON.parse(jsonListMenu[i]);
                  jsonListaFinal.realizado = "si";               
                  jsonListaFinal.imagenRealizado = datosIm[8].image;
                  const newJsonList = jsonListMenu.filter((lista) => lista !== datList[i]);
                  newJsonList.push(JSON.stringify(jsonListaFinal));
                  jsonListMenu=newJsonList;
                }
            }
          }
        }
        
        else {
          jsonListMenu = listmenuinicial;
          
          for (let i = 0; i < listmenuinicial.length; i++){
            if((JSON.parse(item).id) == ((JSON.parse(listmenuinicial[i])).id)){
              jsonListaFinal = JSON.parse(jsonListMenu[i]);
              jsonListaFinal.realizado = "si";               
              jsonListaFinal.imagenRealizado = datosIm[8].image;
              const newJsonList = jsonListMenu.filter((lista) => lista !== listmenuinicial[i]);
              newJsonList.push(JSON.stringify(jsonListaFinal));
              jsonListMenu=newJsonList;
            }     
          }
        }
        
        const valorListas = await AsyncStorage.getItem("LISTAS");
        const l = valorListas ? JSON.parse(valorListas) : [];
        setDatList(jsonListMenu);
        setList(jsonListMenu);
        setFlag(true);
        
        let jsonListNew = '';
        let listNew = '';
        let listini = '';
        let jsonListIni = '';
        if (listaActual !== ''){
          listNew = JSON.parse(listaActual);
          if(datList.length>0) {
            listNew.videolista = datList;
          }
          else {
            listNew.videolista = JSON.parse(listaActual).videolista;
          }
          jsonListNew = JSON.stringify(listNew);
          listini = JSON.parse(listaActual);
          listini.videolista = jsonListMenu;
          jsonListIni = JSON.stringify(listini);
        }
        else {
          listNew = listaInicial;
          if(datList.length>0) {
            listNew.videolista = datList;
          }
          else {
            listNew.videolista = listaInicial.videolista;
          }
          jsonListNew = JSON.stringify(listNew);
          listini = listaInicial;
          listini.videolista = jsonListMenu;
          jsonListIni = JSON.stringify(listini);
        }

        l.push(jsonListIni);
        const newListas = l.filter((lista) => lista !== singleList);
        const newLists = newListas.filter((lista) => lista !== jsonListNew);
        await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));

        await AsyncStorage.getItem("LISTAS").then((listas) => {
          setListaActual(jsonListIni);                 
          setFlagList(!flagList);            
        });
      }                
      else {
        setRealizado("no");
        let jsonListMenu = '';
        let jsonListaFinal = '';
        
        if (flag === true || itemFlag === true || fotoFlag === true || videoFlag === true || flagSaveTime === true) {
          if (datList.length > 0) {   
            jsonListMenu = datList;        
            for (let i = 0; i < datList.length; i++){
              if((JSON.parse(item).id) == ((JSON.parse(datList[i])).id)){
                jsonListaFinal = JSON.parse(jsonListMenu[i]);
                jsonListaFinal.realizado = "no";               
                jsonListaFinal.imagenRealizado = datosIm[7].image;
                const newJsonList = datList.filter((lista) => lista !== datList[i]);
                newJsonList.push(JSON.stringify(jsonListaFinal));
                jsonListMenu=newJsonList;
              }           
            }
          }
        }
        else {
          jsonListMenu = listmenuinicial;
          
          for (let i = 0; i < listmenuinicial.length; i++){
            if((JSON.parse(item).id) == ((JSON.parse(listmenuinicial[i])).id)){
              jsonListaFinal = JSON.parse(jsonListMenu[i]);
              jsonListaFinal.realizado = "no";               
              jsonListaFinal.imagenRealizado = datosIm[7].image;
              const newJsonList = jsonListMenu.filter((lista) => lista !== listmenuinicial[i]);
              newJsonList.push(JSON.stringify(jsonListaFinal));
              jsonListMenu=newJsonList;
            }         
          }
        }

        const valorListas = await AsyncStorage.getItem("LISTAS");
        const l = valorListas ? JSON.parse(valorListas) : [];
        setDatList(jsonListMenu);
        setList(jsonListMenu);
        setFlag(true);
        let jsonListNew = '';
        let listNew = '';
        let listini = '';
        let jsonListIni = '';
        if (listaActual !== ''){
          listNew = JSON.parse(listaActual);
          if(datList.length>0) {
            listNew.videolista = datList;
          }
          else {
            listNew.videolista = JSON.parse(listaActual).videolista;
          }
          jsonListNew = JSON.stringify(listNew);
          listini = JSON.parse(listaActual);
          listini.videolista = jsonListMenu;
          jsonListIni = JSON.stringify(listini);
        }
        else {
          listNew = listaInicial;
          if(datList.length>0) {
            listNew.videolista = datList;
          }
          else {
            listNew.videolista = listaInicial.videolista;
          }
          jsonListNew = JSON.stringify(listNew);
          listini = listaInicial;
          listini.videolista = jsonListMenu;
          jsonListIni = JSON.stringify(listini);
        }

        l.push(jsonListIni);
        const newListas = l.filter((lista) => lista !== singleList);
        const newLists = newListas.filter((lista) => lista !== jsonListNew);
        await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));

        await AsyncStorage.getItem("LISTAS").then((listas) => {
          setListaActual(jsonListIni);                  
          setFlagList(!flagList);            
        });
      }
    } catch (error) {
      console.log(error)
    }    
  }

  const abrirMenuLista = async () => {
    try{
      setOpened(false);
      if (listaActual !== '') {
        let jsonListMenu = '';
        if((JSON.parse(listaActual)).listaRealizado == "no") {
          setListaRealizado("si");
          var dia = new Date().getDate();
          var mes = new Date().getMonth() + 1;
          var año = new Date().getFullYear();
          var fecha = dia + '-' + mes + '-' + año;
          
          jsonListMenu = JSON.parse(listaActual);
          jsonListMenu.listaRealizado = "si";
          jsonListMenu.imagenListaRealizado = datosIm[10].image;
          jsonListMenu.fechaListaRealizado = fecha;
        }       
        else {
          setListaRealizado("no");
          var dia = new Date().getDate();
          var mes = new Date().getMonth() + 1;
          var año = new Date().getFullYear();
          var fecha = dia + '-' + mes + '-' + año;
          
          jsonListMenu = JSON.parse(listaActual);
          jsonListMenu.listaRealizado = "no";
          jsonListMenu.imagenListaRealizado = datosIm[7].image;
          jsonListMenu.fechaListaRealizado = '';
        }

        const valorListas = await AsyncStorage.getItem("LISTAS");
        const l = valorListas ? JSON.parse(valorListas) : [];

        let jsonListNew = JSON.stringify(jsonListMenu);
        l.push(jsonListNew);
        
        const newLists = l.filter((lista) => lista !== listaActual); 
        await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));

        await AsyncStorage.getItem("LISTAS").then((listas) => {
          setListaActual(jsonListNew);                     
        });
      }                
      else {
        let jsonListMenu = '';
        if(listaInicial.listaRealizado == "no") {
          setListaRealizado("si");
          var dia = new Date().getDate();
          var mes = new Date().getMonth() + 1;
          var año = new Date().getFullYear();
          var fecha = dia + '-' + mes + '-' + año;
            
          jsonListMenu = listaInicial;
          jsonListMenu.listaRealizado = "si";
          jsonListMenu.imagenListaRealizado = datosIm[10].image;
          jsonListMenu.fechaListaRealizado = fecha;           
        }
        
        else {
          setListaRealizado("no");
          var dia = new Date().getDate();
          var mes = new Date().getMonth() + 1;
          var año = new Date().getFullYear();
          var fecha = dia + '-' + mes + '-' + año;
            
          jsonListMenu = listaInicial;
          jsonListMenu.listaRealizado = "no";
          jsonListMenu.imagenListaRealizado = datosIm[7].image;
          jsonListMenu.fechaListaRealizado = '';
        }
        const valorListas = await AsyncStorage.getItem("LISTAS");
        const l = valorListas ? JSON.parse(valorListas) : [];

        let jsonListNew = JSON.stringify(jsonListMenu);
        l.push(jsonListNew);
        
        const newListas = l.filter((lista) => lista !== singleList);
        await AsyncStorage.setItem("LISTAS", JSON.stringify(newListas));

        await AsyncStorage.getItem("LISTAS").then((listas) => {
          setListaActual(jsonListNew);                        
        });
      }
    } catch (error) {
      console.log(error)
    }      
  }

  const setTituloLista = async () => {
    setEdit(true);
    setFlagEdit(true);    
  }

  const setEditLista = async () => {
    setEdit(!edit);
    setFlagEdit(false);
    const valorListas = await AsyncStorage.getItem("LISTAS");
    const l = valorListas ? JSON.parse(valorListas) : [];

    var lista = {};
    for (let i=0; i < l.length; i++){
      if((JSON.parse(l[i])).idlista == listaInicial.idlista){
        if(title !== listaInicial.titulo){
          lista.imagen = listaInicial.imagen;
          lista.titulo = title;
          if(datList.length>0){
            lista.videolista = datList;
          }
          else {
            lista.videolista = listaInicial.videolista;
          }

          lista.email = listaInicial.email;
          lista.idlista = listaInicial.idlista;
          lista.fechacreacion = listaInicial.fechacreacion;
          lista.listaRealizado = listaInicial.listaRealizado;
          lista.imagenListaRealizado = listaInicial.imagenListaRealizado;
          lista.historial = listaInicial.historial;  
          lista.fondo = listaInicial.fondo;    

          var jsonLista = JSON.stringify(lista);
          l.push(jsonLista);
          break;
        }
      }
    }
    if(lista.titulo) {
      let listini = listaInicial;
      if(datList.length>0){
        listini.videolista = datList;
      }
      let listTi = listini.videolista;
      let jsonListNew = JSON.stringify(lista);
      setList(listTi);
      setDatList(listTi);
      setFlagTitle(true);
      const newListas = l.filter((lista) => lista !== singleList);
      const newLists = newListas.filter((lista) => lista !== listaActual);

      await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));
      await AsyncStorage.getItem("LISTAS").then((listas) => {
        setListaActual(jsonListNew);
        setFlagList(!flagList);                 
      })  
    }
    
  }

  const onBackdropPress = () => {
    setOpened(false);
  }

  const onTriggerPress = () => {
    setOpened(true);
  }

  const onOptionSelect = (value) => {
    setOpened(false);
  }


  const añadirRecordatorio = () => {
    setOpened(false);
    setEdit(false);
    setFlagEdit(false);
    if(statusVideo.isPlaying){
      if(videoLocalRef !== null && videoLocalRef.length !== 0) {
        for(let i = 0; i<videoLocalRef.current.length; i++){
          videoLocalRef.current[i].pauseAsync();
        }
      }
    }  
    setModalVisibleRecordatorio(true);
  }

  const eliminarRecordatorio = async(lista) => {
    setOpened(false);
    Alert.alert(
      "Eliminar recordatorio",
      "¿Estás seguro de eliminar el recordatorio?", [
          {
          text: 'No',
          onPress: () => null,
          style:"cancel"
          },
          {text: 'Sí', onPress: async() => {
            await Notifications.cancelScheduledNotificationAsync(listaInicial.idlista);
          }
          }
    ])
  }

  let tomarFoto = async() => {
    setFlagFotoModal(true);
    let nuevaFoto = await cameraRef.current.takePictureAsync();
    setfotoVideo(nuevaFoto.uri)
    setModalVisibleFoto(!modalVisibleFoto);
  };


  const abrirCamara = async(item) => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();

    setCameraPermission(cameraPermission.status === "granted");

    if(cameraPermission === undefined){
      console.log('Esperando tener permisos para tomar una foto');
    }
    else if(!cameraPermission){
      console.log('No tiene permisos para tomar una foto');
    }
    else {
      if(JSON.parse(item).foto !== ''){
        Alert.alert(
          "Borrar foto",
          "¿Estás seguro de borrar la foto?", [
              {
              text: 'No',
              onPress: () => null,
              style:"cancel"
              },
              {text: 'Sí', onPress: () => {
                guardarFoto(item);
              }}]
        )
      }
      else {
        getFoto(item);
      }
    }
  }


  const getFoto = (item) => {
    let it = item;
    setItemFotoFlag(it);
    setModalVisiblePreview(true);
    setModalVisibleFoto(true);
  }


  const abrirFotoModal = async(item) => {
    if(flagFotoModal === true){
      try{
        guardarFoto(item);
      }
      catch (error){
        console.log(error);
      }
    }          
  }


  const guardarFoto = async(item) => {
    try {
    const valorListas = await AsyncStorage.getItem("LISTAS");
    const l = valorListas ? JSON.parse(valorListas) : [];

    let listaEm = null;
    if(listaActual !== '' && listaActual !== undefined){
      listaEm = JSON.parse(listaActual);
    }
    else {
      listaEm = listaInicial;
    }
    let em = listaEm.videolista;
    let listFilterEm = null;
    
    if((JSON.parse(item).foto) == '') {
    for (let i = 0; i < listaEm.videolista.length; i++){
      if((JSON.parse(item).id) == (JSON.parse(em[i]).id)){
        listFilterEm = listaEm.videolista.filter((lista) => ((JSON.parse(lista).id) !== (JSON.parse(em[i]).id)));
        let emItem = JSON.parse(item);
        if(fotoVideo !== ''){
          emItem.foto = fotoVideo;
        }
        
        listFilterEm.push(JSON.stringify(emItem));
      }              
    }    
    listaEm.videolista = listFilterEm;
    let listaNueva = JSON.stringify(listaEm);
    l.push(listaNueva);

    setDatList(listFilterEm);
    setList(listFilterEm);
    setFotoFlag(true);

    const newListas = l.filter((lista) => lista !== singleList);
    const newLists = newListas.filter((lista) => lista !== listaActual);
    await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));

    await AsyncStorage.getItem("LISTAS").then((listas) => {
      setListaActual(listaNueva);             
      setFlagList(!flagList);
    });
    setFlagFotoModal(false);
    }
    else {
      for (let i = 0; i < listaEm.videolista.length; i++){
        if((JSON.parse(item).id) == (JSON.parse(em[i]).id)){
          listFilterEm = listaEm.videolista.filter((lista) => ((JSON.parse(lista).id) !== (JSON.parse(em[i]).id)));
          let emItem = JSON.parse(item); 
          emItem.foto = '';                    
          listFilterEm.push(JSON.stringify(emItem));
        }              
      }
      
      listaEm.videolista = listFilterEm;
      let listaNueva = JSON.stringify(listaEm);
      l.push(listaNueva);

      setDatList(listFilterEm);
      setList(listFilterEm);
      setFotoFlag(true);

      const newListas = l.filter((lista) => lista !== singleList);
      const newLists = newListas.filter((lista) => lista !== listaActual);
      await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));

      await AsyncStorage.getItem("LISTAS").then((listas) => {
        setListaActual(listaNueva);             
        setFlagList(!flagList);
      });
      setFlagFotoModal(false);
    }
    }
    catch (error) {
      console.log(error)
    }
  }

  const abrirEmoticono = (item) => {
    setOpenedMenu(false);
    let it = item;
    setImFlag(it);
    setModalVisibleEmoticon(true);    
  }

  const abrirEm = (item) => {
    if(flagEm === true){
      guardarEmoticono(item);
    }
    else{
      return;
    }      
  }

  const guardarEmoticono = async (item) => {
    try {      
      const valorListas = await AsyncStorage.getItem("LISTAS");
      const l = valorListas ? JSON.parse(valorListas) : [];
      let listaEm = null;
      if(listaActual !== '' && listaActual !== undefined){
        listaEm = JSON.parse(listaActual);
      }
      else {
        listaEm = listaInicial;
      }
      let em = listaEm.videolista;
      let listFilterEm = null;
      
      
      for (let i = 0; i < listaEm.videolista.length; i++){
        if((JSON.parse(item).id) == (JSON.parse(em[i]).id)){
          listFilterEm = listaEm.videolista.filter((lista) => ((JSON.parse(lista).id) !== (JSON.parse(em[i]).id)));
          let emItem = JSON.parse(item);
          emItem.emoticono = im;      
          listFilterEm.push(JSON.stringify(emItem));
        }              
      }
      
      listaEm.videolista = listFilterEm;
      let listaNueva = JSON.stringify(listaEm);
      l.push(listaNueva);

      setDatList(listFilterEm);
      setList(listFilterEm);
      setItemFlag(true);

      const newListas = l.filter((lista) => lista !== singleList);
      const newLists = newListas.filter((lista) => lista !== listaActual);
      await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));

      await AsyncStorage.getItem("LISTAS").then((listas) => { 
        setListaActual(listaNueva);             
        setFlagList(!flagList);
      });
      setFlagEm(false);
    }
    catch (error) {
      console.log(error)
    } 
  }
    
  const renderItem = ({ item, index }) => {
    try {
      if ((item !== undefined) && (item !== null) && (JSON.parse(item).videos !== undefined)){

        if(JSON.parse(item).videos.includes("file") && isMounted==true){
          if(previewVideo === null){
            setFlagLocalVideo(true);
          }
          previewVideo = JSON.parse(item).videos;
        }
        else {
          youtubeVideo = JSON.parse(item).videos;
        }

        return (            
          <View style={styles.border}>     
            <View style={{ flexDirection: 'row', marginLeft: 40 }}>    
            <View style={styles.button5}>
              <Image
                source={JSON.parse(item).imagenRealizado}
                style={styles.imagen4}
              />
            </View>
            <View style={styles.button5}>
              <Image
                  source={JSON.parse(item).emoticono !== '' ? JSON.parse(item).emoticono : datosIm[11].image}
                  style={styles.imagen4}
              />
            </View>

            <Modal 
              visible={modalVisibleEmoticon} 
              animationType='fade' 
              transparent={true}>
              <View style={styles.modalStyleEm}>
                <FlatList 
                  data={emoticonos}
                  keyExtractor={( item , index) => index.toString()}
                  renderItem={({ item, index }) => (
                  <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => {
                      setIm(item.image);
                      setFlagEm(true);
                      }}>
                      <Image
                        style={{marginTop: 10, height: 40, width: 40}}
                        source={item.image}
                      />                      
                  </TouchableOpacity>
                  </View>
                  )}                    
                />   
                  <Button onPress={() => {
                      abrirEm(imFlag);
                      setModalVisibleEmoticon(!modalVisibleEmoticon)
                    }}
                    style={styles.botonEmoticono}>
                    <Text>Añadir emoticono</Text>
                  </Button>
              </View>
            </Modal> 

            <Modal
              visible={modalVisiblePreview} 
              animationType='fade' 
              transparent={true}>
              <View style={styles.modalStyle2}>
                <Modal 
                  visible={modalVisibleFoto} 
                  animationType='fade' 
                  transparent={true}>                   
                    <Camera style={styles.camera} type={type} ref={cameraRef} flashMode={flash} >
                      <View>
                        <TouchableOpacity
                          style={styles.imagen8}
                          onPress={() => {
                            setFlash(
                              flash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off
                            );
                          }}>
                          {(flash === Camera.Constants.FlashMode.off) ? 
                            <Ionicons name="flash-off" size={24} color="black" /> 
                            : <Ionicons name="flash" size={24} color="black" />
                          }
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', marginTop: 480}}>
                          <View style={styles.imagen9}>
                              <TouchableOpacity onPress={() => {
                                  setModalVisibleFoto(false);
                                  setModalVisiblePreview(false);
                                }}>
                                <Entypo name="cross" size={45} color="black" />
                              </TouchableOpacity>  
                            </View>
                            <View style={styles.imagen10}>
                              <TouchableOpacity onPress={tomarFoto}>
                                <Image
                                  source={datosIm[12].image}
                                  style={styles.imagen7}
                                />
                              </TouchableOpacity>  
                            </View>  
                            <View style={styles.imagen11}>                       
                              <TouchableOpacity
                                style={styles.imagen}
                                onPress={() => {
                                  setType(
                                    type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
                                  );
                                }}>
                                <MaterialIcons name="flip-camera-ios" size={45} color="black" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </Camera>                 
                </Modal>
                {(fotoVideo !== '') ?
                (<Image
                  source={{uri: fotoVideo                
                  }}
                  style={styles.foto3}
                />) : (<View> 

                </View>)
                }
                <Button onPress={() => {
                  abrirFotoModal(itemFotoFlag);
                  setModalVisiblePreview(!modalVisiblePreview)
                  }}
                  style={styles.botonAñadirFoto}>
                  <Text>Añadir foto</Text>
                </Button>  
                <Button style={styles.botonRepetirFoto}
                  onPress={() => setModalVisibleFoto(true)}>
                  <Text>Repetir foto</Text>
                </Button>
              </View>
            </Modal>

            <Menu>
              <MenuTrigger
                style={{marginLeft: 200, top: 15, height: 30, width: 30}}>
                <Entypo name="dots-three-vertical" size={24} color="black" />
              </MenuTrigger>
                <MenuOptions optionsContainerStyle={{width:200,height:100}}>
                  <MenuOption value={1}
                    onSelect={() => abrirMenu(item)}
                    style={{marginLeft: 10, marginTop: 0}}
                    text={((JSON.parse(item)).realizado == "no") ? "Marcar como realizado" : "Desmarcar como realizado"} />
                  <MenuOption value={2}
                    onSelect={() => abrirEmoticono(item)}
                    style={{marginLeft: 10, marginTop: 0}}
                    text={"Seleccionar un emoticono"} />
                  <MenuOption value={3}
                    onSelect={() => abrirCamara(item)}
                    style={{marginLeft: 10, marginTop: 0}}
                    text={((JSON.parse(item)).foto == '') ? "Añadir foto" : "Borrar foto"} />                                                 
                </MenuOptions>
            </Menu>          
            </View>

            <View style={styles.viewFoto}>
              {(JSON.parse(item).foto !== '') ?
              (<Image
                  source={{uri: JSON.parse(item).foto                
                  }}
                  style={styles.foto2}
              />) : (<View> 

              </View>)
              }
            </View>
            <View style={styles.viewSeries}>
              <Text style={{fontSize: 18, margin: 20, marginLeft: 25}}> 
                {JSON.parse(item).series + '\n' + JSON.parse(item).repeticiones + '\n' + JSON.parse(item).tiempo}
              </Text>
            </View>
            <View style={{alignItems: 'center'}}>
              {previewVideo &&
                <Video
                    ref={ref => (videoLocalRef.current[index] = ref)}
                    source={{ uri: previewVideo }}
                    useNativeControls
                    resizeMode="contain"
                    isLooping={false}
                    isMuted={false}
                    style={styles.videoPlayer}
                    onPlaybackStatusUpdate={status => setStatusVideo(() => status)}
                />}
              {youtubeVideo &&
                <YoutubePlayer
                    height={280}
                    width={280}
                    play={false}
                    videoId={youtubeVideo}
                />}
            </View>
          </View>
        );
      }
      else{
        return;
      }
    } catch (error){
        console.log(error)
    }
  }

  const enviarLista = async () => {
    // Comprobamos que se pueda compartir la lista
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert('No se puede compartir la lista');
      return;
    }
    // Llamamos a la función que comprueba los permisos para compartir la lista
    comprobarLista();
  }

  const getLista = async () => {
    try{
      var lista = {};

      // Obtenemos las listas de la base de datos local
      const valorListas = await AsyncStorage.getItem("LISTAS");
      const l = valorListas ? JSON.parse(valorListas) : [];
      
      // Obtenemos la lista cuyo id coincide con la lista actual
      for (let i=0; i < l.length; i++){
        if((JSON.parse(l[i])).idlista == listaInicial.idlista){
          lista.imagen = (JSON.parse(l[i])).imagen;
          lista.titulo = (JSON.parse(l[i])).titulo;
          lista.videolista = (JSON.parse(l[i])).videolista;
          lista.email = (JSON.parse(l[i])).email;
          lista.idlista = (JSON.parse(l[i])).idlista;
          lista.fechacreacion = (JSON.parse(l[i])).fechacreacion;
          lista.listaRealizado = (JSON.parse(l[i])).listaRealizado;
          lista.imagenListaRealizado = (JSON.parse(l[i])).imagenListaRealizado;
          lista.historial = (JSON.parse(l[i])).historial;
          lista.fondo = (JSON.parse(l[i])).fondo;
          break;
        }
      }
      // Convertimos el objeto lista en una cadena en formato JSON
      var jsonLista = JSON.stringify(lista, null, 2);

      // Creamos la uri de la lista con formato .TXT
      fileUri = FileSystem.documentDirectory + "lista.txt";

      // Escribimos el contenido de la lista en la uri
      await FileSystem.writeAsStringAsync(fileUri, jsonLista, { encoding: FileSystem.EncodingType.UTF8 });

      // Leemos el contenido de la lista de la uri
      file = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
      
      // Enviamos la uri de la lista llamando al módulo "Sharing"
      await Sharing.shareAsync(fileUri);
 
      } catch (error){
        console.log(error)
      }     
  };

  const comprobarLista = async () => {
    // Si el sistema operativo es iOS, obtenemos la lista
    if (Platform.OS === 'ios') {
      getLista();
    } else {
        try{
          // Si el sistema operativo es Android, comprobamos los permisos
          const writegranted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          );
          if (writegranted) {
            try {
              // Si existen permisos para escribir en el almacenamiento externo, obtenemos la lista
                getLista();
            } catch (error) {
              console.log("No tiene permisos para escribir en el almacenamiento externo", error);
            }
          }  
          else {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'Permiso de almacenamiento requerido',
                message:
                  'La aplicación necesita acceso al almacenamiento para enviar la lista',
                buttonNegative: "Cancelar",
                buttonPositive: "OK"
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              try {
                // Si se puede escribir en el almacenamiento externo, obtener permisos para acceder
                // a la galería del dispositivo
                const permission = await MediaLibrary.getPermissionsAsync();

                if (permission.granted) {
                  // Obtenemos la lista si se han otorgado los permisos para acceder a la galería
                  getLista();
                }
                if (!permission.granted && permission.canAskAgain) {
                  const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();
  
                  if (status === 'denied' && canAskAgain) {
                    Alert.alert('El usuario debe aceptar los permisos para enviar la lista');
                  }
                  if (status === 'granted'){
                    getLista();
                  }
                  if (status === 'denied' && !canAskAgain) {
                    Alert.alert("Se ha denegado el permiso y no se puede volver a preguntar");
                  }
                }
                if (!permission.canAskAgain && !permission.granted) {
                  Alert.alert("Se ha denegado el permiso y no se puede volver a preguntar");
                }
              } catch (e) {
                console.log(e);
              }
          }
          else if (granted === PermissionsAndroid.RESULTS.DENIED){
            // Si el permiso ha sido denegado, se muestra una alerta de error
            Alert.alert('Error, no se han aceptado los permisos de almacenamiento');
          }
          else {
            Alert.alert('Error, no se han aceptado los permisos de almacenamiento');
          }
        }
      }
        catch (err) {
          console.log(err);
        }
      }
  }

  for (let i = 0; i<datos.length; i++){
    if((listaInicial.imagen) == datos[i].image){
      num=i;
    }     
  }

  if((listaInicial.imagen) == datos[num].image){
    component = <Image
    source={datos[num].image}
    style={styles.imagen}
    />;
  }
  else {
    if(listaInicial.imagen !== ''){
      component = <Image
      source={{uri: listaInicial.imagen.toString() }}
      style={styles.imagen}
      />;
    }
    else{
      component = <View></View>
    }
  }

  let abrirFondo = async() => {
    setOpened(false);
    setEdit(false);
    if(statusVideo.isPlaying){
      if(videoLocalRef !== null && videoLocalRef.length !== 0) {
        for(let i = 0; i<videoLocalRef.current.length; i++){
          videoLocalRef.current[i].pauseAsync();
        }
      }
    } 
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    // Si el usuario ha denegado el permiso para acceder a su galería, entonces sale una alerta
    if (permissionResult.granted == false) {
    alert('Permisos para acceder a la camara son requeridos');
    return;
    }
    // Cuando el usuario escoge una imagen de su galería, pickerResult retorna la imagen que escogió
    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    
    // Si no se escoge ningún fondo, no da error
    if (pickerResult.cancelled === true) {
      return; 
    }   
    // Actualizamos la variable de estado del fondo seleccionado
    setSelectedImage ({localUri: pickerResult.uri});
    setFlagBackground(true);    
  };

  let añadirFondo = async() => {
    const valorListas = await AsyncStorage.getItem("LISTAS");
    const l = valorListas ? JSON.parse(valorListas) : [];
    
    var lista = {};
    for (let i=0; i < l.length; i++){
      if((JSON.parse(l[i])).idlista == listaInicial.idlista){
        if(listaActual != '' && listaActual != undefined) {
          lista.imagen = JSON.parse(listaActual).imagen;
          lista.titulo = JSON.parse(listaActual).titulo;
          if(datList.length>0){
            lista.videolista = datList;
          }
          else {
            lista.videolista = JSON.parse(listaActual).videolista;
          }

          lista.email = JSON.parse(listaActual).email;
          lista.idlista = JSON.parse(listaActual).idlista;
          lista.fechacreacion = JSON.parse(listaActual).fechacreacion;
          lista.listaRealizado = JSON.parse(listaActual).listaRealizado;
          lista.imagenListaRealizado = JSON.parse(listaActual).imagenListaRealizado;
          lista.fechaListaRealizado = JSON.parse(listaActual).fechaListaRealizado;
          lista.fondo = selectedImage.localUri;

          var jsonLista = JSON.stringify(lista);
          l.push(jsonLista);
          break;
        }
        else {
          lista.imagen = listaInicial.imagen;
          lista.titulo = listaInicial.titulo;
          if(datList.length>0){
            lista.videolista = datList;
          }
          else {
            lista.videolista = listaInicial.videolista;
          }

          lista.email = listaInicial.email;
          lista.idlista = listaInicial.idlista;
          lista.fechacreacion = listaInicial.fechacreacion;
          lista.listaRealizado = listaInicial.listaRealizado;
          lista.imagenListaRealizado = listaInicial.imagenListaRealizado;
          lista.fechaListaRealizado = listaInicial.fechaListaRealizado;
          lista.fondo = selectedImage.localUri;

          var jsonLista = JSON.stringify(lista);
          l.push(jsonLista);
          break;
        }
      }
    }

    const newListas = l.filter((lista) => lista !== singleList);
    const newLists = newListas.filter((lista) => lista !== listaActual);
    
    let listini = listaInicial;
    if(datList.length>0){
      listini.videolista = datList;
    }
    let listTi = listini.videolista;
    let jsonListNew = JSON.stringify(lista);
    setList(listTi);
    setDatList(listTi);
    setFlagFondo(true);
    setFlagBackground(false);
    
    await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));
    await AsyncStorage.getItem("LISTAS").then((listas) => {
      setListaActual(jsonListNew);
      setFlagList(!flagList);                 
    });
  }

  try {
    if(dateVisible === true) {
      datepick = (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Modal
          visible={modalVisibleFecha} 
          animationType='fade' 
          transparent={true}>
            <DateTimePicker
            testID="dateTimePicker"
            style={{ width: '40%', top: 30, left: 90, backgroundColor: '#95bddb' }}
            value={date}
            mode={mode}
            is24Hour={true}
            display={'default'}
            onChange={(event, value) => {
              setDateVisible(!dateVisible);
              
              const currentDate = value || date;

              setDate(currentDate);

              let tempDate = new Date(currentDate);
              let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
              let fTime = 'Horas: ' + tempDate.getHours() + ' | Minutes: ' + tempDate.getMinutes();

              setTime(currentDate);
              setModalVisibleFecha(false);     
            }}
            />
          </Modal>
        </View>);
    }
    else {
      datepick = (<View> 

        </View>);
    }

  } catch (error){
    console.log(error)
  }

  try {
    if(flagEdit === true) {
      editButton = (<TouchableOpacity 
        onPress={setEditLista}>
        <AntDesign name="check" size={24} color="black" />
      </TouchableOpacity>
      );
    }
    else {
      editButton = (<View> 

        </View>);
    }

  } catch (error){
    console.log(error)
  }


  try {
    if (flagBackground === true){
      añadirFondo();
    }
  } catch (error){
    console.log(error)
  }

  return (
    <ImageBackground source={{uri: 
      ((listaActual !== '') ? ((JSON.parse(listaActual).fondo !== '') ? (JSON.parse(listaActual).fondo) : 
      ((listaInicial.fondo!== '') ? (listaInicial.fondo) : 
      'https://images.pexels.com/photos/4589470/pexels-photo-4589470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')) 
      : ((listaInicial.fondo !== '') ? (listaInicial.fondo) : 
      ('https://images.pexels.com/photos/4589470/pexels-photo-4589470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')
      ))}} resizeMode="cover" style={styles.imagen13}>
    <View style={styles.container}>
    <TouchableOpacity
        style={styles.botonAtras}
        onPress={() => backAction()}>
        <Image
          source={datosIm[5].image}
          style={{height: 35, width: 35}}
        />
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', marginTop: 20}}>
        <View style={styles.listaRealizadoIm}>
          <Image
            source={(listaActual !== '') ? (JSON.parse(listaActual).imagenListaRealizado) : (listaInicial.imagenListaRealizado)}
            style={styles.imagen6}
          />
        </View>
        <View style={{left: 23, height: 130, width: 160}}>
          <TextInput 
            value={title}
            onChangeText={newtext => setTitle(newtext)}
            multiline={true}
            style={styles.title}
            editable={edit}
            selectionColor='#515759'
            maxLength={36}
            blurOnSubmit={true}
            returnKeyType="done"
            onSubmitEditing={(event) =>  {
              if(event.nativeEvent.text !== ''){
                setTitle(event.nativeEvent.text);
                setEditLista();
              }
              else {
                Alert.alert("Inserte un título");
              }
            }}
          />
        </View>
        <View style={{marginLeft: 0, left: 20, top: 33, height: 30, width: 30}}>
          <TouchableOpacity 
            onPress={setTituloLista}>
            <AntDesign name="edit" size={24} color="black" />
          </TouchableOpacity>              
        </View>
        <View style={{marginLeft: 0, left: 20, top: 33, height: 30, width: 30}}>
          {editButton}
        </View>
        <View style={{left: 35, top: 30, height: 40, width: 40, justifyContent: 'center', alignItems: 'center'}}>
          <Menu
            opened={opened}
            onBackdropPress={() => onBackdropPress()}
            onSelect={value => onOptionSelect(value)}>
              <MenuTrigger
                onPress={() => onTriggerPress()}
                style={{height: 35, width: 35}}>
                <Entypo name="dots-three-vertical" size={24} color="black" />
              </MenuTrigger>
                <MenuOptions optionsContainerStyle={{width:200,height:170}}>
                  <MenuOption value={1}
                    style={{marginLeft: 10, marginTop: 0}}
                    onSelect={() => abrirMenuLista()}
                    text={(listaActual)?((JSON.parse(listaActual).listaRealizado == "no") ? ("Marcar como realizado") : ("Desmarcar como realizado"))
                      : ((listaInicial.listaRealizado == "no") ? ("Marcar como realizado") : ("Desmarcar como realizado"))} />
                  <MenuOption value={2} 
                    style={{marginLeft: 10, marginTop: 3}}
                    onSelect={() => añadirRecordatorio()}
                    text="Añadir recordatorio"/>
                  <MenuOption value={3}
                    onSelect={() => eliminarRecordatorio()}
                    style={{marginLeft: 10, marginTop: 3}}
                    text={"Eliminar recordatorio"} />
                  <MenuOption value={4}
                    style={{marginLeft: 10, marginTop: 0}}
                    onSelect={() => abrirFondo()}
                    text="Añadir fondo de pantalla" />
                  <MenuOption value={4}
                    style={{marginLeft: 10, marginTop: 0}}
                    onSelect={() => {
                      setOpened(false);
                      setEdit(false);       
                      setFlagEdit(false);                   
                      if(listaActual==''){
                        setFlagHistorial(!flagHistorial);
                      }                                              
                      if(statusVideo.isPlaying){
                        if(videoLocalRef !== null && videoLocalRef.length !== 0) {
                          for(let i = 0; i<videoLocalRef.current.length; i++){
                            videoLocalRef.current[i].pauseAsync();
                          }
                        }
                      }                        
                      navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: 'Historial',
                            params: { listHistorial: ((listaActual !== '') ? ((listaHistorialL !== '' ) ? (listaHistorialL) :
                                      listaActual) : 
                                      singleList),
                                      itemIdHistorial: JSON.parse(singleList).idlista,
                                    },
                          },
                        ],
                      })
                      // Navegamos a la pantalla  Historial
                      navigation.navigate("Historial", {
                        listHistorial: ((listaActual !== '') ? ((listaHistorialL !== '' ) ? (listaHistorialL) :
                        listaActual) : 
                        singleList),
                        itemIdHistorial: JSON.parse(singleList).idlista,
                      });
                      isMounted = false;
                    }}
                    text="Abrir Historial" />
                </MenuOptions>
          </Menu>
        </View>
        
      </View>
        <Modal
            visible={modalVisibleRecordatorio} 
            animationType='fade' 
            transparent={true}>
            <View style={styles.modalStyle}>
            <View>
              <Button
                style={styles.botonFecha}
                status='success'
                accessoryRight={diaIcon}
                onPress={() => {seleccionarFecha()}}>
                Seleccionar día
              </Button>
            </View>
            <View>
              <Button
                style={styles.botonFecha}
                status='success'
                accessoryRight={horaIcon}
                onPress={() => {seleccionarTiempo()}}>
                Seleccionar hora
              </Button>
            </View>
            
          <Text style={{marginLeft: 10, bottom: 90}}>Recibir notificación con una antelación de: </Text>

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
                  theme="LIGHT"
                  mode="BADGE"
                  badgeColors={["#95bddb"]}
                  style={{
                    backgroundColor: '#5a9ed1',
                  }}
                  dropDownContainerStyle={{
                    height: 120,
                  }}
                />
              </View>
              <View style={{justifyContent: 'center', bottom: 75}}>
                <Text>Minutos</Text>
              </View>
            </View>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{bottom: 175}}>Fecha Seleccionada:    {(date) ? 
              (date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()) : ''} </Text>
            <Text style={{right: 20, bottom: 175}}>Hora Seleccionada:      {(date) ? 
              (((date.getHours()<10) ? ('0'+ date.getHours()) : date.getHours()) + ':' + 
                ((date.getMinutes()<10) ? ('0'+ date.getMinutes()) : date.getMinutes())
              ) : ''} 
            </Text>
            </View>    
            {datepick}
            
              <Button onPress={async () => {   
                let tiempo = new Date(time);
                let hora = tiempo.getHours();
                let minutos = '';
                let minutosml = '';
                let segundos = '';
                let repeat = listValueNumberRep;
                let tituloList = listaInicial.titulo;

                if(listValueNumber!=='' && listValueNumber!==0){

                  let horaml = tiempo.getMinutes() * 60000;

                  if(tiempo.getMinutes() < 15){
                    if(listValueNumber==10){
                      minutosml = horaml-(10*60000);
                      if(hora == 0){
                        hora = 23;
                      }
                      else {
                        hora = tiempo.getHours() - 1;
                      }                        
                      segundos = (((tiempo.getHours() - 1)*3600) + (((minutosml/(60000))+60)*60));
                    }
                    if(listValueNumber==15){
                      minutosml = horaml-(15*60000);
                      if(hora == 0){
                        hora = 23;
                      }
                      else {
                        hora = tiempo.getHours() - 1;
                      }      
                      segundos = (((tiempo.getHours() - 1)*3600) + (((minutosml/(60000))+60)*60));
                    }
                    if(listValueNumber==30){
                      minutosml = horaml-(30*60000);
                      if(hora == 0){
                        hora = 23;
                      }
                      else {
                        hora = tiempo.getHours() - 1;
                      }      
                      segundos = (((tiempo.getHours() - 1)*3600) + (((minutosml/(60000))+60)*60));
                    }
                    
                    if(listValueNumber==60){
                      minutosml = horaml-(60*60000);
                      if(hora == 0){
                        hora = 23;
                      }
                      else {
                        hora = tiempo.getHours() - 1;
                      }      
                      segundos = (((tiempo.getHours() - 1)*3600) + (((minutosml/(60000))+60)*60));
                    } 

                    minutos = (minutosml/(60000))+60;

                    if(minutos == 60){
                      minutos = 0;
                      hora = tiempo.getHours();
                    }
                    
                  }

                  else {
                    if(listValueNumber==10){
                      minutosml = horaml-(10*60000);
                      segundos = ((hora*3600) + (minutosml/1000));
                    }
                    if(listValueNumber==15){
                      minutosml = horaml-(15*60000);
                      segundos = ((hora*3600) + (minutosml/1000));
                    }
                    if(listValueNumber==30){
                      minutosml = horaml-(30*60000);
                      segundos = ((hora*3600) + (minutosml/1000));
                    } 
                    if(listValueNumber==60){
                      if(hora == 0){
                        hora = 23;
                      }
                      else {
                        hora = tiempo.getHours() - 1;
                      }
                      minutosml = tiempo.getMinutes()*60000;
                      segundos = ((hora*3600) + (minutosml/1000));                        
                    } 

                    minutos = minutosml/(60000);

                    if(minutos == 60){
                      minutos = 0;
                      hora = tiempo.getHours();
                    }
                  }                                 
                }

                if(listValueNumber == 0 || listValueNumber == '') {
                  minutos = tiempo.getMinutes();
                  segundos = tiempo.getSeconds();  
                  console.log('los minutos son2:', minutos)                  
                }

                console.log('la hora al final es: ', hora)
                console.log('los minutos al final son: ', minutos)
                console.log('los segundos son', segundos)

                let horasElegido = '';
                let minutosElegido = '';

                if(tiempo.getHours()<10){
                  horasElegido = '0'+tiempo.getHours().toString();
                }
                else {
                  horasElegido = tiempo.getHours().toString();
                }

                if(tiempo.getMinutes()<10){
                  minutosElegido = '0'+tiempo.getMinutes().toString();
                }
                else {
                  minutosElegido = tiempo.getMinutes().toString();
                }

                let diaSemana = tiempo.getDay() + 1;

                if (Platform.OS === "android") {
                  await Notifications.setNotificationChannelAsync("recordatorio", {
                    name: "Recordatorio de ejercicio",
                    description: "Recordar realizar el ejercicio!",
                    importance: Notifications.AndroidImportance.HIGH,
                    sound: "default",
                  });                    

                  await Notifications.scheduleNotificationAsync({
                    identifier: listaInicial.idlista,
                    content: {
                      title: tituloList,
                      body: 'Entra en My GymList y haz tu rutina de ejercicios a las ' + horasElegido + ':' + minutosElegido,
                    },
                    trigger: {
                      channelId: "recordatorio",                       
                      weekday: diaSemana,
                      hour: hora,
                      minute: minutos,
                      repeats: true,
                    },
                  });
                }               
                else {
                  await Notifications.scheduleNotificationAsync({
                    identifier: listaInicial.idlista,
                    content: {
                      title: tituloList,
                      body: 'Entra en My GymList y haz tu rutina de ejercicios a las ' + horasElegido + ':' + minutosElegido,
                    },
                    trigger: {
                      channelId: "recordatorio",                       
                      weekday: diaSemana,
                      hour: hora,
                      minute: minutos,
                      repeats: true,
                      },
                    });
                }

                let toast = Toast.show('Se ha creado el recordatorio', {
                  duration: Toast.durations.SHORT,
                  position: Toast.positions.BOTTOM,
                  shadow: true,
                  backgroundColor: '#EBEEF6',
                  textColor: '#000000',
                  shadowColor: '#454545',
                  opacity: 1,
                  delay: 0,                     
                });
                setModalVisibleRecordatorio(false);      
              }} 
              style={styles.botonGuardarFecha}>
                <Text>Guardar</Text>
              </Button>
            
              <Button onPress={() => {
                setModalVisibleRecordatorio(false);
                }}
                style={styles.botonCancelarFecha}>
                <Text>Cancelar</Text>
              </Button>              
            </Modal>     

        {component}
        <Text style={{bottom: 5, fontSize: 14}}>
          {JSON.parse(singleList).email}
        </Text>
        <FlatList 
          data={(list.length !== 0) ? list : listaInicial.videolista}
          extraData={flagList}
          initialNumToRender={1}
          initialScrollIndex={0}
          keyExtractor={( item , index) => index.toString()}
          renderItem={renderItem}
        />

        <View style={{ flexDirection: 'row', marginLeft: 0, marginTop: 10, top: 10, justifyContent: 'space-evenly' }}>
          <View style={styles.botonEliminarLista}>
            <TouchableOpacity onPress={eliminarLista}>
              <Image
                source={datosIm[21].image}
                style={styles.imagenEliminarLista}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.botonEntrenamiento}>
            <Button
              status='success'
              style={{backgroundColor: '#48BEEA', borderColor: '#48BEEA'}}
              accessoryRight={iconoEntrenamiento}
              onPress={() => {
                setEdit(false);
                setFlagEdit(false);
                if(statusVideo.isPlaying){
                  if(videoLocalRef !== null && videoLocalRef.length !== 0) {
                    for(let i = 0; i<videoLocalRef.current.length; i++){
                      videoLocalRef.current[i].pauseAsync();
                    }
                  }
                }                   
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Entrenamiento',
                      params: { listPlay: ((listaActual !== '') ? listaActual : singleList),
                                itemIdPlay: JSON.parse(singleList).idlista, 
                              },
                    },
                  ],
                })
                // Navegamos a la pantalla de Entrenamiento
                navigation.navigate("Entrenamiento", {
                  listPlay: ((listaActual !== '') ? listaActual : singleList),
                  itemIdPlay: JSON.parse(singleList).idlista,
                });
                isMounted = false;
                }}>
              INICIAR{'\n'}ENTRENAMIENTO
            </Button>
          </View>
          {(flagLocalVideo === true) ? 
          (<View>
            </View>
          ) :
          (<View style={styles.botonEnviarLista}>
            <TouchableOpacity onPress={enviarLista}>
              <Image
                source={datosIm[4].image}
                style={styles.imagenEnviarLista}
              />
            </TouchableOpacity>
          </View>)}
        </View>
    </View>
    </ImageBackground>
  );
  
}

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
  button: {
    backgroundColor: '#1B4B95',
    padding: 8,
    marginBottom: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  botonEliminarLista: {
    marginTop: 6,
    borderRadius: 1000,
    width: 50,
    height: 50,
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
  botonEntrenamiento: {
    top: 0,
    borderRadius: 400/2,
    width: 250,
    height: 100,
    alignItems: 'center',
  },
  button4: {
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
    padding: 0,
    marginBottom: 0,
    borderRadius: 400/2,
    height: 35,
  },
  button6: {
    position: 'absolute',
    padding: 0,
    marginBottom: 0,
    borderRadius: 400/2,
    height: 45,
    width: 170,
    top: 320,
    marginLeft: 135,
  },
  botonFecha: {
    backgroundColor: '#9678cc',
    bottom: 100,
    padding: 8,
    marginRight: 10,
    marginBottom: 35,
    borderRadius: 8,
    borderColor: '#8559d2',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width: 180,
  },
  botonGuardarFecha: {
    backgroundColor: '#2d65c4',
    borderRadius: 400/2,
    borderWidth: 1,
    borderColor: '#2a5db5',
    height: 45,
    width: 100,
    marginLeft: 140,
    bottom: 165,
  },
  botonCancelarFecha: {
    backgroundColor: '#d1453d',
    borderRadius: 400/2,
    borderWidth: 1,
    borderColor: '#bd3c35',
    height: 45,
    width: 100,
    marginLeft: 140,
    bottom: 160,
  },
  botonEmoticono: {
    backgroundColor: '#2d65c4',
    borderRadius: 400/2,
    borderWidth: 1,
    borderColor: '#2a5db5',
    height: 45,
    bottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonAñadirFoto: {
    backgroundColor: '#2d65c4',
    borderRadius: 400/2,
    borderWidth: 1,
    borderColor: '#2a5db5',
    height: 45,
    bottom: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonRepetirFoto: {
    backgroundColor: '#c28248',
    borderRadius: 400/2,
    borderWidth: 1,
    borderColor: '#9e724a',
    height: 45,
    bottom: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  botonEnviarLista: {
    marginTop: 5,
    borderRadius: 400/2,
    width: 52,
    height: 52,
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
  button13: {
    backgroundColor: '#1B4B95',
    padding: 8,
    marginBottom: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foto2: {
    height: 150,
    width: 150,
  },
  foto3: {
    height: 280,
    width: 280,
    marginBottom: 50,
  },
  viewFoto: {
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
    right: 60,
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    width: 40,
    top: 40,
    marginLeft: 5,
    borderRadius: 400/2,
  },
  imagen7: {
    height: 70,
    width: 70,
    borderRadius: 400/2,
  },
  imagen8: {
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
  imagenEliminarLista: {
    height: 50,
    width: 50,
    borderRadius: 400/2,
  },
  imagenEnviarLista: {
    height: 52,
    width: 52,
    borderRadius: 1000,
  },
  listaRealizadoIm: {
    padding: 0,
    left: 30,
    marginBottom: 0,
    borderRadius: 400/2,
    height: 35,
  },
  botonAtras: {
    borderRadius: 1000,
    alignItems: 'center', 
    justifyContent: 'center',
    alignSelf: 'center',
    height: 35,
    position: 'absolute',
    marginTop: 20,
    bottom: 10,
    top: 10,
    right: 340,
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
  modalStyle2: {
    borderColor: '#949699',
    borderWidth: 1,
    borderRadius: 9,
    width: width,
    height: Dimensions.get("window").height,
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#95bddb',
  },
  modalStyleEm: {
    borderColor: '#949699',
    borderWidth: 1,
    borderRadius: 9,
    width: width-30,
    height: Dimensions.get("window").height-400,
    marginLeft: 15,
    marginTop: 10,
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#95bddb',
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
    width: 140,
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