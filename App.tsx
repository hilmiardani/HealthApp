// import { StatusBar } from 'expo-status-bar';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Value from './src/components/Value';
import RingProgress from './src/components/RingProgress';
import { useState } from 'react';
import useHealthData from './src/hooks/useHealthData';
// import { AntDesign } from '@expo/vector-icons';
import dayjs, { Dayjs } from "dayjs";
import Icon from 'react-native-vector-icons/AntDesign';

const STEPS_GOAL = 2000;

export default function App() {
  const [date, setDate] = useState(new Date());
  const { steps, flights, distance } = useHealthData(date);

  const changeDate = (numDays: number) => {
    const currentDate = new Date(date); // Create a copy of the current date
    // Update the date by adding/subtracting the number of days
    currentDate.setDate(currentDate.getDate() + numDays);

    setDate(currentDate); // Update the state variable
  };

  const MyStatusBar = ({backgroundColor, ...props} : {backgroundColor:any}) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <StatusBar barStyle="light-content" backgroundColor={backgroundColor} {...props} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <MyStatusBar backgroundColor={"#FF0000"} /> */}
      <View style={styles.datePicker}>
        {/* <AntDesign
          onPress={() => changeDate(-1)}
          name="left"
          size={20}
          color="#C3FF53"
        /> */}
        <TouchableOpacity onPress={()=> changeDate(-1)}>
          <View>
              <Icon name="left" size={20} color="#079dfa" />
          </View>
         </TouchableOpacity>
        <Text style={styles.date}>{dayjs(date).format("D MMMM YYYY")}</Text>
        <TouchableOpacity onPress={()=> changeDate(1)}>
          <View>
              <Icon name="right" size={20} color="#079dfa" />
          </View>
         </TouchableOpacity>

        {/* <AntDesign
          onPress={() => changeDate(1)}
          name="right"
          size={20}
          color="#C3FF53"
        /> */}
      </View>

      <RingProgress
        radius={150}
        strokeWidth={50}
        progress={steps / STEPS_GOAL}
      />

      <View style={styles.values}>
        <Value label="Steps" value={steps.toString()} />
        <Value label="Distance" value={`${(distance / 1000).toFixed(2)} km`} />
        <Value label="Flights Climbed" value={flights.toString()} />
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    padding: 12,
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
  },
  date: {
    color: 'white',
    fontWeight: '500',
    fontSize: 20,
    marginHorizontal: 20,
  },
  statusBar: {
    height: 40,
  }
});
