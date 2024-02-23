import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
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
  const [chartData, setChartData] = useState<{ labels: string[]; datasets: { data: number[] }[] } | null>(
    null
  );

  useEffect(() => {
    if (sleepData && sleepData.length > 0) {
      const firstItem = sleepData[0];
      const lastItem = sleepData[sleepData.length - 1];

      const formattedSleepStart = dayjs(firstItem.startTime).format('HH:mm');
      const formattedSleepEnd = dayjs(lastItem.endTime).format('HH:mm');
      const labels: string[] = [formattedSleepStart, formattedSleepEnd];
      const data: number[] = sleepData.map((item) => item.stage);

      setChartData({
        labels: labels,
        datasets: [{ data: data }],
      });
    }
  }, [sleepData]);

  return (
    <View>
      <Text>Sleep Stages Chart</Text>
      {chartData ? (
        <View>
          <CustomXLabels labels={chartData.labels} />
          {/* <LineChart
            data={chartData}
            width={330}
            height={220}
            yAxisLabel="Stage "
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              formatYLabel: (label) => `${label}`, // Format y-axis label
            }}
            bezier
            style={{
              marginVertical: 2,
              borderRadius: 8,
            }}
            withInnerLines={false}
          /> */}
          <BarChart
            data={chartData}
            width={330}
            height={220}
            yAxisLabel="Stage "
            yAxisSuffix=''
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              formatYLabel: (label) => `${label}`, // Format y-axis label
            }}
            style={{
              marginVertical: 2,
              borderRadius: 8,
            }}
            withInnerLines={false}
          />
        </View>
      ) : (
        <Text>Loading chart...</Text>
      )}
    </View>
  );
};

const CustomXLabels: React.FC<{ labels: string[] }> = ({ labels }) => {
  return (
    <View style={styles.xLabelsContainer}>
      <Text style={styles.formattedSleepStartLabel}>{labels[0]}</Text>
      <Text style={styles.formattedSleepEndLabel}>{labels[1]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  xLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formattedSleepStartLabel: {
    color: 'green', // Customize the color for formattedSleepStart
  },
  formattedSleepEndLabel: {
    color: 'red', // Customize the color for formattedSleepEnd
  },
  // You can add additional styles here if needed
});

export default SleepSessionComponent;
