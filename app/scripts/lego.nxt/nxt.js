var Nxt;
(function (Nxt) {
    var MockConnection = (function () {
        function MockConnection() {
        }
        MockConnection.prototype.connect = function (macAddress, success, error) {
            setTimeout(success, 1000);
        };
        MockConnection.prototype.disconnect = function (success, error) {
            success();
        };
        MockConnection.prototype.write = function (data, success, error) {
            alert(data);
        };
        MockConnection.prototype.writeBinary = function (data, success, error) {
            alert(data);
        };
        MockConnection.prototype.read = function (success, error) {
        };
        return MockConnection;
    })();
    Nxt.MockConnection = MockConnection;

    var BluetoothConnection = (function () {
        function BluetoothConnection() {
            if (window.bluetoothSerial == null) {
                window.bluetoothSerial = new MockConnection();
            }
        }
        BluetoothConnection.prototype.connect = function (macAddress, success, error) {
            window.bluetoothSerial.connect(macAddress, success, error);
        };
        BluetoothConnection.prototype.disconnect = function (success, error) {
            window.bluetoothSerial.disconnect(success, error);
        };
        BluetoothConnection.prototype.write = function (data, success, error) {
            window.bluetoothSerial.write(data, success, error);
        };
        BluetoothConnection.prototype.writeBinary = function (data, success, error) {
            window.bluetoothSerial.writeBinary(data, success, error);
        };
        BluetoothConnection.prototype.read = function (success, error) {
            window.bluetoothSerial.read(success, error);
        };
        return BluetoothConnection;
    })();
    Nxt.BluetoothConnection = BluetoothConnection;
})(Nxt || (Nxt = {}));
var Nxt;
(function (Nxt) {
    var Command = (function () {
        function Command(values) {
            this._bytes = [];
            this.append(values);
        }
        Command.prototype.append = function (values) {
            this._bytes = this._bytes.concat(values);
        };

        Command.prototype.toArrayBuffer = function () {
            console.log("NXT " + this._bytes.toString());

            return new Uint8Array(this._bytes).buffer;
        };
        Command.Types = { DirectReply: 0x00, SystemReply: 0x01, Direct: 0x80, System: 0x81 };
        return Command;
    })();
    Nxt.Command = Command;
})(Nxt || (Nxt = {}));
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
        Motor.prototype.write = function (reply) {
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
var Nxt;
(function (Nxt) {
    var Sensor = (function () {
        function Sensor() {
        }
        Sensor.prototype.read = function () {
        };
        return Sensor;
    })();
    Nxt.Sensor = Sensor;
})(Nxt || (Nxt = {}));
var Nxt;
(function (Nxt) {
    var Brick = (function () {
        function Brick() {
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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Nxt;
(function (Nxt) {
    var SonarSensor = (function (_super) {
        __extends(SonarSensor, _super);
        function SonarSensor() {
            _super.apply(this, arguments);
        }
        return SonarSensor;
    })(Nxt.Sensor);
    Nxt.SonarSensor = SonarSensor;
})(Nxt || (Nxt = {}));
//# sourceMappingURL=nxt.js.map
