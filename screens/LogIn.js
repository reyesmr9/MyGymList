import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';

import {StyleSheet, View, BackHandler, Image, Dimensions, Alert} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Imagenes} from '../components/Images';
import {useNavigation} from '@react-navigation/native';
import {Icon, Input, Text, Button} from '@ui-kitten/components';

const { width } = Dimensions.get('window');

export default function LogIn () {

  const navigation = useNavigation();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

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
    { id: '50', image: Imagenes.cincuenta },
  ]);

  const nombreRef = React.useRef();
  const emailRef = React.useRef();

  const nombreIcon = (props) => (
    <Icon {...props}
      ref={nombreRef}
      name='person-outline'
    />
  );

  const emailIcon = (props) => (
    <Icon {...props}
      ref={emailRef}
      name='email-outline'
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
      isMounted = false;
    }
    return true;
  };

  useEffect(() => {
    isMounted = true;
    if(isMounted){
      BackHandler.addEventListener('hardwareBackPress', backAction);
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
    };        

  }, []);


  const guardarDatos = async() => {
    if(nombre!==""){
      if(email !=="") {
        var listaDatos = {};
        listaDatos.nombre = nombre;
        if((email.includes('@'))){
          try{
            listaDatos.email = email;
            var jsonDatos = JSON.stringify(listaDatos);

            // Guardamos los datos del usuario en la base de datos
            await AsyncStorage.setItem("DATOS", JSON.stringify(jsonDatos));

            AsyncStorage.getItem("DATOS").then((datos) => {
              // Si existen los datos del usuario, navegamos a la pantalla de Modo
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'Modo'
                  },
                ],
              })
              navigation.navigate("Modo");
            });
          } catch (error){
            console.log(error)
          }
        }
        else{
          Alert.alert('Introduce un correo electrónico válido')
        }
      }
      else{
        Alert.alert('Introduce tu correo electrónico')
      }
    }
    else{
      Alert.alert('Introduce tu nombre')
    }
  }

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <View>
            <Text style={styles.title} category="h1">
              Login
            </Text>
        </View>
        <View style={styles.iconoAppView}>
          <Image
            source={datosIm[24].image}
            style={styles.imagenApp}
          />
        </View>
        <View>
            <Input
                label="Nombre"
                placeholder="NOMBRE"
                value={nombre}
                onChangeText={nombreSiguiente => setNombre(nombreSiguiente)}
                style={styles.inputNombre}
                accessoryLeft={nombreIcon}
                multiline={false}
                selectionColor='#000'
            />
            <Input
                label="Email"
                placeholder="CORREO ELECTRÓNICO"
                value={email}
                onChangeText={email => setEmail(email)}
                style={styles.inputEmail}
                accessoryLeft={emailIcon}
                multiline={false}
                selectionColor='#000'
            />  
            <Button
                title="Guardar datos"
                style={styles.botonLogin}
                onPress={guardarDatos}>
                  <Text>Iniciar Sesión</Text>
            </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: "white",
    width: Dimensions.get("window").width
  },
  title: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 26,
    bottom: 130,
    color: 'black',
  },
  inputEmail: {
    textAlignVertical: 'top',
    borderColor: "#4630eb",
    borderRadius: 4,
    borderWidth: 1,
    height: 60,
    padding: 10,
    margin: 3,
    fontSize: 16,
    width: width - 40,
    marginBottom: 10,
    bottom: 40,
  },
  inputNombre: {
    textAlignVertical: 'top',
    borderColor: "#4630eb",
    borderRadius: 4,
    borderWidth: 1,
    height: 60,
    padding: 10,
    margin: 3,
    fontSize: 16,
    width: width - 40,
    marginBottom: 10,
    bottom: 40,
  },
  imagenApp: {
    height: 150,
    width: 150,
  },
  botonLogin: {
    backgroundColor: '#48BEEA',
    borderWidth: 1,
    borderColor: '#48BEEA',
    borderRadius: 100,
    alignItems: 'center', 
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    width: width - 60,
    bottom: 10,
    marginTop: 20,
  },
  iconoAppView: {
    marginTop: 5,
    width: 150,
    height: 150,
    bottom: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
