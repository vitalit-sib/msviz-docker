#! /bin/bash

#############################################
# startup the MsViz backend
#############################################

# General settings
APP_NAME=$2
APP_PORT=$3
APP_DIR=$1
MEM_SIZE=3500
TMP_DIR=tmp

# remove the PID file if it exists
if [ -f $APP_DIR/RUNNING_PID ]
	then 
		rm $APP_DIR/RUNNING_PID
fi

# start the play application
./$APP_DIR/bin/$APP_NAME -Dhttp.port=$APP_PORT -J-Xmx${MEM_SIZE}m  -Djava.io.tmpdir=$TMP_DIR -Dconfig.file=msviz-backend.conf -DapplyEvolutions.default=true -DapplyDownEvolutions.default=true
