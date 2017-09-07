/*
 * Sens'it uplink frame formats:
 * Ref. https://github.com/sigfox/BCX17-resources/blob/master/Sensit-uplink-frames.md
 * 
 * Common
 * 
 * Byte Offset \     bit 7   |   bit 6   |   bit 5   |   bit 4   |   bit 3   |   bit 2   |   bit 1   |   bit 0   |
 *   0         | Battery MSB | Type                  | Timeframe             | Mode                              |
 *   1         | Temperature MSB                                     | Battery LSB                               |
 * 
 * Mode
 *   0: Button
 *   1: Temperature + Humidity
 *   2: Light
 *   3: Door
 *   4: Move
 *   5: Reed switch
 * 
 * Timeframe
 *   0: 10 mins
 *   1: 1 hour
 *   2: 6 hours
 *   3: 24 hours
 *
 * Type
 *   0: Regular, no alert
 *   1: Button call
 *   2: Alert
 *   3: New mode
 *
 * Battery
 *   Use the following formula to get the value in V (between 2.7 & 4.25V)
 *     ((({battery MSB} * 16) + {battery LSB}) + 54 / 20)
 *
 * Temperature (MSB)
 *   Sent along each frame (not only in temp mode)
 *     Value in °C : ({temperature MSB} * 6.4) - 20
 *     Value in °F : ((({temperature MSB} * 6.4) - 20) * 1.8) - 30
 * 
 * 
 * Button mode:
 * 
 * Byte Offset \     bit 7   |       bit 6       |   bit 5   |   bit 4   |   bit 3   |   bit 2   |   bit 1   |   bit 0   |
 *   2         | Unused      | Reed switch state | Tempeerature LSB                                                      |
 *   3         | Major version                                           | Minor version                                 |
 * 
 * 
 * Temperature + Humidity mode:
 * 
 * Byte Offset \     bit 7   |       bit 6       |   bit 5   |   bit 4   |   bit 3   |   bit 2   |   bit 1   |   bit 0   |
 *   2         | Unused      | Reed switch state | Tempeerature LSB                                                      |
 *   3         | Humidity (%) = value * 0.5                                                                              |
 * 
 * 
 * Light mode:
 * 
 * Byte Offset \     bit 7   |   bit 6   |   bit 5   |   bit 4   |   bit 3   |   bit 2   |   bit 1   |   bit 0   |
 *   2         | Multiplier              | Value                                                                 |
 *   3         | Number of alerts                                                                                |
 * 
 * 
 * Door mode:
 * 
 * Byte Offset \     bit 7   |   bit 6   |   bit 5   |   bit 4   |   bit 3   |   bit 2   |   bit 1   |   bit 0   |
 *   2         | Unused (reserved for configuration values)                                                      |
 *   3         | Number of alerts                                                                                |
 * 
 * 
 * Move mode:
 * 
 * Byte Offset \     bit 7   |       bit 6       |   bit 5   |   bit 4   |   bit 3   |   bit 2   |   bit 1   |   bit 0   |
 *   2         | Unused      | Reed switch state | Tempeerature LSB                                                      |
 *   3         | Number of alerts                                                                                        |
 * 
 */

(function() {

  function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
  }

  function getMode(bytes) {
    if (bytes.length < 1) {
      return null;
    }
    return bytes[0] & 0x07;
  }

  function getModeText(modeValue) {
    switch (modeValue) {
      case 0:
        return 'Button';
      case 1:
        return 'Temperature + Humidity';
      case 2:
        return 'Light';
      case 3:
        return 'Door';
      case 4:
        return 'Move';
      case 5:
        return 'Reed switch';
      default:
        return 'Unknown';
    }
  }

  function getTimeframe(bytes) {
    if (bytes.length < 1) {
      return null;
    }
    return (bytes[0] & 0x18) >> 3;
  }

  function getTimeframeText(timeframeValue) {
    switch (timeframeValue) {
      case 0:
        return '10 mins';
      case 1:
        return '1 hour';
      case 2:
        return '6 hours';
      case 3:
        return '24 hours';
      default:
        return 'Unknown';
    }
  }

  function getType(bytes) {
    if (bytes.length < 1) {
      return null;
    }
    return (bytes[0] & 0x60) >> 5;
  }

  function getTypeText(typeValue) {
    switch (typeValue) {
      case 0:
        return 'Regular, no alert';
      case 1:
        return 'Button call';
      case 2:
        return 'Alert';
      case 3:
        return 'New mode';
      default:
        return 'Unknown';
    }
  }

  function getBattery(bytes) {
    if (bytes.length < 2) {
      return null;
    }

    var bMSB = (bytes[0] & 0x80) >> 7;
    //var bLSB = (bytes[1] & 0xF0) >> 4;
    var bLSB = bytes[1] & 0xF;

    return (((bMSB * 16) + bLSB) + 54) / 20.0;
  }

  function getTempMSB(bytes) {
    if (bytes.length < 2) {
      return null;
    }

    //return bytes[1] & 0x0F;
    return (bytes[1] & 0xf0) >> 4;
  }

  function getTempLSB(bytes) {
    if (bytes.length < 3) {
      return null;
    }

    return bytes[2] & 0x1F;
  }

  function getTempC(msb, lsb) {
    if (msb == null || lsb == null) {
      return null;
    }
    return (((msb * 64) + lsb) - 200) / 8.0;
  }

  function getTempF(msb, lsb) {
    return (getTempC(msb, lsb) * 1.8) + 32;
  }

  function getHighPrecisionTemperatures(bytes, obj) {
    var tempMSB = getTempMSB(bytes);
    var tempLSB = getTempLSB(bytes);
    obj.tempC = getTempC(tempMSB, tempLSB);
    obj.tempF = getTempF(tempMSB, tempLSB);
  }

  function getHumidity(bytes) {
    if (bytes.length < 4) {
      return null;
    }
    return bytes[3] * 0.5;
  }

  function getReedSwitchState(bytes) {
    if (bytes.length < 3) {
      return null;
    }
    return (bytes[2] & 0x40) >> 6;
  }

  function getLightMultiplier(bytes) {
    if (bytes.length < 3) {
      return null;
    }
    switch ((bytes[2] & 0xc0) >> 6) {
      case 0:
        return 1;
      case 1:
        return 8;
      case 2:
        return 64;
      case 3:
        return 2048;
      default:
        return -1;
    }
  }

  function getLightValue(bytes) {
    if (bytes.length < 3) {
      return null;
    }
    return bytes[2] & 0x3f;
  }

  function getMajorVersion(bytes) {
    if (bytes.length < 3) {
      return null;
    }
    return (bytes[3] & 0xf0) >> 4;
  }

  function getMinorVersion(bytes) {
    if (bytes.length < 3) {
      return null;
    }
    return bytes[3] & 0x0f;
  }

  function getNumberOfAlerts(bytes) {
    if (bytes.length < 4) {
      return null;
    }
    return bytes[3];
  }

  function parseButtonMode(bytes, obj) {
    getHighPrecisionTemperatures(bytes, obj);
    obj.reedSwitchState = getReedSwitchState(bytes)
    obj.majorVersion = getMajorVersion(bytes);
    obj.minorVersion = getMinorVersion(bytes);
    return obj;
  }

  function parseTemperatureMode(bytes, obj) {
    getHighPrecisionTemperatures(bytes, obj);
    obj.reedSwitchState = getReedSwitchState(bytes)
    obj.humidity = getHumidity(bytes);
    return obj;
  }

  function parseLightMode(bytes, obj) {
    var mul = getLightMultiplier(bytes);
    var val = getLightValue(bytes);
    obj.lux = (mul * val * 0.01);
    obj.numAlerts = getNumberOfAlerts(bytes);
    return obj;
  }

  function parseDoorMode(bytes, obj) {
    obj.numAlerts = getNumberOfAlerts(bytes);
    return obj;
  }

  function parseMoveMode(bytes, obj) {
    getHighPrecisionTemperatures(bytes, obj);
    obj.reedSwitchState = getReedSwitchState(bytes)
    obj.numAlerts = getNumberOfAlerts(bytes);
    return obj;
  }

  function parseReedSwitchMode(bytes, obj) {
    getHighPrecisionTemperatures(bytes, obj);
    obj.reedSwitchState = getReedSwitchState(bytes)
    obj.numAlerts = getNumberOfAlerts(bytes);
    return obj;
  }

  function parse(sigfoxFrame) {
    var bytes = hexToBytes(sigfoxFrame);

    // common values
    var mode = getMode(bytes);
    var timeframe = getTimeframe(bytes);
    var type = getType(bytes);
    var battery = getBattery(bytes);
    var tempMSB = getTempMSB(bytes);

    var obj = {
      mode: mode,
      modeText: getModeText(mode),
      timeframe: timeframe,
      timeframeText: getTimeframeText(timeframe),
      type: type,
      typeText: getTypeText(type),
      battery: battery,
      tempCLowPrecision: getTempC(tempMSB, 0),
      tempFLowPrecision: getTempF(tempMSB, 0),
    };

    switch (mode) {
      case 0: // Button mode
        return parseButtonMode(bytes, obj);
      case 1: // Temperature + Humidity mode
        return parseTemperatureMode(bytes, obj);
      case 2: // Light mode
        return parseLightMode(bytes, obj);
      case 3: // Door mode
        return parseDoorMode(bytes, obj);
      case 4: // Move mode
        return parseMoveMode(bytes, obj);
      case 5: // Reed switch mode
        return parseReedSwitchMode(bytes, obj);
      default:
        return obj;
    }
  }

  module.exports = {
    parse: parse
  }
})();