if [ "$AGENT_JOBSTATUS" == "Succeeded" ]; then
    if ["$APPCENTER_BRANCH" == "master"]; then
        cd android && ./gradlew app:bundleProductionRelease
    else
        cd android && ./gradlew app:bundleDevelopmentRelease
    fi
fi