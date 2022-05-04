
export default class TestComponent extends React.Component {
	handleGetAnimationStyle = (
		animationValue: Animated.Value<number>
	): StyleProp<Animated.AnimateStyle<ViewStyle>> => {
		return {
			transform: [
				{
					scale: animationValue.interpolate({
						inputRange: [0, 1],
						outputRange: [1, 0.9]
					}) // 收缩效果
				}
			],
			opacity: animationValue.interpolate({
				inputRange: [0, 1],
				outputRange: [1, 0.8]
			}) // 透明度从1 - 0.8
		}
	}

	handlePress = () => {
		console.log('yes ~')
	}
	
	render() {
		return (
			<TouchWithFeedback
				getAnimationStyle={this.handleGetAnimationStyle}
				onPress={this.handlePress}
			> 
				<Text>点击我</Text>
			</TouchWithFeedback>	
		)
	}
}


