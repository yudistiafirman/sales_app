import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ListRenderItem,
} from 'react-native';
import * as React from 'react';
import { colors, layout } from '@/constants';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { resScale } from '@/utils';
import Pdf from 'react-native-pdf';
import { LocalFileType } from '@/interfaces/LocalFileType';

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

  const renderItem: ListRenderItem<LocalFileType> = React.useCallback(({ item, index }) => {
    return (
      <View style={style.container}>
        {item.file === null && (
          <TouchableOpacity onPress={addMorePict}>
            <View style={[style.addImage]}>
              <Feather name="plus" size={resScale(25)} color="#000000" />
            </View>
          </TouchableOpacity>
        )}
        {item?.isFromPicker ? (
          <>
            {item?.file?.type === 'image/jpeg' ||
              item?.file?.type === 'image/png' ? (
              <Image source={item?.file} style={style.imageStyle} />
            ) : (
              <Pdf
                source={{ uri: item?.file?.uri }}
                style={style.imageStyle}
                page={1}
              />
            )}
          </>
        ) : (
          <Image source={item?.file} style={style.imageStyle} />
        )}
        {item?.type === 'GALLERY' && removePict && (
          <TouchableOpacity
            style={style.closeIcon}
            onPress={() => removePict(index - 1)}
          >
            <AntDesign
              name="close"
              size={resScale(15)}
              color={colors.white}
            />
          </TouchableOpacity>
        )}
      </View>
    )
  }, [])
  return (
    <FlatList
      data={picts}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      numColumns={3}
    />
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
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: layout.radius.md,
  },
  scrollViewContentStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  closeIcon: {
    position: 'absolute',
    right: resScale(-3),
    top: resScale(-5),
    backgroundColor: colors.text.medium,
    borderRadius: layout.radius.lg
  },
  imageStyle: {
    flex: 1,
    borderRadius: layout.radius.md,
  },
});
