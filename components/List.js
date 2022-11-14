import React, {useState, useEffect} from 'react';
import Constants from 'expo-constants';


import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert, Platform, ScrollView, PermissionsAndroid} from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import * as MailComposer from 'expo-mail-composer';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Linking from 'expo-linking';
import * as DocumentPicker from 'expo-document-picker';
import YoutubePlayer from 'react-native-youtube-iframe';
import {createStackNavigator} from 'react-navigation';
import * as FileSystem from 'expo-file-system';
import NativeModules from "react-native";
import {startActivityAsync, ActivityAction} from 'expo-intent-launcher';
import launch from 'react-native-mail-launcher';
import launchMailApp from 'react-native-mail-launcher';
import { SafeAreaView, FlatList } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import exampleJson from '../file.json';
import StorageAccessFramework from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';


function openDatabase() {
    if (Platform.OS === "web") {
      return {
        transaction: () => {
          return {
            executeSql: () => {},
          };
        },
      };
    }
  
    const db = SQLite.openDatabase("db.db");
    return db;
  
  }
  
  const db = openDatabase();
  //var val;

  function Items ({done: doneHeading, onPressItem}) {
    const [items, setItems] = useState(null);
  
    useEffect(() => {
      /*
      db.transaction((tx) => {
        tx.executeSql(
          `drop table if exists items;`, []
        );
      });
      */
      db.transaction((tx) => {
        tx.executeSql(
          `select * from items where done = ?;`,
          [doneHeading ? 1 : 0],
          (_, {rows: {_array}}) => setItems(_array)
        );
      });
    }, []);
  
    const heading = doneHeading ? "Visto" : "Pendiente";
  
    const boton = doneHeading ? "Eliminar vídeo" : "Añadir a visto";
  
    if(items == null || items.length === 0) {
      return null;
    }
  
    return (
      <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>{heading}</Text>
      {items.map(({ id, done, value }) => (
        <View style={{ height: 400, margin: 16}}>
          <YoutubePlayer
            height={220}
            play={true}
            videoId={value}
          />
         <TouchableOpacity
            key={id}
            onPress={() => onPressItem && onPressItem(items.id) && (val=value)}
            style={{
              backgroundColor: done ? "#1c9963" : "#fff",
              borderColor: "#000",
              borderWidth: 1,
              padding: 1,
           }}
          >
            <Text style={{backgroundColor: 'white', color: 'black', padding: 15}}>{boton}</Text>
          </TouchableOpacity>
        </View>
      ))}
  
      </View>
    );
  
  }
  
  /*
  const addLink = (link) => {
    //is link empty?
    if (link === null || link === '') {
      return false;
    }
    else {
  
      link.toString();
  
      arraylink = link.split(".be/", 2);
  
      link = arraylink[1];
  
      return link;
    }
  
  };
  
  
  function AddVideo () {
    const [link, setLink] = useState(null);
  
  
    return (
      <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>"Insertar link de Youtube"</Text>
      <TextInput
        onChangeText={(link) => setLink(link)}
        onSubmitEditing={() => {
          addLink(link);
          setLink(null);
        }}
        style={styles.input}
        value={addLink(link)}
      />
      <View style={{ height: 400, margin: 16}}>
        <Text style={{ color: done ? "#fff" : "#000" }}>{value}</Text>
        <YoutubePlayer
          height={300}
          play={true}
          videoId={value}
        />
  
      </View>
      
      </View>
    );
  
  }
  */
  
  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  

  //podemos poner tambien const App = () => { }
  export default function List () {

        const[text, setText] = useState(null);
        const [forceUpdate, forceUpdateId] = useForceUpdate(null);
        const [status, setStatus] = useState(null);
        const [data, setData] = useState([]);
        const [val, setVal] = useState(null);
        let [flatListItems, setFlatListItems] = useState(null);
        const [cameraRef, setCameraRef] = useState(null)
        const { StorageAccessFramework } = FileSystem;

        /*
        const getData = () => {
          fetch(exampleJson)
            .then(function(response){
              //console.log(response)
              return response.json();
            })
            .then(function(exampleJson){
              //console.log(exampleJson);
              setData(exampleJson)
            });
        }

        useEffect(()=>{
          getData()
        },[])
        */
        const getFiles = async () => {
          //let media = await MediaLibrary.getAssetsAsync({ mediaType: 'photo' });
          //console.log(media);
          let fileUri = FileSystem.documentDirectory + "text.txt";
          await FileSystem.writeAsStringAsync(fileUri, "Hello World", { encoding: FileSystem.EncodingType.UTF8 });
          const asset = await MediaLibrary.createAssetAsync(fileUri)
          await MediaLibrary.createAlbumAsync("Download", asset, false)
        };

        const saveFile = async () => {
        if (Platform.OS === 'ios') {
          getFiles();
        } else {
            try{
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                  title: 'Storage Permission Required',
                  message:
                    'Application needs access to your storage to download File',
                  buttonNegative: "Cancel",
                  buttonPositive: "OK"
                }
              );
              //const writeGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                try {
                  console.log('You can write external storage');
                  const permission = await MediaLibrary.getPermissionsAsync();
                  console.log(permission);
                  if (permission.granted) {
                    // we want to get all the files
                    getFiles();
                  }
                  if (!permission.granted && permission.canAskAgain) {
                    const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();

                    if (status === 'denied' && canAskAgain) {
                      Alert.alert('User must allow this permission to save file');
                    }
                    if (status === 'granted'){
                      getFiles();
                    }
                    if (status === 'denied' && !canAskAgain) {
                      console.log("user denied and we can't ask again");
                    }
                  }
                  if (!permission.canAskAgain && !permission.granted) {
                    console.log("user denied and we can't ask again");
                  }
                  /*
                  const asset = await MediaLibrary.createAssetAsync('file:///storage/emulated/0/Teleco erasmus/1° semestre/IMG_20191001_004207.jpg');
                  const album = await MediaLibrary.getAlbumAsync('Download');
                  if (album == null) {
                    await MediaLibrary.createAlbumAsync('Download', asset, false);
                  } else {
                    await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                  }
                  */
                } catch (e) {
                  console.log(e);
                }
                /*
                // Start downloading
                const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
                // Check if permission granted
                let directoryUri = permissions.directoryUri;
                //const fileUri = `${FileSystem.documentDirectory}${filename}`;
                let data = "Hello World";
                // Create file and pass it's SAF URI
                await StorageAccessFramework.createFileAsync(directoryUri, "filename", "application/json").then(async(fileUri) => {
                  // Save data to newly created file
                  await FileSystem.writeAsStringAsync(fileUri, data, { encoding: FileSystem.EncodingType.UTF8 });
                })
                .catch((e) => {
                  console.log(e);
                });
                */
              }            
              else if (granted === PermissionsAndroid.RESULTS.DENIED){
                // If permission denied then show alert
                Alert.alert('Error, Storage Permission Not Granted');
                console.log('You cannot write external storage');
              }
              else {
                Alert.alert('Error, Storage Permission Not Granted');
                console.log('You cannot write external storage');
              }
            }
            catch (err) {
              console.log(err);
            }
          }
        }
            /*
           catch (err) {
            // To handle permission related exception
            console.log("++++"+err);
            }
            /*
            if (permissions.granted) {
              // Get the directory uri that was approved
              let directoryUri = permissions.directoryUri;
              //const fileUri = `${FileSystem.documentDirectory}${filename}`;
              let data = "Hello World";
              // Create file and pass it's SAF URI
              await StorageAccessFramework.createFileAsync(directoryUri, "filename", "application/json").then(async(fileUri) => {
                // Save data to newly created file
                await FileSystem.writeAsStringAsync(fileUri, data, { encoding: FileSystem.EncodingType.UTF8 });
              })
              .catch((e) => {
                console.log(e);
              });
            } else {
              alert("You must allow permission to save.")
            }
          */
        

        const renderItem = ({ item }) => (
          <Item title={item.title} />
        );


        const videoArray = (id) => {

          db.transaction((tx) => {
            tx.executeSql(
              `select * from items where id = ?;`,
              [id],
              (tx, results) => {
                var len = results.rows.length;
                console.log('len', len);
                if (len > 0) {
                  setVal(results.rows.item(id).value);
                  val=results.rows.item(id).value;
                  var v = addVideoArray(val);
                  console.log('val: ', val);
                  console.log('v: ', v);
                  return v;
                }
              }
            );
          });
        }
        //const delay = async ms => new Promise(res => setTimeout(res, ms));

        async function changeFlag(text) {
        
          await delay(1500);
          setVal(null);
        }
        
        

        const addVideoArray = (text) => {
         
          var valu=text;
          valu.toString();
          var arrayt = valu.split(".be/", 2);
                        
          var tex = arrayt[1];

          console.log('tex: ', tex)
          //changeFlag(val);
          return tex;
        }

        /*
        useEffect(() => {
          
          db.transaction((tx) => {
            tx.executeSql(
              `drop table if exists items;`, []
            );
          });
          
          
          db.transaction((tx) => {
              tx.executeSql(
              "create table if not exists items (id integer primary key autoincrement, value text);"
              );
          });
          }, []);
          
          //var valor;
        */

        const myItemSeparator = () => {
          return (
            <View
              style={{ height: 1, backgroundColor: "gray", marginHorizontal:10 }}
            />
          );
        };
          
        function Add (text) {
        //is text empty?
        //val=text;
         var valor;
         var datos;
         var temp = [];
         /*const objectArray=Object.entries(val);
         objectArray.forEach(([key, value]) => {
           console.log(key); // 'one'
           console.log(value); // 1
         });*/

          if (text === null || text === '') {
              return false;
          }
      
          else {
      
              text.toString();
              
              var arraytext = text.split(".be/", 2);
          
              if (arraytext != valor) {
              
              text = arraytext[1];
              //valor = arraytext[1];
                /*
                db.transaction(
                    (tx) => {
                    tx.executeSql("insert into items (value) values (?)", [text],
                    (tx, results) => {
                      console.log('Results', results.rowsAffected);
                      }
                    );
                    }
                );

                db.transaction(
                (tx) => {
                    tx.executeSql("select * from items", [], 
                    //console.log(JSON.stringify(rows)),
                    (tx, results) => {
                      //var temp = [];
                      for (let i = 0; i < results.rows.length; ++i)
                        temp.push(results.rows.item(i));
                      setVal(temp);
                      setFlatListItems(text);
                      //setFlatListItems(temp);
                      //setVal(temp);
                      //val=temp;
                      console.log('temp: ', temp);
                      
                    }
                    /*
                    (tx, results) => {
                      var temp = [];
                      for (let i = 0; i < results.rows.length; ++i)
                        temp.push(results.rows.item(i));
                      setFlatListItems(temp);
                      */
                   // );
                   // }
                   // );
                  //});
                  //console.log('val: ', Object.entries(val));
                  
                  }

                  else {
                    Alert.alert('No existe el vídeo');
                    }
                  
                  
            }
        }


        const showAlert = () =>
        Alert.alert(
        "Add a file",
        "Do you want to attach a file?", [
            {
            text: 'No',
            onPress: () => {sendEmail([])},
            style:"cancel"
            },
            {text: "Yes", onPress: sendEmailWithAttachment}
        ]
        );
    
        const sendEmail = async(file) => {
        var options = { }
        if(file.length < 1) {
            options = {
            subject: "Sending email with attachment",
            recipients: ["reyesmr97@gmail.com"],
            body: "Enter email body here..."
            }
        } 
        else{
            options = {
            subject: "Sending email with attachment",
            recipients: ["reyesmr97@gmail.com"],
            body: "Enter email body here...",
            attachments: file
            }
        }
        
        let promise = new Promise ((resolve, reject) => {
            MailComposer.composeAsync(options)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
        })
    
        promise.then(
            result => setStatus("Status: email " + result.status),
            error => setStatus("Status: email " + error.status)
        )
    
        }
    
        const sendEmailWithAttachment = async() => {
        //get the image to attach
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.cancelled) {
            sendEmail([result.uri]); //file path
        }
        else {
            sendEmail([])
        }
        
        }
    
        const showEmail = () =>
        Alert.alert(
        "Add a file",
        "Do you want to open the mail app?", [
            {
            text: 'Android',
            onPress: openMailClientAndroid,
            style:"cancel"
            },
            {text: "IOS", onPress: openMailClientIOS}
        ]
        );
    
        const openMailClientIOS = () => {
        Linking.canOpenURL('message:0')
            .then(supported => {
            if (!supported) {
                console.log('Cant handle url')
            } else {
                return Linking.openURL('message:0')
                .catch(this.handleOpenMailClientErrors)
            }
            })
            .catch(this.handleOpenMailClientErrors)
        }
    
        const openMailClientAndroid = () => {
        
        const activityAction = 'android.intent.action.MAIN'; // Intent.ACTION_MAIN   
        //const activityAction = 'android.intent.action.VIEW';  // solo cuando usamos packageName, para acceder a los archivos y a más aplicaciones
        intentParams = {
            category: 'android.intent.category.APP_EMAIL', // Intent.CATEGORY_APP_EMAIL
            //data: 'googlegmail://',
            flags: 989680, // Intent.FLAG_ACTIVITY_NEW_TASK,
            //packageName: ''
        }
    
        IntentLauncher.startActivityAsync(activityAction, intentParams)
            .catch(this.handleOpenMailClientErrors);
        
        /*
        const pkg = Constants.manifest.releaseChannel
        ? Constants.manifest.android.package  // When published, considered as using standalone build
        : "host.exp.exponent"; // In expo client mode
    
        IntentLauncher.startActivityAsync(
            IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
            { data: 'package:' + pkg },
        )
        */
        }
    
    
        //const { RNMailLauncher } = NativeModules;
    
        const openMailApp = () => {
        if (Platform.OS === 'android') {
            //NativeModules.UIMailLauncher.launchMailApp();
            //WebBrowser.openBrowserAsync('https://gmail.com');
            //Linking.openURL('https://gmail.com');
            Linking.openURL('inbox-gmail://');
            //Linking.openURL('mailto:reyesmr97@gmail.com?subject=SendMail&body=Description');
            return;
        }
        else {
        Linking.openURL('message:0'); // iOS
        return;
        }
        }
    
        const showDocument = async() => {
          let result = await DocumentPicker.getDocumentAsync({
              type: "*/*",   //all files
              /*
              type: "image/*", // all images files
              type: "audio/*", // all audio files
              type: "application/*", // for pdf, doc and docx
              type: "application/pdf", // .pdf
              type: "application/msword", // .doc
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
              type: "vnd.ms-excel", // .xls
              type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
              type: "text/csv", // .csv
              */
          });
      
          if (!result.cancelled) {
              sendEmail([result.uri]); //file path
              const text = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.UTF8 });
              console.log(text);
          }
        
        }

        const readFiles = async () => {
          //const album = await MediaLibrary.getAlbumAsync("file:///storage/emulated/0/Pictures/Download");
          //const assets = await MediaLibrary.getAssetsAsync({album});
          let fileUri = FileSystem.documentDirectory + 'text.txt';
          const text = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
          console.log(text);
        }

        var texto;  
    
        return (
        <View style={styles.container}>
            <Text style={styles.heading}>My GymList</Text>
    
            {Platform.OS === "web" ? (
            <View
                style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
                <Text style={styles.heading}>
                Expo SQlite is not supported on web!
                </Text>
            </View>
            ) : (
            <>
                <SafeAreaView style={{flex:1}}>
                <View style={styles.flexRow}>
                <TextInput
                    onChangeText={(text) => setText(text)}
                    placeholder="Añade un vídeo a la lista"
                    style={styles.input}
                    value={text}
                    onSubmitEditing={() => {
                      
                    //Add(text);
                    //texto=videoArray(text);
                    setText(null);
                    //val=text;

                    //setVal(text);

                    }}
                />      
                </View>
                <View style={styles.flexRow}> 
                <Text>
                  {
                    data.name
                  }
                </Text>
                </View>
                <View style={{backgroundColor:'#f0f0f0', position: 'absolute', bottom: 0}}>
                <TouchableOpacity onPress={async() => {
                  if(cameraRef){
                    let photo = await cameraRef.takePictureAsync();
                    console.log('photo', photo);
                    await MediaLibrary.saveToLibraryAsync(photo.uri);
                  }
                }} style={styles.button}>
                    <Text style={styles.buttonText}>Save photo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={saveFile} style={styles.button}>
                    <Text style={styles.buttonText}>Save file</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={showAlert} style={styles.button}>
                    <Text style={styles.buttonText}>Send email</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={showEmail} style={styles.buttonD}>
                    <Text style={styles.buttonText}>Open email app</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={showDocument} style={styles.buttonC}>
                    <Text style={styles.buttonText}>Open document</Text>
                </TouchableOpacity>
                <StatusBar style="auto" />
                </View>
                </SafeAreaView>
            </>
            )}
        </View>
        );
    //we call the showAlert function when the button is pressed
    
}
    
    /*
                    <FlatList 
                  data={data.subject}
                  keyExtractor={( item , index) => item.id.toString()}
                  renderItem={({ item }) => 
                  <Text>{item.id + '. ' + item.name + '. ' + item.grade}</Text>
                  }
                />

                    <Text style={styles.flexRow}>
                  {
                    exampleJson.name
                  }
                </Text>
                <Text style={styles.flexRow}>
                  {
                    exampleJson.subject.map(subject => {
                      return (            
                          subject.name
                      )
                    })
                  }
                </Text>


                    <FlatList style={styles.sectionContainer}
                      data={val}
                      keyExtractor={(item, index) => item.id.toString()}
                      ItemSeparatorComponent={myItemSeparator}
                      renderItem={({item, index}) => 
                          <View style={styles.listArea}>
                            <YoutubePlayer
                              height={200}
                              play={false}
                              videoId={flatListItems}
                            />
                            <TouchableOpacity
                              key={item.id}
                              onPress={() => 
                                db.transaction((tx) => {
                                  tx.executeSql(`delete from items where id = ?;`, [item.id]
                                  , (tx, results) => {
                                    console.log('Results2:', results.rowsAffected);
                                    }
                                  );
                                }
                              )}
                              
                              style={{
                                backgroundColor: "#1c9963",
                                borderColor: "#000",
                                borderWidth: 1,
                                padding: 1,
                            }}
                            >
                              <Text style={{backgroundColor: 'white', color: 'black', padding: 15}}>Eliminar vídeo</Text>
                          </TouchableOpacity>
                          </View>
                          
                        }
                    />
                />
    
    
                <ScrollView style={styles.listArea}>
                <Items
                    key={`forceupdate-todo-${forceUpdateId}`}
                    done={false}
                    onPressItem={(id) =>
                    db.transaction(
                        (tx) => {
                        tx.executeSql(`update items set done = 1 where id = ?;`, [
                            id,
                        ]);
                        },
                        null,
                        forceUpdate
                    )
                    }
                />
                <Items
                    done
                    key={`forceupdate-done-${forceUpdateId}`}
                    onPressItem={(id) =>
                    db.transaction(
                        (tx) => {
                        tx.executeSql(`delete from items where id = ?;`, [id]);
                        },
                        null,
                        forceUpdate
                    )
                    }
                />
                </ScrollView>
    
                <TouchableOpacity onPress={showVideo}>
                <Text style={{backgroundColor: 'black', color: 'white', padding: 15}}>Add video</Text>
    
                </TouchableOpacity>
    
                {status!==null &&
                <View style={{borderWidth: 2, borderColor: 'blue', margin:10, padding: 10}}>
                    <Text>{status}</Text>
                </View>
                }
    
    */
    
    
    //podemos crear la función (function) después de haberla declarado
    function useForceUpdate() {
        const [value, setValue] = useState(0);
        return [() => setValue(value+1), value];
    }
        
    
    
    
    
        /*
        const[selectedImage, setSelectedImage] = useState(null);  //null porque no va a existir imagen seleccionada al inicio
    
        //creamos una función que se lance cuando pulsamos el boton y nos pida acceder a la galeria de fotos
        let openImagePickerAsync = async() => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        //si el usuario ha denegado el permiso para acceder a su galeria, entonces sale una alerta
        if (permissionResult.granted == false) {
        alert('Permisos para acceder a la camara son requeridos');
        return;
        }
        //cuando el usuario escoge una imagen de su galeria, pickerResult retorna la imagen que escogio. Se pone 'await' porque es asincrono.
        //el const se usa para crear funciones
        const pickerResult = await ImagePicker.launchImageLibraryAsync();
        
        if (pickerResult.cancelled === true) {
        return; //al poner solo return, si no se escoge ninguna imagen, no da error
        }
        
        if (Platform.OS === 'web') {
        //tomamos la imagen que esta guardada en pickerResult.uri y la subimos a la web. este metodo devuelve la uri.
        const remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri)
        setSelectedImage({localUri: pickerResult.uri, remoteUri})
    
        } else {
        setSelectedImage ({localUri: pickerResult.uri});  //de esta forma, estaria actualizado el estado
        }
    };
    
        //funcion para poder compartir la imagen con otras aplicaciones
        const openShareDialog = async () => {
        //llamamos al modulo 'Sharing' y dentro del modulo llamamos al metodo 'isAvailableAsync'
        //si una funcion es asincrona, le debemos poner async, y a los modulos asincronos se les pone 'await' delante
        if (!(await Sharing.isAvailableAsync())) {
            alert('No se pueden compartir imagenes');
            return;
        }
    
        //usamos el metodo shareAsync para compartir la imagen que esta guardada en selectedImage.localUris
        await Sharing.shareAsync(selectedImage.localUri);
        }
    
        return (
        <View style={styles.container}>
            <Text style={styles.title}>Pick an Image</Text>
            <TouchableOpacity
            onPress={openImagePickerAsync}
            //ponemos Image dentro del TouchableOpacity para que al presionar en la imagen se lance la galeria de imagenes
            >
            <Image
            //source={{uri: 'https://picsum.photos/200/200'}}
            source={{ 
                uri: 
                selectedImage !== null 
                    ? selectedImage.localUri
                    : 'https://picsum.photos/200/200',
                }}
            style={styles.image}
            //si existe el estado (si es distinto de null), se pinta una imagen (de la uri) que escogemos en la galeria. 
            //Si no existe el estado (si es null), se muestra la imagen 'picsum.photos' por defecto
            />
            </TouchableOpacity>
    
            {selectedImage ? (   //si selectedImage es distinto de null, entonces se ejecuta el TouchableOpacity
            <TouchableOpacity onPress={openShareDialog} style={styles.button}>
                <Text style={styles.buttonText}> Share this image </Text>
            </TouchableOpacity>
            ) : (
            <View />   //si selectedImage es null, es decir, no hay imagen seleccionada, entonces se carga la misma View
            )}
            <StatusBar style="auto" />
        </View>
        );
    };
    */
  
  const styles = StyleSheet.create({
    containerr: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 30,
      color: 'black',
    },
    image: {
      height: 200,
      width: 200,
      //borderRadius: 100,
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
    buttonD: {
      backgroundColor: '#33A5FF',
      padding: 8,
      marginTop: 0,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 2,
      borderRadius: 5,
    },
    buttonC: {
      backgroundColor: '#33A5FF',
      padding: 8,
      marginTop: 0,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 2,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      fontSize: 14,
    },
  
    container: {
      backgroundColor: "#ffffff",
      flex: 1,
      paddingTop: 0,
    },
    heading: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },
    flexRow: {
      flexDirection: "row",
    },
    input: {
      borderColor: "#4630eb",
      borderRadius: 4,
      borderWidth: 1,
      flex: 1,
      height: 48,
      margin: 16,
      padding: 8,
    },
    listArea: {
      backgroundColor: "#f0f0f0",
      flex: 1,
      paddingTop: 16,
      paddingBottom: 0,
    },
    sectionContainer: {
      borderColor: "#1B4B95",
      borderRadius: 4,
      borderWidth: 1,
      padding: 12,
      marginBottom: 25,
      marginHorizontal: 12,
    },
    sectionHeading: {
      fontSize: 18,
      marginBottom: 8,
      color: '#113875',
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },
  });