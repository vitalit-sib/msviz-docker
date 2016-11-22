#! /bin/bash

#############################################
# startup the MsViz backend
#############################################

# General settings
APP_NAME=$2
APP_PORT=$3
APP_DIR=$1
MEM_SIZE=$4
TMP_DIR=/tmp/msviz

# create the temporary directory for MsViz
mkdir $TMP_DIR

# remove the PID file if it exists
if [ -f $APP_DIR/RUNNING_PID ]
	then 
		rm $APP_DIR/RUNNING_PID
fi

# start the play application
./$APP_DIR/bin/$APP_NAME -Dhttp.port=$APP_PORT -J-Xmx${MEM_SIZE}  -Djava.io.tmpdir=$TMP_DIR -Dconfig.file=msviz-backend.conf -DapplyEvolutions.default=true -DapplyDownEvolutions.default=true
