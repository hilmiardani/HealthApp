import {View} from 'react-native';
import SVG, { Circle } from 'react-native-svg';
import Animated, {useSharedValue, useAnimatedProps, withTiming} from 'react-native-reanimated'
import {useEffect} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type RingProgressProps = {
  radius?: number;
  strokeWidth?: number;
  progress?: number;
}

// const color = '#EE0F55';
const color = '#079dfa'

const RingProgress = ({radius = 100, strokeWidth = 30, progress = 0.5}: RingProgressProps) => {
  const innerRadius = radius - strokeWidth / 2;
  // The Circumference (or) perimeter of circle = 2πR
  const circumference = 2 * Math.PI * innerRadius;

  const fill = useSharedValue(0);

  useEffect(() => {
    fill.value = withTiming(progress, {duration: 2500})
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDasharray: [circumference * fill.value, circumference]
  }))

  return (
    <View style={{
        width: radius * 2,
        height: radius * 2,
        alignSelf: 'center',
      }}>
      <SVG style={{flex: 1}}>
        {/* Background */}
        <Circle 
          r={innerRadius}
          cx={radius}
          cy={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={0.4}
        />
        {/* Foreground */}
        <AnimatedCircle 
          animatedProps={animatedProps}
          r={innerRadius}
          cx={radius}
          cy={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={[circumference * progress, circumference]}
          strokeLinecap="round"
          rotation="-90"
          originX={radius}
          originY={radius}
        />
      </SVG>
      <Icon 
        name="arrowright" 
        size={strokeWidth * 0.8} 
        color="blue" 
        style={{
          position: 'absolute',
          alignSelf: 'center',
          top: strokeWidth * 0.1,
        }}
      />
    </View>
  )
}

export default RingProgress;