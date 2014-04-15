


angular.module('legoNxtRemoteApp').service("robotModel", ["$rootScope", function($rootScope) {

    var LOG_ID = "legoNxtRemoteApp ";
    var nxt = window.Nxt;

    this.mac = "00:16:53:13:A3:3A";
    this.brick = new nxt.Brick();

    this.driveL = new nxt.Motor();
    this.driveR = new nxt.Motor();
    this.cameraLift = new nxt.Motor();

    this.sonarFront = new nxt.SonarSensor();
    this.sonarFront.name = "Front";

    this.sonarBack = new nxt.SonarSensor();
    this.sonarBack.name = "Back";

    this.compass = new nxt.CompassSensor();
    this.compass.name = "Heading";

    this.touch = new nxt.TouchSensor();
    this.touch.name = "Pressed";


    this.brick.portA = this.driveL;
    this.brick.portB = this.cameraLift;
    this.brick.portC = this.driveR;
    this.brick.port1 = this.sonarFront;
    this.brick.port2 = this.touch;
    this.brick.port3 = this.sonarBack;
    this.brick.port4 = this.compass;

    this.isConnected = false;
    this.voiceListener = null;
    this.tiltListener = null;
    this.collisionDistance = 20;

    this.toggleConnect = function() {

        var done = function() {
            $rootScope.$apply();
        };

        if(!this.isConnected)
        {
            this.connect(done);
        }
        else {
            this.disconnect(done);
        }
    }

    this.connect = function(done) {
        var me = this;

        var success = function() {
            me.isConnected = true;
            me.startSensorUpdate();
            done();
        }

        var fail = function(error) {
            me.isConnected = false;
            done();
        };

        this.brick.connect(this.mac, success, fail);
    }

    this.disconnect = function(done) {
        var me = this;

        me.stopSensorUpdate();

        var success = function() {
            me.isConnected = false;
            done();
        }

        var fail = function(error) {
            me.isConnected = false;
            done();
        };

        this.brick.disconnect(success, fail);
    }

    //TODO: Regulation flips out when you turn - figure out why?

    this.forward = function (power) {

        var left = {
            power: power,
            //mode: nxt.Motor.Modes.Regulated,
            //regulation: nxt.Motor.Regulation.Sync
            mode: nxt.Motor.Modes.On,
            regulation: nxt.Motor.Regulation.None
        };
        var right = {
            power: power,
            //mode: nxt.Motor.Modes.Regulated,
            //regulation: nxt.Motor.Regulation.Sync
            mode: nxt.Motor.Modes.On,
            regulation: nxt.Motor.Regulation.None
        };

        this.move(left, right);
    }

    this.backward = function (power) {

        var left = {
            power: -1 * power,
            //mode: nxt.Motor.Modes.Regulated,
            //regulation: nxt.Motor.Regulation.Sync
            mode: nxt.Motor.Modes.On,
            regulation: nxt.Motor.Regulation.None
        };
        var right = {
            power: -1 * power,
            //mode: nxt.Motor.Modes.Regulated,
            //regulation: nxt.Motor.Regulation.Sync
            mode: nxt.Motor.Modes.On,
            regulation: nxt.Motor.Regulation.None
        };

        this.move(left, right);
    }

    this.move = function (left, right) {
        if(!this.checkConnection()) { return; }

        this.driveL.power = left.power;
        this.driveL.mode = left.mode;
        this.driveL.regulation = left.regulation;
        //this.driveL.turnRatio = left.turnRatio || 0;

        this.driveR.power = right.power;
        this.driveR.mode = right.mode;
        this.driveR.regulation = right.regulation;
        //this.driveR.turnRatio = right.turnRatio || 0;

        this.driveL.write(false);
        this.driveR.write(false);

    }

    this.left = function(power) {
        var me = this;

        var left = {
            power: -1 * power,
            mode: nxt.Motor.Modes.On,
            regulation: nxt.Motor.Regulation.None
        };
        var right = {
            power: power,
            mode: nxt.Motor.Modes.On,
            regulation: nxt.Motor.Regulation.None
        };
        this.move(left, right);
    }

    this.right = function(power) {
        var me = this;

        var left = {
            power: power,
            mode: nxt.Motor.Modes.On,
            regulation: nxt.Motor.Regulation.None
        };
        var right = {
            power: -1 * power,
            mode: nxt.Motor.Modes.On,
            regulation: nxt.Motor.Regulation.None
        };

        this.move(left, right);
    }

    this.stop = function() {

        var left = {
            power: 0,
            mode: nxt.Motor.Modes.Break,
            regulation: nxt.Motor.Regulation.Speed
        };
        var right = {
            power: 0,
            mode: nxt.Motor.Modes.Break,
            regulation: nxt.Motor.Regulation.Speed
        };

        this.move(left, right);
    }


    this.toggleVoice = function () {

        if(this.voiceListener) {

            this.voiceListener.stopped = true;
            this.voiceListener.stop();
            this.voiceListener = null;
        }
        else {
            this.voiceListener = this.voiceCreate();
        }
    }

    this.voiceCreate = function() {

        var me = this;
        var recognition = new SpeechRecognition();
        recognition.onresult = function(event) {

            //NOTE: This is not the most performant way to do this, but IMO the cost is worth it for maintainability (these result sets are small).

            if(me.voiceMatch("go", event)) {
                me.forward(75);
            }
            else if(me.voiceMatch("back", event)) {
                me.backward(75);
            }
            else if(me.voiceMatch("right", event)) {
                me.right(75);
            }
            else if(me.voiceMatch("left", event)) {
                me.left(75);
            }
            else if(me.voiceMatch("stop", event)) {
                me.stop();
            }
            else if(me.voiceMatch("beep", event)) {
                me.beep();
            }

            if(!recognition.stopped) {
                recognition.start();
            }
        };
        recognition.onerror = function() {

            if(!recognition.stopped) {
                recognition.start();
            }
        };

        recognition.start();

        return recognition;
    }

    this.voiceMatch = function(match, event) {

        var me = this;

        console.log(LOG_ID + "Voice matching " + JSON.stringify(event));

        //TODO: Research why this plugin returns such a complex structure.  Is it necessary?
        var result, alternative;
        var found = false;

        for(var i=0; i < event.results.length; i++) {
            result = event.results[i];
            for(var j=0; j < result.length; j++) {
                alternative = result[j];

                if(match == alternative.transcript) {
                    console.log(LOG_ID + "Recognized " + match);
                    found = true;
                    return found;
                }
            }
        }

        if(!found) {
            console.log(LOG_ID + "Unrecognized " + match + " in " + JSON.stringify(event));
        }
    }

    this.toggleTilt = function () {

        if(this.tiltListener) {
            navigator.accelerometer.clearWatch(this.tiltListener.watchId);
            this.tiltListener = null;
        }
        else {
            this.tiltListener = this.tiltCreate();
        }
    }

    this.tiltCreate = function() {

         var me = this;
         var lastReading = null;
         var sensitivity = 3;
         var threshold = 4;

         function success(reading) {

             console.log(JSON.stringify('Acceleration ' + JSON.stringify(reading)));

             //We don't want anything to happen until an actual change is recorded.
             if(lastReading == null) {
                 lastReading = reading;
             }

             var change = {
                 x: lastReading.x - reading.x,
                 y: lastReading.y - reading.y,
                 z: lastReading.z - reading.z
             };

             if(Math.abs(change.x) < threshold && Math.abs(change.y) < threshold && Math.abs(change.z) < threshold) {
                 //Not enough change.
                 return;
             }

             if(reading.x > sensitivity) {
                 me.left(75);
             }
             else if(reading.x < -1*sensitivity) {
                 me.right(75);
             }
             else if(reading.y > sensitivity) {
                 me.backward(100);
             }
             else if(reading.y < -1*sensitivity) {
                 me.forward(100);
             }
             else {
                 me.stop();
             }

             lastReading = reading;
         };

         function fail() {
            console.log(JSON.stringify(error));
         };

         var options = { frequency: 500 };
         var watchId = navigator.accelerometer.watchAcceleration(success, fail, options);

         return { watchId:  watchId };
    }

    this.beep = function(power) {
        if(!this.checkConnection()) { return; }

        this.brick.playTone();
    }

    this.sing = function() {
        var me = this;

        if(!this.checkConnection()) { return; }

        //Mary had a Little Lamb converted from ruby https://github.com/zuk/ruby-nxt

        var song = [
            //E  D C   D E   E  E
            { frequency: 659, duration: 500, delay: 500   },
            { frequency: 587, duration: 500, delay: 500   },
            { frequency: 523, duration: 500, delay: 500   },
            { frequency: 587, duration: 500, delay: 500   },
            { frequency: 659, duration: 500, delay: 500   },
            { frequency: 659, duration: 500, delay: 500   },
            { frequency: 659, duration: 500, delay: 500*2 },
            //D  D   D     E   G  G
            { frequency: 587, duration: 500, delay: 500   },
            { frequency: 587, duration: 500, delay: 500   },
            { frequency: 587, duration: 500, delay: 500*2 },
            { frequency: 659, duration: 500, delay: 500   },
            { frequency: 784, duration: 500, delay: 500   },
            { frequency: 784, duration: 500, delay: 500*2 },
            //E  D C   D E   E  E
            { frequency: 659, duration: 500, delay: 500   },
            { frequency: 587, duration: 500, delay: 500   },
            { frequency: 523, duration: 500, delay: 500   },
            { frequency: 587, duration: 500, delay: 500   },
            { frequency: 659, duration: 500, delay: 500   },
            { frequency: 659, duration: 500, delay: 500   },
            { frequency: 659, duration: 500, delay: 500   },
            //E    D      D   E     D  C
            { frequency: 659, duration: 500, delay: 500   },
            { frequency: 587, duration: 500, delay: 500   },
            { frequency: 587, duration: 500, delay: 500   },
            { frequency: 659, duration: 500, delay: 500   },
            { frequency: 587, duration: 500, delay: 500   },
            { frequency: 523, duration: 750, delay: 500*3 }

        ];


        var delay = 0;
        for(var i=0; i < song.length; i++) {

            _.delay(function(note) {
                me.brick.playTone(note.frequency, note.duration);
            }, delay, song[i]);

            delay += song[i].delay;
        }
       
    }

    /*
    NOTE: This example was dropped in favor of tilt control.

    //The robot will turn as the phone turns.
    this.mimic = function() {

        var me = this;

        var lastHeading = 0;

        function success(heading) {

            var h = Math.round( heading.magneticHeading );
            if(Math.abs(lastHeading - h) > 20) {
                console.log(JSON.stringify(heading));


                me.turnToHeading( h, function() {

                },
                function(error) {

                });
            }
            lastHeading = h;
        };

        function fail(error) {
            console.log(JSON.stringify(error));
        };

        var options = {
            //filter: 10
            frequency: 2000
        }; // Update every 3 seconds

        var watchID = navigator.compass.watchHeading(success, fail, options);
    }

    this.turnToHeading = function(heading, success, fail) {

        var me = this;
        var threshold = 10;
        var retry = 0;
        var state = {left: false, right: false, cancel: false};

        var _fail = function(error) {
            me.stop();

            if(retry < 3) {
                turnUntil(state);
                retry++;
            }
            else {
                fail(error);
            }
        };

        me.stop();

        var turnUntil = function(state) {

            me.compass.read(nxt.CompassSensor.Registers.Degree, function(reading) {

                    if(state.cancel) { return; }

                    var diff = heading - reading.degrees;

                    //$rootScope.$apply();
                    console.log("Compass: " + JSON.stringify({ diff: diff, goal: heading, current: reading.degrees}));

                    if(Math.abs(diff) <= threshold) {
                        me.stop();
                        success();
                        console.log("Compass: stopping");
                    }
                    else {

                        //NOTE: This is not complete.

                         //if (diff > 180) {
                         //   diff -= 360;
                         //}

                         //if (diff < -180) {
                         //   diff += 360;
                         //}

                        if(diff < 0) {
                            if(!state.left) {
                                me.left(70);
                                state.left = true;
                            }
                            console.log("Compass: left");
                        }
                        else {
                            if(!state.right) {
                                me.right(70);
                                state.right = true;
                            }
                            console.log("Compass: right");
                        }

                        turnUntil(state);
                    }
                },
                _fail);

        };

        if(me.turnToHeadingState != null) {
            //Cancel any pending call.  Only one of them should ever be running.
            me.turnToHeadingState.cancel = true;
        }

        turnUntil(state);

        me.turnToHeadingState = state;
    }
    */

    this.startSensorUpdate = function() {
        var me = this;

        me.pollSensor = true;
        me.readSensors();
    }

    this.stopSensorUpdate = function() {
        var me = this;

        me.pollSensor = false;
    }

    this.readSensors = function() {
        var me = this;

        //NOTE: This is a strange setup.  Basically we want to always attempt to update every sensor on each poll.  If we fail we proceed to the next.
        //At the end of the chain we update the UI.

        var successTouch = function() {

            $rootScope.$apply();

            if(me.pollSensor) {
                me.readSensors();
            }
        };

        var successCompass = function(reading) {
            me.touch.read(null, successTouch, successTouch);
        };

        var successSonarBack = function(reading) {

            /*
             if(reading.distance <= me.collisionDistance) {
             me.stop();
             }
             */

            me.compass.read(nxt.CompassSensor.Registers.Degree, successCompass, successCompass);
        };

        var successSonarFront = function(reading) {

            /*
            if(reading.distance <= me.collisionDistance) {
                me.stop();
            }
            */

            me.sonarBack.read(nxt.SonarSensor.Registers.Result1, successSonarBack, successSonarBack);
        };

        me.sonarFront.read(nxt.SonarSensor.Registers.Result1, successSonarFront, successSonarFront);
    }

    this.cameraUp = function() {
        //if(!this.checkConnection()) { return; }

        alert("Not Implemented");
    }

    this.cameraDown = function() {
        //if(!this.checkConnection()) { return; }

        alert("Not Implemented");
    }

    this.checkConnection = function() {
        var connected = true;
        if(!this.isConnected) {
            alert("Robot no longer connected.");
            connected = false;
        }
        return connected;
    }
}]);
