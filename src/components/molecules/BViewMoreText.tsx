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
        const { numberOfLines } = this.props;
        this.state = {
            isFulltextShown: true,
            numberOfLines
        };
    }

    hideFullText = () => {
        const { isFulltextShown } = this.state;
        if (isFulltextShown && this.trimmedTextHeight && this.fullTextHeight) {
            this.shouldShowMore = this.trimmedTextHeight < this.fullTextHeight;
            this.setState({
                isFulltextShown: false
            });
        }
    };

    onLayoutTrimmedText = (event) => {
        const height = event?.nativeEvent?.layout?.height;

        this.trimmedTextHeight = height;
        this.hideFullText();
    };

    onLayoutFullText = (event) => {
        const height = event?.nativeEvent?.layout?.height;

        this.fullTextHeight = height;
        this.hideFullText();
    };

    onPressMore = () => {
        this.setState({
            numberOfLines: null
        });
    };

    onPressLess = () => {
        const { numberOfLines } = this.props;
        this.setState({
            numberOfLines
        });
    };

    getWrapperStyle = () => {
        const { isFulltextShown } = this.state;
        if (isFulltextShown) {
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
        const { renderViewMore, renderViewLess } = this.props;

        if (this.shouldShowMore === true) {
            if (numberOfLines > 0) {
                return (renderViewMore || this.renderViewMore)(
                    this.onPressMore
                );
            }
            return (renderViewLess || this.renderViewLess)(this.onPressLess);
        }
        return null;
    };

    renderFullText = () => {
        const { isFulltextShown } = this.state;
        if (isFulltextShown) {
            const { children, textStyle } = this.props;
            return (
                <View
                    onLayout={this.onLayoutFullText}
                    style={styles.fullTextWrapper}
                >
                    <Text style={textStyle}>{children}</Text>
                </View>
            );
        }
        return null;
    };

    render() {
        const { children, textStyle, numberOfLines, onTextLayout } = this.props;
        const { numberOfLines: numberOfLinesState } = this.state;
        return (
            <View style={this.getWrapperStyle()}>
                <View
                    style={styles.viewMoreTextContainer}
                    onLayout={this.onLayoutTrimmedText}
                >
                    <Text
                        style={textStyle}
                        onTextLayout={onTextLayout}
                        numberOfLines={numberOfLinesState}
                    >
                        {children}
                    </Text>
                    {this.renderFooter()}
                </View>

                {this.renderFullText()}
            </View>
        );
    }
}

export default BViewMoreText;
