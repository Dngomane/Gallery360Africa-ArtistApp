import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, ImageBackground, Modal, TextInput, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'react-native-image-picker';
import storage from "@react-native-firebase/storage";
import auth from "@react-native-firebase/auth";
import Toast from 'react-native-toast-message';

const background = require("../assets/images/home.png")

export default function UserProfile({route, navigation}) {

  const [modalOpen, setModalOpen] = useState("");
  const [userName, setUserName] = useState("");
  const [description, setDescription] = useState("")
  const [imageUri, setimageUri] = useState("");
  const [submit, setSubmit] = useState(false);
  // const [photoUrl, setPhotoUrl] = useState("");

  const { artistName, artistUid, photoUrl } = route.params

  const openImageLibrary = async () =>{
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

  await ImagePicker.launchImageLibrary(options, (response) => {

       if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        // const uri = response.assets.map(({uri}) => uri).toString();
        const uri = response.assets.map(({uri}) => uri).toString();
        // console.log('tis is the one you need response', uri)
        //  setimageUri(uri);
        const imageName = uri.substring(uri.lastIndexOf('/'));
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
  
    try {
      setSubmit(true);
      storage().ref(imageName).putFile(uploadUri)
      .then((snapshot) => {
        //You can check the image is now uploaded in the storage bucket
        console.log(`${imageName} has been successfully uploaded.`);
  
        storage().ref('/' + imageName).getDownloadURL().then((imageURL) => {
          console.log(`${imageURL} has been retrieved.`);
          
          setimageUri(imageURL);
        }).catch((e) => console.log('retrieving image error => ', e));
         
      })
      .catch((e) => console.log('uploading image error => ', e));
    setSubmit(false);
    
    }
    catch(e) {
      console.error(e);
    }
        alert("image uploaded");
            
      }
    });
  };

  const updateUser = () => {
  
      firestore().collection("artists").doc(artistUid).update({
        artistName: userName,
        photoUrl: imageUri,
      }).then(() => {alert("you have successfully update your profile");
      setModalOpen(false);
    }).catch((error) => {
        alert(error);
      })
  }
useEffect(() =>{
  console.log(photoUrl, "   the photootdsfsdfdsfs")
}, []);

const signoutUser = async () => {
  try{
      await auth().signOut().then(() => {
        Toast.show({
          type: 'error',
          text1: 'Hello',
          text2: 'You have signed out!',
       })
         navigation.replace("SignIn")
      }).catch((error) => alert(error))
  }catch(e){
    console.log(e)
  }
}


  return (
    <View>
      <View style={{top: 135}}>
        <Modal visible={modalOpen}>
          <View style={styles.modalContainer}>

            <View style={styles.closeBtnContaainer}>
              <EvilIcons onPress={()=> setModalOpen(false) } name='close' size={35} color="white" />
            </View>

            <View style={styles.editprofileImgContainer}>
              <Image source={{uri: `${imageUri}`}} style={styles.uploadedImage} />
              {!submit ? (
                  <AntDesign onPress={() => openImageLibrary()} style={styles.imgAddIcon} name="pluscircle" size={35} color="#E3E3E3" />
                ) 
                : 
                (
                  <ActivityIndicator  style={{ alignSelf: "center", position:"absolute" }}
                    color="black"
                    size="small"/>)}
            </View>

            <TextInput
              placeholder='Edit Username'
              placeholderTextColor="gray" 
              onChangeText={(artistName) => setUserName(artistName)}
              style={styles.editUserInput} 
            />

            <TextInput
              placeholder='description'
              placeholderTextColor="gray" 
              onChangeText={(description) => setDescription(description)}
              style={styles.editUserInput} 
            />

            <TouchableOpacity  style={styles.updateBtn} onPress={updateUser}>
              <Text style={styles.modalText}>Update</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <View style={styles.profileImgContainer}>
          <Image source={{uri: `${photoUrl}`}} style={styles.profileImg}/>
          <Text style={styles.userNameText}>{artistName}</Text>

          <TouchableOpacity onPress={() => setModalOpen(true)} style={styles.editBtn}>
            <Text style={styles.btnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

            {/*  */}
            <View style={styles.optionsContainer}>

              <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{backgroundColor:"#E3E3E3", width:"80%", height:70, flexDirection:"row", alignSelf:"center", alignItems:"center", borderRadius:20}}>
                <MaterialIcons
                  name="notes"
                  size={24}
                  color={'#0E1822'}
                  style={{ marginHorizontal: 10, overflow:"hidden",  color:"#0E1822"}}
                />
                <Text style={{marginHorizontal:10, color:"#0E1822"}}>Terms & Conditions</Text>
                <Entypo name="chevron-small-right" size={24} style={{marginVertical:-10, marginHorizontal:"47%",  color:"#0E1822"}}/>
              </TouchableOpacity>

              <TouchableOpacity onPress={signoutUser} style={{backgroundColor:"#E3E3E3", width:"80%", height:70, flexDirection:"row", alignSelf:"center", alignItems:"center", borderRadius:20, marginVertical:15}}>
                <AntDesign
                  name="logout"
                  size={24}
                  color={'#0E1822'}
                  style={{ marginHorizontal: 10, overflow:"hidden",  color:"#0E1822"}}
                />
                <Text style={{marginHorizontal:70, color:"#0E1822", textAlign: 'center'}}>Logout</Text>
              </TouchableOpacity>

             
          </View>
      </View>
    </View>
  );
}

const styles= StyleSheet.create({

backgroundImg:{
   width:'100%',
   height:'100%',
},

profileImg:{
   width:200,
   height:200, 
   borderRadius:100, 
   bottom:85
},

profileImgContainer:{    
     width:'80%',
     height: 215,
     borderRadius:15,
     backgroundColor:'#E3E3E3',
     alignSelf:'center',
     alignItems:'center',
     top:65
},

topLeftIcon: {
        borderWidth: 1,
        borderRadius: 14,
        borderColor: '#0E1822',
        width: 45,
        height: 45,
        margin:25
},

userNameText:{
  color:'#000',
  fontSize:20,
  bottom: 75
},

editBtn:{
  width:120,
  height: 50,
  backgroundColor:'black',
  borderRadius: 15,
  justifyContent:'center',
  alignItems:'center',
  bottom: 70
},

btnText:{
  color: 'white',
  fontSize: 16,
},

optionsContainer:{
  top: 85
},

modalContainer:{
  width: '85%',
  height: 520,
  backgroundColor:'#E3E3E3',
  borderRadius:15,
  alignSelf:'center',
  top: 30,
  alignItems:'center',
  paddingVertical: 15
},

editprofileImgContainer:{
 width: 200,
 height: 200,
 borderRadius: 150,
 backgroundColor:'gray',
 justifyContent:'center',
 alignItems:'center'
},

editUserInput:{
  borderColor:'black',
  borderWidth:1,
  height: 50,
  paddingHorizontal: 65,
  borderRadius: 15,
  marginVertical: 20,
  backgroundColor:'white',
  color: '#000'
},

updateBtn:{
  width: 220,
  height: 50,
  backgroundColor:'black',
  borderRadius: 15,
  justifyContent:'center',
  alignItems:'center'
},

modalText:{
  fontSize: 18,
  color:'white'
},

closeBtnContaainer:{
  width: 37,
  height: 37,
  backgroundColor:'#FF5353',
  borderRadius: 18.5,
  alignItems:'center',
  justifyContent:'center',
  alignSelf:'flex-end',
  right:15
},

uploadedImage:{
  width: 200,
  height:200,
  borderRadius: 100
},
imgAddIcon:{
  position:'absolute'
},

flatlist:{
 height:280
},

})










