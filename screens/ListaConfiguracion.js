import 'react-native-gesture-handler';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import { useBackHandler } from '@react-native-community/hooks'
import Constants from 'expo-constants';


import * as Sharing from 'expo-sharing';
//import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive';
//import JSZipUtils, { getBinaryContent } from 'jszip-utils';
//import JSZip from 'jszip';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Modal, TextInput, View, Image, ImageBackground, Animated, TouchableOpacity, Alert, Platform, 
  BackHandler, ScrollView, Dimensions, PermissionsAndroid, KeyboardAvoidingView } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import * as MailComposer from 'expo-mail-composer';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Linking from 'expo-linking';
import * as DocumentPicker from 'expo-document-picker';
import YoutubePlayer from 'react-native-youtube-iframe';
import { NavigationContainer, useNavigation, useFocusEffect } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import NativeModules from "react-native";
import {startActivityAsync, ActivityAction} from 'expo-intent-launcher';
import launch from 'react-native-mail-launcher';
import launchMailApp from 'react-native-mail-launcher';
import { SafeAreaView, FlatList } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { StackRouter } from 'react-navigation';
import * as MediaLibrary from 'expo-media-library';
import { Imagenes } from '../components/Images';
import { Video, AVPlaybackStatus } from 'expo-av';
import { Camera, CameraType } from 'expo-camera';
import useStateWithCallback from 'use-state-with-callback';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from 'react-native-root-toast';
import DatePicker from 'react-native-modern-datepicker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
//import {Menu, MenuItem} from 'react-native-material-menu';
//import { Menu, Provider } from 'react-native-paper';
//import { Menu, MenuItem } from '@mui/material';
import { ListItem, Divider} from 'react-native-elements'
import {TooltipMenu} from 'react-native-tooltip-menu';
//import {PopoverTooltip} from 'react-native-popover-tooltip';
//import RNPopover from 'react-native-popover-menu';
import { Button, Icon, Text } from "@ui-kitten/components";
import DropDownPicker from 'react-native-dropdown-picker';
import { MenuProvider } from 'react-native-popup-menu';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuContext,
} from 'react-native-popup-menu';

Notifications.setNotificationHandler({
  handleNotification: async () => {
  return {
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }}
})


export default function ListaConfiguracion ({route}) {

    const [listas, setListas] = useState([]);  //listas es un array de listas
    const [videos, setVideos] = useState([]);
    const {singleList, itemId} = route.params;
    let component = null;
    let imagenRealizado = null;
    let file = null;
    let fileUri = null;
    //let dirUri = null;
    let vids = [];
    const navigation = useNavigation();

    const listaInicial = JSON.parse(singleList);
    let listmenuinicial = listaInicial.videolista;

    let listmenusplice = '';
    let isMounted = true;
    //let id = JSON.stringify(itemId);
    //let lis = [];
    const [flag, setFlag] = useState(false);
    const [flagList, setFlagList] = useState(false);
    const [dat, setDat] = useState(false);
    const [visible, setVisible] = useState(false);
    const [edit, setEdit] = useState(false);
    const [title, setTitle] = useState("");
    const [flagEdit, setFlagEdit] = useState(false);
    const [flagTiempo, setFlagTiempo] = useState(false);

    const [datList, setDatList] = useState([]);
    const initialDate = new Date();

    const [day, setDay] = useState("Monday");
    const [time, setTime] = useState(new Date());
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    /*
    const [selectedDate, setSelectedDate] = useStateWithCallback(
      initialDate,
      () => setShow(Platform.OS === 'ios' ? true : false),
  ); 
  */
    let datepick = null;
    let editButton = null;
    let previewVideo = null;
    let youtubeVideo = null;
    let previewFoto = null;
    let imagenEm = null;
    let base64Video = null;
    //let zip = new JSZip();
    const [selectedDateD, setSelectedDateD] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState();
    const [opened, setOpened] = useState(false);
    const [openedMenu, setOpenedMenu] = useState(false);
    //const [idItem, setIdItem] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [dateVisible, setDateVisible] = useState(false);
    const [realizado, setRealizado] = useState('');
    const [listaRealizado, setListaRealizado] = useState('');
    const [textoRealizado, setTextoRealizado] = useState(true);
    const [list, setList] = useState([]);
    const [listaActual, setListaActual] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const videoLocalRef = useRef(null);
    let cameraRef = useRef();
    const [videoLocal, setVideoLocal] = useState(null);
    const [statusVideo, setStatusVideo] = useState({});

    const [openList, setOpenList] = useState(false);
    const [valuelist, setvaluelist] = useState([]);
    const [ listValueNumber, setListValueNumber ] = useState('');
    const [numeros, setNumeros] = useState([
      { label: '0', value: '0' },
      { label: '10', value: '10' },
      { label: '15', value: '15' },
      { label: '30', value: '30' },
    ]);

    const [openListRep, setOpenListRep] = useState(false);
    const [valuelistRep, setvaluelistRep] = useState([]);
    const [ listValueNumberRep, setListValueNumberRep] = useState('');
    const [numerosRep, setNumerosRep] = useState([
      { label: 'Repetir', value: true },
      { label: 'No repetir', value: false },
    ]);


    const [openListTiempo, setOpenListTiempo] = useState(false);
    const [valuelistTiempo, setvaluelistTiempo] = useState([]);
    const [ listValueNumberTiempo, setListValueNumberTiempo] = useState('');
    const [numerosTiempo, setNumerosTiempo] = useState([
      { label: 'Minutos', value: 'Minutos' },
      { label: 'Horas', value: 'Horas' },
    ]);

    const [modalVisibleVideo, setModalVisibleVideo] = useState(false);
    const [modalVisibleEmoticon, setModalVisibleEmoticon] = useState(false);
    const [modalVisibleFoto, setModalVisibleFoto] = useState(false);
    const [modalVisiblePreview, setModalVisiblePreview] = useState(false);
    const [modalVisibleLocalVideo, setModalVisibleLocalVideo] = useState(false);
    const [modalVisibleTiempo, setModalVisibleTiempo] = useState(false);
    const [cameraPermission, setCameraPermission] = useState();
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const [assetFoto, setAssetFoto] = useState('');
    const [assetInfo, setAssetInfo] = useState('');
    const [fotoVideo, setfotoVideo] = useState('');
    const [flagEm, setFlagEm] = useState(false);
    const [flagTitle, setFlagTitle] = useState(false);
    const [itemFotoFlag, setItemFotoFlag] = useState(false);
    const [flagFondo, setFlagFondo] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [series, setSeries] = useState("");
    const [repeticiones, setRepeticiones] = useState("");
    const [tiempo, setTiempo] = useState("");
    const [email, setEmail] = useState("");
    const [tiempoRealizacion, setTiempoRealizacion] = useState("");
    const [link, setLink] = useState('');
    const [im, setIm] = useState("");
    const [itemFlag, setItemFlag] = useState(false);
    const [videoFlag, setVideoFlag] = useState(false);
    const [imFlag, setImFlag] = useState("");
    const [fotoFlag, setFotoFlag] = useState(false);
    const [flagFotoModal, setFlagFotoModal] = useState(false);
    const [flagBackground, setFlagBackground] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const uri = FileSystem.cacheDirectory + "myList.zip";
    const dirUri = FileSystem.cacheDirectory + "listDir";
    const [videosDir, setVideosDir] = useState("");

    //const uri = `${DocumentDirectoryPath}/myList.zip`;
    //const dirUri = `${DocumentDirectoryPath}/listDir`;
    
    const pickerRef = useRef();

    function open() {
      pickerRef.current.focus();
    }

    function close() {
      pickerRef.current.blur();
    }

    //const fadeAnim = useRef(new Animated.Value(0)).current;

    /*
    const menuRef = (ref) => {
      menu=ref;
    }
    */

    const hideMenu = () => {
      setVisible(false);
    };
    const showMenu = () => {
        setVisible(true);
    };

    let showvisible = () => {
      if(visible == true){
        return true;
      }
      //setVisible(true);
      else {
        return false;
      }
    };

    const onChangeValue = (event, selectedDate) => {
      setShow(Platform.OS === 'ios' ? true : false);
      setDate(selectedDate);
      setSelectedDate(value);
      const currentDate = selectedDate || date;
      //setSelectedDate(selectedDate);
      //setDay(currentDate);
      //setTime(currentDate);

      
      let tempDate = new Date(currentDate);
      let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
      let fTime = 'Horas: ' + tempDate.getHours() + ' | Minutes: ' + tempDate.getMinutes();
      console.log('EL dia elegido es: ', fDate)
      console.log('LA hora elegida es: ', fTime)
      
      /*
      if (Platform.OS === 'android') {
        setShow(false);
      }
      */
      
    }

/*
    const handleDateChange = useCallback(
      (event, date) => {
        if (Platform.OS === 'android') {
          setShow(false);
        }
        if (date) {
          setDate(date);
        }
      },
      [],
    );
*/

    const onChange = (event, value) => {
      console.log('al entrar en onchange, show es: ', show)
      setDateVisible(true);
      
      const currentDate = value || date;
      setShow(false);

      if (dateVisible === true) {
        console.log('el valor de show1 es: ', show)
        setShow(false);
        console.log('el valor de show2 es: ', show)
      }
      
      console.log('el valor de show3 es: ', show)
      setDate(currentDate);
      //setSelectedDate(value);
      let tempDate = new Date(currentDate);
      let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
      let fTime = 'Horas: ' + tempDate.getHours() + ' | Minutes: ' + tempDate.getMinutes();
      console.log('EL dia elegido es: ', fDate)
      console.log('LA hora elegida es: ', fTime)
      setTime(currentDate);
      
    };


    const showMode = (currentMode) => {
      //setShow(true);
      setDateVisible(true);

      /*
      if (Platform.OS === 'android') {
        setShow(false);
        // for iOS, add a button that closes the picker
      }
      */
      
      setMode(currentMode);
      console.log('al salir de showmode, show es: ', show)
    }

    const showDatepicker = () => {
      
      showMode('date');
      /*
      if (Platform.OS === 'android') {
        setShow(true);
        // for iOS, add a button that closes the picker
      }
      */
    }
  
    const showTimepicker = () => {
      
      showMode('time');
      /*
      if (Platform.OS === 'android') {
        setShow(true);
        // for iOS, add a button that closes the picker
      }
      */
    }


    const backAction = async() => {
      //alert('We go out of the Screen');
      //listmenuinicial=[''];
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
        setEdit(false); 
        isMounted = false;
        setFlag(false);
        setFlagEdit(false);
        setList('');
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
        setTiempoRealizacion('');
        //setIm("");
        const vid = AsyncStorage.getItem("VIDEOS");
        //const v = vid ? JSON.parse(vid) : [];
        const varray = [vid];
        var f=varray;
        varray.length=0;
  
        setVideos(f);
        AsyncStorage.setItem("VIDEOS", JSON.stringify(f));
      
        //setDat(false);
        /*
        if(dat==true){
          const newListas = listas.filter((lista) => lista !== singleList);  //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
          AsyncStorage.setItem("LISTAS", JSON.stringify(newListas));
        }
        */
        //setDat(false);
        
        navigation.navigate('AllLists');
      
      }
      return true;
    };
    

    useEffect(() => {
      isMounted = true;
      //setList(listmenuinicial);
   
      //let listmenu = [''];
      if(isMounted){
        //setList((singleList.split('[')[1]).split(','));
        getListas(listmenuinicial);
        getVideos();
        BackHandler.addEventListener('hardwareBackPress', backAction);
      }
    
  
      return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, [flagList]);

    /*
    useEffect(() => {

      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick(listmenu, isMounted));
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick(listmenu, isMounted));
      };
    }, [flagList]);
    */

/*
    const eliminaVideo = async() => {
      let videoslist = '';
      for (let i = 0; i < (singleList.split('[')[1]).split(',').length; i++){
        videoslist = videoslist + ',' + (((singleList.split('[')[1]).split(',')[i]).split('\n'))[3];
      }
      let listvideos = [videoslist];
      let newvideo = '';
      for (let j = 0; i < (singleList.split('[')[1]).split(',').length; i++){
         if(item.split('\n')[3] == videoslist[j]){
           //newvideo = await listvideos.filter((video) => video !== item.split('\n')[3]);
        }
      }
      const valorListas = await AsyncStorage.getItem("LISTAS");
      const l = valorListas ? JSON.parse(valorListas) : [];
      var lista = {};
      lista.imagen = (singleList.split('\n'))[0];
      lista.titulo = (singleList.split('\n'))[1];
      lista.series = '';
      lista.repeticiones = '';
      lista.tiempo = '';
      lista.videos = '';
      lista.email = (singleList.split('\n'))[(singleList.split('\n')).length - 1];
      for(let i = 0; i<(singleList.split('[')[1]).split(',').length; i++){
        lista.series = lista.series + ',' + (((singleList.split('[')[1]).split(',')[i]).split('\n'))[0];
        lista.repeticiones = lista.repeticiones + ',' + (((singleList.split('[')[1]).split(',')[i]).split('\n'))[1];
        lista.tiempo = lista.tiempo + ',' + (((singleList.split('[')[1]).split(',')[i]).split('\n'))[2];
        lista.videos = lista.videos + ',' + newvideo[i];
      }
      //const newListas = await listas.filter((lista) => lista !== singleList);
      await AsyncStorage.setItem("LISTAS", JSON.stringify(newListas))  //nos quedamos solo con las listas que no coinciden con singleList
        .then(() => setDat(!dat));
      
      l.push(lista);
    }
    */


    let num = 3;
    const [number, setNumber] = useState(3);

    //Los iconos y otras imágenes
    const [datos, setDatos] = useState([
      { id: '3', image: Imagenes.uno },
      { id: '6', image: Imagenes.cuatro },
      { id: '10', image: Imagenes.ocho },
      { id: '13', image: Imagenes.once },
      { id: '15', image: Imagenes.trece },
      { id: '21', image: Imagenes.diecinueve },
      { id: '22', image: Imagenes.veinte },
    ]);
    //Imágenes de botones o estados
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
    ]);

    const [emoticonos, setEmoticonos] = useState([
      { id: '39', image: Imagenes.treintaynueve },
      { id: '40', image: Imagenes.cuarenta },
      { id: '41', image: Imagenes.cuarentayuno },
      { id: '42', image: Imagenes.cuarentaydos },
    ]);
/*
    useEffect(() => {
      let listmenu = [''];
      let isMounted = true;
      //listmenu = (singleList.split('[')[1]).split(',');
      if(isMounted){
        //setList((singleList.split('[')[1]).split(','));
        getListas(listmenu);
        console.log('funciona hasta ismounted')
      }

      navigation.addListener('beforeRemove', (e) => {
        if (flag===false) {
          // If we don't have unsaved changes, then we don't need to do anything
          navigation.navigate("AllLists");
        }
      
        e.preventDefault();

        //getVideos();

        Alert.alert(
          'Discard changes?',
          'You have unsaved changes. Are you sure to discard them and leave the screen?',
          [
            { text: "Don't leave", style: 'cancel', onPress: () => {} },
            {
              text: 'Discard',
              style: 'destructive',
              // If the user confirmed, then we dispatch the action we blocked earlier
              // This will continue the action that had triggered the removal of the screen
              onPress: () => {
                alert('Screen was unfocused');
                listmenu=[''];
                isMounted = false;
                setFlag(false);
                setList('');
                navigation.dispatch(e.data.action)

              },
            },
          ]
        );
      }), [flagList]
    });
    */

    /*
    useFocusEffect(
      React.useCallback(() => {

        //getVideos();
        return () => {

          console.log('the screen is updated')
          
          // Useful for cleanup functions
        };
      }, [flagList])
    );
*/


/*
    useBackHandler(() => {
      if (shouldBeHandledHere) {
        // handle it
        return true
      }
      // let the default thing happen
      return false
    })
    */
    const getVideos = async () => {
      /*
      AsyncStorage.setItem("VIDEOS", JSON.stringify('f6TXEnHT_Mk'))
        .then((videos) => {setVideos(JSON.parse(videos))});
      */       
      await AsyncStorage.getItem("VIDEOS").then((videos) => {
        setVideos(JSON.parse(videos));    //guardamos cada video en formato string en videos     
      });
      console.log('El array de videos de la lista es: ', videos);     
    }

    const fadeIn = () => {
      Animated.timing(fadeAnim, {
        toValue: 500,
        duration: 1500,
        easing: Easing.linear,
      }).start();
    }

    const fadeOut = () => {
      // Will change fadeAnim value to 0 in 3 seconds
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 3000,
        easing: Easing.linear,
      }).start();
    };

    const getListas = async (listmenu) => {

      if (Platform.OS === 'ios') {
        Permissions.getAsync(Permissions.NOTIFICATIONS).then((statusObj) => {
          if (statusObj.status !== 'granted') {
          return Permissions.askAsync(Permissions.NOTIFICATIONS)
          }
          return statusObj;
          }).then((statusObj) => {
          if (statusObj.status !== 'granted') {
          return;
          }
          })
      }
        await AsyncStorage.getItem("LISTAS").then((listas) => {
          setListas(JSON.parse(listas));    //guardamos cada lista en formato string en listas
          //setIdItem(id);
          //console.log('el valor de listmenu es: ', listmenu)
        });
        //listmenu=(singleList.split('[')[1]).split(',');
        //setList(listmenusplice);
        try {
          if(flag === false && itemFlag === false && fotoFlag === false && flagTitle === false && videoFlag === false 
            && flagTiempo === false && flagFondo === false){
            if((listaInicial.videolista) !== undefined){             
              listmenuinicial=listaInicial.videolista;
              setTitle(listaInicial.titulo);
              if(listaInicial.fondo !== ''){
                setSelectedImage(listaInicial.fondo);
              }
              //setList(listaInicial.videolista);
              setList(listmenuinicial);
              if (listaActual == ''){
                setListaActual(singleList);
              }
              console.log('La NUEVA LIST es si flag=FALSE: ', list)
              console.log('La NUEVA datLIST es si flag=FALSE: ', datList)
            }
/*
            else{
              listmenu=[''];
            }
            */
          }
          else {
            console.log('Se ha borrado el elemento de la lista2: ', listmenusplice)
            if(flagFondo === true && listaActual !== ''){
              console.log('Flag Fondo = true')
            }
            if((listaInicial.videolista) !== undefined){    
              //setList(listmenusplice);
              //setEdit(false);
              console.log('LIST state es si flag=TRUE: ', list)
              console.log('DATLIST state es si flag=TRUE: ', datList)

              if(list.length > 1){
                /*
                let listini = listaInicial;
                listini.videolista = datList;
                let jsonListIni = JSON.stringify(listini);
                */
                //console.log('JSONLISTINI es1: ', jsonListIni)
                //l.push(jsonListIni);
                const valorListas = await AsyncStorage.getItem("LISTAS");
                const l = valorListas ? JSON.parse(valorListas) : [];
  
                const nuevasListas = l.filter((lista) => lista !== singleList); 
                //console.log('nuevasListas es: ', nuevasListas)
                const newLists = nuevasListas.filter((lista) => lista !== datList); //no hace nada
                await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));
                console.log('NUEVASLISTAS es al final1: ', newLists)
                /*
                if(itemFlag===""){
                  setIm(im);
                  //setFlagEm(false);
                  console.log('EL valor de IM es: ', im)
                }                
                */
                /*
                if(imFlag !== "")
                {
                  setIm(imFlag);
                }
                */
               /*
                if(flagEm === true)
                {
                  setIm(imFlag);
                }
                */
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
                const newLists = nuevasListas.filter((lista) => lista !== jsonListIni); //no hace nada
                await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists))
                  .then(() => navigation.navigate("AllLists"));
                console.log('NUEVASLISTAS es al final2: ', nuevasListas)
              }
              
              //await AsyncStorage.setItem("LISTAS", JSON.stringify(nuevasListas));
              //console.log('NUEVASLISTAS es al final2: ', nuevasListas)         
              
              if (dat === true){
                BackHandler.removeEventListener('hardwareBackPress', backAction);
                console.log('List Length is < 1: ', list)     
                setDat(false);
                setList('');
                setDatList('');
                            //setFlagList(!flagList);
                            //navigation.navigate('AllLists');
          
              }

              
            }
            /*
            else{
            listmenu=[''];
            }
            */
           
          }
        } catch (error){
          console.log(error)
        }         
        
    }
/*
    const getVideos = () => {
      AsyncStorage.getItem("VIDEOS").then((videos) => {
        setVideos(JSON.parse(videos));    //guardamos cada video en formato string en videos
      });
  }
*/

    function toggleCameraType() {
      setType((current) => (
        current === CameraType.back ? CameraType.front : CameraType.back
      ));
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
              //setDat(true);
              //setFlagList(!flagList);
              //isMounted = false;

              let listini = listaInicial;
              listini.videolista = datList;
              let jsonListIni = JSON.stringify(listini);

              isMounted = false;
              setFlag(false);
              setList('');
              setDatList('');
              setListaActual('');
              console.log('Se ha borrado la LISTA: ', list)
              BackHandler.removeEventListener('hardwareBackPress', backAction);
              const valorListas = await AsyncStorage.getItem("LISTAS");
              const l = valorListas ? JSON.parse(valorListas) : [];
              const newListas = l.filter((lista) => lista !== singleList);
              const nuevasListas = newListas.filter((lista) => lista !== jsonListIni);  //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
              await AsyncStorage.setItem("LISTAS", JSON.stringify(nuevasListas))  //nos quedamos solo con las listas que no coinciden con singleList
                  .then(() => navigation.navigate("AllLists"));
              //setDat(true);

            }
          }
        ])
      }


      const abrirMenu = async (item) => {
      try{
        setOpenedMenu(false)
        //console.log('Un objeto de la lista es: ', (JSON.parse(listmenuinicial[0])))
        //console.log('LISTmenuInicial es: ', listmenuinicial)
        console.log('El id del item es: ', JSON.parse(item).id)
        console.log('imagenRealizado es: ', JSON.parse(item).imagenRealizado)
        if((JSON.parse(item)).realizado == "no") {
          setRealizado("si");
          var dia = new Date().getDate(); //To get the Current Date
          var mes = new Date().getMonth() + 1; //To get the Current Month
          var año = new Date().getFullYear(); //To get the Current Year
          var fecha = dia + '-' + mes + '-' + año;
          console.log('la fecha actual es: ', fecha);
          //listaInicial.videolista.realizado="si";
          setTextoRealizado(!textoRealizado);
          let jsonListMenu = '';
          let jsonListaFinal = '';

          if (flag === true || itemFlag === true || fotoFlag === true || videoFlag === true) {
            if (datList.length > 0) {
              jsonListMenu = datList;
              //let jsonListMenu = JSON.parse(listmenusplice);
              
              for (let i = 0; i < datList.length; i++){
                  if((JSON.parse(item).id) == ((JSON.parse(datList[i])).id)){
                    jsonListaFinal = JSON.parse(jsonListMenu[i]);
                    jsonListaFinal.realizado = "si";               
                    jsonListaFinal.imagenRealizado = datosIm[8].image;
                    const newJsonList = jsonListMenu.filter((lista) => lista !== datList[i]); //listmenusplice[i]
                    newJsonList.push(JSON.stringify(jsonListaFinal));
                    jsonListMenu=newJsonList;
                    console.log('Funciona hasta abrirMenu si realizado == no1')
                  }

              }
              /*
              imagenRealizado = <Image
              //source={{uri: 'https://picsum.photos/200/200'}}
              source={datos[15].image}
              style={styles.imagen4}
              //si existe el estado (si es distinto de null), se pinta una imagen (de la uri) que escogemos en la galeria. 
              //Si no existe el estado (si es null), se muestra la imagen 'picsum.photos' por defecto
              />;
              */
              //setList(jsonListMenu);
              console.log('Funciona hasta abrirMenu si realizado == no11')
            }
          }
          
          else {
            jsonListMenu = listmenuinicial;
            
            for (let i = 0; i < listmenuinicial.length; i++){
                if((JSON.parse(item).id) == ((JSON.parse(listmenuinicial[i])).id)){
                  jsonListaFinal = JSON.parse(jsonListMenu[i]);
                  jsonListaFinal.realizado = "si";               
                  jsonListaFinal.imagenRealizado = datosIm[8].image;
                  const newJsonList = jsonListMenu.filter((lista) => lista !== listmenuinicial[i]); //listmenuinicial[i]
                  newJsonList.push(JSON.stringify(jsonListaFinal));
                  jsonListMenu=newJsonList;
                  console.log('Funciona hasta abrirMenu si realizado == no2')
                  //console.log('El valor de REALIZADO2 es: ', (JSON.parse(jsonListMenu[i])).realizado)

                }
              
            }
            /*
            imagenRealizado = <Image
            //source={{uri: 'https://picsum.photos/200/200'}}
            source={datos[15].image}
            style={styles.imagen4}
            //si existe el estado (si es distinto de null), se pinta una imagen (de la uri) que escogemos en la galeria. 
            //Si no existe el estado (si es null), se muestra la imagen 'picsum.photos' por defecto
            />;
            */

            console.log('Funciona hasta abrirMenu si realizado == no22: ', realizado)

          }
          
          const valorListas = await AsyncStorage.getItem("LISTAS");
          const l = valorListas ? JSON.parse(valorListas) : [];
          setDatList(jsonListMenu);
          setList(jsonListMenu);
          setFlag(true);
          console.log('JSONLISTMENU es1: ', jsonListMenu)
          
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

          console.log('JSONLISTINI es1: ', jsonListIni)
          l.push(jsonListIni);
          console.log('El NUEVO VALOR DE LISTAS1 es: ', l)
          const newListas = l.filter((lista) => lista !== singleList);
          const newLists = newListas.filter((lista) => lista !== jsonListNew);  //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
          console.log('EL valor de NEWLISTAS1 es: ', newLists)
          await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));

          await AsyncStorage.getItem("LISTAS").then((listas) => {
            setListas(JSON.parse(listas)); 
            setListaActual(jsonListIni);                 
            setFlagList(!flagList);            
          });

        }

                    
        else {
          setRealizado("no");
          //listaInicial.videolista.realizado="no";
          setTextoRealizado(!textoRealizado);
          let jsonListMenu = '';
          let jsonListaFinal = '';
          
          if (flag === true || itemFlag === true || fotoFlag === true || videoFlag === true) {
            if (datList.length > 0) {   
              jsonListMenu = datList;        
              //let listmenuobject = JSON.parse(listmenuinicial);
              for (let i = 0; i < datList.length; i++){
                  if((JSON.parse(item).id) == ((JSON.parse(datList[i])).id)){
                    jsonListaFinal = JSON.parse(jsonListMenu[i]);
                    jsonListaFinal.realizado = "no";               
                    jsonListaFinal.imagenRealizado = datosIm[7].image;
                    const newJsonList = datList.filter((lista) => lista !== datList[i]); //listmenuinicial[i]
                    newJsonList.push(JSON.stringify(jsonListaFinal));
                    jsonListMenu=newJsonList;

                    console.log('Funciona hasta abrirMenu si realizado == si1')
                  }
                
              }
              /*
              imagenRealizado = <Image
              //source={{uri: 'https://picsum.photos/200/200'}}
              source={datos[14].image}
              style={styles.imagen4}
              //si existe el estado (si es distinto de null), se pinta una imagen (de la uri) que escogemos en la galeria. 
              //Si no existe el estado (si es null), se muestra la imagen 'picsum.photos' por defecto
              />;
              */
              //setList(jsonListMenu);
              console.log('Funciona hasta abrirMenu si realizado == si11')
            }
          }
          else {
            jsonListMenu = listmenuinicial;
            
            for (let i = 0; i < listmenuinicial.length; i++){
                if((JSON.parse(item).id) == ((JSON.parse(listmenuinicial[i])).id)){
                  jsonListaFinal = JSON.parse(jsonListMenu[i]);
                  jsonListaFinal.realizado = "no";               
                  jsonListaFinal.imagenRealizado = datosIm[7].image;
                  const newJsonList = jsonListMenu.filter((lista) => lista !== listmenuinicial[i]); //listmenuinicial[i]
                  newJsonList.push(JSON.stringify(jsonListaFinal));
                  jsonListMenu=newJsonList;
                  console.log('Funciona hasta abrirMenu si realizado == no2')
                  //console.log('El valor de REALIZADO2 es: ', (JSON.parse(jsonListMenu[i])).realizado)

                }
              
            }
            console.log('Funciona hasta abrirMenu si realizado == si2')
          }
            /*
            imagenRealizado = <Image
            //source={{uri: 'https://picsum.photos/200/200'}}
            source={datos[14].image}
            style={styles.imagen4}
            //si existe el estado (si es distinto de null), se pinta una imagen (de la uri) que escogemos en la galeria. 
            //Si no existe el estado (si es null), se muestra la imagen 'picsum.photos' por defecto
            />;
            */

            console.log('Funciona hasta abrirMenu si realizado == si22')
            const valorListas = await AsyncStorage.getItem("LISTAS");
            const l = valorListas ? JSON.parse(valorListas) : [];
            setDatList(jsonListMenu);
            setList(jsonListMenu);
            setFlag(true);
            console.log('JSONLISTMENU es2: ', jsonListMenu)
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
            console.log('El NUEVO VALOR DE LISTAS2 es: ', l)
            const newListas = l.filter((lista) => lista !== singleList);
            const newLists = newListas.filter((lista) => lista !== jsonListNew);  //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
            console.log('EL valor de NEWLISTAS1 es: ', newLists)
            await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));

            await AsyncStorage.getItem("LISTAS").then((listas) => {
              setListas(JSON.parse(listas));
              setListaActual(jsonListIni);                  
              setFlagList(!flagList);            
            });

          
        
         //setModalVisible(!modalVisible);
        }
      } catch (error) {
        console.log(error)
      }
        
      }

    /*
    const eliminarVideo = async () => {
      let videoslist = '';
      for (let i = 0; i < (singleList.split('[')[1]).split(',').length; i++){
        videoslist = videoslist + ',' + (((singleList.split('[')[1]).split(',')[i]).split('\n'))[3];
      }


      const newVideo = await listas.filter((lista) => lista !== singleList);  //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
      await AsyncStorage.setItem("LISTAS", JSON.stringify(newListas))  //nos quedamos solo con las listas que no coinciden con singleList
          .then(() => setDat(!dat));
  }
  */

  const abrirMenuLista = async () => {
    try{
      //console.log('Un objeto de la lista es: ', (JSON.parse(listmenuinicial[0])))
      //console.log('LISTmenuInicial es: ', listmenuinicial)
      //console.log('El id del item es: ', JSON.parse(item).id)
      //console.log('imagenRealizado es: ', JSON.parse(item).imagenRealizado)
      setOpened(false);
      if (listaActual !== '') {
        let jsonListMenu = '';
        if((JSON.parse(listaActual)).listaRealizado == "no") {
          setListaRealizado("si");
          var dia = new Date().getDate(); //To get the Current Date
          var mes = new Date().getMonth() + 1; //To get the Current Month
          var año = new Date().getFullYear(); //To get the Current Year
          var fecha = dia + '-' + mes + '-' + año;
          console.log('la fecha actual es: ', fecha);
          //listaInicial.videolista.realizado="si";
          //setTextoRealizado(!textoRealizado);
          
          let jsonListaFinal = '';
            
              //jsonListMenu = datList;
              //let jsonListMenu = JSON.parse(listmenusplice);
          jsonListMenu = JSON.parse(listaActual);
          jsonListMenu.listaRealizado = "si";
          jsonListMenu.imagenListaRealizado = datosIm[10].image;
          jsonListMenu.fechaListaRealizado = fecha;

              //const newJsonList = jsonListMenu.filter((lista) => lista !== datList[i]);

          console.log('Funciona hasta abrirMenuLista si realizado == no11')
            
        }
        
        else {
          setListaRealizado("no");
          var dia = new Date().getDate(); //To get the Current Date
          var mes = new Date().getMonth() + 1; //To get the Current Month
          var año = new Date().getFullYear(); //To get the Current Year
          var fecha = dia + '-' + mes + '-' + año;
          console.log('la fecha actual es: ', fecha);
          //listaInicial.videolista.realizado="si";
          //setTextoRealizado(!textoRealizado);
          
          let jsonListaFinal = '';
            
              //jsonListMenu = datList;
              //let jsonListMenu = JSON.parse(listmenusplice);
          jsonListMenu = JSON.parse(listaActual);
          jsonListMenu.listaRealizado = "no";
          jsonListMenu.imagenListaRealizado = datosIm[7].image;
          jsonListMenu.fechaListaRealizado = '';

              //const newJsonList = jsonListMenu.filter((lista) => lista !== datList[i]);

          console.log('Funciona hasta abrirMenuLista si realizado == no22')

        }

        //setFlag(true);
        const valorListas = await AsyncStorage.getItem("LISTAS");
        const l = valorListas ? JSON.parse(valorListas) : [];

        console.log('JSONLISTMENU es3: ', jsonListMenu)

        let jsonListNew = JSON.stringify(jsonListMenu);
        l.push(jsonListNew);
        //console.log('El NUEVO VALOR DE LISTAS es: ', l)
        
        console.log('El NUEVO VALOR DE LISTAS3 es: ', l)
        //const newListas = l.filter((lista) => lista !== singleList);
        const newLists = l.filter((lista) => lista !== listaActual);  //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
        console.log('EL valor de NEWLISTAS3 es: ', newLists)
        await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));

        await AsyncStorage.getItem("LISTAS").then((listas) => {
          setListas(JSON.parse(listas));
          setListaActual(jsonListNew);                  
          //setFlagList(!flagList);            
        });

      }

                  
      else {
        let jsonListMenu = '';
        if(listaInicial.listaRealizado == "no") {
          setListaRealizado("si");
          var dia = new Date().getDate(); //To get the Current Date
          var mes = new Date().getMonth() + 1; //To get the Current Month
          var año = new Date().getFullYear(); //To get the Current Year
          var fecha = dia + '-' + mes + '-' + año;
          console.log('la fecha actual es: ', fecha);
          //listaInicial.videolista.realizado="si";
          //setTextoRealizado(!textoRealizado);
          
          let jsonListaFinal = '';
            
              //jsonListMenu = datList;
              //let jsonListMenu = JSON.parse(listmenusplice);
          jsonListMenu = listaInicial;
          jsonListMenu.listaRealizado = "si";
          jsonListMenu.imagenListaRealizado = datosIm[10].image;
          jsonListMenu.fechaListaRealizado = fecha;

              //const newJsonList = jsonListMenu.filter((lista) => lista !== datList[i]);

          console.log('Funciona hasta abrirMenuLista si realizado == no11')
            
        }
        
        else {
          setListaRealizado("no");
          var dia = new Date().getDate(); //To get the Current Date
          var mes = new Date().getMonth() + 1; //To get the Current Month
          var año = new Date().getFullYear(); //To get the Current Year
          var fecha = dia + '-' + mes + '-' + año;
          console.log('la fecha actual es: ', fecha);
          //listaInicial.videolista.realizado="si";
          //setTextoRealizado(!textoRealizado);
          
          let jsonListaFinal = '';
            
              //jsonListMenu = datList;
              //let jsonListMenu = JSON.parse(listmenusplice);
          jsonListMenu = listaInicial;
          jsonListMenu.listaRealizado = "no";
          jsonListMenu.imagenListaRealizado = datosIm[7].image;
          jsonListMenu.fechaListaRealizado = '';

              //const newJsonList = jsonListMenu.filter((lista) => lista !== datList[i]);

          console.log('Funciona hasta abrirMenuLista si realizado == no22')

        }

        //setFlag(true);
        const valorListas = await AsyncStorage.getItem("LISTAS");
        const l = valorListas ? JSON.parse(valorListas) : [];

        console.log('JSONLISTMENU es4: ', jsonListMenu)

        let jsonListNew = JSON.stringify(jsonListMenu);
        l.push(jsonListNew);
        //console.log('El NUEVO VALOR DE LISTAS es: ', l)
        
        console.log('El NUEVO VALOR DE LISTAS4 es: ', l)
        const newListas = l.filter((lista) => lista !== singleList);
        console.log('EL valor de NEWLISTAS4 es: ', newListas)
        await AsyncStorage.setItem("LISTAS", JSON.stringify(newListas));

        await AsyncStorage.getItem("LISTAS").then((listas) => {
          setListas(JSON.parse(listas));
          setListaActual(jsonListNew);                  
          //setFlagList(!flagList);            
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
      //setTitle(title);
      var lista = {};
      for (let i=0; i < l.length; i++){
        console.log('funciona hasta titulo != listaInicial.titulo1', title)
        if((JSON.parse(l[i])).idlista == listaInicial.idlista){
          console.log('funciona hasta titulo != listaInicial.titulo2', listaInicial.titulo)
          if(title !== listaInicial.titulo){
            console.log('funciona hasta titulo != listaInicial.titulo3')

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
            lista.fechaListaRealizado = listaInicial.fechaListaRealizado;

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
        let jsonListIni = JSON.stringify(listini);
        let jsonListNew = JSON.stringify(lista);
        setList(listTi);
        setDatList(listTi);
        setFlagTitle(true);
        const newListas = l.filter((lista) => lista !== singleList);
        const newLists = newListas.filter((lista) => lista !== listaActual);  //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
        //console.log('EL valor de newLists es: ', newLists)
                        
        //console.log('EL valor de JSONLISTINI es: ', jsonListIni)
        await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));
        await AsyncStorage.getItem("LISTAS").then((listas) => {
          setListas(JSON.parse(listas)); 
          setListaActual(jsonListNew);
          setFlagList(!flagList);                 
        })  
      }
     
    }

    const myItemSeparator = () => {
      return (
        <View
          style={{ height: 1, backgroundColor: "gray", marginHorizontal:10 }}
        />
      );
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



    const onBackdropPressMenu = () => {
      setOpenedMenu(false);
    }

    const onTriggerPressMenu = () => {
      setOpenedMenu(true);
    }
  
    const onOptionSelectMenu = (value) => {
      setOpenedMenu(false);
    }



    const añadirRecordatorio = () => {
      setOpened(false);
      setModalVisible(true);
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
              await Notifications.cancelAllScheduledNotificationsAsync();
            }
            }
      ])
    }
    
    const añadirVideo = async() => {
      setOpened(false);
      if(previewVideo){
        setModalVisibleLocalVideo(true);
      }
      if(youtubeVideo){       
        setModalVisibleVideo(true);
      }
    }


    let tomarFoto = async() => {
      let options = {
        quality: 1,
        width: 100,
        height: 100,
        base64: true,
        exif: false
      };

      setFlagFotoModal(true);
      let nuevaFoto = await cameraRef.current.takePictureAsync();
      setfotoVideo(nuevaFoto.uri)
      console.log('fotoVideo al salir de tomarFoto es: ', fotoVideo)
      setModalVisibleFoto(!modalVisibleFoto);
      //setfotoVideo(nuevaFoto);
      //previewFoto = nuevaFoto;
      //console.log('previewfoto es: ', fotoVideo)
    };
    

    const onPictureSaved = ({ uri, width, height, exif, base64 }) => {
      console.log('La URI es: ', uri);
      previewFoto = uri;
      console.log('previewFoto es al guardar la foto: ', previewFoto)
      setfotoVideo(uri);
    }


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
      //setOpened(false);
      //setModalVisibleVideo(true);
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
          console.log('fotoVideo en abrirFotoModal es: ', fotoVideo)
          //let asset = await MediaLibrary.createAssetAsync(fotoVideo);
          //setAssetFoto(asset);
          //console.log('asset es: ', asset)
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
      //console.log('im es2: ', im)
      let listaEm = null;
      if(listaActual !== '' && listaActual !== undefined){
        listaEm = JSON.parse(listaActual);
      }
      else {
        listaEm = listaInicial;
      }
      let em = listaEm.videolista;
      let newEm = [];
      let listFilterEm = null;
      
      if((JSON.parse(item).foto) == '') {
      for (let i = 0; i < listaEm.videolista.length; i++){
        if((JSON.parse(item).id) == (JSON.parse(em[i]).id)){
          listFilterEm = listaEm.videolista.filter((lista) => ((JSON.parse(lista).id) !== (JSON.parse(em[i]).id)));
          let emItem = JSON.parse(item);
          if(fotoVideo !== ''){
            emItem.foto = fotoVideo;
            console.log('La FOTO es: ', emItem.foto)
          }
          
          listFilterEm.push(JSON.stringify(emItem));
          console.log('Funciona hasta abrirEmoticono1: ', JSON.parse(listaEm.videolista[i]).foto)
          console.log('Funciona hasta abrirEmoticono2: ', emItem.foto)
        }              
      }
      //listaEm.videolista=newEm;
      
      listaEm.videolista = listFilterEm;
      let listaNueva = JSON.stringify(listaEm);
      l.push(listaNueva);

      console.log('La videolista con emoticonos finalmente es: ', listFilterEm)

      setDatList(listFilterEm);
      setList(listFilterEm);
      setFotoFlag(true);

      const newListas = l.filter((lista) => lista !== singleList);
      const newLists = newListas.filter((lista) => lista !== listaActual);
      await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));

      await AsyncStorage.getItem("LISTAS").then((listas) => {
        setListas(JSON.parse(listas));  
        setListaActual(listaNueva);             
        setFlagList(!flagList);
      });

      console.log('la uri de la foto es: ', fotoVideo);
      console.log('el item seleccionado es: ', item);
      //let assetInfoFoto = await MediaLibrary.getAssetInfoAsync(assetFoto.id);
      //let assetInfoUri = assetInfoFoto.localUri;
      //console.log('assetinfouri es: ', assetInfoUri)
      //setAssetInfo(assetInfoUri);
      setFlagFotoModal(false);
      }
      else {
        for (let i = 0; i < listaEm.videolista.length; i++){
          if((JSON.parse(item).id) == (JSON.parse(em[i]).id)){
            listFilterEm = listaEm.videolista.filter((lista) => ((JSON.parse(lista).id) !== (JSON.parse(em[i]).id)));
            let emItem = JSON.parse(item); 
            emItem.foto = '';
            console.log('La FOTO es: ', emItem.foto)                       
            listFilterEm.push(JSON.stringify(emItem));
            console.log('Funciona hasta abrirEmoticono1: ', JSON.parse(listaEm.videolista[i]).foto)
            console.log('Funciona hasta abrirEmoticono2: ', emItem.foto)
          }              
        }
        //listaEm.videolista=newEm;
        
        listaEm.videolista = listFilterEm;
        let listaNueva = JSON.stringify(listaEm);
        l.push(listaNueva);
  
        console.log('La videolista con emoticonos finalmente es: ', listFilterEm)
  
        setDatList(listFilterEm);
        setList(listFilterEm);
        setFotoFlag(true);
  
        const newListas = l.filter((lista) => lista !== singleList);
        const newLists = newListas.filter((lista) => lista !== listaActual);
        await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));
  
        await AsyncStorage.getItem("LISTAS").then((listas) => {
          setListas(JSON.parse(listas));  
          setListaActual(listaNueva);             
          setFlagList(!flagList);
        });
  
        console.log('la uri de la foto es: ', fotoVideo);
        console.log('el item seleccionado es: ', item);
        //let assetInfoFoto = await MediaLibrary.getAssetInfoAsync(assetFoto.id);
        //let assetInfoUri = assetInfoFoto.localUri;
        //console.log('assetinfouri es: ', assetInfoUri)
        //setAssetInfo(assetInfoUri);
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
      console.log('it es despues de elegir el em1: ', it)
      //getAbrirEmoticono(it);
      setImFlag(it);
      setModalVisibleEmoticon(true);
      
        //it = item;
        //let jsonit = JSON.parse(it);
        //jsonit.emoticono = im;
        //it = JSON.stringify(jsonit);
        //console.log('it es despues de elegir el em2: ', it)
        /*
        if(flagEm===true){
        //setImFlag(item);
        getAbrirEmoticono(item);
        }
        */
      /*
      if(flagEm === true && modalVisibleEmoticon === false){
        abrirEm(item);
      }
      */


      
    }

    const abrirEm = (item) => {
      //setIm(im);
      console.log('im es despues de elegir el em1: ', im)
      if(flagEm === true){
        getAbrirEmoticono(item);
      }
      
      
    }

    const getAbrirEmoticono = async (item) => {
      
      try {
      /*  
      let jsonListMenu = '';
      let jsonListaFinal = '';
      console.log('im es despues de elegir el em2: ', im)
      console.log('item es em2: ', item)
      if (flag===true){
        if (datList.length > 0) {
          jsonListMenu = datList;
          //let jsonListMenu = JSON.parse(listmenusplice);
          
          for (let i = 0; i < datList.length; i++){
              if((JSON.parse(item).id) == ((JSON.parse(datList[i])).id)){
                jsonListaFinal = JSON.parse(jsonListMenu[i]);
                  jsonListaFinal.emoticono = im;
                  const newJsonList = jsonListMenu.filter((lista) => lista !== datList[i]); //listmenusplice[i]
                  newJsonList.push(JSON.stringify(jsonListaFinal));
                  jsonListMenu=newJsonList;
                console.log('Funciona hasta abrirMenuEm1')
              }

          }
          console.log('Funciona hasta abrirMenuEm2')
        }
    }

    else {
        jsonListMenu = listmenuinicial;
        
        for (let i = 0; i < listmenuinicial.length; i++){
            if((JSON.parse(item).id) == ((JSON.parse(listmenuinicial[i])).id)){
              jsonListaFinal = JSON.parse(jsonListMenu[i]);
                jsonListaFinal.emoticono = im;
                const newJsonList = jsonListMenu.filter((lista) => lista !== datList[i]); //listmenusplice[i]
                newJsonList.push(JSON.stringify(jsonListaFinal));
                jsonListMenu=newJsonList;

              console.log('Funciona hasta abrirMenuEm3')

            }
          
        }

    }

      console.log('Funciona hasta abrirMenuEm4, siendo jsonListMenu: ', jsonListMenu)

      const valorListas = await AsyncStorage.getItem("LISTAS");
      const l = valorListas ? JSON.parse(valorListas) : [];
      setDatList(jsonListMenu);
      setList(jsonListMenu);
      setFlag(true);
      setItemFlag("");
      
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

          console.log('JSONLISTINIEM es1: ', jsonListIni)
          l.push(jsonListIni);
          console.log('El NUEVO VALOR DE LISTASEM1 es: ', l)
          const newListas = l.filter((lista) => lista !== singleList);
          const newLists = newListas.filter((lista) => lista !== jsonListNew);  //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
          console.log('EL valor de NEWLISTASEM1 es: ', newLists)
          await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));

          await AsyncStorage.getItem("LISTAS").then((listas) => {
            setListas(JSON.parse(listas)); 
            setListaActual(jsonListIni);                 
            setFlagList(!flagList);            
          });
        }
        catch (error) {
          console.log(error)
        }
      */
      
      const valorListas = await AsyncStorage.getItem("LISTAS");
      const l = valorListas ? JSON.parse(valorListas) : [];
      console.log('im es2: ', im)
      let listaEm = null;
      if(listaActual !== '' && listaActual !== undefined){
        listaEm = JSON.parse(listaActual);
      }
      else {
        listaEm = listaInicial;
      }
      let em = listaEm.videolista;
      let newEm = [];
      let listFilterEm = null;
      
      
      for (let i = 0; i < listaEm.videolista.length; i++){
        if((JSON.parse(item).id) == (JSON.parse(em[i]).id)){
          listFilterEm = listaEm.videolista.filter((lista) => ((JSON.parse(lista).id) !== (JSON.parse(em[i]).id)));
          let emItem = JSON.parse(item);
          emItem.emoticono = im;
          
          listFilterEm.push(JSON.stringify(emItem));
          console.log('Funciona hasta abrirEmoticono1: ', JSON.parse(listaEm.videolista[i]).emoticono)
          console.log('Funciona hasta abrirEmoticono2: ', emItem.emoticono)
        }              
      }
      //listaEm.videolista=newEm;
      
      listaEm.videolista = listFilterEm;
      let listaNueva = JSON.stringify(listaEm);
      l.push(listaNueva);

      console.log('La videolista con emoticonos finalmente es: ', listFilterEm)

      setDatList(listFilterEm);
      setList(listFilterEm);
      setItemFlag(true);

      const newListas = l.filter((lista) => lista !== singleList);
      const newLists = newListas.filter((lista) => lista !== listaActual);
      await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));

      await AsyncStorage.getItem("LISTAS").then((listas) => {
        setListas(JSON.parse(listas));  
        setListaActual(listaNueva);             
        setFlagList(!flagList);
      });

      console.log('la uri de la imagen seleccionada es: ', im);
      console.log('el item seleccionado es: ', item);
      setFlagEm(false);
    }
    catch (error) {
      console.log(error)
    }
    
    }
    
    const renderItem = ({ item, index }) => {
      try {
        if (item !== undefined && item !== null){
          //console.log('los ITEMS SEPARADOS son: ', (singleList.split('[')[1]).split(','))
          //setDat(false);
          /*
          setList((prevState) => {
            prevState=listmenu;
            return (prevState)
          })
          */
         let it = item;
          if(JSON.parse(item).videos.includes("file")){
            previewVideo = JSON.parse(item).videos;
          }
          else {
            youtubeVideo = JSON.parse(item).videos;
          }
          if(JSON.parse(item).foto !== ''){
            previewFoto = JSON.parse(item).foto;
          }
          console.log('previewFoto es en el item: ', previewFoto)

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
              <View style={styles.button5}>
              <TouchableOpacity
                onPress={ () =>
                  Alert.alert(
                    "Eliminar vídeo",
                    "¿Estás seguro de eliminar el vídeo?", [
                        {
                        text: 'No',
                        onPress: () => null,
                        style:"cancel"
                        },
                        {text: 'Sí', onPress: async() => {           
                          //setIndexList(index);
                          //poner {return;} en el onPress si null no funciona
                        try{
                          /*
                          let serieslist = '';
                          let repeticioneslist = '';
                          let tiempolist = '';
                          let videoslist = '';
                          let idlist = '';
                            
                          for (let i = 0; i < (singleList.split('[')[1]).split(',').length; i++){
                            serieslist = serieslist + ',' + (((singleList.split('[')[1]).split(',')[i]).split('\n'))[0];
                            repeticioneslist =  repeticioneslist + ',' + (((singleList.split('[')[1]).split(',')[i]).split('\n'))[1];
                            tiempolist = tiempolist + ',' + (((singleList.split('[')[1]).split(',')[i]).split('\n'))[2];
                            videoslist = videoslist + ',' + (((singleList.split('[')[1]).split(',')[i]).split('\n'))[3];
                            idlist = idlist + ',' + (((singleList.split('[')[1]).split(',')[i]).split('\n'))[4];                            
                          }
        
                          let subseries = serieslist.substring(1, serieslist.length);
                          let subrepeticiones = repeticioneslist.substring(1, repeticioneslist.length);
                          let subtiempo = tiempolist.substring(1, tiempolist.length);
                          let subvideos = videoslist.substring(1, videoslist.length);
                          let subid = idlist.substring(1, idlist.length);
        
                          console.log('series final es igual a: ', subseries)
        
                            //let listseries = [subseries];
                            //let listrepeticiones = [subrepeticiones];
                            //let listtiempo = [subtiempo];
                            //let listvideos = [subvideos];
        
                          console.log('Las series son: ', serieslist)
        
                          let newseries = '';
                          let newrepeticiones = '';
                          let newtiempo = '';
                          let newvideo = '';
                          let newid = '';
        
                          for (let j = 0; j < subseries.split(',').length; j++){
        
                            if(subseries.split(',')[j] !== item.split('\n')[0]){
                              newseries = newseries + ',' + subseries.split(',')[j];
                            }
                            if(subrepeticiones.split(',')[j] !== item.split('\n')[1]){
                              newrepeticiones = newrepeticiones + ',' + subrepeticiones.split(',')[j];
                            }
                            if(subtiempo.split(',')[j] !== item.split('\n')[2]){
                             newtiempo = newtiempo + ',' + subtiempo.split(',')[j];
                            }
                            if(subvideos.split(',')[j] !== item.split('\n')[3]){
                              newvideo = newvideo + ',' + subvideos.split(',')[j];
                            }
                            if(subid.split(',')[j] !== item.split('\n')[4]){
                              newid = newid + ',' + subid.split(',')[j];
                            }
                              
                              
        
                          }
        
                          console.log('la serie primera es: ', (subseries.split(',')[0].split(','))[0])
                          console.log('Las nuevas series son: ', newseries)
                          console.log('Las series del item son: ', item.split('\n')[0])
                          var lista = {};
                          lista.imagen = (singleList.split('\n'))[0];
                          lista.titulo = (singleList.split('\n'))[1];
                          lista.series = newseries.substring(1, newseries.length);
                          lista.repeticiones = newrepeticiones.substring(1, newrepeticiones.length);
                          lista.tiempo = newtiempo.substring(1, newtiempo.length);
                          lista.videos = newvideo.substring(1, newvideo.length);
                          lista.id = newid.substring(1, newid.length);
                          lista.email = (singleList.split('\n'))[(singleList.split('\n')).length - 1];
                            
                            
                          console.log('La lista final es: ', JSON.stringify(lista))
                          */
        
                            /*
                            const newListas = listas.filter((lista) => lista !== singleList);
                            await AsyncStorage.setItem("LISTAS", JSON.stringify(newListas))  //nos quedamos solo con las listas que no coinciden con singleList
                              .then(() => setDat(!dat));
                            */
        
                        
                            // l.push(JSON.stringify(lista));
                            /*
                          const valorList = await AsyncStorage.getItem("LISTAS");
                          const li = valorList ? JSON.parse(valorList) : [];   
                          const nuevasListas = li.filter((lista) => lista !== datList);  //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
                          await AsyncStorage.setItem("LISTAS", JSON.stringify(nuevasListas));
                          console.log('NUEVASLISTAS es al inicio: ', nuevasListas)
                          */
                          
                          if(flag === false){
                            if(listaActual !== ''){
                              listmenuinicial=JSON.parse(listaActual).videolista;
                            }
                            else {
                            listmenuinicial=listaInicial.videolista;
                            }
                          }
                          else {
                            listmenuinicial=datList;
                            console.log('el valor de DATLIST es: ', datList)
                          }
                          
                          const valorListas = await AsyncStorage.getItem("LISTAS");
                          const l = valorListas ? JSON.parse(valorListas) : [];    

                          /*
                          let vids = '[';
        
                          for(let i = 1; i<subseries.split(',').length; i++) {
                            if((listmenu[i]).split('\n')[4] !== item.split('\n')[4]) {
                              vids = vids + (subseries.split(',')[i] + '\n' + subrepeticiones.split(',')[i] + '\n' + subtiempo.split(',')[i] + '\n' + subvideos.split(',')[i]+ '\n' + subid.split(',')[i]) + ',';
                            }
                          }
                          vids = vids.substring(0, vids.length - 1);
                          */  

                          //const valorList = await AsyncStorage.getItem("LISTAS");
                          //const li = valorList ? JSON.parse(valorList) : [];   

                          console.log('LISTMENU antes es1: ', listmenuinicial)

                          listmenusplice = listmenuinicial.filter((lista) => (JSON.parse(lista).id !== JSON.parse(item).id))
                          //listmenuinicial = listmenusplice;
                          setDatList(listmenusplice);


                          //let listmenu = listmenusplice;
                          //(singleList.split('[')[1]).split(',') = listmenu;
                          setList(listmenusplice);
                          setFlag(true);
                          /*
                          if(listmenusplice.length > 1){
                            setList(listmenuinicial);
                            //setFlagList(!flagList);
                          }
                          */
                          console.log('listmenu despues es1: ', listmenuinicial)
                          console.log('LIST state es: ', list)
                          console.log('DATLIST state es: ', datList)
                          console.log('listmenusplice despues es: ', listmenusplice)
                         
                          let listfinal = '';

                          /*
                          if ((((singleList.split('\n'))[(singleList.split('\n')).length - 1]).includes("@")) == true) {
                            listfinal = '[' + (listmenu.toString()).substring(0, (listmenu.toString().length - ((singleList.split('\n'))[(singleList.split('\n')).length - 1]).length));
                          }
                          */                        
                          //listfinal = '[' + (listmenuinicial.toString()).substring(0, (listmenuinicial.toString().length - ((singleList.split('\n'))[(singleList.split('\n')).length - 1]).length));
                          //listfinal = '[' + listmenuinicial.toString();
                          
                          //console.log('LISTFINAL es: ', listfinal)
                          /*
                          if((singleList.split('[')[1]).split(',').length > 1 || listmenuinicial.length > 1) {
                            l.push((singleList.split('\n'))[0] + '\n' + (singleList.split('\n'))[1] + '\n' + listfinal + (singleList.split('\n'))[(singleList.split('\n')).length - 1]);
                            //l.push(listmenusplice);
                            console.log('SE HA AÑADIDO LA LISTA: ', listfinal);
                          */
                            /*
                            l.push((singleList.split('\n'))[0] + '\n' + (singleList.split('\n'))[1] + '\n' + '[' + newseries.substring(1, newseries.length) + 
                              '\n' + newrepeticiones.substring(1, newrepeticiones.length) + '\n' + newtiempo.substring(1, newtiempo.length) + '\n' + 
                              newvideo.substring(1, newvideo.length) + '\n' + (singleList.split('\n'))[(singleList.split('\n')).length - 1])
                            */
                              //item=null;
                            //setDat(!dat);
                            let jsonListNew = '';
                            let listNew = '';
                            let listini = '';
                            let jsonListIni = '';
                            if (listaActual !== ''){
                              listNew = JSON.parse(listaActual);
                              listNew.videolista = listmenusplice;
                              jsonListNew = JSON.stringify(listNew);
                              listini = JSON.parse(listaActual);
                              listini.videolista = listmenuinicial;
                              jsonListIni = JSON.stringify(listini);
                            }
                            else {
                              listNew = listaInicial;
                              listNew.videolista = listmenusplice;
                              jsonListNew = JSON.stringify(listNew);
                              listini = listaInicial;
                              listini.videolista = listmenuinicial;
                              jsonListIni = JSON.stringify(listini);
                            }

                            l.push(jsonListNew);
                            const listarray = [l];
                            console.log('EL valor de l de Lista es: ', l)
                            /*
                            await AsyncStorage.setItem("LISTAS", JSON.stringify(l));
                            const valorList = await AsyncStorage.getItem("LISTAS");
                            const li = valorList ? JSON.parse(valorList) : [];
                            */

                            const newListas = l.filter((lista) => lista !== singleList);
                            const newLists = newListas.filter((lista) => lista !== jsonListIni);  //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
                            console.log('EL valor de newLists es: ', newLists)
                            
                            console.log('EL valor de JSONLISTINI es: ', jsonListIni)
                            await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));

                            //await AsyncStorage.setItem("LISTAS", JSON.stringify(l));
                            

                            /*
                            const newListas = listas.filter((lista) => lista !== listmenuinicial);  //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
                            console.log('La NEWLISTAS es: ', newListas)
                            AsyncStorage.setItem("LISTAS", JSON.stringify(newListas));
                            
                        }
                        */
                          /*
                          await AsyncStorage.getItem("LISTAS").then((listas) => {
                            setListas(JSON.parse(listas));
                          })
                          */
        
                            //const newListas = listas.filter((lista) => lista !== singleList);  //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
                            //await AsyncStorage.setItem("LISTAS", JSON.stringify(newListas));
                            //eliminarLista();
                          await AsyncStorage.getItem("LISTAS").then((listas) => {
                            setListas(JSON.parse(listas));    
                            setListaActual(jsonListNew);              
                            setFlagList(!flagList);

                            //console.log('listmenu antes es: ', listmenu)
                              /*
                                listmenusplice = listmenu.filter((lista) => {
                                  for(let i = 1; i<item.split('\n').length; i++) {
                                  lista.split('\n')[i] !== item.split('\n')[i]
                                  }
                                })
                                (((singleList.split('[')[1]).split(',')).indexOf(lista)).split('\n')[4] !== item.split('\n')[4])
                              */

                            
                              //return [...listmenu]
        
                              /*
                              let removed;
                              setList((prevState) => {
                                console.log('El estado anterior es: ', prevState)
                                if(prevState!==''){
                                removed = prevState.splice(index, 1);
                                console.log('El estado final es: ', prevState)
                                }
                                return [...prevState]
                              });
                              //navigation.navigate("AllLists");
                              */
                          })         
                          
                          // && (listaInicial.videolista.length < 1)
                          if((datList.length == 1)) {
                            let listini = '';
                            let jsonListIni = '';
                            if (listaActual !== ''){
                              listini = JSON.parse(listaActual);
                              listini.videolista = datList;
                              jsonListIni = JSON.stringify(listini);
                            }
                            else {
                              listini = listaInicial;
                              listini.videolista = datList;
                              jsonListIni = JSON.stringify(listini);
                            }

                            //setDat(true);
                            //setFlagList(!flagList);
                            setFlag(false);
                            setList('');
                            setDatList('');
                            console.log('datList length es == 1')
                            const valorListas = await AsyncStorage.getItem("LISTAS");
                            const l = valorListas ? JSON.parse(valorListas) : [];
                            const newListas = l.filter((lista) => lista !== singleList)
                            const nuevasListas = newListas.filter((lista) => lista !== jsonListIni);  //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
                            await AsyncStorage.setItem("LISTAS", JSON.stringify(nuevasListas)).then(() => navigation.navigate("AllLists"));
                            
  
                          }
                          if((datList.length == 0)) {
                            let listini = '';
                            let jsonListIni = '';
                            if (listaActual !== ''){
                              listini = JSON.parse(listaActual);
                              listini.videolista = datList;
                              jsonListIni = JSON.stringify(listini);
                            }
                            else {
                              listini = listaInicial;
                              listini.videolista = datList;
                              jsonListIni = JSON.stringify(listini);
                            }
                            //setDat(true);
                            //setFlagList(!flagList);
                            //setFlag(false);
                            //setList('');
                            //setDatList('');
                            console.log('datList length es == 0')
                            const valorListas = await AsyncStorage.getItem("LISTAS");
                            const l = valorListas ? JSON.parse(valorListas) : [];
                            const newListas = l.filter((lista) => lista !== singleList)
                            const nuevasListas = newListas.filter((lista) => lista !== jsonListIni);  //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
                            await AsyncStorage.setItem("LISTAS", JSON.stringify(nuevasListas));
                            
  
                          }
                          /*
                          await AsyncStorage.getItem("LISTAS").then(() => {
                            navigation.navigate("AllLists");
                          })
                          */
                        }                      
                        catch (error){
                          console.log(error)
                        }
                      }
                    }
                  ])
              }>
                <Image
                  source={datosIm[6].image}
                  style={styles.imagen3}
                />
              </TouchableOpacity>
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
                        setIm(item.image);    //setIm(item.image)
                        //setImFlag(item.image);
                        //setItemFlag(true);
                        //console.log('imflag es: ', imFlag)
                        setFlagEm(true);
                        //getAbrirEmoticono(it); 
                        //setFlagList(!flagList); 
                        
                        }}>
                        <Image
                          style={{marginLeft: 20, marginTop: 10, height: 40, width: 40}}
                          //source={{uri: 'https://picsum.photos/200/200'}}
                          source={item.image}
                        />                      
                    </TouchableOpacity>
                    </View>
                    )}                    
                  />   
                    <Button onPress={() => {
                        console.log('im es antes de elegir el em: ', im)
                        //console.log('el item.image es: ', item.image)
                        //setFlagEm(true);
                        //setFlagList(!flagList);
                        abrirEm(imFlag);
                        setModalVisibleEmoticon(!modalVisibleEmoticon)
                      }}>
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
                          <View style={{ flexDirection: 'row', marginTop: 580}}>
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
                    console.log('el item foto es antes de elegir la foto: ', itemFotoFlag)
                    //console.log('el item.image es: ', item.image)
                    //setFlagList(!flagList);                        
                    abrirFotoModal(itemFotoFlag);
                    setModalVisiblePreview(!modalVisiblePreview)
                    }}>
                    <Text>Añadir foto</Text>
                  </Button>  
                  <Button style={{marginTop: 20}}
                    onPress={() => setModalVisibleFoto(true)}>
                    <Text>Repetir foto</Text>
                  </Button>
                </View>
              </Modal>

              <Modal
                visible={modalVisibleTiempo} 
                animationType='fade' 
                transparent={true}>
                <View style={styles.modalStyle}>
                <Text>Indica el tiempo total empleado en realizar el ejercicio: </Text>
                <View style={{ flexDirection: 'row'}}>
                  <View style={{right: 20, top: 40}}>
                    <TextInput 
                      value={tiempoRealizacion}
                      onChangeText={tiempo => setTiempoRealizacion(tiempo)}
                      multiline={false}
                      style={styles.input4}
                      selectionColor='#515759'
                      maxLength={5}
                      blurOnSubmit={true}
                      returnKeyType="done"
                      keyboardType='number-pad'
                    />
                  </View>
                  <View style={styles.pickerStyle5}>
                    <DropDownPicker
                      placeholder='Tiempo'
                      open={openListTiempo}
                      value={valuelistTiempo}
                      items={numerosTiempo}
                      setOpen={setOpenListTiempo}
                      setValue={setvaluelistTiempo}
                      setItems={setNumerosTiempo}
                      onChangeValue={(value) => {
                        setListValueNumberTiempo(value);
                      }}
                      theme="DARK"
                      mode="BADGE"
                      badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                    />
                  </View>
                </View>
                <View style={{top: 300, right: 70}}>
                <Button onPress={async() => {
                  try{
                  const valorListas = await AsyncStorage.getItem("LISTAS");
                  const l = valorListas ? JSON.parse(valorListas) : [];
                  let jsonListTiempo = null;
                  let jsonListTiempoVideos = '';
                  let listFilterVideos = null;

                  if (listaActual !== '' && listaActual !== undefined) {              
                    jsonListTiempo = JSON.parse(listaActual);                 
         
                    console.log('El tiempo de realización es: ', tiempoRealizacion)
                  }
                  else {              
                    jsonListTiempo = listaInicial;  //listaEm
         
                    console.log('El tiempo de realización es: ', tiempoRealizacion)
                  }

                  jsonListTiempoVideos = jsonListTiempo.videolista;  //em

                  for (let i = 0; i < jsonListTiempo.videolista.length; i++){
                    if((JSON.parse(item).id) == (JSON.parse(jsonListTiempoVideos[i]).id)){
                      listFilterVideos = jsonListTiempo.videolista.filter((lista) => ((JSON.parse(lista).id) !== 
                        (JSON.parse(jsonListTiempoVideos[i]).id)));
                      let videoItem = JSON.parse(item);
                      videoItem.tiempoRealizacion = tiempoRealizacion;
                      
                      listFilterVideos.push(JSON.stringify(videoItem));
                      console.log('Funciona hasta abrirVideo1: ', JSON.parse(jsonListTiempo.videolista[i]).tiempoRealizacion)
                      console.log('Funciona hasta abrirVideo2: ', videoItem.tiempoRealizacion)
                    }              
                  }
                    
                  jsonListTiempo.videolista = listFilterVideos;
                  let listaNueva = JSON.stringify(jsonListTiempo);
                  l.push(listaNueva);

                  setDatList(listFilterVideos);
                  setList(listFilterVideos);
                  setFlagTiempo(true);        

                  const newListas = l.filter((lista) => lista !== singleList);
                  const newLists = newListas.filter((lista) => lista !== listaActual);
                  await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));

                  await AsyncStorage.getItem("LISTAS").then((listas) => {
                    setListas(JSON.parse(listas)); 
                    setListaActual(listaNueva);                 
                    setFlagList(!flagList);            
                  });

                  setModalVisibleTiempo(!modalVisibleTiempo)
                  setTiempoRealizacion('');
                } catch (error){
                  console.log(error)
                }
                }}
                style={styles.button8}>
                    <Text>Guardar</Text>
                </Button>
                <Button onPress={() => {
                    setModalVisibleTiempo(false);
                    }}
                    style={styles.button9}>
                    <Text>Cancelar</Text>
                </Button>
                </View> 
              </View> 
              </Modal>
        
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
                      ref={videoLocalRef}
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

    /*
                      <Button onPress={() => {
                      console.log('im es antes de elegir el em: ', im)
                      //console.log('el item.image es: ', item.image)
                      

                    }}>
                    <Text>Añadir emoticono</Text>
                  </Button>
                  */

    const singleListArray = () => {
      var s = ((singleList.split('\n'))[2]).split(',');
      console.log('s = ', s)
      if(s !== undefined){
        setVideos(s);
      }
      else {
        setVideos("");
      }

    } 

    const openYoutubeApp = () => {
      Linking.canOpenURL('vnd.youtube://').then(supported => {
        if (supported) {
           return Linking.openURL('vnd.youtube://');
        } else {
           return Linking.openURL('https://www.youtube.com/');
        }
     });
    }

    const video = (text) => {
      var valu=text;
      if (valu != undefined){
        valu.toString();
        var arrayt = valu.split(".be/", 2);
                      
        var tex = arrayt[1];

        //console.log('tex: ', tex)
        //setLink("");
        
        return tex;
      }
    }

    const abrirTiempo = () => {
      setModalVisibleTiempo(true);
    }

    const guardarVideo = async () => {
      if ((videos !== undefined) && (videos !== null)){
        console.log('Se ha pulsado guardar Video si videos existe')
        try{
          const valorListas = await AsyncStorage.getItem("LISTAS");
          const l = valorListas ? JSON.parse(valorListas) : [];
          const vid = await AsyncStorage.getItem("VIDEOS");
          const v = vid ? JSON.parse(vid) : [];
          const varray = [v];
          let videoarray = [video];
          console.log('Valor de videos en asyncstorage', v)
          //varray.push(video(link));
          
          const id = (Math.round(Math.random() * 1000)).toString();
          var lista = {};
          lista.series = series;
          lista.repeticiones = repeticiones;
          lista.tiempo = tiempo;
          if(previewVideo){
            lista.videos = videoLocal;
          }
          if(youtubeVideo){
            lista.videos = video(link);
          }
          
          let idVideos = "";
        
          idVideos = (Math.round(Math.random() * 1000)).toString();

          lista.id = idVideos;
          lista.realizado = "no";
          lista.imagenRealizado = datosIm[7].image;
          lista.emoticono = '';
          lista.foto = '';
          var jsonLista = JSON.stringify(lista);
          //v.push(jsonLista);
          //convertimos el array de videos 'v' en un string usando JSON.stringify(v)
          await AsyncStorage.setItem("VIDEOS", JSON.stringify(lista));
          //videolista = videolista.push(series + '\n' + repeticiones + '\n' + tiempo + '\n' + video(link));
          const vi = await AsyncStorage.getItem("VIDEOS");
          const vd = vi ? JSON.parse(vi) : [];

          let jsonListaFinal = null;

          let miLista = null;
          if(listaActual != '' && listaActual != undefined){
            miLista = JSON.parse(listaActual);
          }
          else {
            miLista = listaInicial;
          }

          jsonListaFinal = miLista.videolista;
          jsonListaFinal.push(vi);
          console.log('jsonlistafinal es: ', jsonListaFinal)
          miLista.videolista = jsonListaFinal;
          let listaNueva = JSON.stringify(miLista);
          l.push(listaNueva);
          const newListas = l.filter((lista) => lista !== singleList);
          const newLists = newListas.filter((lista) => lista !== listaActual);
          await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));

          setLink("");
          setSeries("");
          setRepeticiones("");
          setTiempo("");
          var f=varray;
          varray.length=0;
          console.log('Al vaciar array videos el resultado es: ', f)  
          setVideos(f);

          await AsyncStorage.setItem("VIDEOS", JSON.stringify(f));
          console.log('Objeto de videos obtenido de asyncstorage es: ', vd)

          setDatList(miLista.videolista);
          setList(miLista.videolista);
          setVideoFlag(true);

          await AsyncStorage.getItem("LISTAS").then((listas) => {
            setListas(JSON.parse(listas));  
            setListaActual(listaNueva);             
            setFlagList(!flagList);            
          });
          setModalVisibleVideo(false);
          setModalVisibleLocalVideo(false);
      }
      catch(error){
        console.log(error);
      }
    }
  }

/*
    const showAlert = () =>
    Alert.alert(
    "Añadir un archivo",
    "¿Quiere añadir un archivo?", [
        {
        text: 'No',
        onPress: () => {sendEmail([])},
        style:"cancel"
        },
        {text: "Si", onPress: sendEmailWithAttachment}
    ]
    );
*/
    const showAlertImage = () =>
    Alert.alert(
    "Eliminar vídeo",
    "¿Está seguro de eliminar el vídeo?", [
        {
        text: 'No',
        onPress: () => {return;},
        style:"cancel"
        },
        {text: "Sí", onPress: sendEmailWithAttachment}
    ]
    );

    const sendEmail = async(file) => {
      /*
      const valorListas = await AsyncStorage.getItem("LISTAS");
      const l = valorListas ? JSON.parse(valorListas) : [];
      let fileVideo = '';
      for (let i=0; i < l.length; i++){
        if((JSON.parse(l[i])).idlista == listaInicial.idlista){
          let videoString = (JSON.parse(l[i])).videolista;
          fileVideo = (JSON.parse(videoString[0])).videos;
          console.log('fileVideo ES: ', fileVideo)
        }
      }
      */  
    var options = { }
    if(file.length < 1) {
        options = {
        subject: "Enviando email sin archivo adjunto",
        recipients: ["reyesmr97@gmail.com"],
        body: "Insertar cuerpo del email aquí..."
        }
    } 
    else{
        options = {
        subject: "Enviando email con archivo adjunto",
        recipients: ["reyesmr97@gmail.com", "reyesmachuca.romero@gmail.com"],
        body: "Insertar cuerpo del email aquí...",
        attachments: file
        }
    }
    
    let promise = new Promise ((resolve, reject) => {
        MailComposer.composeAsync(options)
        .then((result) => {
            resolve(result)
        })
        .catch((error) => {
            reject(error)
        })
    })

    promise.then(
      result => console.log('email enviado'),
      error => console.log('error al enviar email')
      /*
        result => setStatus("Estado: email " + result.status),
        error => setStatus("Estado: email " + error.status)
      */
    )

    }

    const sendEmailWithAttachment = async() => {
    //get the image to attach
      //await saveFile();
      /*
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: false,
          aspect: [4, 3],
          quality: 1,
      });
      */

      if (fileUri !== null) {
        const valorListas = await AsyncStorage.getItem("LISTAS");
        const l = valorListas ? JSON.parse(valorListas) : [];
        let fileVideo = '';
        for (let i=0; i < l.length; i++){
          if((JSON.parse(l[i])).idlista == listaInicial.idlista){
            let videoString = (JSON.parse(l[i])).videolista;
            fileVideo = (JSON.parse(videoString[0])).videos;
            console.log('fileVideo ES: ', fileVideo)
          }
        }
        console.log('fileVideo ES: ', fileVideo)
        //setVideosDir(fileVideo);
        sendEmail([fileUri]); //file path
      }
      else {
          sendEmail([])
      }
    
    }

    const openShareDialog = async () => {
      //llamamos al modulo 'Sharing' y dentro del modulo llamamos al metodo 'isAvailableAsync'
      //si una funcion es asincrona, le debemos poner async, y a los modulos asincronos se les pone 'await' delante
      if (!(await Sharing.isAvailableAsync())) {
        alert('No se pueden compartir imagenes');
        return;
      }
  
      await saveFile();
      
      if (fileUri !== null) {
        if (previewVideo !== null){
          //await sendEmailWithAttachment();
          //await Sharing.shareAsync(FileSystem.cacheDirectory + "listDir/test0.mp4");
          //await Sharing.shareAsync(fileUri);
          await Sharing.shareAsync(fileUri);
        }
        else {
          await Sharing.shareAsync(fileUri);
        }
      }
      //usamos el metodo shareAsync para compartir la imagen que esta guardada en selectedImage.localUri

    }

    const getFiles = async () => {
      //let media = await MediaLibrary.getAssetsAsync({ mediaType: 'photo' });
      //console.log(media);
      try{
        var lista = {};
        const valorListas = await AsyncStorage.getItem("LISTAS");
        const l = valorListas ? JSON.parse(valorListas) : [];

        for (let i=0; i < l.length; i++){
          if((JSON.parse(l[i])).idlista == listaInicial.idlista){
            lista.imagen = (JSON.parse(l[i])).imagen;
            lista.titulo = (JSON.parse(l[i])).titulo;
            lista.videolista = (JSON.parse(l[i])).videolista;
        //lista.series = listaInicial.videolista.series;
        //lista.repeticiones = listaInicial.videolista.repeticiones;
        //lista.tiempo = listaInicial.videolista.tiempo;
        //lista.videos = listaInicial.videolista.videos;
        //lista.id = listaInicial.videolista.id;
            lista.email = (JSON.parse(l[i])).email;
            lista.idlista = (JSON.parse(l[i])).idlista;
            lista.fechacreacion = (JSON.parse(l[i])).fechacreacion;
            lista.listaRealizado = (JSON.parse(l[i])).listaRealizado;
            lista.imagenListaRealizado = (JSON.parse(l[i])).imagenListaRealizado;
            lista.fechaListaRealizado = (JSON.parse(l[i])).fechaListaRealizado;
            lista.fondo = (JSON.parse(l[i])).fondo;
            break;
          }
        }
        /*
        for(let i = 0; i < listaInicial.videolista.length; i++){
          lista.series = lista.series + ',' + (((singleList.split('[')[1]).split(',')[i]).split('\n'))[0];
          lista.repeticiones = lista.repeticiones + ',' + (((singleList.split('[')[1]).split(',')[i]).split('\n'))[1];
          //lista.tiempo = (singleList.split('\n'))[i][2];
          lista.tiempo = lista.tiempo + ',' + (((singleList.split('[')[1]).split(',')[i]).split('\n'))[2];
          lista.videos = lista.videos + ',' + (((singleList.split('[')[1]).split(',')[i]).split('\n'))[3];
          lista.id = lista.id + ',' + (((singleList.split('[')[1]).split(',')[i]).split('\n'))[4];
        }
        */
        var jsonLista = JSON.stringify(lista, null, 2);
        console.log('la lista en formato JSON es: ', jsonLista);
        fileUri = FileSystem.documentDirectory + "lista.txt";
        await FileSystem.writeAsStringAsync(fileUri, jsonLista, { encoding: FileSystem.EncodingType.UTF8 });
        file = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });

        if(previewVideo != null){

        let listaVideos = lista.videolista;
        let copyVideos = null;
        let base64Img = [];
        console.log('listaVideos es', listaVideos)

        
        //const metaDataDir = await FileSystem.getInfoAsync(FileSystem.documentDirectory + dirUri);
        //const isDir = metaDataDir.isDirectory;
        try {
          
            await FileSystem.makeDirectoryAsync(
                dirUri,
                { intermediates: true }
            );
          
            //await FileSystem.deleteAsync(dirUri, { idempotent: true });

            for (let i = 0; i < listaVideos.length; i++){
              copyVideos = await FileSystem.copyAsync({
                from: (JSON.parse(listaVideos[i])).videos,
                to: `${dirUri}/test`+ [i] +`.mp4`,
              });
              const fsRead = await FileSystem.readAsStringAsync(`${dirUri}/test`+ [i] +`.mp4`, {
                encoding: "base64",
              });
              /*
              base64Img.push(`data:video/mp4;base64,${fsRead}`);
              base64Video = base64Img.toString();
            */
            console.log('se ha copiado el video en la carpeta dirUri', dirUri)
            const read = await FileSystem.readDirectoryAsync(`${dirUri}`);
            //setVideosDir(read);
            console.log('El contenido del directorio cache es: ', read)
            /*
            //console.log('Los videos en formato base64 son: ', base64Img)
            //const sourcePath = `${DocumentDirectoryPath}/myList.zip`;
            //const targetPath = DocumentDirectoryPath;
            */
            }
            /*
            const dataVideo = await new JSZip.external.Promise((resolve, reject) => {
              JSZipUtils.getBinaryContent(dirUri, (err, data) => {
                if (err) {
                  reject(err)
                } else {
                  resolve(data)
                }
              })
            })
            
           
            console.log('Funciona hasta getBinaryContent')
            
            const zip = await JSZip.loadAsync(dataVideo)
            zip.forEach(async (relativePath, file) => {
              console.log('file: ', file)
              console.log('relativePath: ', relativePath) 
            })
            
            */
            /*
            zip.folder(dirUri);
            
            zip.generateAsync({ type: "string" }).then(function (content) {
              //const base64Data = content;
              console.log(content)
            });
            */

            //console.log('Funciona hasta const zip', zip.files)

            /*
            //Este es el método zip definitivo
            zip(dirUri, uri)
            .then((path) => {
              console.log(`zip completed at ${path}`)
            })
            .catch((error) => {
              console.error(error)
            })
            
            */  

        } catch (e) {
          console.info("ERROR", e);
        }

        //(JSON.parse(listaVideos[i])).videos
        //const asset = await MediaLibrary.createAssetAsync(fileUri)
        //await MediaLibrary.createAlbumAsync("Download", asset, false)
        }

      } catch (error){
      console.log(error)
      }
    };


    const saveFile = async () => {
    if (Platform.OS === 'ios') {
      getFiles();
    } else {
      //getFiles();
        try{
          const writegranted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          );
          //const writeGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
          if (writegranted) {
            try {
                getFiles();
            } catch (e) {
              console.log(e);
            }
            /*
            // Start downloading
            const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
            // Check if permission granted
            let directoryUri = permissions.directoryUri;
            //const fileUri = `${FileSystem.documentDirectory}${filename}`;
            let data = "Hello World";
            // Create file and pass it's SAF URI
            await StorageAccessFramework.createFileAsync(directoryUri, "filename", "application/json").then(async(fileUri) => {
              // Save data to newly created file
              await FileSystem.writeAsStringAsync(fileUri, data, { encoding: FileSystem.EncodingType.UTF8 });
            })
            .catch((e) => {
              console.log(e);
            });
            */
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
                console.log('Se puede escribir en el almacenamiento externo');
                const permission = await MediaLibrary.getPermissionsAsync();
                console.log(permission);
                if (permission.granted) {
                  // we want to get all the files
                  getFiles();
                }
                if (!permission.granted && permission.canAskAgain) {
                  const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();
  
                  if (status === 'denied' && canAskAgain) {
                    Alert.alert('El usuario debe aceptar los permisos para enviar la lista');
                  }
                  if (status === 'granted'){
                    getFiles();
                  }
                  if (status === 'denied' && !canAskAgain) {
                    console.log("El usuario ha denegado el permiso y no se puede volver a preguntar");
                  }
                }
                if (!permission.canAskAgain && !permission.granted) {
                  console.log("El usuario ha denegado el permiso y no se puede volver a preguntar");
                }
                /*
                const asset = await MediaLibrary.createAssetAsync('file:///storage/emulated/0/Teleco erasmus/1° semestre/IMG_20191001_004207.jpg');
                const album = await MediaLibrary.getAlbumAsync('Download');
                if (album == null) {
                  await MediaLibrary.createAlbumAsync('Download', asset, false);
                } else {
                  await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                }
                */
              } catch (e) {
                console.log(e);
              }
          }
          else if (granted === PermissionsAndroid.RESULTS.DENIED){
            // If permission denied then show alert
            Alert.alert('Error, no se han aceptado los permisos de almacenamiento');
            console.log('No se puede escribir en el almacenamiento externo');
          }
          else {
            Alert.alert('Error, no se han aceptado los permisos de almacenamiento');
            console.log('No se puede escribir en el almacenamiento externo');
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
    
    console.log('el valor de num es: ', num)
    //console.log('el valor del array de videos en Lista es: ', (singleList.split('[')[1]))
    //console.log('el valor del array de videos en Lista2 es: ', (singleList.split('[')[1].split(',')))
    //console.log('el valor del tiempo del video es: ', (((singleList.split('[')[1]).split(',')[0]).split('\n'))[2])


    let importarVideo = async() => {
      /*
      for (let i=0; i<Imagenes.length; i++) {
        Imagenes.push(Imagenes[i]);
      }
      */

      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      //si el usuario ha denegado el permiso para acceder a su galeria, entonces sale una alerta
      if (permissionResult.granted == false) {
      alert('Permisos para acceder a la camara son requeridos');
      return;
      }
      //cuando el usuario escoge una imagen de su galeria, pickerResult retorna la imagen que escogio. Se pone 'await' porque es asincrono.
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });;
      
      if (pickerResult.cancelled === true) {
        return; //al poner solo return, si no se escoge ninguna imagen, no da error
      }
      
      setVideoLocal(pickerResult.uri);  //de esta forma, estaria actualizado el estado
      //setFlag(true);
      
    };


    if((listaInicial.imagen) == datos[num].image){
      component = <Image
      //source={{uri: 'https://picsum.photos/200/200'}}
      source={datos[num].image}
      style={styles.imagen}
      //si existe el estado (si es distinto de null), se pinta una imagen (de la uri) que escogemos en la galeria. 
      //Si no existe el estado (si es null), se muestra la imagen 'picsum.photos' por defecto
      />;
    }
    else {
      component = <Image
      //source={{uri: 'https://picsum.photos/200/200'}}
      //la listaInicial puede que tenga que ser un string
      source={{uri: listaInicial.imagen.toString() }}
      style={styles.imagen}
      //si existe el estado (si es distinto de null), se pinta una imagen (de la uri) que escogemos en la galeria. 
      //Si no existe el estado (si es null), se muestra la imagen 'picsum.photos' por defecto
      />;
    }



/*
    try {
      if(flagEm === true){
        setModalVisibleEmoticon(true);
      }
    }
    catch (error){
      console.log(error)
    }
*/


    //(((singleList.split('[')[2]).split(',')).split('\n'))[1]
    /*
    if(realizado == "no") {
      imagenRealizado = <Image
      //source={{uri: 'https://picsum.photos/200/200'}}
      source={datos[15].image}
      style={styles.imagen4}
      //si existe el estado (si es distinto de null), se pinta una imagen (de la uri) que escogemos en la galeria. 
      //Si no existe el estado (si es null), se muestra la imagen 'picsum.photos' por defecto
      />;
    }
    else {
      imagenRealizado = <Image
      //source={{uri: 'https://picsum.photos/200/200'}}
      source={datos[14].image}
      style={styles.imagen4}
      //si existe el estado (si es distinto de null), se pinta una imagen (de la uri) que escogemos en la galeria. 
      //Si no existe el estado (si es null), se muestra la imagen 'picsum.photos' por defecto
      />;
    }
  */
    //console.log('La LISTA es: ', listaInicial)
/*
    try{
      if((singleList.split('[')[1]).split(',') !== undefined) {
        for(let i = 0; i<(singleList.split('[')[1]).split(',').length; i++) {
          
          vids = (((singleList.split('[')[1]).split(',')[i])[0] + '\n' + ((singleList.split('[')[1]).split(',')[i])[1] + '\n' + ((singleList.split('[')[1]).split(',')[i])[2] + '\n' + ((singleList.split('[')[1]).split(',')[i])[3]);
          
        }
        console.log('vids = ', vids)
        //listmenu = singleList.split('[')[1].split(',');
      }
    } catch (error){
      console.log(error)
    }
*/
      //        for (let j = 0; i<(((singleList.split('[')[2]).split(',')).split('\n')).length; j++){}
      //[singleList.split('\n')[2] + ',' + singleList.split('\n')[3] + ',' + singleList.split('\n')[4] + ',' + singleList.split('\n')[5]]
    

     
    

    
/*
              <View style={styles.button6}>
                <Button onPress={() => setModalVisible(true)}>
                    <Text>Añadir recordatorio</Text>
                </Button>
              </View>
              <View>
                <Modal
                visible={modalVisible} 
                animationType='fade' 
                transparent={true}>
                <View style={styles.modalStyle}>
                <View style={styles.button7}>
                  <Button onPress={showDatepicker} title="Show date picker!">
                    <Text>Seleccionar día</Text>
                  </Button>
                </View>
                <View style={styles.button7}>
                  <Button onPress={showTimepicker} title="Show time picker!">
                    <Text>Seleccionar hora</Text>
                  </Button>
                </View>
                </View>
                <Text style={{marginLeft:62, bottom: 50}}>selected: {(date) ? (date.toLocaleString()) : ''}</Text>               
                  {show && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, value) => {
                            setShow(false);
                            const currentDate = value || date;
                            setDate(currentDate);
                            
                            //setSelectedDate(selectedDate);
                            //setDay(currentDate);
                            //setTime(currentDate);
                      
                            
                            let tempDate = new Date(currentDate);
                            let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
                            let fTime = 'Horas: ' + tempDate.getHours() + ' | Minutes: ' + tempDate.getMinutes();
                            console.log('EL dia elegido es: ', fDate)
                            console.log('LA hora elegida es: ', fTime)
                            setTime(currentDate);
                            
                            if (Platform.OS === 'android') {
                              setShow(false);
                            }
                                                                         
                          }}
                          />
                      )}
                      <Button onPress={async () => {
                        let tiempo = new Date(time);
                        let dia = tiempo.getDay();
                        console.log('el dia es: ', dia)
                        let mes = tiempo.getMonth();
                        let hora = tiempo.getHours();
                        let minutos = tiempo.getMinutes();
                        let segundos = tiempo.getSeconds();
    
                        
                        if (Platform.OS === "android") {
                          await Notifications.setNotificationChannelAsync("recordatorio", {
                            name: "Recordatorio de ejercicio",
                            description: "Recordar realizar el ejercicio!",
                            importance: Notifications.AndroidImportance.HIGH,
                            sound: "default",
                          });
                                            
                        await Notifications.scheduleNotificationAsync({
                          identifier: "myidentifer",
                          content: {
                            title: "Tienes un ejercicio pendiente! 🏋️‍♂️",
                            body: 'Entra en My GymList y haz tu rutina de ejercicios',
                            data: { data: "goes here" },
                          },
                          trigger: {
                            channelId: "recordatorio",
                            hour: hora,
                            minute: minutos,
                            repeats: true
                           },
                          });
                        }
                        else {
                          await Notifications.scheduleNotificationAsync({
                            identifier: "myidentifer",
                            content: {
                              title: "Tienes un ejercicio pendiente! 🏋️‍♂️",
                              body: 'Entra en My GymList y haz tu rutina de ejercicios',
                              data: { data: "goes here" },
                            },
                            trigger: {
                              weekday: dia,
                              hour: hora,
                              minute: minutos,
                              repeats: true
                             },
                            });
                        }
                        
                        console.log('Se ha creado el recordatorio')
                        setModalVisible(false);                  
                      }} 
                      style={styles.button8}>
                        <Text>Guardar</Text>
                      </Button>
                    </Modal>
                  </View>
                    <MenuTrigger>
                      <Text>Abrir menu</Text>

                    </MenuTrigger> 
                      <Entypo name="dots-three-vertical" size={24} color="black" />
                <TouchableOpacity onPress={() => {
                  setModalVisible(true);                  
                }} 
                style={styles.button5}>

                </TouchableOpacity>


              <Button title="Fade In View" onPress={fadeIn} />

                  <TooltipMenu
                    items={[
                      {
                        label: 'textoRealizado',
                        onPress: () => abrirMenu,
                      },
                    ]}
                    onRequestClose = {hideMenu}
                  >
                    <View>
                      <Image
                        source={datos[16].image}
                        style={styles.imagen5}
                      />
                    </View>
                  </TooltipMenu>

                  <Modal 
                    visible={modalVisible} 
                    animationType='fade' 
                    transparent={true}>
                      <View style={styles.modalStyle}>
                        <TouchableOpacity onPress={() => {
                          if(realizado == "no") {
                            setRealizado("si");
                            listaInicial.realizado="si";
                            setTextoRealizado("Desmarcar como realizado");
                            imagenRealizado = <Image
                            //source={{uri: 'https://picsum.photos/200/200'}}
                            source={datos[15].image}
                            style={styles.imagen4}
                            //si existe el estado (si es distinto de null), se pinta una imagen (de la uri) que escogemos en la galeria. 
                            //Si no existe el estado (si es null), se muestra la imagen 'picsum.photos' por defecto
                            />;
                          }
                          else {
                            setRealizado("no");
                            listaInicial.realizado="no";
                            setTextoRealizado("Marcar como realizado");
                            imagenRealizado = <Image
                            //source={{uri: 'https://picsum.photos/200/200'}}
                            source={datos[14].image}
                            style={styles.imagen4}
                            //si existe el estado (si es distinto de null), se pinta una imagen (de la uri) que escogemos en la galeria. 
                            //Si no existe el estado (si es null), se muestra la imagen 'picsum.photos' por defecto
                            />;
                          }
                          setModalVisible(!modalVisible);
                        }}>
                          <Text> {textoRealizado} </Text>
                        </TouchableOpacity>
                      </View>
                  </Modal>

      try {
        if(idItem == id){          
          //setList(listmenusplice);
          }
          //setList(listmenu);
        else{
          //setList(listmenu);
        }
        
      } catch (error){
        console.log(error)
      }

*/

/*
const getItemLayout = (data, index) => (
  { length: 50, offset: 50 * index, index }
);
*/


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
  setFlagBackground(true);

  //añadirFondo();
  
};
/*
let añadirFondo = () => {
  addBackground();
}
*/

let addBackground = async() => {
  const valorListas = await AsyncStorage.getItem("LISTAS");
  const l = valorListas ? JSON.parse(valorListas) : [];
      //setTitle(title);
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
  const newLists = newListas.filter((lista) => lista !== listaActual);  //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
  
  let listini = listaInicial;
  if(datList.length>0){
    listini.videolista = datList;
  }
  let listTi = listini.videolista;
  let jsonListIni = JSON.stringify(listini);
  let jsonListNew = JSON.stringify(lista);
  setList(listTi);
  setDatList(listTi);
  setFlagFondo(true);
  setFlagBackground(false);
  
  await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));
  await AsyncStorage.getItem("LISTAS").then((listas) => {
    setListas(JSON.parse(listas)); 
    setListaActual(jsonListNew);
    setFlagList(!flagList);                 
  });
}

try {
  if(dateVisible === true) {
    datepick = (<DateTimePicker
    testID="dateTimePicker"
    value={date}
    mode={mode}
    is24Hour={true}
    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
    onChange={(event, value) => {
      console.log('al entrar en onchange, show es: ', show)
      setDateVisible(!dateVisible);
      
      const currentDate = value || date;
      //setShow(false);
/*
      if (dateVisible === true) {
        console.log('el valor de show1 es: ', show)
        setShow(false);
        console.log('el valor de show2 es: ', show)
      }
      */
      console.log('el valor de show3 es: ', show)
      setDate(currentDate);
      //setSelectedDate(value);
      let tempDate = new Date(currentDate);
      let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
      let fTime = 'Horas: ' + tempDate.getHours() + ' | Minutes: ' + tempDate.getMinutes();
      console.log('EL dia elegido es: ', fDate)
      console.log('LA hora elegida es: ', fTime)
      setTime(currentDate);
      
    }}
    />);
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
    addBackground();
  }
  } catch (error){
  console.log(error)
}
/*
const handleKeyPress = ({ nativeEvent: { key: keyValue } }) => {
  //console.log(keyValue);
  if(keyValue === "next")
  {
    setEdit(false);
    console.log("enter");
  }
};
*/

      return (
        <ImageBackground source={{uri:
          ((listaActual !== '') ? ((JSON.parse(listaActual).fondo !== '') ? (JSON.parse(listaActual).fondo) : 
          ((listaInicial.fondo!== '') ? (listaInicial.fondo) : 
          'https://images.pexels.com/photos/4589470/pexels-photo-4589470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')) 
          : ((listaInicial.fondo !== '') ? (listaInicial.fondo) : 
          ('https://images.pexels.com/photos/4589470/pexels-photo-4589470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')
          ))}} resizeMode="cover" style={styles.imagen13}>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', marginTop: 10}}>
            <View style={styles.listaRealizadoIm}>
              <Image
                source={(listaActual !== '') ? (JSON.parse(listaActual).imagenListaRealizado) : (listaInicial.imagenListaRealizado)}
                style={styles.imagen6}
              />
            </View>
            <View style={{left: 23, height: 130, width: 160}}>
              <TextInput 
                value={(listaActual !== '') ? (JSON.parse(listaActual).titulo) : (listaInicial.titulo)}
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
                    <MenuOptions optionsContainerStyle={{width:200,height:80}}>
                      <MenuOption value={1} 
                        style={{marginLeft: 30, marginTop: 3}}
                        onSelect={() => añadirVideo()}
                        text="Añadir video"/>
                      <MenuOption value={2}
                        style={{marginLeft: 30, marginTop: 0}}
                        onSelect={() => abrirFondo()}
                        text="Añadir fondo de pantalla" />
                    </MenuOptions>
              </Menu>
            </View>

            
          </View>
            <Modal
                visible={modalVisible} 
                animationType='fade' 
                transparent={true}>
                <View style={styles.modalStyle}>
                <View style={styles.button7}>
                  <Button onPress={showDatepicker} title="Show date picker!">
                    <Text>Seleccionar día</Text>
                  </Button>
                </View>
                <View style={styles.button7}>
                  <Button onPress={showTimepicker} title="Show time picker!">
                    <Text>Seleccionar hora</Text>
                  </Button>
                </View>
               
              <Text style={{marginLeft: 10, bottom: 90}}>Recibir notificación con una antelación de: </Text>

              <View style={{ flexDirection: 'row'}}>
                  <View style={styles.pickerStyle3}>
                    <DropDownPicker
                      placeholder='Añadir aviso'
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
                  <View style={{justifyContent: 'center', bottom: 75}}>
                    <Text>Minutos</Text>
                  </View>
                </View>
                </View>
                <Text style={{marginLeft: 55, bottom: 180}}>seleccionado: {(date) ? (date.toLocaleString()) : ''}</Text>               
                {datepick}
                
                  <Button onPress={async () => {   
                    let tiempo = new Date(time);
                    let dia = tiempo.getDay();
                    console.log('el dia es: ', dia)
                    let mes = tiempo.getMonth();
                    let hora = tiempo.getHours();
                    let tiempoml = tiempo.getTime();
                    let minutos = '';
                    let minutosml = '';
                    //let segundos = '';
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
                    //horasElegido = tiempo.getHours();
                    //minutosElegido = tiempo.getMinutes();
                    console.log('minutosElegido es', minutosElegido)
                    console.log('el valor de repeat es: ', repeat)


                    if (Platform.OS === "android") {
                      await Notifications.setNotificationChannelAsync("recordatorio", {
                        name: "Recordatorio de ejercicio",
                        description: "Recordar realizar el ejercicio!",
                        importance: Notifications.AndroidImportance.HIGH,
                        sound: "default",
                      });                    

                      await Notifications.scheduleNotificationAsync({
                        identifier: "myidentifer",
                        content: {
                          title: tituloList,
                          body: 'Entra en My GymList y haz tu rutina de ejercicios a las ' + horasElegido + ':' + minutosElegido,
                        },
                        trigger: {
                          channelId: "recordatorio",                       
                          weekday: diaSemana, //Sunday
                          hour: hora,
                          minute: minutos,
                          repeats: true,
                        },
                      });
                    }
                    
                    else {
                      await Notifications.scheduleNotificationAsync({
                        identifier: "myidentifer",
                        content: {
                          title: tituloList,
                          body: 'Entra en My GymList y haz tu rutina de ejercicios a las ' + horasElegido + ':' + minutosElegido,
                        },
                        trigger: {
                          channelId: "recordatorio",                       
                          weekday: diaSemana, //Sunday
                          hour: hora,
                          minute: minutos,
                          repeats: true,
                         },
                        });
                    }
                    console.log('el dia de la semana es: ', diaSemana)
                    console.log('Se ha creado el recordatorio')

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
                </Modal>
            

                <Modal
                  visible={modalVisibleVideo} 
                  animationType='fade' 
                  transparent={true}>
                  <View style={styles.modalStyle}>
                    <Text style={styles.titleVideo}>Añadir Vídeo</Text>                 
                    <TextInput
                      placeholder="Series"
                      value={series}
                      onChangeText={setSeries}
                      style={styles.input2}
                      multiline={true}
                      selectionColor='#515759'
                    /> 
                    <TextInput
                      placeholder="Repeticiones"
                      value={repeticiones}
                      onChangeText={setRepeticiones}
                      style={styles.input2}
                      multiline={true}
                      selectionColor='#515759'
                    /> 
                    <TextInput
                      placeholder="Tiempo"
                      value={tiempo}
                      onChangeText={setTiempo}
                      style={styles.input2}
                      multiline={true}
                      selectionColor='#515759'
                    /> 
                    <View style={{ flexDirection: 'row' }}>
                      <View>
                        <TextInput
                          placeholder="Insertar link del vídeo de Youtube"
                          value={link}
                          onChangeText={(text) => setLink(text)}
                          style={styles.input3}
                          selectionColor='#515759'
                        />
                      </View>
                      <View style={styles.button11}>
                        <TouchableOpacity onPress={openYoutubeApp}>
                          <Image
                            source={datosIm[16].image}
                            style={styles.imagen12}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>                                                
                  </View>
                  <Button onPress={guardarVideo} 
                  style={styles.button10}>
                    <Text>Guardar</Text>
                  </Button>      
                  <Button onPress={() => {setModalVisibleVideo(false);}} 
                  style={styles.button10}>
                    <Text>Cancelar</Text>
                  </Button>         
                </Modal>

                <Modal
                  visible={modalVisibleLocalVideo} 
                  animationType='fade' 
                  transparent={true}>
                  <View style={styles.modalStyle}>
                    <Text style={styles.titleVideo}>Añadir Vídeo</Text>                 
                    <TextInput
                      placeholder="Series"
                      value={series}
                      onChangeText={setSeries}
                      style={styles.input2}
                      multiline={true}
                      selectionColor='#515759'
                    /> 
                    <TextInput
                      placeholder="Repeticiones"
                      value={repeticiones}
                      onChangeText={setRepeticiones}
                      style={styles.input2}
                      multiline={true}
                      selectionColor='#515759'
                    /> 
                    <TextInput
                      placeholder="Tiempo"
                      value={tiempo}
                      onChangeText={setTiempo}
                      style={styles.input2}
                      multiline={true}
                      selectionColor='#515759'
                    /> 
                    <View style={{ marginTop: 10 }}>
                      <Button
                        title="Abrir vídeo"
                        style={{marginBottom: 10, marginTop: 10, backgroundColor: '#7284b5', borderColor: '#7284b5'}}
                        onPress={importarVideo}>
                        <Text>Abrir vídeo</Text>                                  
                      </Button>
                    </View>                                                
                  </View>
                  <Button onPress={guardarVideo} 
                  style={styles.button10}>
                    <Text>Guardar</Text>
                  </Button>      
                  <Button onPress={() => {setModalVisibleLocalVideo(false);}} 
                  style={styles.button10}>
                    <Text>Cancelar</Text>
                  </Button>         
                </Modal>

            {component}
            
            <FlatList 
              data={list ? list : listaInicial.videolista}
              extraData={flagList}
              initialNumToRender={1}
              keyExtractor={( item , index) => index.toString()}
              renderItem={renderItem}
            />

            <View style={{ flexDirection: 'row', marginLeft: 40, marginTop: 10 }}>
              <View style={styles.button2}>
                <TouchableOpacity onPress={eliminarLista}>
                  <Image
                    source={datosIm[21].image}
                    style={styles.imagen}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.button12}>
                <TouchableOpacity onPress={openShareDialog}>
                  <Image
                    source={datosIm[4].image}
                    style={styles.imagen}
                  />
                </TouchableOpacity>
              </View>
            </View>
        </View>
        </ImageBackground>
      );
  
}

/*
                <View style={{ flexDirection: 'row'}}>
                  <View style={styles.pickerStyle4}>
                    <DropDownPicker
                      placeholder='Repetir cada día'
                      open={openListRep}
                      value={valuelistRep}
                      items={numerosRep}
                      setOpen={setOpenListRep}
                      setValue={setvaluelistRep}
                      setItems={setNumerosRep}
                      onChangeValue={(value) => {
                        setListValueNumberRep(value);
                        console.log('el valor de rep es: ', listValueNumberRep)
                      }}
                      theme="DARK"
                      mode="BADGE"
                      badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                    />
                  </View>
                </View>


                    await Notifications.scheduleNotificationAsync({
                      identifier: "myidentifer",
                      content: {
                        title: tituloList,
                        body: 'Entra en My GymList y haz tu rutina de ejercicios a las ' + tiempo.getHours() + ':' + tiempo.getMinutes(),
                        data: { data: "goes here" },
                      },
                      trigger: {
                        channelId: "recordatorio",
                        hour: hora,
                        minute: minutos,
                        repeats: repeat !== '' ? repeat : false,
                       },
                      });
                      
                <Picker style={styles.button7}
                  ref={pickerRef}
                  selectedValue={selectedLanguage}
                  onValueChange={(itemValue, itemIndex) =>
                  setSelectedLanguage(itemValue)
                  }>
                  <Picker.Item label="Java" value="java" />
                  <Picker.Item label="JavaScript" value="js" />
                </Picker>

        <DatePicker
        onSelectedChange={value => {      
          setSelectedDateD(value || date);
          //setShow(Platform.OS === 'ios' ? true : false);
        }}
        />
        

                      <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, value) => {
                            const currentDate = value || date;
                            //setShow(Platform.OS === 'ios' ? true : false);
                            setDate(currentDate);
                            
                            //setSelectedDate(selectedDate);
                            //setDay(currentDate);
                            //setTime(currentDate);
                      
                            
                            let tempDate = new Date(currentDate);
                            let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
                            let fTime = 'Horas: ' + tempDate.getHours() + ' | Minutes: ' + tempDate.getMinutes();
                            console.log('EL dia elegido es: ', fDate)
                            console.log('LA hora elegida es: ', fTime)
                            setTime(currentDate);
                            /*
                            if (Platform.OS === 'android') {
                              setShow(false);
                            }
                            */    
                            //setShow(false);     
                            /*                                    
                          }}
                          />
                          */
                         /*
              <Menu>
                <MenuTrigger
                  style={{left: 70, top: 35, height: 30, width: 30}}>
                  <Entypo name="dots-three-vertical" size={24} color="black" />
                </MenuTrigger> 
                  <MenuOptions optionsContainerStyle={{width:300, height:50}}>
                    <MenuOption onSelect={() => 
                      eliminarRecordatorios(list)
                    }
                      style={{marginLeft: 30, marginTop: 0}}
                      text={"Eliminar recordatorios"} />

                  </MenuOptions>
              </Menu>


              <Text style={styles.title} category="h1"> 
                {listaInicial.titulo + '\n'}
              </Text>
              <Menu 
                ref={index.toString()}
                visible={visible}
                anchor={<Text onPress={showMenu}>Show menu</Text>}
                onRequestClose={hideMenu}>
                  <MenuItem onPress={async() => {
                    let serieslist = '';
                    let repeticioneslist = '';
                    let tiempolist = '';
                    let videoslist = '';
                    for (let i = 0; i < (singleList.split('[')[1]).split(',').length; i++){
                      serieslist = serieslist + ',' + (((singleList.split('[')[1]).split(',')[i]).split('\n'))[0];
                      repeticioneslist =  repeticioneslist + ',' + (((singleList.split('[')[1]).split(',')[i]).split('\n'))[1];
                      tiempolist = tiempolist + ',' + (((singleList.split('[')[1]).split(',')[i]).split('\n'))[2];
                      videoslist = videoslist + ',' + (((singleList.split('[')[1]).split(',')[i]).split('\n'))[3];
                    }
                    let listseries = [serieslist];
                    let listrepeticiones = [repeticioneslist];
                    let listtiempo = [tiempolist];
                    let listvideos = [videoslist];

                    let newseries = '';
                    let newrepeticiones = '';
                    let newtiempo = '';
                    let newvideo = '';

                    for (let j = 0; j < (singleList.split('[')[1]).split(',').length; j++){
                      if(item.split('\n')[0] == serieslist[j]){
                        newseries = listseries.filter((series) => series !== item.split('\n')[0]);
                      }
                      if(item.split('\n')[1] == repeticioneslist[j]){
                        newrepeticiones = listrepeticiones.filter((repeticiones) => repeticiones !== item.split('\n')[1]);
                      }
                      if(item.split('\n')[2] == tiempolist[j]){
                        newtiempo = listtiempo.filter((tiempo) => tiempo !== item.split('\n')[2]);
                      }
                      if(item.split('\n')[3] == videoslist[j]){
                        newvideo = listvideos.filter((video) => video !== item.split('\n')[3]);
                      }

                    }
                    const valorListas = await AsyncStorage.getItem("LISTAS");
                    const l = valorListas ? JSON.parse(valorListas) : [];
                    var lista = {};
                    lista.imagen = (singleList.split('\n'))[0];
                    lista.titulo = (singleList.split('\n'))[1];
                    lista.series = '';
                    lista.repeticiones = '';
                    lista.tiempo = '';
                    lista.videos = '';
                    lista.email = (singleList.split('\n'))[(singleList.split('\n')).length - 1];

                    for(let i = 0; i<(singleList.split('[')[1]).split(',').length; i++){
                      lista.series = lista.series + ',' + newseries[i];
                      lista.repeticiones = lista.repeticiones + ',' + newrepeticiones[i];
                      lista.tiempo = lista.tiempo + ',' + newtiempo[i];
                      lista.videos = lista.videos + ',' + newvideo[i];
                    }
                    const newListas = listas.filter((lista) => lista !== singleList);
                    await AsyncStorage.setItem("LISTAS", JSON.stringify(newListas))  //nos quedamos solo con las listas que no coinciden con singleList
                      .then(() => setDat(!dat));
                    
                    l.push(lista);
                    await AsyncStorage.getItem("LISTAS");
                  }}>
                    Eliminar vídeo
                  </MenuItem>
              </Menu>


            <TouchableOpacity
              onPress={() => {navigation.navigate("AllLists");}}>
              <Image
                source={datos[12].image}
                style={styles.imagen2}
             />
            </TouchableOpacity>

            <Text style={{fontSize: 18, margin: 20}}> 
                {(singleList.split('\n'))[2] + '\n' + (singleList.split('\n'))[3] + '\n' + (singleList.split('\n'))[4]}
            </Text>
                <Button 
                title="Enviar lista"
                onPress={showAlert}>
                    <Text>Enviar lista</Text>
                </Button>

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
  },
  button2: {
    //backgroundColor: '#1B4B95',
    padding: 3,
    marginBottom: 0,
    marginTop: 0,
    bottom: 2,
    borderRadius: 5,
    width: width - 230,
    height: 50,
    alignItems: 'center',
  },
  button3: {
    //backgroundColor: '#1B4B95',
    padding: 0,
    marginBottom: 40,
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
});