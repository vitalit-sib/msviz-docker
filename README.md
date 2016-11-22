# MsViz Docker

This project contains the docker-compose settings for the full MsViz installation (backend, frontend and db). This is a strait forward way to make MsViz run on any OS (Windows, MacOS or Linux).

## Installation

### Install Docker

#### *Linux, MacOS or Windows 10*

To run this project you have to install [Docker](https://www.docker.com) on your computer. You can find installers for the different OS (Windows, MacOS, Linux) [here](https://docs.docker.com/engine/installation/).

**Increase memory**: 
In order to make MsViz work correctly you have to increase it's available memory to at least 4 GB. You can change the available memory from the Docker *Preferences* under the section *General*

#### *Windows 8 or older*

In case you are using a Windows older then version 10, you have to install the lates [Docker Toolbox](https://github.com/docker/toolbox/releases/latest).

**Increase memory**: 
When using the Docker Toolbox you have to increase the memory manually by typing the following commands from the *Docker Quickstart Terminal*:

`docker-machine rm default`

`docker-machine create -d virtualbox --virtualbox-memory 4096 default`

### Download the MsViz docker image

You can either download this project as a zip file or you can clone it using git:

#### *ZIP file*
Download and extract the ZIP file:

[https://github.com/vitalit-sib/msviz-docker/archive/master.zip]

#### *Clone from GitHub*
Type the following command from command line:

`git clone git@github.com:vitalit-sib/msviz-docker.git`

### Start the MsViz image

Open the *Docker Terminal* and go into the folder where you extracted the docker image:

`cd folder/to/msviz-docker-master`

The following command installs and starts the MsViz application:

`docker-compose up -d`

### Open MsViz in your browser

for Windows machines open the following link:

<http://192.168.99.100:9001>

for all other platforms us this link:

<http://localhost:9001>

### Update MsViz


