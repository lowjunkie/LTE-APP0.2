import { Text, View, Image, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Modal } from "react-native";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { List, Chip } from "react-native-paper";
import { Dimensions } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { COLORS, SIZES, FONTS, assets, CONST } from "../../../../constants";
import { DatePickerModal } from 'react-native-paper-dates';
import { Ionicons, MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";
import TicketListItem from "../../ui components/TicketListItem";
import axios from "axios";
import moment from 'moment';
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';

const TicketStatus = ({ navigation, route }) => {

    const [stackIndex, setStackIndex] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);

    const [allTickets, setAllTickets] = useState([])
    const [activeTickets, setActiveTickets] = useState([])
    const [resolvedTickets, setResolvedTickets] = useState([])
    const [ticketList, setTicketList] = useState([])


    const getTicketsList = async () => {
        try {
            const teacherID = await AsyncStorage.getItem('AuthState')
            axios.get(
                `${CONST.baseUrl}/teacherapp/all/tickets/${teacherID}`
            ).then((response) => {
                console.log(response.data);
                const data = response.data
                data.map((ele, index) => {
                    setTicketList(oldArray => [...oldArray, ele]);
                    setAllTickets(oldArray => [...oldArray, ele]);
                    if (ele.replied_by === null) {
                        setActiveTickets(oldArray => [...oldArray, ele]);
                    } else {
                        setResolvedTickets(oldArray => [...oldArray, ele]);
                    }
                })
            })
        } catch (e) {
            // error reading value
            console.error(e.response)
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setTicketList([])
            setActiveTickets([])
            setResolvedTickets([])
            setAllTickets([])
            getTicketsList()
        });

        return unsubscribe;
    }, [navigation]);


    return (
        <View style={{ backgroundColor: COLORS.blueShade, width: '100%', height: '100%', padding: 16, alignItems: 'center' }}>
            <View style={{ width: '100%', justifyContent: 'center' }}>

                <TextInput onChangeText={(text) => handleSearch(text)} placeholder="Search..." style={{ height: 60, width: '100%', borderRadius: 16, backgroundColor: 'white', paddingHorizontal: 42, alignItems: 'center', flexDirection: 'row' }} selectionColor={COLORS.grey}>

                </TextInput>
                <Ionicons name="md-search" size={22} color={COLORS.primary} style={{ position: 'absolute', left: 16 }} />
            </View>

            <View style={{ flexDirection: 'row', width: '100%', marginTop: 12, justifyContent: 'space-evenly' }}>
                <TouchableOpacity
                    onPress={() => {
                        setStackIndex(1)
                        setTicketList(allTickets)
                    }}
                    style={[stackIndex == 1 ? styles.selectedBox : styles.unSelectedBox]}
                >
                    <Text style={[stackIndex == 1 ? styles.selectedText : styles.unSelectedText]}>
                        All
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        setStackIndex(2)
                        setTicketList(activeTickets)
                    }}
                    style={[stackIndex == 2 ? styles.selectedBox : styles.unSelectedBox]}>
                    <Text style={[stackIndex == 2 ? styles.selectedText : styles.unSelectedText]}>
                        Active
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        setStackIndex(3)
                        setTicketList(resolvedTickets)
                    }}
                    style={[stackIndex == 3 ? styles.selectedBox : styles.unSelectedBox]}>
                    <Text style={[stackIndex == 3 ? styles.selectedText : styles.unSelectedText]}>
                        Archived
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={{ marginTop: 12, marginBottom: 8 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ width: Dimensions.get('window').width * 0.9 }}>

                {

                    ticketList.map((ele, index) => {
                        return (
                            <TicketListItem id={index + 1} name={ele.msg_title} time={`Since ${moment(ele.created_at.substring(0, 16), "YYYY-MM-DDTHH:mm").fromNow()}`} status={ele.replied_by == null ? false : true} />
                        )
                    })
                }

                {
                    ticketList.length === 0 ? <Text style={{ marginTop: 64, fontFamily: FONTS.bold, color: COLORS.darkGrey, fontSize: 16, alignSelf: 'center' }}>
                        No Ticket to show
                    </Text> : null
                }
            </ScrollView>

            {/* <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>

            </Modal> */}



        </View>

    )
}

export default TicketStatus;

const styles = StyleSheet.create({
    unSelectedBox: {
        borderRadius: 8,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        marginHorizontal: 8,
        flex: 1
    },
    selectedBox: {
        borderRadius: 8,
        borderWidth: 1,
        flex: 1,
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        marginHorizontal: 8
    },
    unSelectedText: {
        fontFamily: FONTS.regular, color: COLORS.primary, fontSize: 14
    },
    selectedText: {
        fontFamily: FONTS.regular, color: 'white', fontSize: 14
    }

});

