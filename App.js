import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { TextInput, StyleSheet, Text, View, Button, Linking } from 'react-native';
import axios from "axios";
import { useState } from "react";

export default function App() {

    const [totalDoseData, setTotalDoseData] = useState({});
    const [showTable, setShowTable] = useState(0);
    const [maxDate, setMaxDate] = useState(0);
    const [list, setList] = useState();
    const [tableHead, setTableHead] = useState([]);
    const [showError, setShowError] = useState(0);
    const [available, setAvailable] = useState(0);
    const [pin, setPin] = useState(322201);
    const getCurrentDate = async (x) => {

        var date = new Date().getDate();
        date = date + x;
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();

        //Alert.alert(date + '-' + month + '-' + year);
        // You can turn it in to your desired format
        return date + '-' + month + '-' + year;//format: dd-mm-yyyy;
    }
    const onPressLearnMore = async () => {
        console.log("Button Pressed");
        try {
            const date = await getCurrentDate(0);
            const res = await axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pin}&date=${date}`);
            const jsonData = res.data;
            console.log(jsonData["centers"]);
            let doseData = {};
            let n = 0;
            let ava = 0;
            await jsonData["centers"].map((center) => {
                //if (center["center_id"] === 697793 || center["center_id"] === 686954) {
                let name = center["name"];
                let sessions = center["sessions"];
                doseData[name] = [];
                n = Math.max(n, sessions.length);
                sessions.map((data) => {
                    doseData[name].push({ "date": data["date"], "capacity": data["available_capacity"] });
                    ava = ava + data["available_capacity"];

                })
                // }
            });
            console.log(doseData);
            setAvailable(ava);
            setTotalDoseData(doseData);
            setMaxDate(n);
            setShowTable(1);
        } catch (err) {
            console.log("Error");
            setShowError(1);
        }
    }


    const table = (showTable === 0) ? (showError === 0 ? null : <Text style={{ color: 'red' }}>Error Occured</Text>) : (
        <>
            <Text style={{marginBottom: "10px"}}>Available : {available}</Text>
            <Text style={{ color: 'blue' }}
                onPress={() => Linking.openURL('https://selfregistration.cowin.gov.in/')}>
                Cowin Registeration Website
</Text>
        </>
    );
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={pin}
                placeholder="pinCode"
                onChangeText={setPin}
                keyboardType="numeric" />
            <Button
                onPress={onPressLearnMore}
                title="Check Availability"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />
            {table}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
    },
});


/*
        let head = [];
        await [...Array(n).keys()].forEach((index) => {
            const da = getCurrentDate(index);
            head.push(da);
        });
        setTableHead(head);

        const prom = new Promise(function(myProm) {
            let td = [];
            for(const x in doseData) {
                let row = [];
                const myPromise = new Promise(function(myResolve) {

                    doseData[x].forEach((val) => {
                        row.push(val["capacity"]);
                    });
                    myResolve(row);
                });
                myPromise.then(() => {
                    console.log(n-doseData[x].length);
                    row = row.concat(Array(n-doseData[x].length).fill(0));
                }).then(() => {
                    console.log(row);
                    td.push(row);
                });
            }
            myProm(td);
        });
        prom.then((td) => {
            setTableData(td);
            console.log(td);
        });
        */
