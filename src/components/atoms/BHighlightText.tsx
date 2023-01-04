import { Text, StyleSheet } from 'react-native';
import React from 'react';
import font from '@/constants/fonts';
import respFS from '@/utils/respFS';
import colors from '@/constants/colors';

type higlightTextType = {
  searchQuery?: string;
  name: string;
  fontSize?: number;
};

export default function HighlightText({
  searchQuery,
  name,
  fontSize,
}: higlightTextType) {
  if (!searchQuery) {
    return (
      <Text
        style={[
          style.normalText,
          fontSize ? { fontSize: fontSize } : { fontSize: respFS(14) },
        ]}
        numberOfLines={1}
      >
        {name}
      </Text>
    );
  }
  const parts = name.split(new RegExp(`(${searchQuery})`, 'gi'));

  return (
    <Text
      style={[
        style.normalText,
        fontSize ? { fontSize: respFS(fontSize) } : { fontSize: respFS(14) },
      ]}
      numberOfLines={1}
    >
      {parts.map((part, index) =>
        part.toLowerCase() === searchQuery.toLowerCase() ? (
          <Text
            key={part + index}
            style={[
              style.normalText,
              style.boldText,
              fontSize
                ? { fontSize: respFS(fontSize) }
                : { fontSize: respFS(14) },
            ]}
          >
            {part}
          </Text>
        ) : (
          part
        )
      )}
    </Text>
  );
}
const style = StyleSheet.create({
  normalText: {
    fontFamily: font.family.montserrat[500],
    color: colors.textInput.input,
  },
  boldText: {
    fontWeight: '900',
  },
});
