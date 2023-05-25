#!/bin/bash

cd ${APPCENTER_SOURCE_DIRECTORY}

if ["$APPCENTER_ANDROID_VARIANT" == "productionRelease"]; then
    echo JAVA_HOME=$JAVA_HOME > .env.production
    echo CODE_PUSH_KEY=$CODE_PUSH_KEY >> .env.production
    echo GOOGLE_MAPS_API_KEY=$GOOGLE_MAPS_API_KEY >> .env.production
    echo API_URL_COMMON=$API_URL_COMMON >> .env.production
    echo API_URL_INV=$API_URL_INV >> .env.production
    echo API_URL_PRODUCTIVITY=$API_URL_PRODUCTIVITY >> .env.production
    echo API_URL_ORDER=$API_URL_ORDER >> .env.production
    echo API_URL_FINANCE=$API_URL_FINANCE >> .env.production
    cat .env.production
else
    echo JAVA_HOME=$JAVA_HOME > .env
    echo CODE_PUSH_KEY=$CODE_PUSH_KEY >> .env
    echo GOOGLE_MAPS_API_KEY=$GOOGLE_MAPS_API_KEY >> .env
    echo API_URL_COMMON=$API_URL_COMMON >> .env
    echo API_URL_INV=$API_URL_INV >> .env
    echo API_URL_PRODUCTIVITY=$API_URL_PRODUCTIVITY >> .env
    echo API_URL_ORDER=$API_URL_ORDER >> .env
    echo API_URL_FINANCE=$API_URL_FINANCE >> .env
    cat .env
fi