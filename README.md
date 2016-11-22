# MsViz Docker

This project contains the docker-compose settings for the full MsViz installation (backend, frontend and db). This is a straightforward way to make MsViz run on any OS (Windows, MacOS or Linux).

## Installation

### Install Docker

#### *Linux, MacOS or Windows 10*

To run this project you have to install [Docker](https://www.docker.com) on your computer. You can find installers for the different OS (Windows, MacOS, Linux) [here](https://docs.docker.com/engine/installation/).

**Increase memory**: 
In order to make MsViz work correctly you have to increase it's available memory to at least 4 GB. You can change the available memory from the *Docker Preferences* under the section *General*. To make MsViz run smoother you are also advised to increase the number of CPUs to at least 2.

#### *Windows 8 or older*

In case you are using a Windows older then version 10, you have to install the latest [Docker Toolbox](https://github.com/docker/toolbox/releases/latest).

**Increase memory**: 
When using the Docker Toolbox you have to increase the memory to 4GB manually by typing the following commands from the *Docker Quickstart Terminal*. This command also allocates 2 CPUs, which is not strictly necessary but increases the performance:

```
docker-machine rm default
docker-machine create -d virtualbox --virtualbox-memory 4096 --virtualbox-cpu-count 2 default
```

### Download the MsViz docker image

You can either download this project as a zip file or clone it using git:

#### *ZIP file*
Download and extract the ZIP file:

<https://github.com/vitalit-sib/msviz-docker/archive/master.zip>

#### *Clone from GitHub*
Type the following command:

```
git clone git@github.com:vitalit-sib/msviz-docker.git
```

### Start the MsViz image

Open the *Docker Terminal* and navigate to the extracted Msviz Docker image using the [*cd* command](https://en.wikipedia.org/wiki/Cd_(command)):

```
cd folder/to/msviz-docker-master
```

Install and start the MsViz application:

```
docker-compose up -d
```

### Open MsViz in your browser

For Windows machines use <http://192.168.99.100:9001>.

For all other platforms use <http://localhost:9001>.

### Update MsViz

1. Download and extract the [latest version](https://github.com/vitalit-sib/msviz-docker/archive/master.zip) from GitHub.
2. Navigate to the extracted folder:

	```
	cd folder/to/msviz-docker-master
	```
3. Stop and remove the old image:

	```
	docker-compose stop
	docker-compose rm
	```
4. Build and start the new image:

	```
	docker-compose build
	docker-compose up -d
	```







