[![Build Status](https://travis-ci.com/husman/pixieapp.svg?token=Uq8zx2AzWVDiE7M68dWB&branch=master)](https://travis-ci.com/husman/pixieapp)

## Pre-req
Please install Node v10.13.x

## Setup
To setup the application and install all of it's dependencies, execute the following command:
```
yarn
```

## Starting the development environment
To start the development environment, execute the following command:
```
yarn dev
```

## Starting multiple instances of the application on development
To start multiple instances of the application, you will need to set the port to a value other than "8000". For example,
```
export PORT=9000
yarn dev
```

## Running all tests
To run all tests, execute the following command:
```
yarn test-all
```

## Unit tests
To run unit tests, execute the following command:
```
yarn test
```

## End-to-end tests
To run end-to-end tests, execute the following command:
```
yarn test-e2e
```

## License
Copyright © 2018-present Neetos LLC. All rights reserved.


## Enable web sockets logging/debug mode
To enable verbose logging for web sockets. Open the developer's console and execute
```js
localStorage.debug = '*';
```
