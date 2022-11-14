import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import Constants from 'expo-constants';

import AllLists from './AllLists';

import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Modal, Pressable, Text, TextInput, View, Image, TouchableOpacity, Alert, BackHandler, Platform, ScrollView, Dimensions, KeyboardAvoidingView} from 'react-native';
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import {List, ListItem, Divider} from '@ui-kitten/components';
import { Input, Icon } from 'react-native-elements';
import { Imagenes } from '../components/Images';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 
import {Picker} from '@react-native-picker/picker';
import {IconPicker} from '@grassper/react-native-icon-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { Button } from '@ui-kitten/components'


export default function NuevaLista () {

    const [titulo, setTitulo] = useState("");
    const [series, setSeries] = useState("");
    const [repeticiones, setRepeticiones] = useState("");
    const [tiempo, setTiempo] = useState("");
    const [email, setEmail] = useState("");
    const [link, setLink] = useState('');
    //const [tiempoGuardar, setFlagTiempoGuardar] = useState("");
    const [dat, setDat] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [videos, setVideos] = useState([]);  //videos es un array de videos
    const [selectedImage, setSelectedImage] = useState(null);  //null porque no va a existir imagen seleccionada al inicio
    const [im, setIm] = useState("");
    const [flag, setFlag] = useState(false);
    const [flagVideo, setFlagVideo] = useState(false);

    const [openListTiempo, setOpenListTiempo] = useState(false);
    const [valuelistTiempo, setvaluelistTiempo] = useState([]);
    const [ listValueNumberTiempo, setListValueNumberTiempo] = useState('');
    const [numerosTiempo, setNumerosTiempo] = useState([
      { label: 'minutos', value: 'minutos' },
      { label: 'horas', value: 'horas' },
    ]);

    let componentVideo = null;
    let component = null;
    let isMounted = true;
    //let videolista = null;
    //const Imagenes = [Imagenes];
    /*
    const handleSubmit = (id, iconName, iconSet, iconColor, backgroundColor) => {
      console.log({ id, iconName, iconSet, iconColor, backgroundColor });
      setModalVisible(!modalVisible);
    };
    */
    const navigation = useNavigation();

/*
    const [imagenes, setImagenes] = useState([
      { id: '1', image: Imagenes.uno },
      { id: '2', image: Imagenes.cuatro },imagenlist
      { id: '3', image: Imagenes.ocho },
      { id: '4', image: Imagenes.once },
      { id: '5', image: Imagenes.trece },
      { id: '6', image: Imagenes.diecinueve },
      { id: '7', image: Imagenes.veinte }
    ]);
*/

  const [datos, setDatos] = useState([
    { id: '3', image: Imagenes.uno },
    { id: '6', image: Imagenes.cuatro },
    { id: '10', image: Imagenes.ocho },
    { id: '13', image: Imagenes.once },
    { id: '15', image: Imagenes.trece },
    { id: '21', image: Imagenes.diecinueve },
    { id: '22', image: Imagenes.veinte },      //datos[6]

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
  ]);

  //Imagen inicial al crear la lista
  const [imagenInicial, setImagenInicial] = useState([
    { id: '23', image: Imagenes.veintitres },
    { id: '24', image: Imagenes.veinticuatro },
    { id: '25', image: Imagenes.veinticinco },
    { id: '26', image: Imagenes.veintiseis }
  ]);

  const [imagenDatos, setImagenDatos] = useState([
    { id: '38', image: Imagenes.treintayocho }
  ]);
/*
    useFocusEffect(
      React.useCallback(() => {
        getVideos();
      }, [])
    );
*/
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
      const vid = AsyncStorage.getItem("VIDEOS");
      //const v = vid ? JSON.parse(vid) : [];
      const varray = [vid];
      var f=varray;
      varray.length=0;
      setFlagVideo(false);
      setVideos(f);        
      //convertimos el array de listas 'l' en un string usando JSON.stringify(l) y lo pasamos a AllLists.js
      AsyncStorage.setItem("VIDEOS", JSON.stringify(f));
      //setSelectedImage(null);
      //setIm("");
      setTitulo("");
      //setEmail('');
      navigation.navigate('AllLists');
      }
    return true;
  };

  useEffect(() => {
    isMounted = true;

    if(isMounted){
      getVideos();
      BackHandler.addEventListener('hardwareBackPress', backAction);
    }


    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, [dat]);

    const getVideos = async () => {
        /*
        AsyncStorage.setItem("VIDEOS", JSON.stringify('f6TXEnHT_Mk'))
          .then((videos) => {setVideos(JSON.parse(videos))});
        */       
        await AsyncStorage.getItem("VIDEOS").then((videos) => {
          setVideos(JSON.parse(videos));    //guardamos cada video en formato string en videos     
        });
        await AsyncStorage.getItem("DATOS").then((datos) => {
          setEmail(JSON.parse(datos).split('"')[7]);
        });
        console.log('El array de videos de la lista es: ', videos);

        if((selectedImage == null) && (im == "")){
          setSelectedImage({localUri: 'https://cdn.pixabay.com/photo/2017/01/25/17/35/picture-2008484_960_720.png'});
          setIm(imagenInicial[2].image);
        }
        /*
        const valorVideos = await AsyncStorage.getItem("VIDEOS");
        const v = valorVideos ? JSON.parse(valorVideos) : [];

        if(v.length==0){
          setSelectedImage({localUri: 'https://cdn.pixabay.com/photo/2017/01/25/17/35/picture-2008484_960_720.png'});
          setIm(imagenInicial[2].image);
          //('el valor principal de selectedimage.localuri es', selectedImage.localUri)
        }
        */
    }

  /*
    const seleccionaIcono = () => {
      setModalVisible(!modalVisible);
      console.log('la uri de la imagen seleccionada es: ', im);

    }
  */

    const seleccionaImagen = () =>
    Alert.alert(
      "",
      "Selecciona una imagen", [
        {text: "Cancelar", onPress: () => {return;}, style: 'cancel'},
        {
          text: 'Icono de la app',
          onPress: () => setModalVisible(true)
        },
        {text: "Imagen de la galería", onPress: openImagePickerAsync} 
      ]
    );

    const myItemSeparator = () => {
      return (
        <View
          style={{ height: 1, backgroundColor: "gray", marginHorizontal: 10 }}
        />
      );
    };
    
    //creamos una función que se lance cuando pulsamos el boton y nos pida acceder a la galeria de fotos
    let openImagePickerAsync = async() => {
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
      const pickerResult = await ImagePicker.launchImageLibraryAsync();
      
      if (pickerResult.cancelled === true) {
      return; //al poner solo return, si no se escoge ninguna imagen, no da error
      }
      
      setSelectedImage ({localUri: pickerResult.uri});  //de esta forma, estaria actualizado el estado
      setFlag(true);
      
    };

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

    const crearLista = async () => {
        /*const array = videos.filter((video) => 
        {for(let i=0; i<videos.length; i++){
          video !== videos[i];
        }});
        */
        if((videos.length > 0) && (videos !== undefined) && (videos !== null)){
          const valorListas = await AsyncStorage.getItem("LISTAS");
          const l = valorListas ? JSON.parse(valorListas) : [];
          const valorVideos = await AsyncStorage.getItem("VIDEOS");
          const video = valorVideos ? JSON.parse(valorVideos) : [];
          let videoarray = [video];
          var lista = {};
          const idList = (Math.round(Math.random() * 1000)).toString();
          var dia = new Date().getDate(); //To get the Current Date
          var mes = new Date().getMonth() + 1; //To get the Current Month
          var año = new Date().getFullYear(); //To get the Current Year
          var fecha = dia + '-' + mes + '-' + año;

          try{
            if (selectedImage.localUri !== 'https://cdn.pixabay.com/photo/2017/01/25/17/35/picture-2008484_960_720.png' || im !== imagenInicial[2].image){
              if ((selectedImage.localUri !== null) && (selectedImage.localUri !== undefined) && (selectedImage.localUri !== "") && (flag === true)){

                lista.imagen = selectedImage.localUri;
                lista.titulo = titulo;
                lista.videolista = video;
                lista.email = email;

                let idVideos = "";
                if(l.length>0){
                  for (let i=0; i < l.length; i++){
                    if(idList !== (JSON.parse(l[i]).idlista)) {
                      idVideos = idList;
                    }
                  }
                }
                if(idVideos === "")
                {
                  idVideos = (Math.round(Math.random() * 1000)).toString();
                }

                lista.idlista = idVideos;
                lista.fechacreacion = fecha;
                lista.listaRealizado = "no";
                lista.imagenListaRealizado = datosIm[7].image;    
                lista.historial = '';  
                lista.fondo = '';          
                var jsonLista = JSON.stringify(lista);
                l.push(jsonLista);

                /*
                const vids=()=>
                {
                  var vi;
                  for(let i=0; i<videos.length; i++){
                    vi=videos.filter((video) => video !== videos[i]);
                  return vi;
                  }
              
                }
                */
                //var newVideos = videos.filter((video) => video !== vids);
                //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
              }
              if ((im !== null) && (im !== undefined) && (im !== "") && (flag === false)){
                lista.imagen = im;
                lista.titulo = titulo;
                lista.videolista = video;
                lista.email = email;

                let idVideos = "";

                if(l.length>0){
                  for (let i=0; i < l.length; i++){
                    if(idList !== (JSON.parse(l[i]).idlista)) {
                      idVideos = idList;
                    }
                  }
                }
                if(idVideos === "")
                {
                  idVideos = (Math.round(Math.random() * 1000)).toString();
                }

                lista.idlista = idVideos;
                lista.fechacreacion = fecha;
                lista.listaRealizado = "no";
                lista.imagenListaRealizado = datosIm[7].image;
                lista.historial = '';
                lista.fondo = '';
                var jsonLista = JSON.stringify(lista);
                l.push(jsonLista);

                //l.push(im + '\n' + titulo + '\n' + '[' + video + '\n' + email);
                /*
                const vids=()=>
                {
                  var vi;
                  for(let i=0; i<videos.length; i++){
                    vi=videos.filter((video) => video !== videos[i]);
                  return vi;
                  }
              
                }
                */
                //var newVideos = videos.filter((video) => video !== vids);
                //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
              }
              console.log('Se ha pulsado Crear Lista')
              
              var anotherArray=videos;

              console.log('Los videos al inicio de Crear Lista son: ', anotherArray)
              //await AsyncStorage.setItem("VIDEOS"), JSON.stringify(anotherArray);

              //setVideos(a); 
              const listarray = [l];
              console.log('SE HA AÑADIDO LA LISTA: ', l)
              const vid = await AsyncStorage.getItem("VIDEOS");
              const v = vid ? JSON.parse(vid) : [];
              const varray = [v];
              var f=varray;
              varray.length=0;
              console.log('Al vaciar array videos el resultado es: ', f)  
              setVideos(f);        
              //convertimos el array de listas 'l' en un string usando JSON.stringify(l) y lo pasamos a AllLists.js
              await AsyncStorage.setItem("VIDEOS", JSON.stringify(f));
              await AsyncStorage.setItem("LISTAS", JSON.stringify(l))
                  .then(() => navigation.navigate("AllLists"));
              setTitulo("");
              //setEmail("");
              //setSeries("");
              //setRepeticiones("");
              //setTiempo("");
              setSelectedImage(null);
              setIm("");

              //setVideos(array);

              console.log('array de listas es = ', l)
              console.log('array de videos final = ', videos)
              //console.log('array de array = ', newVideos)
            }
            else {
              Alert.alert("Inserte una imagen o un icono");
            }
          }
          catch(error){
            console.log(error);
            Alert.alert("Error. Inserte una imagen o un icono");
          }
        }

        else {
          Alert.alert("Inserte un link de Youtube en la lista");
        }
    }

    const addVideoLink = () => {

        console.log('Se ha pulsado Añadir Video')

        return (
          <View>
            <View style={{ flexDirection: 'row'}}>
              <View>
                <TextInput
                  placeholder="Series"
                  value={series}
                  onChangeText={setSeries}
                  style={styles.input2}
                  multiline={true}
                  selectionColor='#515759'
                />
              </View>
              <View>
                <Text style={{ marginLeft: 30}}>series</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row'}}>
              <View>
                <TextInput
                  placeholder="Repeticiones"
                  value={repeticiones}
                  onChangeText={setRepeticiones}
                  style={styles.input2}
                  multiline={true}
                  selectionColor='#515759'
                /> 
              </View>
              <View>
                <Text style={{ marginLeft: 30}}>repeticiones</Text>
              </View>
            </View>
            <TextInput
              placeholder="Tiempo"
              value={tiempo}
              onChangeText={setTiempo}
              style={styles.input2}
              multiline={true}
              selectionColor='#515759'
            /> 

            <Button
              title="Guardar vídeo"
              onPress={guardarVideo}>
              <Text>Guardar</Text>                                  
            </Button>
  
          </View>
        );
   
  }

    const guardarVideo = async () => {
      if ((videos !== undefined) && (videos !== null)){
        console.log('Se ha pulsado guardar Video si videos existe')
        try{
          const vid = await AsyncStorage.getItem("VIDEOS");
          const v = vid ? JSON.parse(vid) : [];
          //const varray = [v];
          console.log('Valor de videos en asyncstorage', v)
          //varray.push(video(link));
          
          const id = (Math.round(Math.random() * 1000)).toString();
          var lista = {};
          lista.series = series + " series";
          lista.repeticiones = repeticiones + " repeticiones";
          lista.tiempo = tiempo + " " + listValueNumberTiempo;
          lista.videos = video(link);

          let idVideos = "";

          idVideos = id;

          lista.id = idVideos;
          lista.realizado = "no";
          lista.imagenRealizado = datosIm[7].image;      
          lista.emoticono = '';
          lista.foto = '';
          var jsonLista = JSON.stringify(lista);
          v.push(jsonLista);
          //convertimos el array de videos 'v' en un string usando JSON.stringify(v)
          await AsyncStorage.setItem("VIDEOS", JSON.stringify(v));
          //videolista = videolista.push(series + '\n' + repeticiones + '\n' + tiempo + '\n' + video(link));
          const vi = await AsyncStorage.getItem("VIDEOS");
          const vd = vi ? JSON.parse(vi) : [];

          setLink("");
          setSeries("");
          setRepeticiones("");
          setTiempo("");
          setVideos(vd);
          setFlagVideo(false);
          setDat(!dat);
          console.log('Valor de videos es1', videos)
          console.log('si video NO es null, objeto de videos obtenido de asyncstorage: ', vd)
      }
      catch(error){
        console.log(error);
      }

    }
    else {
      console.log('Se ha pulsado guardar Video si videos no existe')
      try{
        setDat(!dat);
        var lista = {};
        lista.series = series + " series";
        lista.repeticiones = repeticiones + " repeticiones";
        lista.tiempo = tiempo + listValueNumberTiempo;
        lista.videos = video(link);

        const idItem = (Math.round(Math.random() * 1000)).toString();

        lista.id = idItem;
        lista.realizado = "no";
        lista.imagenRealizado = datosIm[7].image;
        lista.emoticono = '';
        lista.foto = '';
        var jsonListaArray = JSON.stringify(lista);
        var jsonList = JSON.stringify([jsonListaArray]);
        //await AsyncStorage.setItem("VIDEOS", jsonListaArray);
        //const vid = await AsyncStorage.getItem("VIDEOS");    
        //const v = vid ? JSON.parse(vid) : [];
        //varray.push(video(link));
        //const varray = [v];
        /*
        const id = (Math.round(Math.random() * 1000)).toString();
        lista.id = id;
        var jsonLista = JSON.stringify([lista]);
        v.push(jsonLista);
        */

        //const varray = [v];
        //convertimos el array de videos 'v' en un string usando JSON.stringify(v)
        //await AsyncStorage.setItem("VIDEOS", JSON.stringify(v));

        await AsyncStorage.setItem("VIDEOS", jsonList);
        const vid = await AsyncStorage.getItem("VIDEOS");    
        const v = vid ? JSON.parse(vid) : [];

        setLink("");
        setSeries("");
        setRepeticiones("");
        setTiempo("");
        setVideos(v);
        setFlagVideo(false);
        setDat(!dat);
        //console.log('si video === null, array de videos obtenido de asyncstorage: ', varray)
        console.log('si video === null, objeto de videos obtenido de asyncstorage: ', v)
        console.log('Valor de videos es2', videos)
      }
      catch(error){
        console.log(error);
      }
    }
  }

  /*
    const videoList = () => {
      var v = video(link);
      setLink("");
      console.log('v: ', v)

      return (            
      <View style={{ marginTop: 10}}>
        <YoutubePlayer
          height={400}
          width={400}
          play={false}
          videoId={v}
        />
     </View>)
    }

    
    const addVideo = () => {
      console.log('funciona hasta addVideo');
      return (
        <View>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.boton}>
        <Text style={styles.botonTexto}>Añadir video</Text>
      </TouchableOpacity>
        <Modal 
        visible={modalVisible} 
        animationType='fade' 
        transparent={true}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}>
        <TextInput
          value={link}
          onChangeText={(text) => setLink(text)}
          style={styles.input3}
          onSubmitEditing={() => {videoList();}}
        />
        <View style={{ marginTop: 10}}>
          <Pressable
            style={[styles.botonModal, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text>Hide Modal</Text>
          </Pressable>

          <YoutubePlayer
            height={200}
            width={200}
            play={false}
            videoId={link}
          />
        </View>
      </Modal>
      </View>
      );
    }
*/
    const renderItem = ({ item, index }) => {
      //setDat(false);
      let seriescard = item[0];
      let repeticionescard = item[1];
      let tiempocard = item[2];
      let videocard = item[3];

      /*
      if(item.length !== 0 && item !== null && item !== undefined) {

          console.log('El ITEM es1: ', item)

          if((videos.length > 0) && (videos !== undefined) && (videos !== null)){ 

              if(item[4] == videos[4]){
                seriescard = item[0];
                repeticionescard = item[1];
                tiempocard = item[2];
                videocard = item[3];
              console.log('la nueva card es: ', item[0])
            }

            if(videos.length == 0){
              seriescard = item.split(',').split('\n')[0];
              repeticionescard = item.split(',').split('\n')[1];
              tiempocard = item.split(',').split('\n')[2];
              videocard = item.split(',').split('\n')[3];
            }
        }

      }
      */
      //console.log('la nueva card es1: ', item[0])
      //console.log('la nueva card es2: ', item[1])
      //console.log('El ITEM es2: ', item)
      //const itemList = JSON.stringify(item);
      //console.log('El ITEM de la LISTA es: ', itemList)
      if (videos.length > 0) {
        //console.log('videos al añadir uno nuevo es1: ', videos)
        return (
          <View style={styles.border}>
            <View styles={styles.viewSeries}>
              <Text style={{fontSize: 18, margin: 20, marginLeft: 25}}> 
                {JSON.parse(item).series + '\n' + JSON.parse(item).repeticiones + '\n' + JSON.parse(item).tiempo}
              </Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <YoutubePlayer
                height={280}
                width={280}
                play={false}
                videoId={JSON.parse(item).videos}
              />
            </View>
          </View>
        );
      }
      else {
        console.log('videos al añadir uno nuevo es2: ', videos)
        return;
      }
    }

    const eliminarVideos = async () => {
      const newListas = await videos.filter((video) => video === 'f6TXEnHT_Mk');  //creamos un nuevo array con todas las listas que no coinciden con el parametro singleList de las listas usando array.filter
      await AsyncStorage.setItem("VIDEOS", JSON.stringify(newListas));  //nos quedamos solo con las listas que no coinciden con singleList
      //'kHd-8DZeHCQ'
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


/*
    function showVideoList (){
      console.log('funciona hasta showVideoList');
      return (
        <View>
          <FlatList 
            data={videos.reverse()}
            extraData={dat}
            keyExtractor={( item , index) => item.id.toString()}
            renderItem={({ item }) => 
            <Text style={{ marginBottom: 100}}>{item}</Text>
            }
          />    
        </View>
      );
          
    }
  */

try{
    if (flag === false) {
      component = <Image
      //source={{uri: 'https://picsum.photos/200/200'}}
      source={ 
                im !== "" ? im : imagenInicial[2].image
                //im
              }
                style={styles.imagen}
                //si existe el estado (si es distinto de null), se pinta una imagen (de la uri) que escogemos en la galeria. 
              //Si no existe el estado (si es null), se muestra la imagen 'picsum.photos' por defecto
    
    />;
    } 
    else if (flag === true ) {
        component = <Image
        //source={{uri: 'https://picsum.photos/200/200'}}
        source={{
          uri: selectedImage !== null ?
               selectedImage.localUri : 
              'https://cdn.pixabay.com/photo/2017/01/25/17/35/picture-2008484_960_720.png'
              ,

          }}
        style={styles.imagen}
        //si existe el estado (si es distinto de null), se pinta una imagen (de la uri) que escogemos en la galeria. 
        //Si no existe el estado (si es null), se muestra la imagen 'picsum.photos' por defecto
        />;
    }
    else {
          component = <Image
          //source={{uri: 'https://picsum.photos/200/200'}}
          source={{
                    //source={{uri: 'https://picsum.photos/200/200'}}
                    uri: 'https://cdn.pixabay.com/photo/2017/01/25/17/35/picture-2008484_960_720.png'
                  }}
                    style={styles.imagen}
                    //si existe el estado (si es distinto de null), se pinta una imagen (de la uri) que escogemos en la galeria.                     //Si no existe el estado (si es null), se muestra la imagen 'picsum.photos' por defecto
        
          />;
    }
    
    if (flagVideo === false) {
      componentVideo =  (<View> 

      </View>);
    } 
    else if (flagVideo === true ) {
      componentVideo = (
        <View>
          <View style={{ flexDirection: 'row'}}>
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
          <View style={{ flexDirection: 'row'}}>
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
            <View style={{ flexDirection: 'row' }}>
              <View>
              <TextInput
                placeholder="Insertar link de Youtube"
                value={link}
                onChangeText={(text) => setLink(text)}
                style={styles.input3}
                selectionColor='#515759'
              />
              </View>
              <View style={styles.button4}>
                <TouchableOpacity onPress={openYoutubeApp}>
                  <Image
                    source={datosIm[16].image}
                    style={styles.imagen2}
                  />
                </TouchableOpacity>
              </View>
            </View>
          <Button
            title="Guardar vídeo"
            onPress={guardarVideo}>
            <Text>Guardar</Text>                                  
          </Button>
      </View>);
    }
    else {
      componentVideo = (<View> 

      </View>);
    }

  } catch (error){
    console.log(error)
  }
     
    let pressFlagVideo = () => {
      setFlagVideo(true);
    }
    

      return (
        <View style={styles.container}>
          <Text style={styles.title} category="h1">
				    Nueva Lista
			    </Text>
          <Modal 
            visible={modalVisible} 
            animationType='fade' 
            transparent={true}>
            <View style={styles.modalStyle}>
            <FlatList 
              data={datos}
              keyExtractor={( item , index) => index.toString()}
              renderItem={({ item, index }) => (
              <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  setIm(item.image);    //setIm(item.image)
                  setFlag(false);
                  //var i = Imagenes[index];
                  console.log('la uri de la imagen seleccionada es: ', im);
                  console.log('el item seleccionado es: ', item);
                  setModalVisible(!modalVisible);
                  }}>
                  <Image
                    //source={{uri: 'https://picsum.photos/200/200'}}
                    source={item.image}
                    style={{height: 50, width: 50}}
                  />
              </TouchableOpacity>
              </View>
              )}
            />  
            </View> 
          </Modal>
          <TouchableOpacity
            onPress={seleccionaImagen}
            //ponemos Image dentro del TouchableOpacity para que al presionar en la imagen se lance la galeria de imagenes
            >
            {component}
          </TouchableOpacity>
          <TextInput
            placeholder="Título"
            value={titulo}
            onChangeText={setTitulo}
            style={styles.input}
            multiline={true}
            selectionColor='#515759'
          />  
          <Text style={{marginBottom: 10}}>
				    {email || "Email"}
			    </Text>

            {componentVideo}

            <FlatList 
              data={videos ? videos : []}
              keyExtractor={( item , index) => index.toString()}
              renderItem={renderItem}
              ItemSeparatorComponent={myItemSeparator}
            />  
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.botonb}>
                <Button
                  title="Añadir vídeo"
                  style={{backgroundColor: '#5683F3'}}
                  onPress={pressFlagVideo}>
                  <Text>Añadir vídeo</Text>                                  
                </Button>
              </View>
            </View>
            <Button
              title="Crear Lista"
              style={{marginTop: 10, height: 60, width: 140}}
              onPress={crearLista}>
              <Text>CREAR LISTA</Text>                                  
            </Button>

        </View>
      );


 }
/*

<TouchableOpacity onPress={()=>this.props.navigation.goBack()} 
  style={{width:'100%', height:45, flexDirection:'row'}}> 
<Image source={require('back button image path')}/> 
</TouchableOpacity>

           <Text style={{fontSize: 18, margin: 20}}> 
              {item[0]}
          </Text>
          <Text style={{fontSize: 18, margin: 20}}> 
              {item[1]}
          </Text>
          <Text style={{fontSize: 18, margin: 20}}> 
              {item[2]}
          </Text>

              <IconPicker
                iconsTitle="Iconos"
                numColumns={3}
                iconSize={20}
                iconColor="#fff"
                backgroundColor='#121212'
                onClick={handleSubmit}
                iconContainerStyle={styles.iconContainer}
              />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.bottom}>
                <Button style={styles.boton} 
                  title="Borrar Videos"
                  onPress={eliminarVideos}
                />
            </KeyboardAvoidingView>

Iconos:
"https://www.flaticon.es/iconos-gratis/fuerte"
<a target="_blank" href="https://icons8.com/icon/9U7XZipO47pN/fitness">Fitness</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
<a target="_blank" href="https://icons8.com/icon/dpmUQ6u4vRRq/fitness">Fitness</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
<a target="_blank" href="https://icons8.com/icon/9760/lagartijas">Lagartijas</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
<a target="_blank" href="https://icons8.com/icon/16944/lagartijas">Lagartijas</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
<a target="_blank" href="https://icons8.com/icon/djfOcRn1m_kh/stretching">Stretching</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
<a target="_blank" href="https://icons8.com/icon/eMyFuLjESwET/stretching">Stretching</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
<a target="_blank" href="https://icons8.com/icon/16962/sentadillas">Sentadillas</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>

Paste this link on the website where your app is available for download or in the description section of the platform or marketplace you’re using.
<a href="https://www.flaticon.com/free-icons/exercise" title="exercise icons">Exercise icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/squat" title="squat icons">Squat icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/gymnasium" title="gymnasium icons">Gymnasium icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/warm-up" title="Warm up icons">Warm up icons created by smalllikeart - Flaticon</a>
"Icon made by Darius Dan from www.flaticon.com"


*/               

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      color: "white",
      padding: 30,
      width: Dimensions.get("window").width,
  },
  boton: {
    backgroundColor: '#4FA5E6',
    borderRadius: 5,
    height: 25,
    marginBottom: 4,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonb: {
    padding: 1,
    borderRadius: 5,
    marginTop: 10,
    marginRight: 10,
    margin: 5,
  },
  botond: {
    padding: 1,
    borderRadius: 5,
    marginTop: 0,
    margin: 5,
    marginLeft: 15,
  },
  botonTexto: {
    color: 'black',
    fontSize: 14,
    height: 20,
    margin: 12,
    padding: 1,
    justifyContent: 'center',
  },
  border: {
    marginTop: 30,
    borderColor: '#949699',
    borderWidth: 1,
    borderRadius: 9,
    width: width-60,
    height: 350,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  button3: {
    //backgroundColor: '#1B4B95',
    padding: 0,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 40,
    borderRadius: 400/2,
    height: 35,
  },
  button4: {
    //backgroundColor: '#1B4B95',
    position: 'absolute',
    padding: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    borderRadius: 400/2,
    height: 35,
    right: 0,
    top: 4,
  },
  botonModal: {
    backgroundColor: '#1B4B95',
    color: 'black',
    fontSize: 14,
    height: 25,
    margin: 5,
    padding: 1,
    width: width - 250,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 0,
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
    marginLeft: 2,
    width: width - 180,
  },
  title: {
    textAlign: 'center',
    fontSize: 25,
    marginTop: 5,
    marginBottom: 15,
  },
  imagen: {
    height: 60,
    width: 60,
    marginBottom: 0,
    borderRadius: 400/2,
  },
  imagen2: {
    height: 40,
    width: 40,
    left: 0,
    marginBottom: 0,
    borderRadius: 400/2,
  },
  iconContainer: {
    width: 50,
    height: 30,
    borderRadius: 50,
    margin: 5,
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: '#121212',
  },
  modalStyle: {
    borderColor: '#949699',
    borderWidth: 1,
    borderRadius: 9,
    width: width-30,
    height: Dimensions.get("window").height-400,
    marginLeft: 15,
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#79aad1',
  },
  viewSeries: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerStyle5: {
    padding: 0,
    marginBottom: 5,
    top: 0,
    left: 18,
    borderRadius: 5,
    width: 110,
  },
});