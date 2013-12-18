/// <reference path="connection.ts" />
/// <reference path="motor.ts" />
/// <reference path="sensor.ts" />
/// <reference path="command.ts" />
var Nxt;
(function (Nxt) {
    var Brick = (function () {
        function Brick() {
            //Enums
            //Fields
            this._connection = null;
            this._connection = new Nxt.BluetoothConnection();
        }
        Object.defineProperty(Brick.prototype, "portA", {
            get: function () {
                return this._portA;
            },
            set: function (portA) {
                this._portA = portA;
                portA._connection = this._connection;
                portA._port = 0;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Brick.prototype, "portB", {
            get: function () {
                return this._portB;
            },
            set: function (portB) {
                this._portB = portB;
                portB._connection = this._connection;
                portB._port = 1;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Brick.prototype, "portC", {
            get: function () {
                return this._portC;
            },
            set: function (portC) {
                this._portC = portC;
                portC._connection = this._connection;
                portC._port = 2;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Brick.prototype, "portABC", {
            get: function () {
                return this._portABC;
            },
            set: function (portABC) {
                this._portABC = portABC;
                portABC._connection = this._connection;
                portABC._port = 0xFF;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Brick.prototype, "port1", {
            get: function () {
                return this._port1;
            },
            set: function (port1) {
                this._port1 = port1;
                port1._connection = this._connection;
                port1._port = 0;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Brick.prototype, "port2", {
            get: function () {
                return this._port2;
            },
            set: function (port2) {
                this._port2 = port2;
                port2._connection = this._connection;
                port2._port = 1;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Brick.prototype, "port3", {
            get: function () {
                return this._port3;
            },
            set: function (port3) {
                this._port3 = port3;
                port3._connection = this._connection;
                port3._port = 2;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Brick.prototype, "port4", {
            get: function () {
                return this._port4;
            },
            set: function (port4) {
                this._port4 = port4;
                port4._connection = this._connection;
                port4._port = 3;
            },
            enumerable: true,
            configurable: true
        });

        Brick.prototype.connect = function (macAddress, success, failure) {
            var me = this;

            this._connection.connect(macAddress, success, function (error) {
                me._connected = false;
                failure(error);
            });
            this._connected = true;
        };

        Brick.prototype.disconnect = function (success, failure) {
            if (this.isConnected()) {
                this._connection.disconnect(success, failure);
                this._connected = false;
            }
        };

        Brick.prototype.isConnected = function () {
            return this._connected;
        };

        Brick.prototype.beep = function (frequency, duration) {
            if (typeof frequency === "undefined") { frequency = 523; }
            if (typeof duration === "undefined") { duration = 500; }
            //TODO: Implement frequency and duration (last 4 indices)
            var cmd = new Nxt.Command([0x06, 0x00, Nxt.Command.Types.Direct, 0x03, 0x0B, 0x02, 0xF4, 0x01]);

            this._connection.writeBinary(cmd.toArrayBuffer(), function () {
            }, function (error) {
                alert(error);
            });
        };
        return Brick;
    })();
    Nxt.Brick = Brick;
})(Nxt || (Nxt = {}));
//# sourceMappingURL=brick.js.map
