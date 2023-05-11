import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { fonts } from '@/constants';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import { resScale } from '@/utils';
import respFS from '@/utils/resFontSize';

const style = StyleSheet.create({
  normalText: {
    fontFamily: font.family.montserrat[500],
    color: colors.textInput.input,
    maxWidth: resScale(200),
  },
  boldText: {
    fontFamily: fonts.family.montserrat[800],
  },
});

type HiglightTextType = {
  searchQuery?: string;
  name: string;
  fontSize?: number;
};

export default function HighlightText({ searchQuery, name, fontSize }: HiglightTextType) {
  function escapeRegExp(text: string) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
  if (!searchQuery) {
    return (
      <Text
        style={[
          style.normalText,
          fontSize ? { fontSize: respFS(fontSize) } : { fontSize: font.size.md },
        ]}
        numberOfLines={1}>
        {name}
      </Text>
    );
  }

  const regexStr = `(${searchQuery.trim().split(/\s+/).map(escapeRegExp).join('|')})`;
  const regex = new RegExp(regexStr, 'gi');
  const parts = name.split(regex);

  return (
    <Text
      style={[
        style.normalText,
        fontSize ? { fontSize: respFS(fontSize) } : { fontSize: font.size.md },
      ]}
      numberOfLines={1}>
      {parts
        .filter(part => part)
        .map((part, i) =>
          regex.test(part) ? (
            <Text
              key={part + i}
              style={[
                style.normalText,
                style.boldText,
                fontSize ? { fontSize: respFS(fontSize) } : { fontSize: font.size.md },
              ]}>
              {part}
            </Text>
          ) : (
            part
          )
        )}
    </Text>
  );
}
