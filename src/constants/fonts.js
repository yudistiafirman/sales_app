import respFS from "@/utils/respFS";

const font = {
    family: {
        montserrat: {
            300: 'montserrat_light',
            400: 'montserrat_regular',
            500: 'montserrat_medium',
            600: 'montserrat_semibold',
            700: 'montserrat_bold',
            800: 'montserrat_extrabold',
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
