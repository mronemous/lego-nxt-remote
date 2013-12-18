angular.module('legoNxtRemoteApp').service("robotModel", [function() {

    var nxt = window.Nxt;

    this.mac = "00:16:53:13:A3:3A";
    this.brick = new nxt.Brick();

    this.driveL = new nxt.Motor();
    this.driveR = new nxt.Motor();
    this.cameraLift = new nxt.Motor();

    this.brick.portA = this.driveL;
    this.brick.portB = this.cameraLift;
    this.brick.portC = this.driveR;
    this.isConnected = false;

    this.connect = function(done) {
        var me = this;

        var success = function() {
            me.isConnected = true;
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

    this.beep = function(power) {
        if(!this.checkConnection()) { return; }

        this.brick.beep();
    }

    this.dance = function() {

        alert("Not Implemented");
    }

    this.mimic = function() {

        alert("Not Implemented");
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
