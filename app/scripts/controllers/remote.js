'use strict';

angular.module('legoNxtRemoteApp')
  .controller('RemoteCtrl', function ($scope, songService) {

        $scope.robot = new NxtRemote.Robot();

        $scope.toggleConnect = function() {

            var done = function() {
                $scope.$apply();
            };

            if(!this.isConnected)
            {
                $scope.robot.connect(done);
                $scope.startSensorUpdate();
            }
            else {
                $scope.robot.disconnect(done);
                $scope.stopSensorUpdate();
            }
        }

        $scope.startSensorUpdate = function() {

            $scope.pollSensor = true;

            var done = function() {

                $scope.$apply();

                if($scope.pollSensor) {
                    $scope.robot.readSensors(done);
                }
            };

            $scope.robot.readSensors(done);
        }

        $scope.stopSensorUpdate = function() {

            $scope.pollSensor = false;
        }

        $scope.toggleVoice = function () {
            var me = $scope;

            if(me.voiceListener) {

                me.voiceListener.stopped = true;
                me.voiceListener.stop();
                me.voiceListener = null;
            }
            else {
                me.voiceListener = me.voiceCreate();
            }
        }

        $scope.voiceCreate = function() {

            var me = $scope;
            var robot = me.robot;

            var recognition = new SpeechRecognition();
            recognition.onresult = function(event) {

                //NOTE: This is not the most performant way to do this, but IMO the cost is worth it for maintainability (these result sets are small).

                if(me.voiceMatch("go", event)) {
                    robot.forward(75);
                }
                else if(me.voiceMatch("back", event)) {
                    robot.backward(75);
                }
                else if(me.voiceMatch("right", event)) {
                    robot.right(75);
                }
                else if(me.voiceMatch("left", event)) {
                    robot.left(75);
                }
                else if(me.voiceMatch("stop", event)) {
                    robot.stop();
                }
                else if(me.voiceMatch("beep", event)) {
                    robot.beep();
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

        $scope.voiceMatch = function(match, event) {

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

        $scope.toggleTilt = function () {

            var me = $scope;

            if(me.tiltListener) {
                navigator.accelerometer.clearWatch(me.tiltListener.watchId);
                me.tiltListener = null;
            }
            else {
                me.tiltListener = this.tiltCreate();
            }
        }

        $scope.tiltCreate = function() {

            var robot = $scope.robot;

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
                    robot.left(75);
                }
                else if(reading.x < -1*sensitivity) {
                    robot.right(75);
                }
                else if(reading.y > sensitivity) {
                    robot.backward(100);
                }
                else if(reading.y < -1*sensitivity) {
                    robot.forward(100);
                }
                else {
                    robot.stop();
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

        $scope.sing = function() {

            var song = songService.getSong('Mary had a little lamb');
            $scope.robot.sing(song);
        }
 });
