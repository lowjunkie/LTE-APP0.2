import 'react-native-gesture-handler';

import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect } from "react";
import { Text } from "react-native"
import Login from '../components/functional components/Auth/Login';
import TermsConditions from '../components/functional components/TermsConditions/TermsConditions';
import HomeTabView from "../components/functional components/Home/HomeTabView"
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnBoardingScreen from '../components/functional components/OnBoardingComponent/OnBoardingScreen';
import OnBoardingRoutes from '../components/functional components/OnBoardingComponent/OnBoardingRoutes';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
const AppRoutes = ({ navigation }) => {



    const Stack = createNativeStackNavigator();
    const [state, setState] = useState(false)
    const [isBoarded, setBoarded] = useState(false);


    const finishAuth = () => {
        setState(false)
    }

    const theme = {
        ...DefaultTheme,
        colour: {
            ...DefaultTheme.colors,
            background: "transparent"
        }
    }

    const saveBoardingState = async () => {
        try {
            AsyncStorage.setItem('FirstTime', "true").then(

            )
        } catch (err) {
            console.error(err)
        }
    }


    const finishBoarding = () => {
        setBoarded(true)
        saveBoardingState()
    }


    const logout = async () => {
        try {
            await AsyncStorage.setItem('AuthState', "-1")
        } catch (err) {
            alert(err)
        }


        setState(true)
    }

    useEffect(() => {
        getData()
        getBoardedData()
    }, [])

    const getData = async () => {
        try {
            const result = await AsyncStorage.getItem('AuthState')
            if (result !== null && result != "-1") {
                setState(false)
            } else {

                setState(true)
            }
        } catch (e) {
            console.error(e)
        }
    }


    const getBoardedData = async () => {
        try {
            const result = await AsyncStorage.getItem('FirstTime')
            if (result !== null) {
                setBoarded(true)
            } else {
                setBoarded(false)
            }
        } catch (e) {
            console.error(e)
        }
    }




    return (

        <NavigationContainer theme={theme}>
            <Stack.Navigator screenOptions={{ contentStyle: { backgroundColor: '#FFFFFF' } }}>

                <Stack.Group screenOptions={{}}  >

                {state ? (<Stack.Group screenOptions={{}} >

                    {isBoarded ? (<Stack.Group screenOptions={{}} >

                        <Stack.Screen name="Login" component={Login} options={{ header: () => null }} initialParams={{ finishAuth: finishAuth }} />

                        <Stack.Screen name="TermsConditions" component={TermsConditions} options={{ header: () => null }} initialParams={{ finishAuth: finishAuth }} />
                    </Stack.Group>)
                        : (<Stack.Group screenOptions={{}} >
                             <Stack.Screen name="Landing" component={OnBoardingRoutes} options={{ header: () => null }} initialParams={{ finishBoarding: finishBoarding }}/>
                        </Stack.Group>)
                    }
                </Stack.Group>
                )

                    : (<Stack.Group screenOptions={{}}  >

                        <Stack.Screen name="HomeTabView" component={HomeTabView} initialParams={{ logout: logout }} options={({ navigation, route }) => ({
                            headerShown: false,
                        })} />
                    </Stack.Group>)}

            </Stack.Group>

            </Stack.Navigator>
        </NavigationContainer>
    );

}

export default AppRoutes;