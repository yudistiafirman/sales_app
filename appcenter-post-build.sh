#!/bin/bash

if ["$APPCENTER_ANDROID_VARIANT" == "productionRelease"]; then
    cd android && ./gradlew app:bundleProductionRelease
else
    cd android && ./gradlew app:bundleDevelopmentRelease
fi