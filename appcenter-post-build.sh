if ["$APPCENTER_BRANCH" != "master" && "$APPCENTER_BRANCH" != "development" && "$APPCENTER_BRANCH" != "hotfix"]; then
    cd android && ./gradlew app:assembleDevelopmentRelease
else
    cd android && ./gradlew app:assembleDevelopmentRelease && ./gradlew app:assembleProductionRelease
fi
