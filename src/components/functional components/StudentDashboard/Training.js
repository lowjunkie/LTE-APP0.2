import { Text, View, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { List, Chip } from "react-native-paper";
import { COLORS, SIZES, FONTS, assets } from "../../../../constants";
import ProgressBar from 'react-native-progress/Bar'
import { Feather, Ionicons } from "@expo/vector-icons";
import axios from "axios";

const Training = ({ navigation, route }) => {

    const [data, setData] = useState({ level_list: [] })
    const [state, setState] = useState({})
    const [state2, setState2] = useState({})
    const [state3, setState3] = useState({})

    async function fetchLevels() {
        console.log(route.params.student_id)
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://lte-backend.onrender.com/api/teacherapp/get/student/details',
            headers: {
                'Content-Type': 'application/json'
            },
            data: { stud_id: route.params.student_id }
        };


        axios.request(config)
            .then((response) => {

                response.data.stud_total_and_completed_level_session_details.map((ele, index) => {
                    setState(current => ({ ...current, [ele.level_id]: { total: Number(ele.total_session_count), completed: ele.completed_session_count, progress: Number(ele.total_session_count) / Number(ele.completed_session_count) == 0 ? 1 : Number(ele.completed_session_count) } }))
                })

                response.data.stud_next_session.map((ele, index) => {
                    setState2(current => ({ ...current, [ele.level_id]: { start: ele.start_time.substring(0, 5), end: ele.end_time.substring(0, 5), nextId: ele.session_id, nextTitle: ele.session_name, date: ele.date.substring(0, 10), day: ele.day } }))
                })

                setData(response.data)

                let temp0 = []
                let temp1 = []
                let temp2 = []
                let temp3 = []
                let temp4 = []
                let temp5 = []
                response.data.stud_level_details.map((ele, index) => {
                    if(ele.level_name.slice(-1) == "0"){
                        temp0.push(ele)
                    }
                    else if(ele.level_name.slice(-1) == "1"){
                        temp1.push(ele)
                    }
                    else if(ele.level_name.slice(-1) == "2"){
                        temp2.push(ele)
                    }
                    else if(ele.level_name.slice(-1) == "3"){
                        temp3.push(ele)
                    }
                    else if(ele.level_name.slice(-1) == "4"){
                        temp4.push(ele)
                    }
                    else if(ele.level_name.slice(-1) == "5"){
                        temp5.push(ele)
                    }

                })

                setState3({
                    0: temp0,
                    1: temp1,
                    2: temp2,
                    3: temp3,
                    4: temp4,
                    5: temp5,
                })

            })
            .catch((error) => {
                console.log(error);
            });
    }



    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchLevels()
        });

        return unsubscribe;
    }, [navigation]);

    function navToSessions(ele) {
        if(ele.level_name == "level0"){
        navigation.navigate("Level Review Zero", { ...state[ele.level_id], ...state2[ele.level_id], title: ele.level_name, sessions: state3[ele.level_name.slice(-1)], student_id: route.params.student_id, student_name: route.params.student_name } )
    }else{
        navigation.navigate("Level Review", { ...state[ele.level_id], ...state2[ele.level_id], title: ele.level_name, sessions: state3[ele.level_name.slice(-1)], student_id: route.params.student_id, student_name: route.params.student_name } )

    }
}



    return (
        <View style={{ height: '100%', backgroundColor: 'white', paddingTop: 16 }}>
            <List.AccordionGroup>
                {data.level_list.map((ele, index) => {
                    return (
                        <List.Accordion theme={{ colors: { primary: COLORS.primary } }} style={{ backgroundColor: 'white', borderBottomWidth: 1, borderColor: COLORS.borderGrey }} title={ele.level_name} id={ele.level_id}>
                            <TouchableOpacity
                                onPress={()=>navToSessions(ele)}
                                style={{ marginHorizontal: 16, marginTop: 12, borderBottomWidth: 1, borderColor: COLORS.borderGrey, paddingBottom: 8, width: '90%' }}>
                                
                                <Text
                                    style={{
                                        fontFamily: FONTS.semiBold,
                                        fontSize: SIZES.smallFont,
                                        flexWrap: 'wrap',
                                    }}>
                                    {state2[ele.level_id] ? state2[ele.level_id].nextTitle : ""}   {state2[ele.level_id] ? state2[ele.level_id].start : ""} - {state2[ele.level_id] ? state2[ele.level_id].end : ""}
                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text
                                        style={{
                                            fontFamily: FONTS.regular,
                                            fontSize: SIZES.smallFont,
                                            color: COLORS.grey
                                        }}>
                                        Next session on {state2[ele.level_id] ? state2[ele.level_id].date : ""} {state2[ele.level_id] ? state2[ele.level_id].day : ""}
                                    </Text>


                                </View>
                                <View style={{ alignSelf: 'flex-start', marginTop: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>


                                    <ProgressBar unfilledColor={COLORS.unProgressed} color={COLORS.yellow} progress={state[ele.level_id].progress} width={Dimensions.get('window').width * 0.7} borderColor={COLORS.unProgressed} />
                                    <Text
                                        style={{
                                            fontFamily: FONTS.regular,
                                            fontSize: SIZES.smallFont,
                                            color: COLORS.darkBlue,
                                            marginStart: 8
                                        }}>
                                        {state[ele.level_id].completed} of {state[ele.level_id].total}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </List.Accordion>
                    )
                })}

                {data.level_list.length === 0 && 
                 <Text style={{marginTop:64, fontFamily: FONTS.bold, color:COLORS.darkGrey, fontSize: 16, alignSelf:'center'}}>
                 No Student is available 
             </Text>
                }



                
            </List.AccordionGroup>

            <TouchableOpacity
                onPress={() => {
                    route.params.onClick()
                }}
                style={{ width: 60, height: 60, position: 'absolute', backgroundColor: COLORS.borderGrey, bottom: 120, right: 50, borderRadius: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.primary }}>
                <Feather name="layers" size={30} color={COLORS.primary} />
            </TouchableOpacity>
        </View>
    )
}

export default Training;

const TrainStyle = StyleSheet.create({
    btnContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
    },
    chipContainer: {
        flex: 2,
        flexDirection: "row",
    },
    submitContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    chipFirstItem: {
        width: 300,
        height: 30,
        fontSize: 2,
        borderRadius: 25,
    },
    chipItem: {
        width: 100,
        height: 30,
        fontSize: 2,
        borderRadius: 25,
        alignContent: "center",
        shadowColor: "black",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 5,
        marginTop: 10,
        marginRight: 10,
    },
    sessionTitle: {
        margin: 10,
        fontSize: 20,
        fontWeight: "bold",
    },
    btnStyle: {
        alignItems: "center",
        padding: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#FF758F",
        width: 100,
        height: 40,
    },
    addMargin: {
        marginTop: 100,
    },
    subHeading: {
        marginTop: 60,
        marginLeft: 10,
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 20,
    },
    btnTextStyle: {
        fontSize: 15,
        color: "#FF758F",
    },
});