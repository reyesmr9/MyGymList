import 'react-native-gesture-handler';
import React, {useState} from 'react';

import { StyleSheet, View, BackHandler, Dimensions, Alert} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {List, ListItem, Text, Button} from '@ui-kitten/components';

export default function Historial ({route}) {
  const navigation = useNavigation();
  const {listHistorial, itemIdHistorial} = route.params;
  const [modalVisibleHistorial, setModalVisibleHistorial] = useState(false);
  const [listActualH, setListActualH] = useState([]);
  const [flagListActual, setFlagListActual] = useState(false);

  let isMounted = true;
      
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
      let listH = listActualH;
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Lista',
            params: { singleList: listHistorial,
                      itemId: JSON.parse(listHistorial).listaid,
                    },
          },
        ],
      })
      navigation.navigate("Lista", {
        singleList: ((listH.length!==0) ? listActualH : listHistorial),
        itemId: JSON.parse(listHistorial).listaid,
      });
      if(modalVisibleHistorial===false){
        isMounted = false;
      }
    }
    return true;
  };

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
      
    }, []));

  const borrarHistorial = async() => {    
    const valorListas = await AsyncStorage.getItem("LISTAS");
    const l = valorListas ? JSON.parse(valorListas) : [];

    let newLists = '';
    let listaAhoraH = JSON.parse(listHistorial);
    listaAhoraH.historial = '';

    newLists = l.filter((lista) => lista !== listHistorial); 

    newLists.push(JSON.stringify(listaAhoraH));

    await AsyncStorage.setItem("LISTAS", JSON.stringify(newLists));

    await AsyncStorage.getItem("LISTAS").then((listas) => {
      setListActualH(JSON.stringify(listaAhoraH));
      setFlagListActual(true);                          
    })
    .catch(()=>{
      console.log('No existe la lista')
    }); 
    console.log('Se ha borrado el historial')
  }

  const renderItem = ({ item, index }) => {
    try {
      if (item !== undefined || item !== null){
          return (
            <View>        
            <View style={styles.textHistorial2}>     
            <ListItem
              title={() => 
                <Text 
                style={styles.tituloLista}>
                  {"fecha:   " + JSON.parse(item).fechaRealizado + "\n\n"}
                  {"tiempo total:   " + JSON.parse(item).tiempoTotal + "\n"}
                </Text>}
                onPress={async() => {
                try{
                  let listH = listActualH;
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'HistorialEntrenamiento',
                        params: { ejercicioHistorial: item,
                                  ejercicioIdHistorial: JSON.parse(item).idHistorial,
                                  lista: ((listH.length!==0) ? listActualH : listHistorial)
                                },
                      },
                    ],
                  })
                  navigation.navigate("HistorialEntrenamiento", {
                    ejercicioHistorial: item,
                    ejercicioIdHistorial: JSON.parse(item).idHistorial,
                    lista: ((listH.length!==0) ? listActualH : listHistorial)
                  });
                } catch(error){
                  console.log(error)
                }
                }
              }
              style={styles.border2}
            />
            </View>
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

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.title} category="h1"> 
          Historial
        </Text>
        {(flagListActual===false && (JSON.parse(listHistorial).historial !== '')) ? 
        (<View style={{backgroundColor: '#fafafd', flex:1, marginTop: -5}}>
          <List
            style={{width: Dimensions.get("window").width, marginBottom: 40}}
            data={JSON.parse(listHistorial).historial}
            renderItem={renderItem}
          />
          <Button style={styles.botonBorrarHistorial}
            onPress={() => {
            Alert.alert('Borrar historial',
              "¿Está seguro de borrar el historial?", [
              {
                text: 'No',
                onPress: () => null,
                style:"cancel"
              },
              {text: "Sí", onPress: () => {borrarHistorial();}}
              ]
            );                 
          }}>
            <Text>Borrar historial</Text>
          </Button>
        </View>
        ) :
        (<View style={{backgroundColor: '#fafafd', flex:1, width: Dimensions.get("window").width, 
        alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.textoH}>El historial está vacío</Text>
        </View>
        )}
        <View style={{backgroundColor: '#fafafd', width: Dimensions.get("window").width, 
          alignItems: 'center', justifyContent: 'center'}}>    
        <Button
          title="Atrás"
          style={styles.botonAtras}
          onPress={() => {
            let listH = listActualH;
            // Volvemos a la lista
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Lista',
                  params: { singleList: listHistorial,
                            itemId: JSON.parse(listHistorial).listaid,
                          },
                },
              ],
            })
            navigation.navigate("Lista", {
              singleList: ((listH.length!==0) ? listActualH : listHistorial),
              itemId: JSON.parse(listHistorial).listaid,
            });
            if(modalVisibleHistorial === false){
              isMounted = false;
            }
          }}>
            <Text>Atrás</Text>
        </Button>
        </View>
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
  border2: {
    marginTop: 30,
    marginLeft: 28,
    borderColor: '#949699',
    borderWidth: 1,
    borderRadius: 9,
    width: width-30,
    height: 150,
    backgroundColor: '#b3d0e6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  border3: {
    marginTop: 30,
    marginLeft: 0,
    borderColor: '#949699',
    borderWidth: 1,
    borderRadius: 9,
    width: width-30,
    height: 600,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonAtras: {
    backgroundColor: '#d1453d',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bd3c35',
    padding: 0,
    bottom: 25,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 80,
  },
  botonAtrasModal: {
    backgroundColor: '#d1453d',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bd3c35',
    top: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 80,
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
  botonBorrarHistorial: {
    backgroundColor: '#5280c7',
    borderWidth: 1,
    borderColor: '#4973b3',
    padding: 0,
    marginBottom: 25,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    bottom: 20,
    height: 60,
    width: 150,
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
  textoH: {
    fontSize: 16,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    flexDirection: 'row',
    marginBottom: 36,
  },
  title: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 26,
    marginTop: 40,
    marginBottom: 10,
    color: 'black',
  },
  titleVideo: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
    color: 'black',
  },
  textHistorial: {
    padding: 10,
    marginRight: 30,
    fontSize: 16,
    backgroundColor:'rgba(52, 52, 52, 0.010)',
  },
  textHistorial2: {
    padding: 0,
    marginRight: 30,
    fontSize: 16,
    backgroundColor:'rgba(52, 52, 52, 0.010)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tituloLista: {
    fontSize: 18,
    marginLeft: 10,
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
    borderColor: '#949699',
    borderWidth: 1,
    borderRadius: 9,
    width: width,
    height: Dimensions.get("window").height,
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#79aad1',
  },
  modalStyle3: {
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
  videoPlayer2: {
    alignSelf: 'center',
    width: 280,
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
