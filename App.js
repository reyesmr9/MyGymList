import * as eva from "@eva-design/eva";
import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';

import AllLists from './screens/AllLists';
import LogIn from './screens/LogIn';
import Modo from './screens/Modo';
import NuevaLista from './screens/NuevaLista';
import NuevaListaLocal from './screens/NuevaListaLocal';
import Lista from './screens/Lista';
import ListaConfiguracion from './screens/ListaConfiguracion';
import Entrenamiento from './screens/Entrenamiento';
import Historial from './screens/Historial';

import {StyleSheet, View, BackHandler, Image, TouchableOpacity, 
  Dimensions, Alert, Button } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createStackNavigator} from '@react-navigation/stack';
import {Imagenes} from './components/Images';
import {RootSiblingParent} from 'react-native-root-siblings';
import {MenuProvider} from 'react-native-popup-menu';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';

const {Navigator, Screen} = createBottomTabNavigator();
const {width} = Dimensions.get('window');
const datos = [
  { id: '3', image: Imagenes.uno },
  { id: '6', image: Imagenes.cuatro },
  { id: '10', image: Imagenes.ocho },
  { id: '13', image: Imagenes.once },
  { id: '15', image: Imagenes.trece },
  { id: '21', image: Imagenes.diecinueve },
  { id: '22', image: Imagenes.veinte },
  { id: '29', image: Imagenes.veintinueve },
  { id: '30', image: Imagenes.treinta },
  { id: '37', image: Imagenes.treintaysiete }
];




/*
const BottomTabBar = ({navigation, state}) => (
    <BottomNavigation
      indicatorStyle={styles.bottomnav}
      selectedIndex={state.index}
      onSelect={(index) => navigation.navigate(state.routeNames[index])}>
        <BottomNavigationTab title='Nueva Lista'/> 
    </BottomNavigation>
  );
*/
  function HideTabBar () {
    return (null);
  }
  function componentLocal () {
    return (Alert.alert(
      "",
      "Crear Lista", [
        {
          text: 'Añadir videos de Youtube',
          onPress: () => NuevaLista,
          style:"cancel"
        },
        {text: "Añadir videos en local", onPress: () => NuevaListaLocal}
      ]
    ));
  }

  const CustomButton = ({ children, onPress }) => (
    <TouchableOpacity
      style={{
        top: -10,
        justifyContent: 'flex-end',
        alignItems: "center",
        marginLeft: width-212,
      }}
      onPress={onPress}
    >

      <Image
        source={datos[9].image}
        style={styles.imagen}
      />

    </TouchableOpacity>
  );

  function NewList() {
    return (
      <Navigator>
        <Screen name="NuevaLista" component={NuevaLista} 
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 1 }, 
            tabBarButton: () => <HideTabBar />
          })} 
        />
        <Screen name="NuevaListaLocal" component={NuevaListaLocal}
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 1 }, 
            tabBarButton: () => <HideTabBar />
          })}
        />
      </Navigator>
    );
  }

  function InitialLogIn() {
    return (
      <Navigator>
        <Screen name={"LogIn"}
          component={LogIn} 
          options={{
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 }, 
            tabBarButton: () => <HideTabBar />}} 
        />
        <Screen name={"Modo"}
          component={Modo} 
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 }, 
            tabBarButton: () => <HideTabBar />
          })}
        />
        <Screen name={"AllLists"}
          component={AllLists}
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 }, 
            tabBarButton: () => <HideTabBar />
          })} 
        />
        <Screen name={'Lista'} 
          component={Lista}
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 }, 
            tabBarButton: () => <HideTabBar />
          })} 
        />
        <Screen name={'ListaConfiguracion'} 
          component={ListaConfiguracion}
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 }, 
            tabBarButton: () => <HideTabBar />
          })} 
        />
        <Screen name="Entrenamiento" component={Entrenamiento}
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 }, 
            tabBarButton: () => <HideTabBar />
          })}
        />
        <Screen name="Historial" component={Historial}
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 }, 
            tabBarButton: () => <HideTabBar />
          })}
        />
        <Screen name="NuevaLista" component={NuevaLista} 
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 } , 
            tabBarButton: () => <HideTabBar />
          })} 
        />
        <Screen name="NuevaListaLocal" component={NuevaListaLocal}
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 }, 
            tabBarButton: () => <HideTabBar />
          })}
        />
      </Navigator>
    );
  }

  function Home() {
    return (
      <Navigator>
        <Screen name={"Modo"}
          component={Modo} 
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 }, 
            tabBarButton: () => <HideTabBar />
          })}
        />
        <Screen name={"AllLists"}
          component={AllLists}
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 }, 
            tabBarButton: () => <HideTabBar />
          })} 
        />
        <Screen name={'Lista'} 
          component={Lista}
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 }, 
            tabBarButton: () => <HideTabBar />
          })} 
        />
        <Screen name={'ListaConfiguracion'} 
          component={ListaConfiguracion}
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 }, 
            tabBarButton: () => <HideTabBar />
          })} 
        />
        <Screen name="Entrenamiento" component={Entrenamiento}
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 }, 
            tabBarButton: () => <HideTabBar />
          })}
        />
        <Screen name="Historial" component={Historial}
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 }, 
            tabBarButton: () => <HideTabBar />
          })}
        />
        <Screen name="NuevaLista" component={NuevaLista} 
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 } , 
            tabBarButton: () => <HideTabBar />
          })} 
        />
        <Screen name="NuevaListaLocal" component={NuevaListaLocal}
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 }, 
            tabBarButton: () => <HideTabBar />
          })}
        />
      </Navigator>
    );
  }


  function ModoInicial() {
    return (
      <Navigator>
        <Screen name={"Modo"}
          component={Modo} 
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 }, 
            tabBarButton: () => <HideTabBar />
          })}
        />
        <Screen name={"AllLists"}
          component={AllLists}
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 }, 
            tabBarButton: () => <HideTabBar />
          })} 
        />
        <Screen name={'Lista'} 
          component={Lista}
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 }, 
            tabBarButton: () => <HideTabBar />
          })} 
        />
        <Screen name={'ListaConfiguracion'} 
          component={ListaConfiguracion}
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 }, 
            tabBarButton: () => <HideTabBar />
          })} 
        />
        <Screen name="NuevaLista" component={NuevaLista} 
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 } , 
            tabBarButton: () => <HideTabBar />
          })} 
        />
        <Screen name="NuevaListaLocal" component={NuevaListaLocal}
          options={({navigation})=> ({
            headerShown: false, 
            tabBarStyle: { display: 'none', height: 0 }, 
            tabBarButton: () => <HideTabBar />
          })}
        />
      </Navigator>
    );
  }


  const Stack = createStackNavigator();
  function StackScreens() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="stackScreen1" component={stackScreen1} />
      </Stack.Navigator>
    );
  }

  function StackScreen1({ navigation }) {
    return (
      <View style={{ marginBotton: 50, justifyContent: 'center', alignItems: 'center' }}>
        <Button
          title="Nueva Lista"
          onPress={() => navigation.navigate('NuevaLista')}
        />
      </View>
    );
  }




export default function App () {
  let isMounted = true;
  const [loginDatos, setLoginDatos] = useState("");
  const [loginDatosB, setLoginDatosB] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState('');
  const [datosModo, setDatosModo] = useState("");
  const [isModo, setIsModo] = useState('');
  
  /*
  const newList = () => {
    return (
      <View
        style={{ height: 1, backgroundColor: "gray", marginHorizontal:10 }}
      />
    );
  };

          <Screen
          name="NewList"
          component={NewList}
          options={({navigation})=> ({
            headerTitle: "",
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {navigation.goBack()}}>
                <Image
                  source={datos[8].image}
                  style={styles.imagen2}
                />
              </TouchableOpacity>
            ),
            tabBarButton: (props) => <CustomButton {...props} />,
            tabBarStyle: { display: 'none' }
          })}
        />
  */
  const TabNavigator = () => {
    //const [isLoggedIn, setIsLoggedIn] = useState();                  
    return (
      <Stack.Navigator style = {styles.bottom}>
        {(isLoggedIn!='') ? (
        // Screens for logged in users
        <Stack.Group>
          <Stack.Screen name={'Home'} options={{headerShown: false}} component={Home}/>
        </Stack.Group>
        ) : (
        // Auth screens
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name={"InitialLogIn"} component={InitialLogIn} />
        </Stack.Group>
      )}
    </Stack.Navigator>
    );
  }

  //const ref = React.useRef(null);
  const backAction = () => {

    return true;
  };

  const getDatos = async() => {
    /*
    var f = [''];
    f.length=0;
    console.log('Al vaciar array videos el resultado es: ', f)  
    setLoginDatos(f);
    setIsLoggedIn(f);        
    //convertimos el array de listas 'l' en un string usando JSON.stringify(l) y lo pasamos a AllLists.js
    await AsyncStorage.setItem("DATOS", JSON.stringify(f));
    */
    
    var f = [''];
    f.length=0;
    console.log('Al vaciar array MODO el resultado es: ', f)  
    setIsModo('');
    setDatosModo(f);        
    await AsyncStorage.setItem("MODO", JSON.stringify(f));   
    
    await AsyncStorage.getItem("DATOS").then((datos) => {
      setLoginDatos(JSON.parse(datos));    //guardamos cada lista en formato string en listas
      setIsLoggedIn(datos);
    });
    /*
    await AsyncStorage.getItem("USUARIO").then((datos) => {
      setDatosUsuario(JSON.parse(datos));    //guardamos cada lista en formato string en listas
      setIsUsuario(datos);
    });

    console.log('Los DATOS que tenemos son: ', loginDatos)
    */
    
  }
      
    useEffect(() => {
      isMounted = true;
      /*
      if(isMounted){
        BackHandler.addEventListener('hardwareBackPress', backAction);
      }
      */
      if(isMounted){
        getDatos();
        BackHandler.addEventListener('hardwareBackPress', backAction);
      }
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      //return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
      //const subscription = AppState.addEventListener("change", _handleAppStateChange);
      return () => {
        backHandler.remove();
        isMounted = false;
        //subscription.remove();
      };
        
      }, [loginDatosB]);

    
    return (
      <RootSiblingParent>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <MenuProvider skipInstanceCheck>
            <NavigationContainer>
              <TabNavigator />
            </NavigationContainer>
          </MenuProvider>
        </ApplicationProvider>
      </RootSiblingParent>
    );
  
}

/*
      <View
        style={{
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: "blue",
          alignItems: "center",
        }}
      >
      </View>
options={({navigation})=> ({
           tabBarButton:props => <TouchableOpacity {...props} onPress={()=>navigation.navigate('NuevaLista')}/>
      })}

    headerLeft: () => (
      <TouchableOpacity
        onPress={() => {navigation.goBack()}}>
        <Image
          source={datos[8].image}
          style={styles.imagen2}
        />
      </TouchableOpacity>
    ),
*/



    

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
  },
  button: {
    backgroundColor: '#1B4B95',
    padding: 8,
    marginTop: 0,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 2,
    borderRadius: 5,
  },
  bottom: {
    backgroundColor: '#FAFAFF',
    height: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  bottomnav: {
    backgroundColor: '#5478cc',
    fontSize: 18,
  },
  bottomtext: {
    color: 'white',
    fontSize: 14,
  },
  imagen: {
    height: 75,
    width: 75,
    borderRadius: 400/2,
  },
  imagen2: {
    height: 35,
    width: 35,
    marginLeft: 10,
    borderRadius: 400/2,
  }
});

/*
  const ref = React.useRef(null);
      return (
        <View style={{flex:1}}>
          <NavigationContainer ref={ref}>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="List" component={List} />
            </Stack.Navigator>
          </NavigationContainer>
          <TouchableOpacity onPress={newList} style={styles.button}>
                    <Text style={styles.buttonText}>Add list</Text>
          </TouchableOpacity>
          <Button
            onPress={() => ref.current && ref.current.navigate('List')}
            title="Ir a la lista"
          />
        </View>
      );
  */