#!/usr/bin/env bash
# Creates an .env from ENV variables for use with react-native-config
if [ $ENVIRONMENT_VARIABLE = "prod" ]; then
   cp .env.production .env
else
   cp .env .env
fi

printf "\n.env created with contents:\n"
cat .env