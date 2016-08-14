# url-shorten
Shorten URL built with Hapi

Reference: https://codetuts.tech/build-a-url-shortener-node-hapi-js/


** How to install and manage mongo locally **

1. Download mongo
```
$ cd ~/Download
$ tar xzf mongodb-osx-x86_64-2.2.3.tgz
$ sudo mv mongodb-osx-x86_64-2.2.3 /usr/local/mongodb
```

2. Assign permission
```
$ sudo mkdir -p /data/db
$ whoami
kdao
$ sudo chown kdao /data/db
```

3. Create ~/.bash_profile
```
$ cd ~
$ pwd
/Users/kdao
$ touch .bash_profile
$ vim .bash_profile

export MONGO_PATH=/usr/local/mongodb
export PATH=$PATH:$MONGO_PATH/bin

##restart terminal

$ mongo -version
MongoDB shell version: 2.2.3
```

4. Restart mongo

```
$ mongod
```
