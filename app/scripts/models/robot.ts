/// <reference path="../../libs/lego-nxt/build/lego-nxt.d.ts" />

//TODO: Figure out how to get IntelliJ to correctly handle intellisense.

module NxtRemote {

    declare var _; //TODO: Resolve this with .d.ts

    export class Robot {

        //Enums

        //Fields
        mac:string;
        brick:Nxt.Brick;
        driveL:Nxt.Motor;
        driveR:Nxt.Motor;
        cameraLift:Nxt.Motor;
        sonarFront:Nxt.SonarSensor;
        sonarBack:Nxt.SonarSensor;
        compass:Nxt.CompassSensor;
        touch:Nxt.TouchSensor;
        isConnected:boolean = false;
        collisionDistance:number = 20;

        constructor() {
            this.mac = "00:16:53:13:A3:3A";
            this.brick = new Nxt.Brick();

            this.driveL = new Nxt.Motor();
            this.driveR = new Nxt.Motor();
            this.cameraLift = new Nxt.Motor();

            this.sonarFront = new Nxt.SonarSensor();
            this.sonarFront.name = "Front";

            this.sonarBack = new Nxt.SonarSensor();
            this.sonarBack.name = "Back";

            this.compass = new Nxt.CompassSensor();
            this.compass.name = "Heading";

            this.touch = new Nxt.TouchSensor();
            this.touch.name = "Pressed";


            this.brick.portA = this.driveL;
            this.brick.portB = this.cameraLift;
            this.brick.portC = this.driveR;
            this.brick.port1 = this.sonarFront;
            this.brick.port2 = this.touch;
            this.brick.port3 = this.sonarBack;
            this.brick.port4 = this.compass;
        }

        connect(done) {

            var success = () => {
                this.isConnected = true;
                done();
            };

            var fail = (error) => {
                this.isConnected = false;
                done();
            };

            this.brick.connect(this.mac, success, fail);
        }

        disconnect(done) {

            var success = () => {
                this.isConnected = false;
                done();
            }

            var fail = (error) => {
                this.isConnected = false;
                done();
            };

            this.brick.disconnect(success, fail);
        }

        checkConnection() {
            var connected = true;
            if (!this.isConnected) {
                alert("Robot no longer connected.");
                connected = false;
            }
            return connected;
        }

        //TODO: Regulation flips out when you turn - figure out why?

        forward(power) {

            var left = {
                power: power,
                //mode: Nxt.Motor.Modes.Regulated,
                //regulation: Nxt.Motor.Regulation.Sync
                mode: Nxt.Motor.Modes.On,
                regulation: Nxt.Motor.Regulation.None
            };
            var right = {
                power: power,
                //mode: Nxt.Motor.Modes.Regulated,
                //regulation: Nxt.Motor.Regulation.Sync
                mode: Nxt.Motor.Modes.On,
                regulation: Nxt.Motor.Regulation.None
            };

            this.move(left, right);
        }

        backward(power) {

            var left = {
                power: -1 * power,
                //mode: nxt.Motor.Modes.Regulated,
                //regulation: nxt.Motor.Regulation.Sync
                mode: Nxt.Motor.Modes.On,
                regulation: Nxt.Motor.Regulation.None
            };
            var right = {
                power: -1 * power,
                //mode: nxt.Motor.Modes.Regulated,
                //regulation: nxt.Motor.Regulation.Sync
                mode: Nxt.Motor.Modes.On,
                regulation: Nxt.Motor.Regulation.None
            };

            this.move(left, right);
        }

        move(left, right) {

            if (!this.checkConnection()) {
                return;
            }

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

        left(power) {

            var left = {
                power: -1 * power,
                mode: Nxt.Motor.Modes.On,
                regulation: Nxt.Motor.Regulation.None
            };
            var right = {
                power: power,
                mode: Nxt.Motor.Modes.On,
                regulation: Nxt.Motor.Regulation.None
            };
            this.move(left, right);
        }

        right(power) {

            var left = {
                power: power,
                mode: Nxt.Motor.Modes.On,
                regulation: Nxt.Motor.Regulation.None
            };
            var right = {
                power: -1 * power,
                mode: Nxt.Motor.Modes.On,
                regulation: Nxt.Motor.Regulation.None
            };

            this.move(left, right);
        }

        stop() {

            var left = {
                power: 0,
                mode: Nxt.Motor.Modes.Break,
                regulation: Nxt.Motor.Regulation.Speed
            };
            var right = {
                power: 0,
                mode: Nxt.Motor.Modes.Break,
                regulation: Nxt.Motor.Regulation.Speed
            };

            this.move(left, right);
        }

        readSensors(done) {

            //NOTE: This is a strange setup.  Basically we want to always attempt to update every sensor on each poll.  If we fail we proceed to the next.

            var successCompass = (reading) => {
                this.touch.read(null, done, done);
            };

            var successSonarBack = (reading) => {

                /*
                 if(reading.distance <= me.collisionDistance) {
                 this.stop();
                 }
                 */

                this.compass.read(Nxt.CompassSensor.Registers.Degree, successCompass, successCompass);
            };

            var successSonarFront = (reading) => {

                /*
                 if(reading.distance <= me.collisionDistance) {
                 this.stop();
                 }
                 */

                this.sonarBack.read(Nxt.SonarSensor.Registers.Result1, successSonarBack, successSonarBack);
            };

            this.sonarFront.read(Nxt.SonarSensor.Registers.Result1, successSonarFront, successSonarFront);
        }

        beep() {
            if (!this.checkConnection()) {
                return;
            }

            this.brick.playTone();
        }

        sing(song) {

            if (!this.checkConnection()) {
                return;
            }

            var delay = 0;
            for (var i = 0; i < song.length; i++) {

                _.delay((note) => {
                    this.brick.playTone(note.frequency, note.duration);
                }, delay, song[i]);

                delay += song[i].delay;
            }

        }

        cameraUp() {

            alert("Not Implemented");
        }

        cameraDown() {

            alert("Not Implemented");
        }

    }
}