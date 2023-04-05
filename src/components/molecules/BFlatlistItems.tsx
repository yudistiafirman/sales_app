import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import resScale from '@/utils/resScale';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { layout } from '@/constants';
import BSpacer from '../atoms/BSpacer';
import BEmptyState from '@/components/organism/BEmptyState';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

type visitationType = {
	[key: string]: any;
	name: string;
};

type BTabScreenType = {
	data?: any[]; // array of data to render, must have name props for now
	renderItem: (item: visitationType | any, query?: string) => JSX.Element; // item to render in flatlist
	isLoading?: boolean;
	searchQuery?: string;
	onEndReached?:
	| ((info: { distanceFromEnd: number }) => void)
	| null
	| undefined;
	refreshing?: boolean;
	initialFetch?: () => Promise<visitationType[] | undefined>;
	isError?: boolean;
	errorMessage?: string;
	onAction?: () => void;
};

export default function BFlatlistItems({
	data,
	renderItem,
	// isLoading,
	searchQuery,
	onEndReached,
	refreshing,
	initialFetch,
	isLoading,
	isError,
	onAction,
	errorMessage,
}: BTabScreenType) {
	const [flatListDatas, setFlatListDatas] = useState<any[]>(data!);
	const [currentPage, setCurrentPage] = useState(1);
	const [_isLoading, _setIsLoading] = useState(isLoading || false);

	const renderLoading = () => {
		return (
			<View style={style.flatListLoading}>
				<ShimmerPlaceHolder style={style.flatListShimmer} />
			</View>
		);
	};

	const renderItemSeparator = () => {
		return <BSpacer size="middleSmall" />;
	};
	const renderFlatListFooter = () => {
		if (!isLoading) {
			return null;
		} else {
			return null;
		}
		// harusnya nambah state baru buat loading untuk get more list
		// return renderLoading();
	};
	const renderEmptyComponent = () => {
		if (isLoading) {
			return renderLoading();
		} else {
			return BEmptyState({
				emptyText: `${searchQuery} tidak ditemukan!`,
				isError: isError,
				errorMessage: errorMessage,
				onAction: onAction,
			});
		}
	};
	return (
		<View style={style.container}>
			<KeyboardAwareFlatList
				contentContainerStyle={style.flatlistContent}
				onEndReached={onEndReached}
				onEndReachedThreshold={0.1}
				// maintainVisibleContentPosition
				ItemSeparatorComponent={renderItemSeparator}
				refreshing={refreshing}
				data={flatListDatas}
				keyExtractor={(_, index) => index.toString()}
				renderItem={({ item }) => {
					return renderItem(item);
				}}
				ListFooterComponent={() => renderFlatListFooter()}
				ListEmptyComponent={() => renderEmptyComponent()}
			/>
		</View>
	);
}

const style = StyleSheet.create({
	container: {
		flex: 1,
	},
	flatlistContent: {
		marginTop: layout.pad.lg,
	},
	flatListLoading: {
		marginTop: layout.pad.lg,
		justifyContent: 'center',
		alignItems: 'center',
	},
	flatListShimmer: {
		width: resScale(330),
		height: resScale(60),
		borderRadius: resScale(8),
	},
});
