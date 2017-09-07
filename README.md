# Sigfox Sensit

Very simple npm module to parse messages sent by a [Sensit](http://sensit.io) device

## Install

```
$ npm install --save sensit-sigfox
```

## Use

```
const SensitMsg = require('./index.js');
var testFrame = "a06e1119";
var msg = SensitMsg.parse(testFrame);
```

### Output

The `parse(hexFrame)` will gives back an object with the following attributes : `mode`, `frameType`, as well as mode-specific attributes (`battery`, `temperature`, ...)

## ⚠️  Work in progress

* Need to publish the Sensit frames documentation here
* All modes are not properly parsed yet


### Test

```
npm test
````
