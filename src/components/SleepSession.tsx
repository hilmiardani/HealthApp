import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SleepDataItem {
  stage: number;
  startTime: string;
  endTime: string;
}

interface SleepSessionComponentProps {
  sleepData: SleepDataItem[] | null; // Update type to accept null
}

const SleepSessionComponent: React.FC<SleepSessionComponentProps> = ({ sleepData }) => {
  const calculateTotalSleepTime = () => {
    if (!sleepData || sleepData.length === 0) {
      return 'No sleep data available';
    }

    const startTime = sleepData[0].startTime;
    const endTime = sleepData[sleepData.length - 1].endTime;
    return `${startTime} - ${endTime}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sleep Session</Text>
      <Text style={styles.timeRange}>{calculateTotalSleepTime()}</Text>
      {sleepData && sleepData.length > 0 ? (
        sleepData.map((item, index) => (
          <View key={index} style={styles.sleepItem}>
            <Text>{`Stage ${item.stage}`}</Text>
            <Text>{`${item.startTime} - ${item.endTime}`}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noData}>No sleep data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  timeRange: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 5,
  },
  sleepItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

export default SleepSessionComponent;
