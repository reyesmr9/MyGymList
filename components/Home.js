import React from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

export default function Home () {
    //const navigationRef = useNavigationContainerRef();
    //const ref = React.useRef(null);
        return(
            <View style={styles.container}>
               <Text>Home Screen</Text> 

            </View>
        );
    
}
/*

               <Button 
               title='Go to List'
               onPress={ () => 
                navigationRef.navigate('List')
               }
               />

*/

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});