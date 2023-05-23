import * as React from "react";
import { colors, fonts, layout } from "@/constants";
import { Styles } from "@/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { setShowButtonNetwork, signout } from "@/redux/reducers/authReducer";
import { AppDispatch, RootState } from "@/redux/store";
import bStorage from "@/actions/BStorage";
import { signOut } from "@/actions/CommonActions";
import crashlytics from "@react-native-firebase/crashlytics";
import Icon from "react-native-vector-icons/Feather";
import analytics from "@react-native-firebase/analytics";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import { getAppVersionName, isProduction } from "@/utils/generalFunc";
import { openPopUp } from "@/redux/reducers/modalReducer";

const styles: Styles = {
    chipText: {
        fontFamily: fonts.family.montserrat[500],
        fontSize: fonts.size.md,
        color: colors.text.darker,
        textAlign: "center"
    },
    version: {
        fontFamily: fonts.family.montserrat[400],
        fontSize: fonts.size.xs,
        color: colors.text.darker,
        textAlign: "center"
    }
};

export default function SalesHeaderRight(iconColor = "") {
    const dispatch = useDispatch<AppDispatch>();
    const [visible, setVisible] = React.useState(false);
    const { isShowButtonNetwork } = useSelector(
        (state: RootState) => state.auth
    );

    const hideMenu = () => setVisible(false);
    const showMenu = () => setVisible(true);
    let buttonCount = 0;

    const onLogout = async () => {
        try {
            const response = await signOut();
            if (response) {
                bStorage.clearItem();
                dispatch(signout(false));
                crashlytics().setUserId("");
                analytics().setUserId("");
            }
        } catch (error) {
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText: error.message || "Terjadi error saat logout",
                    outsideClickClosePopUp: true
                })
            );
        }
    };

    const onVersionClick = () => {
        buttonCount += 1;
        if (buttonCount > 2) {
            dispatch(setShowButtonNetwork(!isShowButtonNetwork));
            buttonCount = 0;
        } else {
            setTimeout(() => {
                buttonCount = 0;
            }, 500);
        }
    };

    return (
        <Menu
            visible={visible}
            anchor={
                <Icon
                    name="menu"
                    size={18}
                    color={iconColor !== "" ? iconColor : colors.white}
                    style={{ padding: layout.pad.lg }}
                    onPress={showMenu}
                />
            }
            onRequestClose={hideMenu}
        >
            <MenuItem textStyle={styles.chipText} onPress={onLogout}>
                Logout
            </MenuItem>
            <MenuDivider />
            <MenuItem
                textStyle={styles.version}
                disabled={!(isProduction() && !__DEV__)}
                onPress={
                    isProduction() && !__DEV__ ? onVersionClick : undefined
                }
            >
                {`APP Version ${getAppVersionName()}`}
            </MenuItem>
        </Menu>
    );
}
