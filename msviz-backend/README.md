# Docker image for the MsViz backend

### install the image
docker build -t vitalit-sib/msviz:v0.1 

### run the image
docker run -d --name msviz-backend -p 9000:9000 vitalit-sib/msviz:v0.1

### look at the log
docker logs msviz-backend