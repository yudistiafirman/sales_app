module.exports = {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [
        [
            require.resolve("babel-plugin-module-resolver"),
            {
                root: ["./src"],
                extensions: [
                    ".ios.js",
                    ".android.js",
                    ".js",
                    ".ts",
                    ".tsx",
                    ".json"
                ],
                alias: {
                    "@": "./src"
                }
            }
        ],
        "react-native-reanimated/plugin" // Reanimated plugin has to be listed last.
    ],
    env: {
        production: {
            plugins: ["react-native-paper/babel", "transform-remove-console"]
        }
    }
};
