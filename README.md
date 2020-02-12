# Controlling FarmBot Remotely

FarmBot has a [remote procedure call (RPC) system](https://developer.farm.bot/docs/high-level-overview) that allows developers to read and write to their device remotely over MQTT. This makes it possible to create custom farming applications that are specific to your needs and completely separate from the official FarmBot app.

This repository shows a simple app that moves a FarmBot's Z-axis up and down every three seconds. It handles all the low level details such as initializing NPM and setting up a docker container to host the app. Although the use case is simple, it is a great starting point for more serious applications.

# Why Run Code Remotely?

When discussing third-party applications, [Farmware](https://software.farm.bot/docs/farmware) is often brought up as a possible solution for remote control of a device. Farmware is a special python script that runs on a FarmBot OS device. It is used by developers to customize their device's behavior, but it does come with some drawbacks:

 * The API can change between major FBOS releases, meaning that a Farmware that worked on FBOS v8 might not work on FBOS v9.
 * The only supported language is Python3
 * Farmwares have full control over a FarmBot system, which can lead to erratic device behavior, occasionally leading developers to think their device is malfunctioning.

We [discourage the use of Farmware except in unavoidable situations](https://developer.farm.bot/docs/you-might-not-need-farmware) and instead recommend that third party developers control their device from remote machines.

By running your code off the device you:
 * Are less likely to hit compatibility issues (the RPC system used by FarmBot is the same one used every day by the FarmBot Web App).
 * Can write applications in any language you choose.
 * Can store data on your own servers, avoiding all [account limits](https://software.farm.bot/v7/docs/account-limitations).

# Step 0: Clone the Tutorial

```
git clone https://github.com/FarmBot-Labs/remote-control-example.git
cd remote-control-example
```

# Step 1: Install Docker Compose

The example application is written using NodeJS. To avoid inconsistencies between developer setups, we use a [Docker Compose](https://www.zdnet.com/article/what-is-docker-and-why-is-it-so-darn-popular/) container image to virtualize the application environment.

The instructions below will work on Ubuntu-based machines.

For other systems, see the [official Docker Compose website](https://docs.docker.com/compose/install/).

```
# Remove old (possibly broke) docker versions
sudo apt-get remove docker docker-engine docker.io

# Install docker
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common --yes
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu xenial stable" --yes
sudo apt-get update --yes
sudo apt-get install docker-ce --yes
sudo docker run hello-world # Should run!
# Install docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

# Step 2: Install Dependencies

Now that Docker is running, we need to install the project dependencies via NPM- the Node Package Manager.

```
sudo docker-compose run farmbot_example npm install
```

You should see a `node_modules/` directory populated with dependencies after running the command.

# Start the Server

```
sudo docker-compose up
```

# Stop the Server

```
sudo docker-compose down
```

# Next Steps

This is a very basic tutorial. The next best step for a serious developer is to read the [official software developer documentation](https://developer.farm.bot/docs) from start to finish. The material was designed to be read in order and coontains all of the major concepts required to understand how FarmBot works from the perspective of a software developer.

We're here to help. If anything still does not make sense, please raise an issue or reach out to us on the [FarmBot forum](https://forum.farmbot.org).
