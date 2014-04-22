lego-nxt-remote
===============

Lego NXT remote using Phonegap, Angular, and Typescript.

The primary purpose of this project is to help teach children how to program.  The javascript API allows easier access to robot programming without getting very low level.  The firmware of the Lego NXT brick does not need to be changed to use the API.

To setup the project run the following commands:

```bash
git clone git://github.com/mronemous/lego-nxt-remote.git && cd lego-nxt-remote
npm install
bower install
grunt create:cordova
```

Import the android project (/build/cordova/platforms/android) with your favorite IDE.

To run the local file watches and also start a local webserver.

```bash
grunt serve
```

TODO: grunt build currently only handles web code.  Ideally it would allow release / debug configurations to create platform artifacts.


API Documentation
===============


Create a Brick
<pre>
var mac = "XX:XX:XX:XX:XX:XX"; //Mac of your brick.
var brick = new Nxt.Brick();


var driveL = new Nxt.Motor();
var driveR = new Nxt.Motor();
var cameraLift = new Nxt.Motor();

var sonarFront = new Nxt.SonarSensor();
sonarFront.name = "Front";

var sonarBack = new Nxt.SonarSensor();
sonarBack.name = "Back";

var compass = new Nxt.CompassSensor();
compass.name = "Heading";

var touch = new Nxt.TouchSensor();
touch.name = "Pressed";

brick.portA = driveL;
brick.portB = cameraLift;
brick.portC = driveR;
brick.port1 = sonarFront;
brick.port2 = touch;
brick.port3 = sonarBack;
brick.port4 = compass;
</pre>

Connect to Brick
<pre>
brick.connect(mac, function() {
  //connected
},
function(){
  //error connecting
});
</pre>

Disconnect from Brick
<pre>
brick.disconnect(mac, function() {
  //disconnected
},
function(){
  //error disconnecting
});
</pre>

Write to a Motor
<pre>
driveL.power = 100;
driveL.mode = Nxt.Motor.Modes.On;
driveL.regulation = Nxt.Motor.Regulation.None;
driveL.write(false);
</pre>

Read a Sensor
<pre>
compass.read(Nxt.CompassSensor.Registers.Degree, function(reading) {
  //Reading obtained by sensor.
},
function() {
  //Failed to get a reading from the sensor.
});
</pre>

Play tone
<pre>
brick.playTone(frequency, duration);
</pre>




