import * as React from 'react';
import { StyleProp, ViewStyle, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors, layout } from '@/constants';
import { resScale } from '@/utils';
import DocumentPicker from 'react-native-document-picker';
import { BSvg } from '@/components';
import SvgNames from '@/components/atoms/BSvg/svgName';

type configType = {
  style?: StyleProp<ViewStyle>;
  takePhoto: () => void;
  onDocPress?: (data: any) => void;
  onGalleryPress?: (data: any) => void;
  disabledGalleryPicker?: boolean;
  disabledDocPicker?: boolean;
  flashModeEnable?: boolean;
};

const CameraButton = ({
  style,
  takePhoto,
  onDocPress,
  onGalleryPress,
  disabledGalleryPicker = true,
  disabledDocPicker = true,
  flashModeEnable = false,
}: configType) => {
  const selectFile = React.useCallback(
    async (typeDocument: 'IMAGE' | 'DOC') => {
      try {
        const res = await DocumentPicker.pickSingle({
          type:
            typeDocument === 'IMAGE'
              ? ['image/png', 'image/jpg', 'image/jpeg']
              : [DocumentPicker.types.pdf],
          allowMultiSelection: false,
        });
        if (typeDocument === 'IMAGE') onGalleryPress(res);
        else onDocPress(res);
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
        } else {
          throw err;
        }
      }
    },
    [onDocPress, onGalleryPress]
  );

  return (
    <>
      <View style={[styles.cameraBtn, style]}>
        <View style={styles.optionButton}>
          <View style={styles.flexFull}>
            {!disabledGalleryPicker && (
              <View style={styles.gallery}>
                <TouchableOpacity
                  style={styles.roundedViewButton}
                  onPress={() => selectFile('IMAGE')}
                >
                  <BSvg
                    widthHeight={resScale(20)}
                    svgName={SvgNames.IC_GALLERY_PICKER}
                    color={colors.white}
                    type="color"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          {!disabledDocPicker && (
            <View style={styles.flexFull}>
              <View style={styles.doc}>
                <TouchableOpacity
                  style={styles.roundedViewButton}
                  onPress={() => selectFile('DOC')}
                >
                  <BSvg
                    widthHeight={resScale(20)}
                    svgName={SvgNames.IC_DOC_PICKER}
                    color={colors.white}
                    type="color"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={() => takePhoto()}>
          <View style={styles.outerShutter}>
            <View style={styles.innerShutter} />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  flexFull: {
    flex: 1,
  },
  roundedViewButton: {
    height: resScale(40),
    width: resScale(40),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.text.secondary,
    borderRadius: layout.radius.xl,
  },
  optionButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  galleryView: {
    alignSelf: 'flex-start',
    flex: 1,
  },
  gallery: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: layout.pad.xxl,
    paddingTop: layout.pad.md,
  },
  docView: {
    alignSelf: 'flex-end',
    flex: 1,
  },
  doc: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: layout.pad.xxl,
    paddingTop: layout.pad.md,
  },
  cameraBtn: {
    // position: 'absolute',
    height: resScale(120),
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  outerShutter: {
    // flex: 1,
    borderRadius: resScale(40),
    height: resScale(68),
    width: resScale(68),
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: layout.pad.lg,
    marginTop: layout.pad.lg,
  },
  innerShutter: {
    borderRadius: resScale(40),
    height: resScale(58),
    width: resScale(58),
  },
});

export default CameraButton;
