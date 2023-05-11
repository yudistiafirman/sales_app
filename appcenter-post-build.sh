#!/bin/bash

if ["$APPCENTER_ANDROID_VARIANT" == "productionRelease"]; then
    cd android && ./gradlew app:bundleProductionRelease
else
    cd android && ./gradlew app:bundleDevelopmentRelease
fi

# Update your ORG name and APP name
ORG=BRIK-ID
APP=BRIK

if ["$APPCENTER_ANDROID_VARIANT" == "productionRelease"]; then
    ORG=BRIK-ID
    APP=BRIK-1
fi

# This is to get the Build Details so we could pass it as part of the Email Body
build_url=https://appcenter.ms/orgs/$ORG/apps/$APP/build/branches/$APPCENTER_BRANCH/builds/$APPCENTER_BUILD_ID
# Address to send email
TO_ADDRESS="tech@brik.id"
# A sample Subject Title 
SUBJECT="AppCenter Build"
# Content of the Email on Build-Success.
SUCCESS_BODY="Success! Your build completed successfully!\n\n"
# Content of the Email on Build-Failure.
FAILURE_BODY="Sorry! Your AppCenter Build failed. Please review the logs and try again.\n\n"
#If Agent Job Build Status is successful, Send the email, if not send a failure email.
if [ "$AGENT_JOBSTATUS" == "Succeeded" ];
then
	echo "Build Success!"
	echo -e ${SUCCESS_BODY} ${build_url} | mail -s "${SUBJECT} - Success!" ${TO_ADDRESS}
	echo "success mail sent"
else
	echo "Build Failed!"
	echo -e ${FAILURE_BODY} ${build_url} | mail -s "${SUBJECT} - Failed!" ${TO_ADDRESS}
	echo "failure mail sent"
fi