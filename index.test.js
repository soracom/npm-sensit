const sensit = require('./index.js');

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
    tempC: 24.125,
    tempFLowPrecision: 73.4,
    tempF: 75.42500000000001,
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
    tempC: 24.75,
    tempFLowPrecision: 73.4,
    tempF: 76.55000000000001,
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
    tempC: 24.875,
    tempFLowPrecision: 73.4,
    tempF: 76.775,
    reedSwitchState: 1,
    numAlerts: 1,
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
    tempC: 25,
    tempFLowPrecision: 73.4,
    tempF: 77,
    reedSwitchState: 0,
    majorVersion: 2,
    minorVersion: 4,
  });
});