if ["$APPCENTER_BRANCH" != "master" && "$APPCENTER_BRANCH" != "development" && "$APPCENTER_BRANCH" != "hotfix"]; then
    cd android && ./gradlew app:bundleDevelopmentRelease
else
    cd android && ./gradlew app:bundleDevelopmentRelease && ./gradlew app:bundleProductionRelease
fi