import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
} from 'react-native-health';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import {
  initialize,
  requestPermission,
  readRecords,
  getSdkStatus,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';
import { TimeRangeFilter } from 'react-native-health-connect/lib/typescript/types/base.types';

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.FlightsClimbed,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
    ],
    write: [],
  },
};

const useHealthData = (date: Date) => {
  const [hasPermissions, setHasPermission] = useState(false);
  const [steps, setSteps] = useState(0);
  const [flights, setFlights] = useState(0);
  const [distance, setDistance] = useState(0);
  const [sleepSession, setSleepSession] = useState<any>(null);

  // iOS - HealthKit
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    AppleHealthKit.isAvailable((err, isAvailable) => {
      if (err) {
        console.log('Error checking availability');
        return;
      }
      if (!isAvailable) {
        console.log('Apple Health not available');
        return;
      }
      AppleHealthKit.initHealthKit(permissions, (err) => {
        if (err) {
          console.log('Error getting permissions');
          return;
        }
        setHasPermission(true);
      });
    });
  }, []);

  useEffect(() => {
    if (!hasPermissions) {
      return;
    }

    const options: HealthInputOptions = {
      date: date.toISOString(),
      includeManuallyAdded: false,
    };

    AppleHealthKit.getStepCount(options, (err, results) => {
      if (err) {
        console.log('Error getting the steps');
        return;
      }
      setSteps(results.value);
    });

    AppleHealthKit.getFlightsClimbed(options, (err, results) => {
      if (err) {
        console.log('Error getting the steps:', err);
        return;
      }
      setFlights(results.value);
    });

    AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
      if (err) {
        console.log('Error getting the steps:', err);
        return;
      }
      setDistance(results.value);
    });
  }, [hasPermissions, date]);

  // Android - Health Connect
  const readSampleData = async () => {    
    // initialize the client
    const isInitialized = await initialize();
    
    if (!isInitialized) {
      return;
    }

    // request permissions
    const grantedPermissions = await requestPermission([
      { accessType: 'read', recordType: 'Steps' },
      { accessType: 'read', recordType: 'Distance' },
      { accessType: 'read', recordType: 'FloorsClimbed' },
      { accessType: 'read', recordType: 'HeartRate' },
      { accessType: 'read', recordType: 'SleepSession' },
    ]);

    console.log('Granted permissions: ', grantedPermissions);
    

    const timeRangeFilter: TimeRangeFilter = {
      operator: 'between',
      startTime: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
      endTime: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
    };

    // const currentDate = new Date();
    const previousDay = new Date(date);
    previousDay.setDate(date.getDate() - 1);

    const timeRangeFilterPreviousDay: TimeRangeFilter = {
      operator: 'between',
      startTime: new Date(previousDay.setHours(0, 0, 0, 0)).toISOString(),
      endTime: new Date(previousDay.setHours(23, 59, 59, 999)).toISOString(),
    };

    // Steps
    const steps = await readRecords('Steps', { timeRangeFilter });
    const totalSteps = steps.reduce((sum, cur) => sum + cur.count, 0);
    setSteps(totalSteps);

    // Distance
    const distance = await readRecords('Distance', { timeRangeFilter });
    const totalDistance = distance.reduce(
      (sum, cur) => sum + cur.distance.inMeters,
      0
    );
    console.log('Total Distance: ', totalDistance);
    setDistance(totalDistance);

    // Floors climbed
    const floorsClimbed = await readRecords('FloorsClimbed', {
      timeRangeFilter,
    });
    const totalFloors = floorsClimbed.reduce((sum, cur) => sum + cur.floors, 0);
    setFlights(totalFloors);

    // Heart rate
    const heartRate = await readRecords('HeartRate', { timeRangeFilter });
    // const totalHeartRate = heartRate
    // console.log('Total Heart Rate: ', totalHeartRate);

    // Sleep
    const sleep = await readRecords('SleepSession', { timeRangeFilter: timeRangeFilterPreviousDay });
    // const totalSleep = sleep
    setSleepSession(sleep[0].stages || []);
    console.log('Sleep: ', sleep);

    // Calories Burned
    const result = await readRecords('ActiveCaloriesBurned', { timeRangeFilter });
    // console.log('Result: ', result);

    // Testing
    readRecords('SleepSession', { timeRangeFilter: timeRangeFilterPreviousDay }).then((result) => {
      // console.log('Retrieved records: ', JSON.stringify({ result }, null, 2)); // Retrieved records:  {"result":[{"startTime":"2023-01-09T12:00:00.405Z","endTime":"2023-01-09T23:53:15.405Z","energy":{"inCalories":15000000,"inJoules":62760000.00989097,"inKilojoules":62760.00000989097,"inKilocalories":15000},"metadata":{"id":"239a8cfd-990d-42fc-bffc-c494b829e8e1","lastModifiedTime":"2023-01-17T21:06:23.335Z","clientRecordId":null,"dataOrigin":"com.healthconnectexample","clientRecordVersion":0,"device":0}}]}
    });
    
  };

  const checkAvailability = async () => {
    const status = await getSdkStatus();
    if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
    console.log('SDK is available');
    }

    if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
      console.log('SDK is not available');
    }

    if (
      status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
    ) {
      console.log('SDK is not available, provider update required');
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    // checkAvailability();
    readSampleData();
  }, [date]);

  return {
    steps,
    flights,
    distance,
    sleepSession
  };
};

export default useHealthData;
