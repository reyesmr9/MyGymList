import 'react-native-gesture-handler';
import React, {useState, useEffect, useRef} from 'react';

import { StyleSheet, Modal, Text, TextInput, View, Image, TouchableOpacity, 
  Keyboard, Alert, BackHandler, Dimensions} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Imagenes } from '../components/Images';
import { Video } from 'expo-av';
import DropDownPicker from 'react-native-dropdown-picker';
import { Button, Icon } from '@ui-kitten/components'

export default function NuevaListaLocal () {
  const [titulo, setTitulo] = useState("");
  const [series, setSeries] = useState("");
  const [repeticiones, setRepeticiones] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [email, setEmail] = useState("");
  const [link, setLink] = useState('');
  const [dat, setDat] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [videos, setVideos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [im, setIm] = useState("");
  const [flag, setFlag] = useState(false);
  const [flagVideo, setFlagVideo] = useState(false);
  const videoLocalRef = useRef(null);
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

  let componentVideo = null;
  let component = null;
  let isMounted = true;

  const navigation = useNavigation();

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

  //Imagen inicial al crear la lista
  const [imagenInicial, setImagenInicial] = useState([
    { id: '23', image: Imagenes.veintitres },
    { id: '24', image: Imagenes.veinticuatro },
    { id: '25', image: Imagenes.veinticinco },
    { id: '26', image: Imagenes.veintiseis }
  ]);

  const iconRef = React.useRef();

  const iconoImportarVideo = (props) => (
    <Icon
      {...props}
      ref={iconRef}
      name='video-outline'
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
      const vid = AsyncStorage.getItem("EJERCICIOS");
      const varray = [vid];
      var f=varray;
      varray.length=0;
      setFlagVideo(false);
      setVideos(f);        
      AsyncStorage.setItem("EJERCICIOS", JSON.stringify(f));
      if(selectedImage !== null){
        setSelectedImage({localUri: 'https://cdn.pixabay.com/photo/2017/01/25/17/35/picture-2008484_960_720.png'});
      }
      if(im !== ""){
        setIm(imagenInicial[2].image);
      }
      if(statusVideoAdd.isPlaying){
        if(videoLocalAddRef !== null && videoLocalAddRef.current !== null) {
        videoLocalAddRef.current.pauseAsync();
        }
      }
      if(statusVideo.isPlaying){
        if(videoLocalRef !== null && videoLocalRef.current !== null) {
          videoLocalRef.current.pauseAsync();
        }
      }
      setTitulo("");
      setVideoLocal(null);   
      Keyboard.dismiss();
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
      isMounted = false;
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
    await AsyncStorage.getItem("EJERCICIOS").then((videos) => {
      setVideos(JSON.parse(videos)); 
    });
    await AsyncStorage.getItem("DATOS").then((datos) => {
      setEmail(JSON.parse(datos).split('"')[7]);
    });

    if((selectedImage == null) && (im == "")){
      setSelectedImage({localUri: 'https://cdn.pixabay.com/photo/2017/01/25/17/35/picture-2008484_960_720.png'});
      setIm(imagenInicial[2].image);
    }
  }

  const seleccionaImagen = () =>
  Alert.alert(
    "",
    "Selecciona una imagen", [
      {text: "Cancelar", onPress: () => {return;}, style: 'cancel'},
      {
        text: 'Icono de la app',
        onPress: () => setModalVisible(true)
      },
      {text: "Imagen de la galería", onPress: abrirImagen}      
    ]
  );

  const myItemSeparator = () => {
    return (
      <View
        style={{ height: 1, backgroundColor: "gray", marginHorizontal: 10 }}
      />
    );
  };
    
  // Función que se lanza cuando pulsamos el botón de "abrirImagen" y nos pide acceder a la galería de fotos
  let abrirImagen = async() => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    // Si el usuario ha denegado el permiso para acceder a su galería, entonces sale una alerta
    if (permissionResult.granted == false) {
    alert('Permisos para acceder a la galería son requeridos');
    return;
    }
    // Cuando el usuario escoge una imagen de su galería, pickerResult retorna la imagen que escogió
    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    
    if (pickerResult.cancelled === true) {
    return;
    }
    //Actualizamos la variable de estado de la imagen seleccionada
    setSelectedImage ({localUri: pickerResult.uri});
    setFlag(true);
  };

  const crearLista = async () => {
    if(titulo !== ""){
      const valorListas = await AsyncStorage.getItem("LISTAS");
      const l = valorListas ? JSON.parse(valorListas) : [];
      const valorVideos = await AsyncStorage.getItem("EJERCICIOS");
      const video = valorVideos ? JSON.parse(valorVideos) : [];
      let videoarray = [video];
      var lista = {};
      const idList = (Math.round(Math.random() * 1000)).toString();
      var dia = new Date().getDate();
      var mes = new Date().getMonth() + 1;
      var año = new Date().getFullYear();
      var fecha = dia + '-' + mes + '-' + año;
      try{
        if ((videos.length > 0) && (videos !== undefined) && (videos !== null)){
          if ((selectedImage.localUri !== null) && (selectedImage.localUri !== undefined) && (selectedImage.localUri !== "") && (flag === true)){
            lista.imagen = selectedImage.localUri;
            lista.titulo = titulo;
            lista.videolista = video;
            lista.email = email;

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
            lista.fechacreacion = fecha;
            lista.listaRealizado = "no";
            lista.imagenListaRealizado = datosIm[7].image;  
            lista.historial = '';
            lista.fondo = '';              
            var jsonLista = JSON.stringify(lista);
            l.push(jsonLista);            
          }
          if ((im !== null) && (im !== undefined) && (im !== "") && (flag === false)){
            lista.imagen = im;
            lista.titulo = titulo;
            lista.videolista = video;
            lista.email = email;

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
            lista.fechacreacion = fecha;
            lista.listaRealizado = "no";
            lista.imagenListaRealizado = datosIm[7].image;
            lista.historial= '';
            lista.fondo = '';
            var jsonLista = JSON.stringify(lista);
            l.push(jsonLista);
          }
          else {
            lista.imagen = '';
            lista.titulo = titulo;
            lista.videolista = video;
            lista.email = email;

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
            lista.fechacreacion = fecha;
            lista.listaRealizado = "no";
            lista.imagenListaRealizado = datosIm[7].image;
            lista.historial= '';
            lista.fondo = '';
            var jsonLista = JSON.stringify(lista);
            l.push(jsonLista);
          }

          const vid = await AsyncStorage.getItem("EJERCICIOS");
          const v = vid ? JSON.parse(vid) : [];
          const varray = [v];
          var f=varray;
          varray.length=0;
          setVideos(f);        
          await AsyncStorage.setItem("EJERCICIOS", JSON.stringify(f));
          await AsyncStorage.setItem("LISTAS", JSON.stringify(l))
            .then(() => {
              setTitulo("");
              setSelectedImage(null);
              setIm("");
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'AllLists'
                  },
                ],
              })
              navigation.navigate("AllLists");
              isMounted = false;
            });
        }
        else {
          Alert.alert("Inserta un vídeo en la lista");
        }    
      }
      catch(error){
        console.log(error);
        Alert.alert("Error al crear la lista");
      }
    }
    else {
      Alert.alert("Inserta un título");
    }
  }

  const guardarVideo = async () => {
    if ((videos !== undefined) && (videos !== null)){
    // Se ha pulsado guardarVideo si vídeos existe
      try{
        if(videoLocal === null){
          Alert.alert("Inserta un vídeo");
        }
        else {
          const vid = await AsyncStorage.getItem("EJERCICIOS");
          const v = vid ? JSON.parse(vid) : [];
          
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
          lista.videos = videoLocal;

          let idVideos = "";

          idVideos = id;

          lista.id = idVideos;
          lista.realizado = "no";
          lista.imagenRealizado = datosIm[7].image;
          lista.emoticono = '';
          lista.foto = '';
          var jsonLista = JSON.stringify(lista);
          v.push(jsonLista);
          await AsyncStorage.setItem("EJERCICIOS", JSON.stringify(v));
          const vi = await AsyncStorage.getItem("EJERCICIOS");
          const vd = vi ? JSON.parse(vi) : [];

          setLink("");
          setSeries("");
          setRepeticiones("");
          setTiempo("");
          setVideos(vd);
          setFlagVideo(false);
          setDat(!dat);
          setVideoLocal(null);
          setOpenListTiempo(false);
        }
    }
    catch(error){
      console.log(error);
    }
  }
  else {
    // Se ha pulsado guardarVideo si vídeos no existe
    try{
      if(videoLocal === null){
        Alert.alert("Inserta un vídeo");
      }
      else {
        setDat(!dat);
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
        lista.videos = videoLocal;

        const idItem = (Math.round(Math.random() * 1000)).toString();

        lista.id = idItem;
        lista.realizado = "no";
        lista.imagenRealizado = datosIm[7].image;
        lista.emoticono = '';
        lista.foto = '';
        var jsonListaArray = JSON.stringify(lista);
        var jsonList = JSON.stringify([jsonListaArray]);

        await AsyncStorage.setItem("EJERCICIOS", jsonList);
        const vid = await AsyncStorage.getItem("EJERCICIOS");    
        const v = vid ? JSON.parse(vid) : [];

        setLink("");
        setSeries("");
        setRepeticiones("");
        setTiempo("");
        setVideos(v);
        setFlagVideo(false);
        setDat(!dat);
        setVideoLocal(null);
      }
    }
    catch(error){
      console.log(error);
    }
  }
}

  const renderItem = ({ item, index }) => {
    if (videos.length > 0) {
      return (
        <View style={styles.border}>
          <View styles={styles.viewSeries}>
            <Text style={{fontSize: 18, margin: 20, marginLeft: 25}}> 
              {JSON.parse(item).series + '\n' + JSON.parse(item).repeticiones + '\n' + JSON.parse(item).tiempo}
            </Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <View>
              <Video
                  ref={videoLocalRef}
                  source={{ uri: JSON.parse(item).videos }}
                  useNativeControls
                  resizeMode="contain"
                  isLooping={false}
                  isMuted={false}
                  style={styles.videoPlayer}
                  onPlaybackStatusUpdate={status => setStatusVideo(() => status)}
              />
            </View>
          </View>
        </View>
      );
    }
    else {
      return;
    }
  }

  let importarVideo = async() => {

    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    // Si el usuario ha denegado el permiso para acceder a su galería, entonces sale una alerta
    if (permissionResult.granted == false) {
    alert('Permisos para acceder a la cámara son requeridos');
    return;
    }
    // Cuando el usuario escoge una imagen de su galería, pickerResult retorna la imagen que escogió
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (pickerResult.cancelled === true) {
      return;
    }
    //Actualizamos la variable de estado de la imagen seleccionada
    setVideoLocal(pickerResult.uri);
  };

  try{
    if (flag === false) {
      component = <Image
        source={ 
                  im !== "" ? im : imagenInicial[2].image
                }
        style={styles.imagen}
        // Si existe el estado, se pinta una imagen (de la uri) que escogemos en la galería. 
        // Si no existe el estado, se muestra la imagen por defecto    
      />;
    } 
    else if (flag === true ) {
      component = <Image
        source={{
          uri: selectedImage !== null ?
              selectedImage.localUri : 
              'https://cdn.pixabay.com/photo/2017/01/25/17/35/picture-2008484_960_720.png'
              ,

          }}
        style={styles.imagen}
        // Si existe el estado, se pinta una imagen (de la uri) que escogemos en la galería. 
        // Si no existe el estado, se muestra la imagen por defecto 
      />;
    }
    else {
          component = <Image
            source={{
                      uri: 'https://cdn.pixabay.com/photo/2017/01/25/17/35/picture-2008484_960_720.png'
                    }}
            style={styles.imagen}                           
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
        {(videoLocal !== null) ? (
          <View>
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
        <Button
          title="Importar vídeo"
          style={styles.botonAbrirVideo}
          accessoryRight={iconoImportarVideo}
          onPress={importarVideo}>
          <Text>Abrir vídeo</Text>                                  
        </Button>
        <Button
          title="Guardar vídeo"
          style={styles.botonGuardar}
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
     
    let añadirEjercicio = () => {
      setFlagVideo(true);
    }
    
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.botonAtras}
        onPress={() => backAction()}>
        <Image
          source={datosIm[5].image}
          style={{height: 35, width: 35}}
        />
      </TouchableOpacity>
      <Text style={styles.title} category="h1">
        Nueva Lista Local
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
        onPress={seleccionaImagen}>
        {component}
      </TouchableOpacity>
      <TextInput
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
        multiline={false}
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
            title="Añadir ejercicio"
            style={styles.botonAñadirEjercicio}
            onPress={añadirEjercicio}>
            <Text>Añadir ejercicio</Text>                                  
          </Button>
        </View>
      </View>
      <Button
        title="Crear Lista"
        style={styles.botonCrearLista}
        onPress={crearLista}>
        <Text>CREAR LISTA</Text>                                  
      </Button>
    </View>
  );
 }           

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
    padding: 0,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 40,
    borderRadius: 400/2,
    height: 35,
  },
  button4: {
    position: 'absolute',
    padding: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    borderRadius: 400/2,
    height: 35,
    right: 4,
    top: 4,
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
  button6: {
    marginBottom: 20, 
    marginTop: 10, 
    marginLeft: 57,
    backgroundColor: '#6666ff', 
    borderColor: '#6666ff',
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 250,
  },
  botonGuardar: {
    backgroundColor: '#1d89db',
    borderWidth: 1,
    borderColor: '#1979c2',
    borderRadius: 100,
    padding: 10, 
    alignItems: 'center', 
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
  },
  botonAñadirEjercicio: {
    backgroundColor: '#48BEEA',
    borderWidth: 1,
    borderColor: '#48BEEA',
    borderRadius: 100,
    padding: 10, 
    alignItems: 'center', 
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
  },
  botonCrearLista: {
    backgroundColor: '#2d65c4',
    borderWidth: 1,
    borderColor: '#2a5db5',
    borderRadius: 100,
    padding: 10, 
    alignItems: 'center', 
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10, 
    height: 60, 
    width: 140,
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
  botonAtras: {
    borderRadius: 1000,
    alignItems: 'center', 
    justifyContent: 'center',
    alignSelf: 'center',
    height: 35,
    position: 'absolute',
    bottom: 10,
    top: 35,
    right: 340,
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