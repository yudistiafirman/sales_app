if ["$APPCENTER_ANDROID_VARIANT" == "production" || "$APPCENTER_ANDROID_VARIANT" == "productionRelease"]; then
    echo MAJOR_VERSION=$MAJOR_VERSION >> .env.production
    echo MINOR_VERSION=$MINOR_VERSION >> .env.production
    echo PATCH_VERSION=$PATCH_VERSION >> .env.production
    echo CODE_PUSH_KEY=$CODE_PUSH_KEY >> .env.production
    echo GOOGLE_MAPS_API_KEY=$GOOGLE_MAPS_API_KEY >> .env.production
    echo API_URL_COMMON=$API_URL_COMMON >> .env.production
    echo API_URL_INV=$API_URL_INV >> .env.production
    echo API_URL_PRODUCTIVITY=$API_URL_PRODUCTIVITY >> .env.production
    echo API_URL_ORDER=$API_URL_ORDER >> .env.production
else
    echo MAJOR_VERSION=$MAJOR_VERSION >> .env
    echo MINOR_VERSION=$MINOR_VERSION >> .env
    echo PATCH_VERSION=$PATCH_VERSION >> .env
    echo CODE_PUSH_KEY=$CODE_PUSH_KEY >> .env
    echo GOOGLE_MAPS_API_KEY=$GOOGLE_MAPS_API_KEY >> .env
    echo API_URL_COMMON=$API_URL_COMMON >> .env
    echo API_URL_INV=$API_URL_INV >> .env
    echo API_URL_PRODUCTIVITY=$API_URL_PRODUCTIVITY >> .env
    echo API_URL_ORDER=$API_URL_ORDER >> .env
fi