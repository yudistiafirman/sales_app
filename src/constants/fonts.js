import respFS from "@/utils/respFS";

const font = {
    family: {
        montserrat: {
            300: 'Montserrat-Light',
            400: 'Montserrat-Regular',
            500: 'Montserrat-Medium',
            600: 'Montserrat-SemiBold',
            700: 'Montserrat-Bold',
            800: 'Montserrat-ExtraBold'
        }
    },
    size: {
        xs: respFS(10),
        sm: respFS(12),
        md: respFS(14),
        lg: respFS(16),
        xl: respFS(18),
    },
};

export default font;
