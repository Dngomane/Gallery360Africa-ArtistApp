import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from './src/Screens/Splash';
import Onboarding from './src/Screens/Onboarding';
import SignIn from './src/Screens/SignIn';
import SignUp from './src/Screens/SignUp';
import Home from './src/Screens/Home';

const Stack = createNativeStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Home'
      >
        <Stack.Screen options={{headerShown: false}} name='Splash' component={Splash} />
        <Stack.Screen options={{headerShown: false}} name='Onboarding' component={Onboarding} />
        <Stack.Screen options={{headerShown: false}} name='SignIn' component={SignIn} />
        <Stack.Screen options={{headerShown: false}} name='SignUp' component={SignUp} />
        <Stack.Screen options={{headerShown: false}} name='Home' component={Home} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;