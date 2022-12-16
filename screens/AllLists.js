import 'react-native-gesture-handler';
import React, {useState} from 'react';

import {StyleSheet, View,  Modal, Image, ImageBackground, BackHandler, TouchableOpacity, 
  Alert, Platform, Dimensions} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Linking from 'expo-linking';
import * as DocumentPicker from 'expo-document-picker';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import DropDownPicker from 'react-native-dropdown-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Imagenes } from '../components/Images';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {List, ListItem, Text, Button} from '@ui-kitten/components';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

export default function AllLists () {
  const [listas, setListas] = useState([]);
  const [opened, setOpened] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [flagList, setFlagList] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();
  let file = null;
  let list = null;
  let num = 3;
  let isMounted = true;
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

  const [ listValueNumber, setListValueNumber ] = useState('');

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
      // Si se puede navegar hacia atrás, navegamos a la pantalla de Modo       
      setOpened(false);
      isMounted = false;
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Modo'
          },
        ],
      })
      navigation.navigate("Modo");
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

    return () => {
      backHandler.remove();
      isMounted = false;
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

      return () => {
        backHandler.remove();
        isMounted = false;
      };
  }, []));

  const getListas = async () => {
    // Guardamos las listas de la base de datos en una variable de estado 
    AsyncStorage.getItem("LISTAS").then((listas) => {
      setListas(JSON.parse(listas));
    });
  }

  const abrirEmailIOS = async() => {
    Linking.canOpenURL('message:0')
      .then(supported => {
        if (!supported) {
          console.log('No se puede abrir la aplicación de correo electrónico')
        } else {
          return Linking.openURL('message:0')
            .catch(this.handleOpenMailClientErrors)
        }
      })
      .catch(this.handleOpenMailClientErrors)
  }

  const abrirEmailAndroid = async() => {     
    const activityAction = 'android.intent.action.MAIN';
    let intentParams = {
      category: 'android.intent.category.APP_EMAIL',
      flags: 268435456
    }
      
    // Se lanza un intento de actividad para abrir la aplicación de Gmail
    IntentLauncher.startActivityAsync(activityAction, intentParams)
      .catch((error) => {
        console.log('Ha habido un error al volver a la app desde Gmail')
      });    
  }

  const abrirEmail = () => {
    if(Platform.OS === "ios"){
      abrirEmailIOS();
    }
    if(Platform.OS === "android"){
      abrirEmailAndroid();
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
    
  const component = (item) => {  
    if (item !== undefined || item !== null){
      for (let i = 0; i<datos.length; i++){
        if((JSON.parse(item).imagen) == datos[i].image){
          num=i;
        }     
      }
      // Si la imagen de la lista se encuentra dentro de "datos", se muestra el icono
      if((JSON.parse(item).imagen) == datos[num].image){
        return (<Image
                  source={datos[num].image}
                  style={styles.imagen2}
                />
        );
      }
      else {
        // Si la imagen de la lista no se encuentra dentro de "datos", se muestra la uri de la imagen
        return(<Image
                  source={{uri: JSON.parse(item).imagen.toString() }}
                  style={styles.imagen2}
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
        // Se vacía "DATOS" de la base de datos y navegamos a la pantalla de Login
        await AsyncStorage.setItem("DATOS", JSON.stringify(f));
        navigation.navigate('LogIn');
        isMounted = false;
      }},
    ]);     
  };


  const renderItem = ({ item, index }) => {
    try {
      if (item !== undefined || item !== null){
        return (        
          <View style={{backgroundColor:'rgba(52, 52, 52, 0.010)'}}>     
            <ListItem
              title={() => 
                <Text 
                style={styles.tituloLista}>
                  {JSON.parse(item).titulo}
                </Text>}
              onPress={async() => {                 
                const valorModo = await AsyncStorage.getItem("MODO");
                const m = valorModo ? JSON.parse(valorModo) : [];         
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
                  // Si el modo seleccionado es Entrenamiento, navegamos a la pantalla de Lista
                  if (JSON.parse(m).tipo === "Entrenamiento"){
                    navigation.navigate("Lista", {
                      singleList: item,
                      itemId: index,
                    })}
                  // Si el modo seleccionado es Configuración, navegamos a la pantalla de ListaConfiguracion
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
      // Obtenemos la lista del explorador de archivos
      let result = await DocumentPicker.getDocumentAsync({
          type: "*/*",
      });

      if (!result.cancelled) {
        file = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.UTF8 });
        list = JSON.parse(file);

        try{
          if (list.imagen !== null){
            const valor = await AsyncStorage.getItem("LISTAS");
            const l = valor ? JSON.parse(valor) : [];
            let num = '';

            for (let i=0; i < l.length; i++){
              if((JSON.parse(l[i])).idlista == list.idlista){
                  Alert.alert('', 'Esta lista ya existe, ¿Quieres actualizarla o crear una copia?', [
                    {
                      text: 'Actualizar',
                      onPress: async() => {
                        const newListas = l.filter((lista) => JSON.parse(lista).idlista !== list.idlista);
                        newListas.push(file);

                        // Si se ha actualizado la lista, se borra la lista anterior y se añade la
                        // lista importada a la base de datos
                        await AsyncStorage.setItem("LISTAS", JSON.stringify(newListas));
                        AsyncStorage.getItem("LISTAS").then((listas) => {
                          setListas(JSON.parse(listas));
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
              l.push(file);

              // Si no existía la lista, se añade a la base de datos
              await AsyncStorage.setItem("LISTAS", JSON.stringify(l));
              AsyncStorage.getItem("LISTAS").then((listas) => {
                setListas(JSON.parse(listas));
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

    var jsonLista = JSON.stringify(lista);
    l.push(jsonLista);
    // Se añade la lista importada en la base de datos
    await AsyncStorage.setItem("LISTAS", JSON.stringify(l));
    AsyncStorage.getItem("LISTAS").then((listas) => {
      setListas(JSON.parse(listas));
    });

  }


  let abrirFondo = async() => {
    setOpened(false);
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    // Si el usuario ha denegado el permiso para acceder a su galería, entonces sale una alerta
    if (permissionResult.granted == false) {
    alert('Permisos para acceder a la camara son requeridos');
    return;
    }
    // Cuando el usuario escoge una imagen de su galería, pickerResult retorna la imagen que escogió
    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    // Si no se escoge ninguna imagen, no da error
    if (pickerResult.cancelled === true) {
      return; 
    }

    // Actualizamos la variable de estado del fondo seleccionado
    setSelectedImage ({localUri: pickerResult.uri});  
    var listaFondo = {};
      listaFondo.valor = pickerResult.uri;
    var jsonDatos = JSON.stringify(listaFondo);

    // Guardamos el fondo en la base de datos
    await AsyncStorage.setItem("FONDO", jsonDatos);
    AsyncStorage.getItem("FONDO").then(() => {
      console.log('El fondo es: ', jsonDatos)
    });    
  };

  const mesFecha = (lista) => {
    // Obtenemos el mes actual
    var mes = new Date().getMonth() + 1; 

    let diaLista = (JSON.parse(lista).fechacreacion).split('-')[0];
    let mesLista = (JSON.parse(lista).fechacreacion).split('-')[1];
    let añoLista = (JSON.parse(lista).fechacreacion).split('-')[2];

    var fechaLista = new Date(añoLista, mesLista, diaLista);

    var diaIndicado = (JSON.parse(lista).fechacreacion).split('-')[0];
    var mesIndicado = mes-listValueNumber;
    var añoIndicado = (JSON.parse(lista).fechacreacion).split('-')[2];
    var fechaIndicada = new Date(añoIndicado, mesIndicado, diaIndicado);

    // Si la lista se ha creado después del número de meses seleccionado, se conserva la lista
    if((mes-listValueNumber) >= 0){
      if((mesLista >= (mes-listValueNumber)) && (fechaLista >= fechaIndicada)){
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

  return (
    <ImageBackground source={{uri: 
      selectedImage !== null ?
      selectedImage.localUri : 
      'https://images.pexels.com/photos/3927386/pexels-photo-3927386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      }} resizeMode="cover" style={styles.imagen4}>
      <View style={styles.container}>
        <TouchableOpacity
            style={styles.botonAtras}
            onPress={() => backAction()}>
            <Image
              source={datosIm[5].image}
              style={{height: 35, width: 35}}
            />
        </TouchableOpacity>
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
            const valorListas = await AsyncStorage.getItem("LISTAS");
            const l = valorListas ? JSON.parse(valorListas) : [];   

            const listMonth = l.filter((lista) => (mesFecha(lista)));  
            await AsyncStorage.setItem("LISTAS", JSON.stringify(listMonth))

            await AsyncStorage.getItem("LISTAS").then((listas) => {       
              setListas(JSON.parse(listas));       
              setFlagList(!flagList);            
            });
            console.log('Se han eliminado los elementos creados hace más de ' + listValueNumber + ' meses')
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
    padding: 0,
    marginBottom: 30,
    borderRadius: 400/2,
    height: 35,
  },
  botonNuevaLista: {
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