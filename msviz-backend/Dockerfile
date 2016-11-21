# Pull java base image
FROM java:8

MAINTAINER Roman Mylonas <roman.mylonas@sib.swiss>

# the scala and sbt versions used
ENV SCALA_VERSION 2.11.6
ENV SBT_VERSION 0.13.11

ENV APP_NAME msviz-backend
ENV APP_PORT 9000
ENV APP_DIR msviz-backend-1.0-SNAPSHOT

# Install Scala
## Piping curl directly in tar
RUN \
  curl -fsL http://downloads.typesafe.com/scala/$SCALA_VERSION/scala-$SCALA_VERSION.tgz | tar xfz - -C /root/ && \
  echo >> /root/.bashrc && \
  echo 'export PATH=~/scala-$SCALA_VERSION/bin:$PATH' >> /root/.bashrc

# Install sbt
RUN \
  curl -L -o sbt-$SBT_VERSION.deb http://dl.bintray.com/sbt/debian/sbt-$SBT_VERSION.deb && \
  dpkg -i sbt-$SBT_VERSION.deb && \
  rm sbt-$SBT_VERSION.deb && \
  apt-get update && \
  apt-get install sbt && \
  sbt sbtVersion


# Copy and extract MsViz backend
COPY msviz-backend-1.0-SNAPSHOT.zip .
RUN unzip msviz-backend-1.0-SNAPSHOT.zip && \
	rm msviz-backend-1.0-SNAPSHOT.zip


# Copy the configuration and startup file
COPY msviz-backend.conf .
COPY startup_play.sh .

EXPOSE $APP_PORT

# * * * Run the Play application * * *
CMD ./startup_play.sh $APP_DIR $APP_NAME $APP_PORT

