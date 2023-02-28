import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as React from 'react';
import { colors, layout } from '@/constants';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { resScale } from '@/utils';

type BGalleryType = {
  picts: any[];
  addMorePict?: () => void;
  removePict?: (index: number) => void;
};

export default function BGallery({
  picts,
  addMorePict,
  removePict,
}: BGalleryType) {
  return (
    <ScrollView
      contentContainerStyle={style.scrollViewContentStyle}
      showsVerticalScrollIndicator={false}
    >
      {addMorePict && (
        <TouchableOpacity onPress={addMorePict}>
          <View style={[style.addImage, style.container]}>
            <Feather name="plus" size={resScale(25)} color="#000000" />
          </View>
        </TouchableOpacity>
      )}
      {picts &&
        picts.length > 0 &&
        picts.map((image, index) => {
          return (
            <View key={index.toString()} style={style.container}>
              <Image source={image?.photo} style={style.imageStyle} />
              {image?.type === 'GALLERY' && removePict && (
                <TouchableOpacity
                  style={style.closeIcon}
                  onPress={removePict(index)}
                >
                  <AntDesign
                    name="closecircle"
                    size={resScale(15)}
                    color="#000000"
                  />
                </TouchableOpacity>
              )}
            </View>
          );
        })}
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    width: resScale(102),
    height: resScale(120),
    margin: resScale(5),
    borderRadius: layout.radius.md,
  },
  addImage: {
    backgroundColor: colors.tertiary,
    margin: resScale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContentStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  closeIcon: {
    position: 'absolute',
    right: resScale(-5),
    top: resScale(-5),
  },
  imageStyle: {
    flex: 1,
  },
});
