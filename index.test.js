const sensit = require('./index.js');

test('parse temperature + humidity mode - blank dummy data', () => {
  // 0 00 00 001
  expect(sensit.parse('01')).toEqual({
    battery: null,
    humidity: null,
    mode: 1,
    modeText: 'Temperature + Humidity',
    timeframe: 0,
    timeframeText: '10 mins',
    tempCLowPrecision: null,
    tempC: null,
    tempFLowPrecision: 32,
    tempF: 32,
    reedSwitchState: null,
    type: 0,
    typeText: "Regular, no alert",
  });
});

test('parse temperature + humidity mode - minimum temp data', () => {
  // 0 00 00 001
  expect(sensit.parse('010000')).toEqual({
    battery: 2.7,
    humidity: null,
    mode: 1,
    modeText: 'Temperature + Humidity',
    timeframe: 0,
    timeframeText: '10 mins',
    tempCLowPrecision: -25,
    tempC: -25,
    tempFLowPrecision: -13,
    tempF: -13,
    reedSwitchState: 0,
    type: 0,
    typeText: "Regular, no alert",
  });
});

test('parse temperature + humidity mode - bug regression 1', () => {
  // 0 00 00 001
  expect(sensit.parse('e96d2234')).toEqual({
    battery: 4.15,
    humidity: 26.0,
    mode: 1,
    modeText: 'Temperature + Humidity',
    timeframe: 1,
    timeframeText: '1 hour',
    tempCLowPrecision: 23,
    tempC: 27.25,
    tempFLowPrecision: 73.4,
    tempF: 81.05000000000001,
    reedSwitchState: 0,
    type: 3,
    typeText: "New mode",
  });
});

test('parse example 1', () => {
  expect(sensit.parse('E9671854')).toEqual({
    mode: 1,
    modeText: 'Temperature + Humidity',
    timeframe: 1,
    timeframeText: '1 hour',
    type: 3,
    typeText: 'New mode',
    battery: 3.85,
    tempCLowPrecision: 23,
    tempFLowPrecision: 73.4,
    reedSwitchState: 0,
    humidity: 42,
    tempC: 26,
    tempF: 78.80000000000001,
  });
});

test('parse example 2', () => {
  expect(sensit.parse('C2646418')).toEqual({
    mode: 2,
    modeText: 'Light',
    timeframe: 0,
    timeframeText: '10 mins',
    type: 2,
    typeText: 'Alert',
    battery: 3.7,
    tempCLowPrecision: 23,
    tempFLowPrecision: 73.4,
    lux: 2.88,
    numAlerts: 24,
  });
});

test('parse light mode - blank dummy data', () => {
  // 0 01 10 010
  expect(sensit.parse('32')).toEqual({
    battery: null,
    lux: 0,
    mode: 2,
    modeText: "Light",
    numAlerts: null,
    tempCLowPrecision: null,
    tempFLowPrecision: 32,
    timeframe: 2,
    timeframeText: "6 hours",
    type: 1,
    typeText: "Button call",
  });
});

test('parse light mode - real data 1', () => {
  expect(sensit.parse('e26e9200')).toEqual({
    mode: 2,
    modeText: 'Light',
    timeframe: 0,
    timeframeText: '10 mins',
    type: 3,
    typeText: 'New mode',
    battery: 4.2,
    tempCLowPrecision: 23,
    tempFLowPrecision: 73.4,
    lux: 11.52,
    numAlerts: 0,
  });
});

test('parse light mode - real data 2', () => {
  expect(sensit.parse('c26e4c01')).toEqual({
    mode: 2,
    modeText: 'Light',
    timeframe: 0,
    timeframeText: '10 mins',
    type: 2,
    typeText: 'Alert',
    battery: 4.2,
    tempCLowPrecision: 23,
    tempFLowPrecision: 73.4,
    lux: 0.96,
    numAlerts: 1,
  });
});

test('parse door mode - blank dummy data', () => {
  // 0 00 11 011
  expect(sensit.parse('1b')).toEqual({
    battery: null,
    mode: 3,
    modeText: "Door",
    numAlerts: null,
    tempCLowPrecision: null,
    tempFLowPrecision: 32,
    timeframe: 3,
    timeframeText: "24 hours",
    type: 0,
    typeText: "Regular, no alert",
  });
});

test('parse move mode - real data 1', () => {
  expect(sensit.parse('c46d2902')).toEqual({
    mode: 4,
    modeText: 'Move',
    timeframe: 0,
    timeframeText: '10 mins',
    type: 2,
    typeText: 'Alert',
    battery: 4.15,
    tempCLowPrecision: 23,
    tempC: 28.125,
    tempFLowPrecision: 73.4,
    tempF: 82.625,
    reedSwitchState: 0,
    numAlerts: 2,
  });
});

test('parse reed switch mode - real data 1', () => {
  expect(sensit.parse('e56d2e00')).toEqual({
    mode: 5,
    modeText: 'Reed switch',
    timeframe: 0,
    timeframeText: '10 mins',
    type: 3,
    typeText: 'New mode',
    battery: 4.15,
    tempCLowPrecision: 23,
    tempC: 28.75,
    tempFLowPrecision: 73.4,
    tempF: 83.75,
    reedSwitchState: 0,
    numAlerts: 0,
  });
});

test('parse reed switch mode - real data 2', () => {
  expect(sensit.parse('c56d6f01')).toEqual({
    mode: 5,
    modeText: 'Reed switch',
    timeframe: 0,
    timeframeText: '10 mins',
    type: 2,
    typeText: 'Alert',
    battery: 4.15,
    tempCLowPrecision: 23,
    tempC: 28.875,
    tempFLowPrecision: 73.4,
    tempF: 83.975,
    reedSwitchState: 1,
    numAlerts: 1,
  });
});

test('parse button mode - blank dummy data', () => {
  // 0 00 00 000
  expect(sensit.parse('00')).toEqual({
    battery: null,
    majorVersion: null,
    minorVersion: null,
    mode: 0,
    modeText: 'Button',
    timeframe: 0,
    timeframeText: '10 mins',
    tempCLowPrecision: null,
    tempC: null,
    tempFLowPrecision: 32,
    tempF: 32,
    reedSwitchState: null,
    type: 0,
    typeText: "Regular, no alert",
  });
});

test('parse button mode - real data 1', () => {
  expect(sensit.parse('e06d3024')).toEqual({
    mode: 0,
    modeText: 'Button',
    timeframe: 0,
    timeframeText: '10 mins',
    type: 3,
    typeText: 'New mode',
    battery: 4.15,
    tempCLowPrecision: 23,
    tempC: 29,
    tempFLowPrecision: 73.4,
    tempF: 84.2,
    reedSwitchState: 0,
    majorVersion: 2,
    minorVersion: 4,
  });
});

test('parse invalid blank data', () => {
  expect(sensit.parse('')).toEqual({
    battery: null,
    mode: null,
    modeText: "Unknown",
    tempCLowPrecision: null,
    tempFLowPrecision: 32,
    timeframe: null,
    timeframeText: "Unknown",
    type: null,
    typeText: "Unknown",
  });
});
