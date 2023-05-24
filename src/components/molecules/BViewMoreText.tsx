import * as React from "react";
import {
    Text,
    View,
    StyleSheet,
    ViewStyle,
    TouchableOpacity,
    StyleProp,
    TextStyle
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import resScale from "@/utils/resScale";
import colors from "@/constants/colors";

const styles = StyleSheet.create({
    fullTextWrapper: {
        opacity: 0,
        position: "absolute",
        left: 0,
        top: 0
    },
    viewMoreText: {
        color: "blue"
    },
    transparent: {
        opacity: 0
    },
    viewMoreTextContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    }
});

const defaultProps = {
    textStyle: {}
};

type ViewMoreTextProps = typeof defaultProps &
    ViewStyle & {
        numberOfLines: number;
        renderViewMore?: (handlePress: () => void) => React.ReactNode;
        renderViewLess?: (handlePress: () => void) => React.ReactNode;
        onTextLayout?: () => void;
        textStyle?: StyleProp<TextStyle>;
        children?: any;
    };

class BViewMoreText extends React.Component<ViewMoreTextProps> {
    trimmedTextHeight = null;

    fullTextHeight = null;

    shouldShowMore = false;

    constructor(props: any) {
        super(props);
        this.state = {
            isFulltextShown: true,
            numberOfLines: this.props.numberOfLines
        };
    }

    hideFullText = () => {
        if (
            this.state.isFulltextShown &&
            this.trimmedTextHeight &&
            this.fullTextHeight
        ) {
            this.shouldShowMore = this.trimmedTextHeight < this.fullTextHeight;
            this.setState({
                isFulltextShown: false
            });
        }
    };

    onLayoutTrimmedText = (event) => {
        const { height } = event.nativeEvent.layout;

        this.trimmedTextHeight = height;
        this.hideFullText();
    };

    onLayoutFullText = (event) => {
        const { height } = event.nativeEvent.layout;

        this.fullTextHeight = height;
        this.hideFullText();
    };

    onPressMore = () => {
        this.setState({
            numberOfLines: null
        });
    };

    onPressLess = () => {
        this.setState({
            numberOfLines: this.props.numberOfLines
        });
    };

    getWrapperStyle = () => {
        if (this.state.isFulltextShown) {
            return styles.transparent;
        }
        return {};
    };

    renderViewMore = () => (
        <TouchableOpacity onPress={this.onPressMore}>
            <Icon name="down" color={colors.text.blue} />
        </TouchableOpacity>
    );

    renderViewLess = () => (
        <TouchableOpacity onPress={this.onPressLess}>
            <Icon name="up" color={colors.text.blue} />
        </TouchableOpacity>
    );

    renderFooter = () => {
        const { numberOfLines } = this.state;

        if (this.shouldShowMore === true) {
            if (numberOfLines > 0) {
                return (this.props.renderViewMore || this.renderViewMore)(
                    this.onPressMore
                );
            }
            return (this.props.renderViewLess || this.renderViewLess)(
                this.onPressLess
            );
        }
        return null;
    };

    renderFullText = () => {
        if (this.state.isFulltextShown) {
            return (
                <View
                    onLayout={this.onLayoutFullText}
                    style={styles.fullTextWrapper}
                >
                    <Text style={this.props.textStyle}>
                        {this.props.children}
                    </Text>
                </View>
            );
        }
        return null;
    };

    render() {
        return (
            <View style={this.getWrapperStyle()}>
                <View
                    style={styles.viewMoreTextContainer}
                    onLayout={this.onLayoutTrimmedText}
                >
                    <Text
                        style={this.props.textStyle}
                        onTextLayout={this.props.onTextLayout}
                        numberOfLines={this.state.numberOfLines}
                    >
                        {this.props.children}
                    </Text>
                    {this.renderFooter()}
                </View>

                {this.renderFullText()}
            </View>
        );
    }
}

export default BViewMoreText;
