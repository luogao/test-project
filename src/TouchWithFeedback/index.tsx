import React from 'react'
import {
	GestureResponderEvent,
	PressableProps,
	Pressable,
	StyleProp,
	ViewStyle,
	StyleSheet
} from 'react-native'
import Animated, {
	block,
	Clock,
	clockRunning,
	cond,
	defined,
	set,
	stopClock,
	and,
	useValue
} from 'react-native-reanimated'
import { timing } from 'react-native-redash'


interface TouchWithFeedbackProps extends PressableProps {
	getAnimationStyle?: (
		animationValue: Animated.Value<number>
	) => StyleProp<Animated.AnimateStyle<ViewStyle>>
}

type Binary = 0 | 1

export const TouchWithFeedback = (props: TouchWithFeedbackProps) => {
	const { style, ...rest } = props
	const activeValue = 1
	const inactiveValue = 0

	const TRUE = 1
	const FALSE = 0

	const animationDuration = useValue<number>(150) //ms
	const animationValue = useValue<number>(inactiveValue)
	const animationState = useValue<Binary>(FALSE)
	const activeClock = new Clock()
	const inactiveClock = new Clock()

	function activeAnimation() {
		animationState.setValue(TRUE)
	}

	function inactiveAnimation() {
		animationState.setValue(FALSE)
	}

	function handlePressOut(event: GestureResponderEvent) {
		inactiveAnimation()
		props.onPressOut && props.onPressOut(event)
	}

	function handlePressIn(event: GestureResponderEvent) {
		activeAnimation()
		props.onPressIn && props.onPressIn(event)
	}

	function handlePress(e: GestureResponderEvent) {
		props.onPress && props.onPress(e)
	}

	function _stopClock(clock: Animated.Clock) {
		return cond(and(defined(clock), clockRunning(clock)), stopClock(clock))
	}

	return (
		<>
			<Pressable
				{...rest}
				onPress={handlePress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
			>
				<Animated.View
					style={StyleSheet.flatten([
						style as any,
						props.getAnimationStyle
							? props.getAnimationStyle(animationValue)
							: undefined
					])}
				>
					{props.children}
				</Animated.View>
			</Pressable>
			<Animated.Code
				exec={block([
					cond(
						[animationState],
						[
							_stopClock(inactiveClock),
							set(
								animationValue,
								timing({
									clock: activeClock,
									duration: animationDuration,
									from: animationValue,
									to: activeValue
								})
							) // active
						],
						[
							_stopClock(activeClock),
							set(
								animationValue,
								timing({
									clock: inactiveClock,
									duration: animationDuration,
									from: animationValue,
									to: inactiveValue
								})
							) // inactive
						]
					)
				])}
			/>
		</>
	)
}