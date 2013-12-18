/// <reference path="brick.ts" />
/// <reference path="connection.ts" />
/// <reference path="command.ts" />
var Nxt;
(function (Nxt) {
    var Motor = (function () {
        function Motor() {
            this.mode = Motor.Modes.On;
            this.power = 0;
            this.regulation = Motor.Regulation.None;
            this.turnRatio = 0;
            this.runState = Motor.RunStates.Running;
            this.tachoLimit = 0;
        }
        //TODO: Implement reply
        //Write new state to motor.
        Motor.prototype.write = function (reply) {
            //TODO: Implement tacho-limit currently set to 0 (last 4 indices)
            var cmd = new Nxt.Command([0x0C, 0x00, Nxt.Command.Types.Direct, 0x04, this._port, this.power, this.mode, this.regulation, this.turnRatio, this.runState, 0, 0, 0, 0]);
            this._connection.writeBinary(cmd.toArrayBuffer(), function () {
            }, function (error) {
                alert(error);
            });
        };
        Motor.Modes = { Coast: 0x00, On: 0x01, Break: 0x03, Regulated: 0x05 };
        Motor.Regulation = { None: 0x00, Speed: 0x01, Sync: 0x02 };
        Motor.RunStates = { Idle: 0x00, RampUp: 0x10, Running: 0x20, RampDown: 0x40 };
        return Motor;
    })();
    Nxt.Motor = Motor;
})(Nxt || (Nxt = {}));
//# sourceMappingURL=motor.js.map
