import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as yup from 'yup';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';

export default function SignIn ({navigation}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
       setLoading(true)
       if(email !== "" && password !== "") {
        await auth().signInWithEmailAndPassword(email, password)
          .then((user) => {
            <ActivityIndicator size="large" color="#0000ff" />
          console.log(user);
          Toast.show({
            type: 'success',
            text1: 'You have successfully loged in ',
        })
          if (user) navigation.replace('LandingPage');
        })
        .catch((error) => {
          console.log(error);
          if (error.code === "auth/invalid-email")
          {
          Toast.show({
            type: 'error',
            text1: 'Email is not valid',
        })
        setLoading(false)
        }
          else if (error.code === "auth/user-not-found")
          {
            Toast.show({
              type: 'error',
              text1: 'No User Found',
          });
          setLoading(false)
        }
        else {
            Toast.show({
              type: 'error',
              text1: 'Please check your email id or password',
           })
           setLoading(false)
        }
      });
    }
  }

  // 
  return (
   

    <KeyboardAvoidingView behavior='position' style={{ backgroundColor: '#573E22', height: '100%', width: '100%'}}>
    <View style={styles.topBody}>
    <View>
      <Image source={require('../assets/logo/SignInLogo.png')} style={styles.logo}/>
      </View>
    </View>
      <View style={styles.footer}>
              <View  style={{marginLeft: 33, marginBottom: 15}}>
                  <Text style={{fontSize: 36, color: '#22180E'}}>Welcome Back !</Text>
                  <Text style={{color: '#FFFFFF'}}>LogIn to your account</Text>
              </View>
            <View style={{alignItems:'center'}}>

            <TextInput
              style={styles.inputStyle}
              onChangeText={email => setEmail(email)}
              value={email}
              underlineColorAndroid="#f000"
              placeholder="Email"
              placeholderTextColor="#FFFFFF"
              keyboardType="email-address"
            />
          
          
            <TextInput
              style={styles.inputStyle}
              onChangeText={password => setPassword(password)}
              value={password}
              underlineColorAndroid="#f000"
              placeholder="Password"
              placeholderTextColor="#FFFFFF"
              returnKeyType="next"
              secureTextEntry={true}
            />

            </View>
          
          <TouchableOpacity
            onPress={onLogin}
            activeOpacity={0.5}>
           <LinearGradient start={{x: 1, y: 0}} end={{x: 1, y: 0}} colors={['#CEB89E', '#9F805C']} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Sign In</Text>
            </LinearGradient>
          </TouchableOpacity>

        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
           <Text style={{}}>
              Don't have an account?
           </Text>
           <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={{color: '#22180E'}}>
                  {' '}
                  Sign Up
                </Text>
              </TouchableOpacity>
        </View>
        </View>
    </KeyboardAvoidingView>

    
  );
}
const styles = StyleSheet.create({
  topBody: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300
  },
  footer: {
    //flex: 1,
   // marginVertical: 25
  },
  SectionStyle: {
    flexDirection: 'row',
    // height: 40,
    // marginTop: 17,
    // marginLeft: 35,
    // marginRight: 35,
    // margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#BFA688',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 50,
    alignItems: 'center',
    borderRadius: 14,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 25,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 13,
    fontSize: 16,
  },
  inputStyle: {
    color: 'white',
    height: 70,
    width:'90%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#FFFFFF',
    marginVertical:10,
    paddingHorizontal:20
  },
      logo: {
      height: 250,
      width: 250,
      justifyContent: 'center',
      alignItems: 'center',
  },
});