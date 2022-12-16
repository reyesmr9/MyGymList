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
import HistorialEntrenamiento from './screens/HistorialEntrenamiento'

import {BackHandler} from 'react-native';
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

function HideTabBar () {
  return (null);
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
      <Screen name="HistorialEntrenamiento" component={HistorialEntrenamiento}
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
      <Screen name={"LogIn"}
        component={LogIn} 
        options={{
          headerShown: false, 
          tabBarStyle: { display: 'none', height: 0 }, 
          tabBarButton: () => <HideTabBar />}} 
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
      <Screen name="HistorialEntrenamiento" component={HistorialEntrenamiento}
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

export default function App () {
  let isMounted = true;
  const [isLoggedIn, setIsLoggedIn] = useState('');
  
  const TabNavigator = () => {                 
    return (
      <Stack.Navigator style = {styles.bottom}>
        {(isLoggedIn!=='') ? (
        // Se muestran las pantallas cuando un usuario se ha autenticado
        <Stack.Group>
          <Stack.Screen name={'Home'} options={{headerShown: false}} component={Home}/>
        </Stack.Group>
        ) : (
        // Se muestran las pantallas cuando un usuario no se ha autenticado
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name={"InitialLogIn"} component={InitialLogIn} />
        </Stack.Group>
      )}
    </Stack.Navigator>
    );
  }

  const backAction = () => {
    return true;
  };

  const getDatos = async() => {
    // Obtenemos los datos del usuario de la base de datos
    const datosUsuario = await AsyncStorage.getItem("DATOS");
    const datos = datosUsuario ? JSON.parse(datosUsuario) : [];
    if(datos.length==0){
      console.log('No se han introducido datos')
    }
    else{
      // Si existen los datos del usuario, se almacenan en una variable de estado
      setIsLoggedIn(datosUsuario);
    }    
  }
      
  useEffect(() => {
    isMounted = true;
    if(isMounted){
      // Si se ha montado la pantalla, se obtienen los datos del usuario
      getDatos();
      BackHandler.addEventListener('hardwareBackPress', backAction);
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => {
      backHandler.remove();
    };      
  }, []);

    
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