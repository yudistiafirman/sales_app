import colors from "@/constants/colors";
import scaleSize from "@/utils/scale";
import { StyleSheet } from "react-native";

const TabBarStyle = StyleSheet.create({
    tabBarContainer:{ 
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center',
        height:scaleSize.moderateScale(56),
        borderTopWidth:1,
        borderColor:colors.border.grey 
    },
    icon :{
        height:scaleSize.moderateScale(24),
        width:scaleSize.moderateScale(24),
        marginBottom:scaleSize.moderateScale(4)
    }
})


export default TabBarStyle