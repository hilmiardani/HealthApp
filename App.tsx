import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Value from './src/components/Value';
import RingProgress from './src/components/RingProgress';
import useHealthData from './src/hooks/useHealthData';
import dayjs from 'dayjs';
import Icon from 'react-native-vector-icons/AntDesign';
import SleepSessionComponent from './src/components/SleepSession';

const STEPS_GOAL = 2000;

export default function App() {
  const [date, setDate] = useState(new Date());
  const { steps, flights, distance, sleepSession, startSleep, endSleep } = useHealthData(date);

  const changeDate = (numDays: number) => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + numDays);
    setDate(currentDate);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Health App</Text>
      <View style={styles.datePicker}>
        <TouchableOpacity onPress={() => changeDate(-1)}>
          <View>
            <Icon name="left" size={20} color="#079dfa" />
          </View>
        </TouchableOpacity>
        <Text style={styles.date}>{dayjs(date).format('D MMMM YYYY')}</Text>
        <TouchableOpacity onPress={() => changeDate(1)}>
          <View>
            <Icon name="right" size={20} color="#079dfa" />
          </View>
        </TouchableOpacity>
      </View>

      <RingProgress radius={150} strokeWidth={50} progress={steps / STEPS_GOAL} />

      <View style={styles.values}>
        <Value label="Steps" value={steps.toString()} />
        <Value label="Distance" value={`${(distance / 1000).toFixed(2)} km`} />
        {/* <Value label="Flights Climbed" value={flights.toString()} /> */}
      </View>

      <View style={{marginBottom: 50}}>
        <SleepSessionComponent sleepData={sleepSession} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 12,
  },
  title: {
    marginTop: 0,
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: '#079dfa',
  },
  values: {
    flexDirection: 'row',
    gap: 25,
    flexWrap: 'wrap',
    marginTop: 100,
  },
  datePicker: {
    alignItems: 'center',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 0,
  },
  date: {
    color: 'black',
    fontWeight: '500',
    fontSize: 20,
    marginHorizontal: 20,
  },
});
