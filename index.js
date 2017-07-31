
function parse(sigfoxFrame){
  return new SensitMsg(sigfoxFrame)

  //this.getValues();
};

var SensitMsg = function(sigfoxFrame){
  this.frame = Number(parseInt(sigfoxFrame, 16));
  this.frameStr = sigfoxFrame;

  this.getBinary();

  this.getBytes();
  this.getMode();
  this.getBattery();

  this.getValues();
};


SensitMsg.prototype.getBinary = function(){
  this.binary = this.frame.toString(2);
};
SensitMsg.prototype.getBytes = function(){
  this.bytes = [];
  this.frameStr.match(/[0-f]{1,2}/g).forEach(function (byte){
    this.bytes.push(parseInt(byte, 16));
  }.bind(this));
};
SensitMsg.prototype.getMode = function(){
  //Mode : bits 1 to 3
  var mode = this.bytes[0] & 0b111;
  //frame type: bits 6 & 7
  var frameType = (this.bytes[0] >> 5 ) & 0b11;

  switch (mode){
      case 0: this.mode='Button';
        break;
      case 1: this.mode='Temperature';
        break;
      case 2: this.mode='Light';
        break;
      case 3: this.mode='Door';
        break;
      case 4: this.mode='Move';
        break;
      case 5: this.mode='Reed switch';
        break;
      default: this.mode='Unknown mode {'+mode+'}';
  }

  switch (frameType){
      case 0: this.frameType = "Classic";
        break;
      case 1: this.frameType = "Button";
        break;
      case 2: this.frameType = "Alert";
        break;
      case 3: this.frameType = "New Mode";
        break;
      default: this.frameType = "Unknown {"+frameType+"}";
  }
};
SensitMsg.prototype.getBattery = function(){
  //MSB : first byte's first bit
  var MSB = this.bytes[0] >> 7;
  //LSB : second byte's trailing 4 bits
  var LSB = this.bytes[1] & 0b1111;

  //console.log("Battery", MSB, LSB, (MSB*16)+LSB);

  this.battery =(((MSB*16)+LSB) * 2.7) / 20;



};
SensitMsg.prototype.getValues = function(){
  this.getTemperatureLowPrecision();

  switch(this.mode){
      case 'Temperature':
        if (this.frameType !== 'Alert'){
          this.getHumidity();
        }
        this.getTemperature();

        break;
      case 'Light':
        this.getLight();
      default:
        console.warn("No getValues() method implemented for %s mode", this.mode);
  }
};
SensitMsg.prototype.getTemperatureLowPrecision = function(){
  //Last 4 bits of byte 2
  var temp = this.bytes[1] & 0b1111;

  this.temperatureLP = (temp * 64 -200)/10;

};
SensitMsg.prototype.getTemperature = function(){
  //MSB : First 4 bits of byte 2
  var MSB = Number(this.bytes[1] >> 4).toString(2);
  console.log('temp MSB %s - %s', MSB,parseInt(MSB,2));

  //LSB : 6 last bits of byte 3
  var LSB = Number(this.bytes[2] & 0b111111, 2).toString(2);
  while (LSB.length < 6){
    LSB = '0'+LSB;
  }
  console.log('temp LSB %s - %s', LSB, parseInt(LSB,2));
  console.log('temperature', MSB+LSB, parseInt(MSB+LSB, 2));

  this.temperature = (parseInt(MSB+LSB,2)-200) / 8;


};

SensitMsg.prototype.getHumidity = function(){
  this.humidity = this.bytes[3] / 2;
};

SensitMsg.prototype.getLight = function(){
  console.log("Get Light", this.bytes[2], new Number(this.bytes[2]).toString(16),new Number(this.bytes[2]).toString(2));
  //Value	 b0-5
  //Multiplier b6 - b7
  var lightValue = this.bytes[2] & 0b111111;
  console.log("value", lightValue);
  var lightMultiplier = this.getLightMultiplier();
  console.log('x factor', lightMultiplier);
  this.light = 0.01 * lightMultiplier * lightValue;
};
SensitMsg.prototype.getLightMultiplier = function(){
  /*
  Multiplier value	Final multiplier
  0	1
  1	8
  2	64
  3	2014
  */
  var multiplier = this.bytes[2] >> 6;
console.log("multiplier", multiplier);

  switch (multiplier){
      case 0 : return 1;
      case 1 : return 8;
      case 2 : return 64;
      default: return 2014;
  }
};
module.exports = {
  parse: parse
};
