import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import dayjs from 'dayjs';

interface SleepDataItem {
  stage: number;
  startTime: string;
  endTime: string;
}

interface SleepSessionComponentProps {
  sleepData: SleepDataItem[];
}

const SleepSessionComponent: React.FC<SleepSessionComponentProps> = ({ sleepData }) => {
  const [chartData, setChartData] = useState<{ labels: string[]; datasets: { data: number[] }[] }>({
    labels: [],
    datasets: [{ data: [] }],
  });

  const calculateTotalSleepTime = () => {
    if (!sleepData || sleepData.length === 0) {
      return;
    }

    const startTime = sleepData[0].startTime;
    const endTime = sleepData[sleepData.length - 1].endTime;
    return `${startTime} - ${endTime}`;
  };

  useEffect(() => {
    // Extract labels and data from sleepData
    const labels = sleepData.map((item) => item.startTime);
    const data = sleepData.map((item) => item.stage);

    setChartData({ labels, datasets: [{ data }] });
  }, [sleepData]);

  return (
    <View>
      <Text>Sleep Stages Chart</Text>
      <LineChart
        data={chartData}
        width={300}
        height={220}
        yAxisLabel="Stage"
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // ... your styles
});

export default SleepSessionComponent;
