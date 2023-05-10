import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import crashlytics from "@react-native-firebase/crashlytics";
import { ScrollView, StyleSheet, View } from "react-native";
import { RootState } from "@/redux/store";
import { CREATE_VISITATION } from "@/navigation/ScreenNames";
import { BForm, BSpacer } from "@/components";
import { Competitor, Input } from "@/interfaces";
import BSheetAddCompetitor from "@/components/templates/BottomSheetAddCompetitor";
import { updateDataVisitation } from "@/redux/reducers/VisitationReducer";
import { colors, fonts, layout } from "@/constants";
import { resScale } from "@/utils";

export type selectedDateType = {
  date: string;
  prettyDate: string;
  day: string;
};

function Fourth() {
  const dispatch = useDispatch();
  const visitationData = useSelector((state: RootState) => state.visitation);
  const [isCompetitorVisible, setIsCompetitorVisible] = useState(false);

  const inputsData: Input[] = useMemo(
    () => [
      {
        label: "Kompetitor",
        isRequire: true,
        isError: false,
        type: "PIC",
        value: visitationData?.competitors ? visitationData.competitors : [],
        onChange: () => {
          setIsCompetitorVisible(!isCompetitorVisible);
        },
      },
    ],
    [visitationData?.competitors]
  );

  useEffect(() => {
    crashlytics().log(`${CREATE_VISITATION}-Step4`);
  }, [visitationData.images]);

  return (
    <View style={style.container}>
      <View style={{ flex: 1 }}>
        <ScrollView style={style.scrollViewStyle}>
          <BForm titleBold="500" inputs={inputsData} />
        </ScrollView>
      </View>
      <BSpacer size="extraSmall" />
      <BSheetAddCompetitor
        onClose={() => setIsCompetitorVisible(!isCompetitorVisible)}
        isVisible={isCompetitorVisible}
        addCompetitor={(comp: Competitor) => {
          const currentList = visitationData?.competitors
            ? [...visitationData?.competitors]
            : [];
          currentList.push(comp);
          dispatch(
            updateDataVisitation({
              type: "competitors",
              value: currentList,
            })
          );
        }}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between" },
  gantiText: {
    marginRight: 10,
    color: colors.primary,
    fontFamily: fonts.family.montserrat[500],
  },
  loadingShimmer: {
    width: resScale(335),
    height: resScale(100),
    borderRadius: layout.radius.md,
  },
  labelShimmer: {
    width: resScale(335),
    height: resScale(50),
    borderRadius: layout.radius.md,
  },
  scrollViewStyle: {
    flex: 1,
  },
});

export default Fourth;
