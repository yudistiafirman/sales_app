if ["$APPCENTER_BRANCH" == "master"]; then
    cd android && ./gradlew app:assembleProductionRelease
else
    cd android && ./gradlew app:assembleDevelopmentRelease
fi