import 'react-native-gesture-handler';
import React, {useState, useEffect, useRef} from 'react';
import * as Sharing from 'expo-sharing';
import { StyleSheet, Modal, TextInput, View, Image, ImageBackground, TouchableOpacity, Alert, Platform, 
  BackHandler, Dimensions, PermissionsAndroid} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import YoutubePlayer from 'react-native-youtube-iframe';
import {useNavigation} from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { FlatList } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Imagenes } from '../components/Images';
import { Video } from 'expo-av';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import { Button, Icon, Text, Input } from "@ui-kitten/components";
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

export default function ListaConfiguracion ({route}) {
  const [listas, setListas] = useState([]);
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
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [flagEdit, setFlagEdit] = useState(false);
  const [flagTiempo, setFlagTiempo] = useState(false);
  const [flagLocalVideoConf, setFlagLocalVideoConf] = useState(false);
  const [datList, setDatList] = useState([]);

  let editButton = null;
  let previewVideo = null;
  let youtubeVideo = null;

  const [opened, setOpened] = useState(false);
  const [openedMenu, setOpenedMenu] = useState(false);
  const [list, setList] = useState([]);
  const [listaActual, setListaActual] = useState('');
  const videoLocalRef = useRef([]);
  const videoLocalAddRef = useRef(null);
  const [videoLocal, setVideoLocal] = useState(null);
  const [statusVideo, setStatusVideo] = useState({});
  const [statusVideoAdd, setStatusVideoAdd] = useState({});

  const [openListTiempo, setOpenListTiempo] = useState(false);
  const [valuelistTiempo, setvaluelistTiempo] = useState([]);
  const [ listValueNumberTiempo, setListValueNumberTiempo] = useState('');
  const [numerosTiempo, setNumerosTiempo] = useState([
    { label: 'minutos', value: 'minutos' },
    { label: 'horas', value: 'horas' },
  ]);

  const [modalVisibleVideo, setModalVisibleVideo] = useState(false);
  const [modalVisibleLocalVideo, setModalVisibleLocalVideo] = useState(false);
  const [modalEmail, setModalEmail] = useState(false);
  const [flagEm, setFlagEm] = useState(false);
  const [flagTitle, setFlagTitle] = useState(false);
  const [flagFondo, setFlagFondo] = useState(false);
  const [series, setSeries] = useState("");
  const [repeticiones, setRepeticiones] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [emailNuevo, setEmailNuevo] = useState("");
  const [tiempoRealizacion, setTiempoRealizacion] = useState("");
  const [link, setLink] = useState('');
  const [itemFlag, setItemFlag] = useState(false);
  const [videoFlag, setVideoFlag] = useState(false);
  const [fotoFlag, setFotoFlag] = useState(false);
  const [flagFotoModal, setFlagFotoModal] = useState(false);
  const [flagBackground, setFlagBackground] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const iconRef = React.useRef();

  const iconoImportarVideo = (props) => (
    <Icon
      {...props}
      ref={iconRef}
      name='video-outline'
    />
  );

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
      if(statusVideo.isPlaying){
        if(videoLocalRef !== null && videoLocalRef.length !== 0) {
          for(let i = 0; i<videoLocalRef.current.length; i++){
            videoLocalRef.current[i].pauseAsync();
          }
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
      setEmailNuevo("");
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
      const vid = AsyncStorage.getItem("EJERCICIOS");
      const varray = [vid];
      var f=varray;
      varray.length=0;

      setVideos(f);
      AsyncStorage.setItem("EJERCICIOS", JSON.stringify(f));
          
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
  

  useEffect(() => {
    isMounted = true;
  
    if(isMounted){
      // Si se ha montado la pantalla, se obtienen las listas y vídeos de la lista
      getListas();
      getVideos();
      BackHandler.addEventListener('hardwareBackPress', backAction);
    }
    
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, [flagList]);

  let num = 3;

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

  const getVideos = async () => {   
    await AsyncStorage.getItem("EJERCICIOS").then((videos) => {
      setVideos(JSON.parse(videos));    
    });
  }

  const getListas = async () => {
    // Guardamos las listas en una variable de estado
    await AsyncStorage.getItem("LISTAS").then((listas) => {
      setListas(JSON.parse(listas));
    });
    try {
      if(flag === false && itemFlag === false && fotoFlag === false && flagTitle === false && videoFlag === false 
        && flagTiempo === false && flagFondo === false){
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
        }
      }
      else {
        if((listaInicial.videolista) !== undefined){    
          if(list.length > 1){
            const valorListas = await AsyncStorage.getItem("LISTAS");
            const l = valorListas ? JSON.parse(valorListas) : [];

            const nuevasListas = l.filter((lista) => lista !== singleList); 
            const newLists = nuevasListas.filter((lista) => lista !== datList);
            await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));
          }
          if (list.length < 1) {
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
              isMounted = false;
          }      
          
          if (dat === true){
            BackHandler.removeEventListener('hardwareBackPress', backAction);
            console.log('List Length is < 1: ', list)     
            setDat(false);
            setList('');
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
            setList('');
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
        setListas(JSON.parse(listas)); 
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
  
  const añadirEjercicio = async() => {
    setOpened(false);
    if(previewVideo){
      if(statusVideo.isPlaying){
        if(videoLocalRef !== null && videoLocalRef.length !== 0) {
          for(let i = 0; i<videoLocalRef.current.length; i++){
            videoLocalRef.current[i].pauseAsync();
          }
        }
      }  
      setModalVisibleLocalVideo(true);
    }
    if(youtubeVideo){       
      setModalVisibleVideo(true);
    }
  }
    
  const renderItem = ({ item, index }) => {
    try {
      if (item !== undefined && item !== null){
        if(JSON.parse(item).videos.includes("file") && isMounted==true){
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
                        }
                        
                        const valorListas = await AsyncStorage.getItem("LISTAS");
                        const l = valorListas ? JSON.parse(valorListas) : [];    

                        listmenusplice = listmenuinicial.filter((lista) => (JSON.parse(lista).id !== JSON.parse(item).id))

                        setDatList(listmenusplice);

                        setList(listmenusplice);
                        setFlag(true);

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

                        const newListas = l.filter((lista) => lista !== singleList);
                        const newLists = newListas.filter((lista) => lista !== jsonListIni);

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
                          const valorListas = await AsyncStorage.getItem("LISTAS");
                          const l = valorListas ? JSON.parse(valorListas) : [];
                          const newListas = l.filter((lista) => lista !== singleList)
                          const nuevasListas = newListas.filter((lista) => lista !== jsonListIni);
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
                          isMounted = false;                         
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
                          const valorListas = await AsyncStorage.getItem("LISTAS");
                          const l = valorListas ? JSON.parse(valorListas) : [];
                          const newListas = l.filter((lista) => lista !== singleList)
                          const nuevasListas = newListas.filter((lista) => lista !== jsonListIni);
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
      return tex;
    }
  }

  const guardarEmail = async () => {
    if (emailNuevo !== ""){
      if((emailNuevo.includes('@'))){
      try{          
        setModalEmail(false);
        const valorListas = await AsyncStorage.getItem("LISTAS");
        const l = valorListas ? JSON.parse(valorListas) : [];
        
        let listaEmail = '';
        var lista = {};
        if(listaActual != '' && listaActual != undefined){
          listaEmail = JSON.parse(listaActual);
        }
        else{
          listaEmail = listaInicial;
        }        
        lista.imagen = listaEmail.imagen;
        lista.titulo = listaEmail.titulo;
        lista.videolista = listaEmail.videolista;
        lista.email = emailNuevo;

        lista.idlista = listaEmail.idlista;
        lista.fechacreacion = listaEmail.fechacreacion;
        lista.listaRealizado = listaEmail.listaRealizado;
        lista.imagenListaRealizado = listaEmail.imagenListaRealizado;    
        lista.historial = listaEmail.historial;  
        lista.fondo = listaEmail.fondo; 

        var jsonLista = JSON.stringify(lista);

        const newListas = l.filter((lista) => JSON.parse(lista).idlista !== JSON.parse(singleList).idlista);
        newListas.push(jsonLista);

        await AsyncStorage.setItem("LISTAS", JSON.stringify(newListas));

        if(datList.length>0){
          listaEmail.videolista = datList;
        }

        let listaVideolista = listaEmail.videolista;

        setList(listaVideolista);

        await AsyncStorage.getItem("LISTAS").then((listas) => {
          setListas(JSON.parse(listas));  
          setListaActual(JSON.stringify(lista));             
          setFlagList(!flagList);            
        });
        
      }  
      catch(error){
        console.log(error);
      }
    }
    else {
      Alert.alert('Introduce un correo electrónico válido')
    }
  }
  else {
    Alert.alert('Introduce un correo electrónico')
  }
}

  const guardarEjercicio = async () => {
    if ((videos !== undefined) && (videos !== null)){
      try {
        if(videoLocal === null && previewVideo){
          Alert.alert("Inserta un vídeo");
          return;
        }
        if(link==='' && youtubeVideo){
          if(!(link.includes('youtu.be')) || !(link.includes('youtube.com'))){
            Alert.alert("Introduce un link válido");
            return;
          }          
        }
        else {
          const valorListas = await AsyncStorage.getItem("LISTAS");
          const l = valorListas ? JSON.parse(valorListas) : [];
          const vid = await AsyncStorage.getItem("EJERCICIOS");
          const v = vid ? JSON.parse(vid) : [];
          const varray = [v];
          
          const id = (Math.round(Math.random() * 1000)).toString();
          var lista = {};

          if(series == "") {
            lista.series = series;
          }
          else {
            lista.series = series + " series";
          }
          if(repeticiones == "") {
            lista.repeticiones = repeticiones;
          }
          else {
            lista.repeticiones = repeticiones + " repeticiones";
          }
          if(tiempo == "") {
            lista.tiempo = tiempo;
          }
          else {
            lista.tiempo = tiempo + " " + listValueNumberTiempo;
          }

          if(previewVideo){
            lista.videos = videoLocal;
            if(statusVideoAdd.isPlaying){
              if(videoLocalAddRef !== null && videoLocalAddRef.current !== null) {
              videoLocalAddRef.current.pauseAsync();
              }
            }
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
          await AsyncStorage.setItem("EJERCICIOS", JSON.stringify(lista));
          const vi = await AsyncStorage.getItem("EJERCICIOS");

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
          setVideos(f);

          await AsyncStorage.setItem("EJERCICIOS", JSON.stringify(f));

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

  let importarVideo = async() => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    // Si el usuario ha denegado el permiso para acceder a su galería, entonces sale una alerta
    if (permissionResult.granted == false) {
    alert('Permisos para acceder a la camara son requeridos');
    return;
    }
   // Cuando el usuario escoge un vídeo de su galería, pickerResult retorna el vídeo que escogió
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Si no se escoge ningún vídeo, no da error
    if (pickerResult.cancelled === true) {
      return;
    }

    // Actualizamos la variable de estado del vídeo seleccionado
    setVideoLocal(pickerResult.uri);
  };

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

  let modificarEmail = async() => {
    setOpened(false);
    setModalEmail(true);
  };

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
                  <MenuOptions optionsContainerStyle={{width:200,height:110}}>
                    <MenuOption value={1} 
                      style={{marginLeft: 10, marginTop: 3}}
                      onSelect={() => añadirEjercicio()}
                      text="Añadir ejercicio"/>
                    <MenuOption value={2}
                      style={{marginLeft: 10, marginTop: 0}}
                      onSelect={() => abrirFondo()}
                      text="Añadir fondo de pantalla" />
                    <MenuOption value={3}
                      style={{marginLeft: 10, marginTop: 0}}
                      onSelect={() => modificarEmail()}
                      text="Modificar correo electrónico de la lista" />
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
            <View style={{ flexDirection: 'row', right: 22, bottom: 30}}>
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
          <View style={{ flexDirection: 'row', left: 1, bottom: 30}}>
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
              <Text style={{marginLeft: 20, top: 10, fontSize: 17, bottom: 30}}>repeticiones</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', bottom: 30}}>
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
            <View style={{ flexDirection: 'row', bottom: 30 }}>
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
          <View style={{ alignItems: 'center', justifyContent: 'center', top: 30 }}>
            <Button onPress={guardarEjercicio} 
            style={styles.botonGuardarEjercicio}>
              <Text>Guardar</Text>
            </Button> 
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', top: 30 }}>     
            <Button onPress={() => {
              setModalVisibleVideo(false);
            }} 
            style={styles.botonCancelarEjercicio}>
              <Text>Cancelar</Text>
            </Button>
          </View>       
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

        <Modal
          visible={modalEmail} 
          animationType='fade' 
          transparent={true}>
          <View style={styles.modalStyleEmail}>
            <Text style={styles.titleEmail}>Modificar correo electrónico</Text>                 
            <View>
              <Input
                placeholder="Introduce un correo electrónico"
                value={emailNuevo}
                onChangeText={setEmailNuevo}
                style={styles.input4}
                multiline={false}
                selectionColor='#515759'
                returnKeyType="done"
              />
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 30 }}>
              <Button onPress={guardarEmail} 
              style={styles.botonGuardarEmail}>
                <Text>Guardar</Text>
              </Button> 
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 30 }}>     
              <Button onPress={() => {
                setModalEmail(false);
                setEmailNuevo("");
              }} 
              style={styles.botonCancelarEmail}>
                <Text>Cancelar</Text>
              </Button>
            </View>
          </View>   
        </Modal>

        {component}
        <Text style={{bottom: 5, fontSize: 14}}>
          {(emailNuevo !== "") ? emailNuevo : JSON.parse(singleList).email}
        </Text>
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
    padding: 0,
    marginBottom: 40,
    borderRadius: 400/2,
    width: width - 230,
    height: 35,
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
  botonGuardarEmail: {
    backgroundColor: '#2d65c4',
    borderRadius: 400/2,
    borderWidth: 1,
    borderColor: '#2a5db5',
    borderRadius: 400/2,
    height: 45,
    width: 100,
    marginBottom: 10,
    top: 60,
  },
  botonCancelarEmail: {
    backgroundColor: '#d1453d',
    borderRadius: 400/2,
    borderWidth: 1,
    borderColor: '#bd3c35',
    height: 45,
    width: 100,
    marginBottom: 30,
    top: 60,
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
  titleEmail: {
    textAlign: 'center',
    bottom: 50,
    color: 'black',
    fontSize: 18,
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
  modalStyleEmail: {
    borderColor: '#949699',
    borderWidth: 1,
    borderRadius: 9,
    width: width-30,
    height: Dimensions.get("window").height-260,
    marginLeft: 15,
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 170,
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
    borderColor: "#2D1F87",
    borderRadius: 4,
    borderWidth: 1,
    height: 70,
    padding: 10,
    fontSize: 15,
    marginTop: 5,
    top: 20,
    marginBottom: 8,
    width: width - 100,
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