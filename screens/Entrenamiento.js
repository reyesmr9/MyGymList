import 'react-native-gesture-handler';
import React, {useState, useEffect, useRef, useCallback} from 'react';

import { StyleSheet, View, BackHandler, TouchableOpacity, Dimensions, Alert} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import YoutubePlayer from 'react-native-youtube-iframe';
import { Video } from 'expo-av';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {Icon, Text, Button} from '@ui-kitten/components';
import { FlatList } from 'react-native';

export default function Entrenamiento ({route}) {
  const navigation = useNavigation();
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
  const [flagFinal, setFlagFinal] = useState(false);
  const [tiempoInicio, setTiempoInicio] = useState("");
  const [tiempoFinal, setTiempoFinal] = useState("");
  const [tiempoTotal, setTiempoTotal] = useState("");
  const [statusVideo, setStatusVideo] = useState({});
  let previewVideoPlay = null;
  let youtubeVideoPlay = null;
  let videoGuardar = false;
  let videoSiguiente = false;
  const videoLocalRef = useRef([]);

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

  const comenzarTimer = () => {
    setCustomInterval(
      setInterval(() => {
        cambiarTiempo();
      }, 1000)
    );
  }

  const pararTimer = () => {
    if(customInterval){
      clearInterval(customInterval);
    }
  }

  const resetearTimer = () => {
    pararTimer();
    setSeconds(0);
    setMinutes(0);
    setHours(0);
    return;
  }

  const cambiarTiempo = () => {     
    setSeconds((prevState) => {
      if((prevState + 1) == 60){
        setMinutes((prevMinutes) => {
          if((minutes + 1) == 60){
            setHours((prevHours) => {
              if((hours + 1) == 60){
                resetearTimer();
                return 0;
              }
              return hours + 1;
            });
            return 0;
          }
          else {
            return minutes + 1;
          }
        });
        return 0;
      }
      else {
        return prevState + 1;
      }
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
      Alert.alert('',
      "¿Estás seguro de cancelar el entrenamiento?", [
          {
          text: 'No',
          onPress: () => null,
          style:"cancel"
          },
          {text: "Sí", onPress: () => {
            cancelarEntrenamiento();
          }}
      ]
      );
    }
    return true;
  };

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
    };
      
    }, [flagButtonGuardar]));

  useEffect(() => {
    if(isMounted===true){
    // Si se ha pulsado el botón Siguiente, se avanza al próximo ejercicio
    if(flagOneVideo === false && flagTiempoInicial === true){
      pulsarSiguiente();
      // Si se ha llegado al último ejercicio, se actualiza la lista
      if(currentSectionIndex >= ((listaActualT !== '') ? 
      (JSON.parse(listaActualT).videolista.length-2) : (listaInicialT.videolista.length-2))) {
        setFlagButtonGuardar(true);
      }
    }
    // Si se ha pulsado el botón Guardar, guardamos el tiempo de realización y descanso
    // de los ejercicios
    if(flagTiempoPress === true){
      guardarTiemposEjercicios();
    }
    }
    return () => {
      isMounted = false;
    };

  }, [flagTiempo]);

  const getLista = async() => {
    try {
      if(flagSaveTime === false){
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
        console.log('Se ha llegado al final del entrenamiento')
      }
    } catch (error){
      console.log(error)
    }
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
    }
    else {
      videoSiguiente = true;
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
          (<Video
            ref={ref => (videoLocalRef.current[index] = ref)}
            shouldPlay={false}
            source={{ uri: previewVideoPlay }}
            useNativeControls
            resizeMode="contain"
            isLooping={false}
            isMuted={false}
            style={styles.videoPlayer2}
            onPlaybackStatusUpdate={status => setStatusVideo(() => status)}
          />)}
        </View>
        {videoGuardar &&
        ((flagButton === false) ?
        (<Button
          style={styles.botonComenzar}
          onPress={() => {tiempoVideoDescanso(item)}}>
          <Text style={styles.buttonText}>Comenzar ejercicio</Text>
        </Button>) : 
        (<View style={{marginLeft: 20, alignItems: 'center', justifyContent: 'center'}}>
          <Button style={styles.botonGuardar}
            onPress={() => {
            if(statusVideo.isPlaying){
              if(videoLocalRef !== null && videoLocalRef.length !== 0) {
                for(let i = 0; i<videoLocalRef.current.length; i++){
                  videoLocalRef.current[i].pauseAsync();
                }
              }
            }             
            tiempoEjerciciosRealizados(item);             
            setFlagTiempoGuardar(true);
            setFlagTiempoPress(true);
            setFlagButtonGuardar(false);             
            setFlagTiempoInicial(false);
            setFlagTiempo(!flagTiempo);            
            }}>
            <Text>Guardar</Text>
          </Button>
        </View>))
        }
        {videoSiguiente &&
        ((flagButton === false) ? 
        (<TouchableOpacity
          style={styles.botonComenzar}
          onPress={() => {tiempoVideoDescanso(item)}}>
          <Text style={styles.buttonText}>Comenzar ejercicio</Text>
        </TouchableOpacity>) :
        (<Button
          style={styles.botonSiguiente}
          status='success'
          accessoryRight={siguienteIcon}
          onPress={() => {{
            if(statusVideo.isPlaying){
                if(videoLocalRef !== null && videoLocalRef.length !== 0) {
                  for(let i = 0; i<videoLocalRef.current.length; i++){
                    videoLocalRef.current[i].pauseAsync();
                  }
                }
            // Se ha pausado el vídeo y se ha dado a Siguiente            
            }
            tiempoVideoRealizado(item);
            }}}>
          Siguiente
        </Button>)
        )}
      </View>
    );
  }

  const pulsarSiguiente = () => {
    // Comprobar si se ha llegado al final de la lista
    if (currentSectionIndex >= ((listaActualT !== '') ? 
      (JSON.parse(listaActualT).videolista.length-1) : (listaInicialT.videolista.length-1))) {
      setFlagButtonGuardar(true);
      setCurrentSectionIndex(0);
      // Si se está reproduciendo un vídeo local, pausarlo
      if(statusVideo.isPlaying){
        if(videoLocalRef !== null && videoLocalRef.length !== 0) {
          for(let i = 0; i<videoLocalRef.current.length; i++){
            videoLocalRef.current[i].pauseAsync();
          }
        }
      }
      // Se muestra el último ejercicio de la lista
      flatListRef.current.scrollToIndex({
        index: currentSectionIndex,
      });        
      return;
    } else if (flatListRef.current){
      // Si al avanzar en la lista llegamos al último ejercicio, mostrar el último ejercicio de la lista
      if (currentSectionIndex >= ((listaActualT !== '') ? 
        (JSON.parse(listaActualT).videolista.length-1) : (listaInicialT.videolista.length-1))) {
        setFlagButtonGuardar(true);
        setCurrentSectionIndex(0);
        if(statusVideo.isPlaying){
          if(videoLocalRef !== null && videoLocalRef.length !== 0) {
            for(let i = 0; i<videoLocalRef.current.length; i++){
              videoLocalRef.current[i].pauseAsync();
            }
          }
        }
        flatListRef.current.scrollToIndex({
          index: currentSectionIndex,
        });
        return;
      }
      else {
        // Si no se ha llegado al final de la lista, avanzar al siguiente ejercicio
        if(statusVideo.isPlaying){
          if(videoLocalRef !== null && videoLocalRef.length !== 0) {
            for(let i = 0; i<videoLocalRef.current.length; i++){
              videoLocalRef.current[i].pauseAsync();
            }
          }
        }
        flatListRef.current.scrollToIndex({
          index: currentSectionIndex + 1,
        });       

        setCurrentSectionIndex(currentSectionIndex + 1);        
        return;
      }
    }
  }

  const guardarTiemposEjercicios = async() => {
    try{
      // Obtenemos las listas y los tiempos de la base de datos
      const valorListas = await AsyncStorage.getItem("LISTAS");
      const l = valorListas ? JSON.parse(valorListas) : [];

      const valorTiempo = await AsyncStorage.getItem("TIEMPO");
      const t = valorTiempo ? JSON.parse(valorTiempo) : [];

      // Obtenemos la fecha actual
      var dia = new Date().getDate();
      var mes = new Date().getMonth() + 1;
      var año = new Date().getFullYear();
      var fecha = dia + '-' + mes + '-' + año;

      let listaHist = '';
      var listaHistorial = {};
      listaHistorial.idHistorial = (Math.round(Math.random() * 1000)).toString();

      if (listaActualT !== '' && listaActualT !== undefined) {              
        listaHist = JSON.parse(listaActualT);
      }
      else {              
        listaHist = listaInicialT; 
      }

      // Comprobamos que los id de los historiales de entrenamiento sean únicos en la lista
      for(let i=0; i<l.length; i++){
        if(listaHist.idlista === (JSON.parse(l[i]).idlista)) {
          for(let j=0; j<((listaHist.historial).length); j++){
            if((listaHist.historial)[j].idHistorial === listaHistorial.idHistorial){
              listaHistorial.idHistorial = (Math.round(Math.random() * 1000)).toString();
              break;
            }
          }
          break;
        }
      }

      // Guardamos la fecha de realización del entrenamiento en el historial
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

      // Guardamos los tiempos de la base de datos en el historial de entrenamiento
      listaHistorial.tiemposEjercicios = t;    

      if(t.length !== 0){
        let jsonListTiempo = null;
        let listFilterVideos = t;

        if (listaActualT !== '' && listaActualT !== undefined) {              
          jsonListTiempo = JSON.parse(listaActualT);                 
        }
        else {              
          jsonListTiempo = listaInicialT;
        }
          
        jsonListTiempo.videolista = listFilterVideos;

        let newLists = '';
        let listaH = null;

        for (let i = 0; i < l.length; i++){
          if(jsonListTiempo.idlista === (JSON.parse(l[i]).idlista)) {         
            
            if (listaActualT !== '' && listaActualT !== undefined) {              
              listaH = JSON.parse(listaActualT);                 
            }
            else {              
              listaH = listaInicialT;
            }

            let arrayListaH = [];

            // Si el historial está vacío inicialmente, se crea una matriz vacía
            if(JSON.parse(l[i]).historial == ''){
              arrayListaH = [];
              console.log('el historial está inicialmente vacío')
            }
            // Si el historial no está vacío, se añade a la variable arrayListaH
            else{
              arrayListaH = JSON.parse(l[i]).historial;
              console.log('existe ya un historial')
            }
            
            // Guardamos el historial de entrenamiento en el historial de la lista
            arrayListaH.push(JSON.stringify(listaHistorial));

            listaH.historial = arrayListaH;
            
            break;     
          }
        }
        setFlagSaveTime(true);
        setFlagOneVideo(false);

        // Filtramos las listas cuyo id sea diferente al de la lista actual
        newLists = l.filter((lista) => JSON.parse(lista).idlista !== JSON.parse(listPlay).idlista);

        // Añadimos la lista actual con el historial actualizado en la lista de listas
        newLists.push(JSON.stringify(listaH));

        const vid = AsyncStorage.getItem("TIEMPO");
        const varray = [vid];
        var f=varray;
        f.length=0;

        // Almacenamos una matriz vacía en los tiempos de la base de datos para eliminarlos
        await AsyncStorage.setItem("TIEMPO", JSON.stringify(f));
        
        // Almacenamos las listas en la base de datos
        await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));

        let listaFinal = '';

        await AsyncStorage.getItem("LISTAS").then((listas) => {
          setListas(JSON.parse(listas)); 

          listaFinal = JSON.stringify(listaH);
          setFlagTiempoPress(false);
          let listaf = listT;
          listaf.length=0;
          setListT(listaf);
          
          // Reseteamos el cronómetro
          setCurrentSectionIndex(0);
          if(customInterval){
            clearInterval(customInterval);
            setSeconds(0);
            setMinutes(0);
            setHours(0);
          }

          // Navegamos a la pantalla Lista
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'Lista',
                params: { singleList: listPlay,
                          itemId: JSON.parse(listPlay).listaid,
                        },
              },
            ],
          })
          navigation.navigate("Lista", {
            singleList: ((listaFinal !== '') ? listaFinal : listPlay),
            itemId: JSON.parse(listPlay).listaid,
          });
          isMounted=false;                        
        });
      
      }
      else {
        console.log('No se ha guardado el tiempo en ninguno de los vídeos')
      }
      
    } catch(error){
      console.log(error)
    }

  }

  const tiempoEjerciciosRealizados = async(item) => {
    try{
      // Guardamos el tiempo final del ejercicio realizado y el tiempo total de entrenamiento
      setTiempoFinal(hours + ":" + minutes + ":" + seconds);
      setTiempoTotal(hours + ":" + minutes + ":" + seconds);

      // Obtenemos los tiempos de la base de datos
      const valorTiempo = await AsyncStorage.getItem("TIEMPO");
      const t = valorTiempo ? JSON.parse(valorTiempo) : [];

      if(t.length==0){
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

        let newTiempo6 = t;

        var jsonLista = JSON.stringify(listaTiempo);       

        newTiempo6.push(jsonLista);
        // Si no se han guardado los tiempos, almacenamos el tiempo de realización del ejercicio en la base de datos
        await AsyncStorage.setItem("TIEMPO", JSON.stringify(newTiempo6));

        await AsyncStorage.getItem("TIEMPO").then((tiempo) => {
          console.log('El valor de los tiempos es: ', tiempo)
        });

        setFlagButton(false);

        if(flagOneVideo === false){
            setFlagTiempoInicial(true);
        }
        setFlagTiempo(!flagTiempo);
      }

      else {
        if(tiempoInicio !== ""){
          let listVideo = '';
          let videoArray = '';

          // Si se han guardado los tiempos, calculamos el tiempo de realización del ejercicio
          for (let i = 0; i < listaInicialT.videolista.length; i++){
            if((JSON.parse(item).id) == (JSON.parse(listaInicialT.videolista[i]).id)){
              let tiempoEjInicial = tiempoInicio;
              let horasInicial = (tiempoEjInicial.split(":")[0]) * 3600;
              let minutosInicial = tiempoEjInicial.split(":")[1] * 60;

              let segundosInicial = tiempoEjInicial.split(":")[2] * 1;

              let segundosTotalActual = (hours * 3600) + (minutes * 60) + seconds;
              let segundosTotalInicial = horasInicial + minutosInicial + segundosInicial;

              let segundosRealizacionTotal = Math.abs(segundosTotalActual - segundosTotalInicial);

              listVideo = JSON.parse(listaInicialT.videolista[i]);
              videoArray = JSON.parse(listaInicialT.videolista[i]);

              let horasRealizacion = Math.round(segundosRealizacionTotal/60/60);
              let minutosparaRealizacion = Math.round(segundosRealizacionTotal/60);
              let minutosRealizacion = Math.round(minutosparaRealizacion % 60);
              let segundosRminutos = Math.round(segundosRealizacionTotal % 60);

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

          let newTiempo1 = '';

          if(videoArray !== ''){
            newTiempo1 = t.filter((lista) => (JSON.parse(lista).id !== videoArray.id));
          }

          var jsonLista = JSON.stringify(listaTiempo);       

          newTiempo1.push(jsonLista);

          // Almacenamos el tiempo de realización del ejercicio en la base de datos
          await AsyncStorage.setItem("TIEMPO", JSON.stringify(newTiempo1));

          await AsyncStorage.getItem("TIEMPO").then((tiempo) => {
            console.log('El valor de los tiempos es: ', tiempo)
          });

          setFlagButton(false);
          if(flagOneVideo === false){
            setFlagTiempoInicial(true);
          }
          setFlagTiempo(!flagTiempo);

        }
      }
    } catch(error){
      console.log(error)
    }
  }


  const tiempoVideoRealizado = async(item) => {
    try{
      // Guardamos el tiempo de realización final del ejercicio
      setTiempoFinal(hours + ":" + minutes + ":" + seconds);

      // Obtenemos los tiempos de la base de datos
      const valorTiempo = await AsyncStorage.getItem("TIEMPO");
      const t = valorTiempo ? JSON.parse(valorTiempo) : [];

      if(t.length==0){
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

        let newTiempo3 = t;

        var jsonLista = JSON.stringify(listaTiempo);       

        newTiempo3.push(jsonLista);
        // Si no se han guardado los tiempos en la base de datos, se guarda el tiempo de realización del ejercicio
        await AsyncStorage.setItem("TIEMPO", JSON.stringify(newTiempo3));

        await AsyncStorage.getItem("TIEMPO").then((tiempo) => {
          console.log('El valor de los tiempos es: ', tiempo)
        });
          setFlagButton(false);
          // Si hay más de un ejercicio en la lista, se avanza al siguiente ejercicio
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
          let numVideo = '';

          // Si se han guardado los tiempos en la base de datos, se calcula el tiempo de realización del ejercicio
          for (let i = 0; i < listaInicialT.videolista.length; i++){
            if((JSON.parse(item).id) == (JSON.parse(listaInicialT.videolista[i]).id)){
              numVideo = i;
              let tiempoEjInicial = tiempoInicio;
              
              let horasInicial = (tiempoEjInicial.split(":")[0]) * 3600;
              let minutosInicial = tiempoEjInicial.split(":")[1] * 60;

              let segundosInicial = tiempoEjInicial.split(":")[2] * 1;

              let segundosTotalActual = (hours * 3600) + (minutes * 60) + seconds;
              let segundosTotalInicial = horasInicial + minutosInicial + segundosInicial;
                  
              let segundosRealizacionTotal = Math.abs(segundosTotalActual - segundosTotalInicial);

              listVideo = JSON.parse(listaInicialT.videolista[i]);
              videoArray = JSON.parse(listaInicialT.videolista[i]);

              let horasRealizacion = Math.round(segundosRealizacionTotal/60/60);
              let minutosparaRealizacion = Math.round(segundosRealizacionTotal/60);
              let minutosRealizacion = Math.round(minutosparaRealizacion % 60);
              let segundosRminutos = Math.round(segundosRealizacionTotal % 60);

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
            listaTiempo.tiempoRealizacion = JSON.parse(item).tiempoRealizacion;
          }
          listaTiempo.tiempoDescanso = '';
          listaTiempo.video = JSON.parse(item).videos;

          let newTiempo4 = '';

          if(videoArray !== ''){
            newTiempo4 = t.filter((lista) => lista !== listArray[numVideo]);
          }

          var jsonLista = JSON.stringify(listaTiempo);       

          newTiempo4.push(jsonLista);
          // Almacenamos el tiempo de realización del ejercicio
          await AsyncStorage.setItem("TIEMPO", JSON.stringify(newTiempo4));

          await AsyncStorage.getItem("TIEMPO").then((tiempo) => {
            console.log('El valor de los tiempos es: ', tiempo)
          });

          // Si hay más de un ejercicio en la lista, se avanza al siguiente ejercicio
          setFlagButton(false);
          if(flagOneVideo === false){
            setFlagTiempoInicial(true);
          }
          setFlagTiempo(!flagTiempo);

        }
      }

    } catch(error){
      console.log(error)
    }
  }

  const tiempoVideoDescanso = async(item) => {
    try{
      // Establecemos el tiempo inicial del ejercicio
      setTiempoInicio(hours + ":" + minutes + ":" + seconds);

      // Obtenemos los tiempos de los ejercicios
      const valorTiempo = await AsyncStorage.getItem("TIEMPO");
      const t = valorTiempo ? JSON.parse(valorTiempo) : [];
            
      if(t.length==0){
        // Si no se han guardado los tiempos, iniciamos el cronómetro
        comenzarTimer();
        setFlagSaveTime(true);
        setFlagButton(true);

        var listaTiempo = {};
        listaTiempo.id = JSON.parse(item).id;
        listaTiempo.series = JSON.parse(item).series;
        listaTiempo.repeticiones = JSON.parse(item).repeticiones;
        listaTiempo.tiempoRealizacion = '';
        listaTiempo.tiempoDescanso = '';
        listaTiempo.video = JSON.parse(item).videos;

        // Convertimos el objeto lista en una cadena en formato JSON
        let jsonLista = JSON.stringify(listaTiempo);

        let newTiempo = [];

        // Guardamos los tiempos del ejercicio en la base de datos
        newTiempo.push(jsonLista);
        await AsyncStorage.setItem("TIEMPO", JSON.stringify(newTiempo));
        await AsyncStorage.getItem("TIEMPO").then((tiempo) => {
          console.log('El valor de los tiempos es: ', tiempo)
        });
          
      }
      else {
        if(tiempoFinal !== ""){
          let listArray = t;
          let jsonListArray = '';
          let listVideo = '';
          let numLista = '';

          // Si se han guardado los tiempos, calculamos el tiempo de descanso del ejercicio anterior
          for (let i = 0; i < listaInicialT.videolista.length; i++){
            if(listaActualT == ''){
              if((JSON.parse(item).id) == (JSON.parse(listaInicialT.videolista[i]).id)){
                numLista = i;
                let tiempoEjFinal = tiempoFinal;
                let horasFinal = (tiempoEjFinal.split(":")[0]) * 3600;
                let minutosFinal = (tiempoEjFinal.split(":")[1]) * 60;
                let segundosFinal = tiempoEjFinal.split(":")[2] * 1;

                let segundosTotalActual = (hours * 3600) + (minutes * 60) + seconds;
                let segundosTotalFinal = horasFinal + minutosFinal + segundosFinal;

                let segundosDescansoTotal = Math.abs(segundosTotalActual - segundosTotalFinal);

                let horasDescanso = Math.round(segundosDescansoTotal/60/60);
                let minutosparaDescanso = Math.round(segundosDescansoTotal/60);
                let minutosDescanso = Math.round(minutosparaDescanso % 60);
                let segundosDminutos = Math.round(segundosDescansoTotal % 60);

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
                // Guardamos el tiempo de descanso en la lista
                listVideo.tiempoDescanso = horasDescanso + ":" + minutosDescanso + ":" + segundosDminutos;

                // Convertimos el objeto lista en una cadena en formato JSON
                jsonListArray = JSON.stringify(listVideo);
                break;
              }
            }
            else {
              if((JSON.parse(item).id) == (JSON.parse((JSON.parse(listaActualT)).videolista[i]).id)){
                numLista = i;
                let tiempoEjFinal = tiempoFinal;
                let horasFinal = (tiempoEjFinal.split(":")[0]) * 3600;
                let minutosFinal = tiempoEjFinal.split(":")[1] * 60;

                let segundosFinal = tiempoEjFinal.split(":")[2] * 1;
                let segundosTotalActual = (hours * 3600) + (minutes * 60) + seconds;
                let segundosTotalFinal = horasFinal + minutosFinal + segundosFinal;
                  
                let segundosDescansoTotal = Math.abs(segundosTotalActual - segundosTotalFinal);

                let horasDescanso = Math.round(segundosDescansoTotal/60/60);
                let minutosparaDescanso = Math.round(segundosDescansoTotal/60);
                let minutosDescanso = Math.round(minutosparaDescanso % 60);
                let segundosDminutos = Math.round(segundosDescansoTotal % 60);               

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
            listaTiempo.video = JSON.parse(jsonListArray).video;
          }
          else {
            listaTiempo.tiempoDescanso = '';
            listaTiempo.video = JSON.parse(item).videos;
          }

          let newTiempo5 = '';

          if(listVideo !== ''){
            if(numLista !== 1){
              // Si hay más de un ejercicio en la lista, se guardará el tiempo de descanso
              // del ejercicio anterior en la base de datos
              newTiempo5 = t.filter((lista) => lista !== listArray[numLista-1]);
            }
            else{
              // Si solo hay un ejercicio en la lista, se borrarán los tiempos de la base de datos
              newTiempo5 = t;
              newTiempo5.length=0;
            }
            console.log('newTiempo5 es: ', newTiempo5)
          }

          var jsonLista = JSON.stringify(listaTiempo);       

          newTiempo5.push(jsonLista);

          await AsyncStorage.setItem("TIEMPO", JSON.stringify(newTiempo5));

          await AsyncStorage.getItem("TIEMPO").then((tiempo) => {
            console.log('El valor de los tiempos es: ', tiempo)
          });
          setFlagSaveTime(true);
          setFlagButton(true);
        }
      }
    } catch(error){
        console.log(error)
      }
  }

  const cancelarEntrenamiento = async() => {
    console.log('Se ha cancelado el entrenamiento')
    
    if(statusVideo.isPlaying){
      if(videoLocalRef !== null && videoLocalRef.length !== 0) {
        for(let i = 0; i<videoLocalRef.current.length; i++){
          videoLocalRef.current[i].pauseAsync();
        }
      }
    }
    
    setFlagPlay(!flagPlay);  
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
    setFlagFinal(false);
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
    // Cancelamos el entrenamiento y volvemos a la lista
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Lista',
          params: { singleList: listPlay,
                    itemId: JSON.parse(listPlay).listaid,
                  },
        },
      ],
    })
    navigation.navigate("Lista", {
      singleList: ((listaActualT !== '') ? listaActualT : listPlay),
      itemId: JSON.parse(listPlay).listaid,
    });
    isMounted = false;
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
        <Button style={styles.botonCancelar}
          onPress={() => {
            Alert.alert('',
            "¿Estás seguro de cancelar el entrenamiento?", [
                {
                text: 'No',
                onPress: () => null,
                style:"cancel"
                },
                {text: "Sí", onPress: () => {cancelarEntrenamiento();}}
            ]
            );
          }}>
            <Text style={styles.buttonText}>Cancelar</Text>
        </Button>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
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
  botonCancelar: {
    backgroundColor: '#d1453d',
    borderWidth: 1,
    borderColor: '#bd3c35',
    padding: 8,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonGuardar: {
    backgroundColor: '#2d65c4',
    borderWidth: 1,
    borderColor: '#2a5db5',
    padding: 8,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 8,
    justifyContent: 'center',
  },
  botonSiguiente: {
    backgroundColor: '#1dc28d',
    borderWidth: 1,
    borderColor: '#24b385',
    borderRadius: 10,
    marginLeft: 22, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  button2: {
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
    padding: 4,
    marginBottom: 0,
    right: 25,
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
  button12: {
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
    fontSize: 15,
  },
  bottom: {
    flexDirection: 'row',
    marginBottom: 36,
  },
  botonComenzar: {
    backgroundColor: '#1d89db',
    borderWidth: 1,
    borderColor: '#1979c2',
    borderRadius: 10,
    marginLeft: 22,
    padding: 10, 
    alignItems: 'center', 
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
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
