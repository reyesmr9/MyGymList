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
    let fileUri = null;
    const navigation = useNavigation();

    const listaInicial = JSON.parse(singleList);
    let listmenuinicial = listaInicial.videolista;

    let listmenusplice = '';
    let isMounted = true;

    const [flag, setFlag] = useState(false);
    const [flagList, setFlagList] = useState(false);
    const [dat, setDat] = useState(false);
    const [visible, setVisible] = useState(false);
    const [edit, setEdit] = useState(false);
    const [title, setTitle] = useState("");
    const [flagEdit, setFlagEdit] = useState(false);
    const [flagTiempo, setFlagTiempo] = useState(false);
    const [flagLocalVideoConf, setFlagLocalVideoConf] = useState(false);

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
    const videoLocalAddRef = useRef(null);
    let cameraRef = useRef();
    const [videoLocal, setVideoLocal] = useState(null);
    const [statusVideo, setStatusVideo] = useState({});
    const [statusVideoAdd, setStatusVideoAdd] = useState({});

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
      { label: 'minutos', value: 'minutos' },
      { label: 'horas', value: 'horas' },
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

    const iconRef = React.useRef();

    const iconoImportarVideo = (props) => (
      <Icon
        {...props}
        ref={iconRef}
        name='video-outline'
      />
    );

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
        if(statusVideo.isPlaying){
          if(videoLocalRef !== null && videoLocalRef.current !== null) {
            videoLocalRef.current.pauseAsync();
          }
        }
        setOpened(false);
        setOpenedMenu(false);
        setEdit(false); 
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
        setFlagLocalVideoConf(false);
        setTiempoRealizacion('');
        //setIm("");
        const vid = AsyncStorage.getItem("EJERCICIOS");
        //const v = vid ? JSON.parse(vid) : [];
        const varray = [vid];
        var f=varray;
        varray.length=0;
  
        setVideos(f);
        AsyncStorage.setItem("EJERCICIOS", JSON.stringify(f));
      
        //setDat(false);
        /*
        if(dat==true){
          const newListas = listas.filter((lista) => lista !== singleList);  //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
          AsyncStorage.setItem("LISTAS", JSON.stringify(newListas));
        }
        */
        //setDat(false);
        isMounted = false;
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'AllLists'
            },
          ],
        })
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
        getListas();
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
/*
    useFocusEffect(
      React.useCallback(() => {
      isMounted = true;
  
      if(isMounted){
        if(previewVideo !== null) {
          setFlagLocalVideoConf(true);
          console.log('No es un VIDEO LOCAL')
        }
      }

    }, [previewVideo]));
*/
    const getVideos = async () => {
      /*
      AsyncStorage.setItem("VIDEOS", JSON.stringify('f6TXEnHT_Mk'))
        .then((videos) => {setVideos(JSON.parse(videos))});
      */       
      await AsyncStorage.getItem("EJERCICIOS").then((videos) => {
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

    const getListas = async () => {

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
                setFlag(false);
                let listini = listaInicial;
                listini.videolista = datList;
                let jsonListIni = JSON.stringify(listini);
                
                const valorListas = await AsyncStorage.getItem("LISTAS");
                const l = valorListas ? JSON.parse(valorListas) : [];
  
                const nuevasListas = l.filter((lista) => lista !== singleList); 
                const newLists = nuevasListas.filter((lista) => lista !== jsonListIni); //no hace nada
                isMounted = false;
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
              isMounted = false;
              await AsyncStorage.setItem("LISTAS", JSON.stringify(nuevasListas))  //nos quedamos solo con las listas que no coinciden con singleList
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
              //setDat(true);

            }
          }
        ])
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
        const newLists = newListas.filter((lista) => lista !== listaActual);  //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter

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
    
    const añadirEjercicio = async() => {
      setOpened(false);
      if(previewVideo){
        setModalVisibleLocalVideo(true);
      }
      if(youtubeVideo){       
        setModalVisibleVideo(true);
      }
    }
    
    const renderItem = ({ item, index }) => {
      try {
        if (item !== undefined && item !== null){
          if(JSON.parse(item).videos.includes("file")){
            if(previewVideo === null){
              setFlagLocalVideoConf(true);
            }
            previewVideo = JSON.parse(item).videos;
          }
          else {
            youtubeVideo = JSON.parse(item).videos;
          }

          if(JSON.parse(item).foto !== ''){
            previewFoto = JSON.parse(item).foto;
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
              <View style={styles.button5}>
              <TouchableOpacity
                onPress={ () =>
                  Alert.alert(
                    "Eliminar ejercicio",
                    "¿Estás seguro de eliminar el ejercicio?", [
                        {
                        text: 'No',
                        onPress: () => null,
                        style:"cancel"
                        },
                        {text: 'Sí', onPress: async() => {           
                        try{
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

                          console.log('LISTMENU antes es1: ', listmenuinicial)

                          listmenusplice = listmenuinicial.filter((lista) => (JSON.parse(lista).id !== JSON.parse(item).id))

                          setDatList(listmenusplice);

                          setList(listmenusplice);
                          setFlag(true);

                          console.log('listmenu despues es1: ', listmenuinicial)
                          console.log('LIST state es: ', list)
                          console.log('DATLIST state es: ', datList)
                          console.log('listmenusplice despues es: ', listmenusplice)
                         
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

                          const newListas = l.filter((lista) => lista !== singleList);
                          const newLists = newListas.filter((lista) => lista !== jsonListIni);  //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
                          console.log('EL valor de newLists es: ', newLists)
                            
                          console.log('EL valor de JSONLISTINI es: ', jsonListIni)
                          await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));

                          await AsyncStorage.getItem("LISTAS").then((listas) => {
                            setListas(JSON.parse(listas));    
                            setListaActual(jsonListNew);              
                            setFlagList(!flagList);
                          })         

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

                            setFlag(false);
                            setList('');
                            setDatList('');
                            console.log('datList length es == 1')
                            const valorListas = await AsyncStorage.getItem("LISTAS");
                            const l = valorListas ? JSON.parse(valorListas) : [];
                            const newListas = l.filter((lista) => lista !== singleList)
                            const nuevasListas = newListas.filter((lista) => lista !== jsonListIni);  //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
                            await AsyncStorage.setItem("LISTAS", JSON.stringify(nuevasListas)).then(() => {
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
                            console.log('datList length es == 0')
                            const valorListas = await AsyncStorage.getItem("LISTAS");
                            const l = valorListas ? JSON.parse(valorListas) : [];
                            const newListas = l.filter((lista) => lista !== singleList)
                            const nuevasListas = newListas.filter((lista) => lista !== jsonListIni);  //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
                            await AsyncStorage.setItem("LISTAS", JSON.stringify(nuevasListas));                          
                          }
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

    const abrirYoutube = () => {
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

    const guardarEjercicio = async () => {
      if ((videos !== undefined) && (videos !== null)){
        console.log('Se ha pulsado guardar Video si videos existe')
        try{
          if(videoLocal === null){
            Alert.alert("Inserta un vídeo");
          }
          if(statusVideoAdd.isPlaying){
            if(videoLocalAddRef !== null && videoLocalAddRef.current !== null) {
            videoLocalAddRef.current.pauseAsync();
            }
          }
          else{
          const valorListas = await AsyncStorage.getItem("LISTAS");
          const l = valorListas ? JSON.parse(valorListas) : [];
          const vid = await AsyncStorage.getItem("EJERCICIOS");
          const v = vid ? JSON.parse(vid) : [];
          const varray = [v];
          let videoarray = [video];
          console.log('Valor de videos en asyncstorage', v)
          //varray.push(video(link));
          
          const id = (Math.round(Math.random() * 1000)).toString();
          var lista = {};
          lista.series = series + " series";
          lista.repeticiones = repeticiones + " repeticiones";
          lista.tiempo = tiempo + " " + listValueNumberTiempo;
          if(previewVideo){
            lista.videos = videoLocal;
          }
          if(youtubeVideo){
            lista.videos = video(link);
          }
          
          let idVideos = "";
        
          idVideos = id;

          lista.id = idVideos;
          lista.realizado = "no";
          lista.imagenRealizado = datosIm[7].image;
          lista.emoticono = '';
          lista.foto = '';
          var jsonLista = JSON.stringify(lista);
          //v.push(jsonLista);
          //convertimos el array de videos 'v' en un string usando JSON.stringify(v)
          await AsyncStorage.setItem("EJERCICIOS", JSON.stringify(lista));
          //videolista = videolista.push(series + '\n' + repeticiones + '\n' + tiempo + '\n' + video(link));
          const vi = await AsyncStorage.getItem("EJERCICIOS");
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

          await AsyncStorage.setItem("EJERCICIOS", JSON.stringify(f));
          console.log('Objeto de videos obtenido de asyncstorage es: ', vd)

          setDatList(miLista.videolista);
          setList(miLista.videolista);
          setVideoFlag(true);
          setVideoLocal(null);

          await AsyncStorage.getItem("LISTAS").then((listas) => {
            setListas(JSON.parse(listas));  
            setListaActual(listaNueva);             
            setFlagList(!flagList);            
          });
          setModalVisibleVideo(false);
          setModalVisibleLocalVideo(false);
        }
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

    const enviarLista = async () => {
      //llamamos al modulo 'Sharing' y dentro del modulo llamamos al metodo 'isAvailableAsync'
      //si una funcion es asincrona, le debemos poner async, y a los modulos asincronos se les pone 'await' delante
      if (!(await Sharing.isAvailableAsync())) {
        alert('No se pueden compartir la lista');
        return;
      }
  
      await saveFile();
      
      if (fileUri !== null) {
        if (previewVideo !== null){
          //await sendEmailWithAttachment();
          //await Sharing.shareAsync(FileSystem.cacheDirectory + "listDir/test0.mp4");
          console.log('NO SE PUEDE ENVIAR LISTA')
          //await Sharing.shareAsync(fileUri);
        }
        else {
          //await Sharing.shareAsync(fileUri);
          console.log('SE PUEDE ENVIAR LISTA')
        }
      }
      //usamos el metodo shareAsync para compartir la imagen que esta guardada en selectedImage.localUri

    }

    const getFiles = async () => {
      try{
        var lista = {};
        const valorListas = await AsyncStorage.getItem("LISTAS");
        const l = valorListas ? JSON.parse(valorListas) : [];
  
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
        var jsonLista = JSON.stringify(lista, null, 2);
        console.log('la lista en formato JSON es: ', jsonLista);
        fileUri = FileSystem.documentDirectory + "lista.txt";
        await FileSystem.writeAsStringAsync(fileUri, jsonLista, { encoding: FileSystem.EncodingType.UTF8 });
        file = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
        
        await Sharing.shareAsync(fileUri);
   
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

let añadirFondo = async() => {
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
    añadirFondo();
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
                    <MenuOptions optionsContainerStyle={{width:200,height:80}}>
                      <MenuOption value={1} 
                        style={{marginLeft: 10, marginTop: 3}}
                        onSelect={() => añadirEjercicio()}
                        text="Añadir ejercicio"/>
                      <MenuOption value={2}
                        style={{marginLeft: 10, marginTop: 0}}
                        onSelect={() => abrirFondo()}
                        text="Añadir fondo de pantalla" />
                    </MenuOptions>
              </Menu>
            </View>           
          </View>
            
                <Modal
                  visible={modalVisibleVideo} 
                  animationType='fade' 
                  transparent={true}>
                  <View style={styles.modalStyle}>
                    <Text style={styles.titleVideo}>Añadir ejercicio</Text>                 
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
                        <TouchableOpacity onPress={abrirYoutube}>
                          <Image
                            source={datosIm[16].image}
                            style={styles.imagen12}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>                                                
                  </View>
                  <Button onPress={guardarEjercicio} 
                  style={styles.botonGuardarEjercicio}>
                    <Text>Guardar</Text>
                  </Button>      
                  <Button onPress={() => {
                    setModalVisibleVideo(false);
                  }} 
                  style={styles.botonCancelarEjercicio}>
                    <Text>Cancelar</Text>
                  </Button>         
                </Modal>

                <Modal
                  visible={modalVisibleLocalVideo} 
                  animationType='fade' 
                  transparent={true}>
                  <View style={styles.modalStyle}>
                    <Text style={styles.titleVideo}>Añadir ejercicio</Text>                 
                    <View style={{ flexDirection: 'row', right: 22}}>
                    <View>
                      <TextInput
                        placeholder="Series"
                        value={series}
                        onChangeText={setSeries}
                        style={styles.input2}
                        multiline={true}
                        selectionColor='#515759'
                        returnKeyType="done"
                        keyboardType='number-pad'
                      />
                    </View>
                    <View>
                      <Text style={{marginLeft: 20, top: 10, fontSize: 17}}>series</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', left: 1}}>
                    <View>
                      <TextInput
                        placeholder="Repeticiones"
                        value={repeticiones}
                        onChangeText={setRepeticiones}
                        style={styles.input2}
                        multiline={true}
                        selectionColor='#515759'
                        returnKeyType="done"
                        keyboardType='number-pad'
                      /> 
                    </View>
                    <View>
                      <Text style={{marginLeft: 20, top: 10, fontSize: 17}}>repeticiones</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row'}}>
                    <View>
                      <TextInput
                        placeholder="Tiempo"
                        value={tiempo}
                        onChangeText={setTiempo}
                        style={styles.input2}
                        multiline={true}
                        selectionColor='#515759'
                        returnKeyType="done"
                        keyboardType='number-pad'
                      />
                    </View>
                    <View style={styles.pickerStyle5}>
                      <DropDownPicker
                        placeholder='tiempo'
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
                    {(videoLocal !== null) ? (
                      <View style={{top: 40}}>
                        <Video
                            ref={videoLocalAddRef}
                            source={{ uri: videoLocal }}
                            useNativeControls
                            resizeMode="contain"
                            isLooping={false}
                            isMuted={false}
                            style={styles.videoPlayerAdd}
                            onPlaybackStatusUpdate={status => setStatusVideoAdd(() => status)}
                            />
                      </View>
                    ) : (
                      <View>
                      </View>
                    )}
                    <View style={{ marginTop: 10, alignItems: 'center', justifyContent: 'center', top: 50, right: 0 }}>
                    <Button
                      title="Importar vídeo"
                      style={styles.botonAbrirVideo}
                      accessoryRight={iconoImportarVideo}
                      onPress={importarVideo}>
                      <Text>Abrir vídeo</Text>                                  
                    </Button>
                    </View>
                                               
                  </View>   
                  <View style={{ alignItems: 'center', justifyContent: 'center', top: 30 }}>
                    <Button onPress={guardarEjercicio} 
                    style={styles.botonGuardarEjercicio}>
                      <Text>Guardar</Text>
                    </Button> 
                  </View>
                  <View style={{ alignItems: 'center', justifyContent: 'center', top: 30 }}>     
                    <Button onPress={() => {
                      if(statusVideoAdd.isPlaying){
                        if(videoLocalAddRef !== null && videoLocalAddRef.current !== null) {
                        videoLocalAddRef.current.pauseAsync();
                        }
                      }
                      setModalVisibleLocalVideo(false);
                    }} 
                    style={styles.botonCancelarEjercicio}>
                      <Text>Cancelar</Text>
                    </Button>

                  </View>   
                </Modal>

            {component}
            
            <FlatList 
              data={list ? list : listaInicial.videolista}
              extraData={flagList}
              initialNumToRender={1}
              keyExtractor={( item , index) => index.toString()}
              renderItem={renderItem}
            />

            <View style={{ flexDirection: 'row', marginTop: 30, marginBottom: 10, 
              justifyContent: 'space-evenly' }}>
              <View style={(flagLocalVideoConf === true) ? styles.botonEliminarListaLocal : styles.botonEliminarLista}>
                <TouchableOpacity onPress={eliminarLista}>
                  <Image
                    source={datosIm[21].image}
                    style={styles.imagen}
                  />
                </TouchableOpacity>
              </View>
              {(flagLocalVideoConf === true) ? 
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
  botonEliminarLista: {
    right: 120,
    borderRadius: 1000,
    width: 50,
    height: 50,
    bottom: 8,
    alignItems: 'center',
  },
  botonEliminarListaLocal: {
    right: 145,
    borderRadius: 1000,
    width: 50,
    height: 50,
    bottom: 10,
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
  botonGuardarEjercicio: {
    backgroundColor: '#2d65c4',
    borderRadius: 400/2,
    borderWidth: 1,
    borderColor: '#2a5db5',
    borderRadius: 400/2,
    height: 45,
    width: 100,
    marginBottom: 10,
    bottom: 140,
  },
  botonCancelarEjercicio: {
    backgroundColor: '#d1453d',
    borderRadius: 400/2,
    borderWidth: 1,
    borderColor: '#bd3c35',
    height: 45,
    width: 100,
    marginBottom: 30,
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
  botonEnviarLista: {
    left: 120,
    bottom: 10,
    borderRadius: 1000,
    width: 52,
    height: 52,
    alignItems: 'center',
  },
  botonAbrirVideo: {
    marginBottom: 10, 
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#af88db',
    borderWidth: 1,
    borderColor: '#b18dd9',
    borderRadius: 100,
    padding: 10, 
    height: 50,
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
    bottom: 120,
    color: 'black',
    fontSize: 18,
  },
  imagen: {
    height: 52,
    width: 52,
    borderRadius: 400/2,
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
  imagenEnviarLista: {
    height: 52,
    width: 52,
    borderRadius: 1000,
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
    marginBottom: 10,
    fontSize: 16,
    width: width - 250,
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
    top: 0,
    left: 18,
    borderRadius: 5,
    width: 110,
  },
  videoPlayer: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  videoPlayerAdd: {
    alignSelf: 'center',
    width: 220,
    height: 200,
  },
});