var Nxt;
(function (Nxt) {
    var Base64 = (function () {
        function Base64() {
        }
        Base64.decode = function (base64) {
            return Base64.base64DecToArr(base64, false);
        };

        Base64.b64ToUint6 = function (nChr) {
            return nChr > 64 && nChr < 91 ? nChr - 65 : nChr > 96 && nChr < 123 ? nChr - 71 : nChr > 47 && nChr < 58 ? nChr + 4 : nChr === 43 ? 62 : nChr === 47 ? 63 : 0;
        };

        Base64.base64DecToArr = function (sBase64, nBlocksSize) {
            var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length, nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2, taBytes = new Uint8Array(nOutLen);

            for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
                nMod4 = nInIdx & 3;
                nUint24 |= Base64.b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
                if (nMod4 === 3 || nInLen - nInIdx === 1) {
                    for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
                        taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
                    }
                    nUint24 = 0;
                }
            }

            return taBytes;
        };

        Base64.uint6ToB64 = function (nUint6) {
            return nUint6 < 26 ? nUint6 + 65 : nUint6 < 52 ? nUint6 + 71 : nUint6 < 62 ? nUint6 - 4 : nUint6 === 62 ? 43 : nUint6 === 63 ? 47 : 65;
        };

        Base64.base64EncArr = function (aBytes) {
            var nMod3 = 2, sB64Enc = "";

            for (var nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
                nMod3 = nIdx % 3;
                if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) {
                    sB64Enc += "\r\n";
                }
                nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
                if (nMod3 === 2 || aBytes.length - nIdx === 1) {
                    sB64Enc += String.fromCharCode(Base64.uint6ToB64(nUint24 >>> 18 & 63), Base64.uint6ToB64(nUint24 >>> 12 & 63), Base64.uint6ToB64(nUint24 >>> 6 & 63), Base64.uint6ToB64(nUint24 & 63));
                    nUint24 = 0;
                }
            }

            return sB64Enc.substr(0, sB64Enc.length - 2 + nMod3) + (nMod3 === 2 ? '' : nMod3 === 1 ? '=' : '==');
        };

        Base64.UTF8ArrToStr = function (aBytes) {
            var sView = "";

            for (var nPart, nLen = aBytes.length, nIdx = 0; nIdx < nLen; nIdx++) {
                nPart = aBytes[nIdx];
                sView += String.fromCharCode(nPart > 251 && nPart < 254 && nIdx + 5 < nLen ? (nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 247 && nPart < 252 && nIdx + 4 < nLen ? (nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 239 && nPart < 248 && nIdx + 3 < nLen ? (nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 223 && nPart < 240 && nIdx + 2 < nLen ? (nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 191 && nPart < 224 && nIdx + 1 < nLen ? (nPart - 192 << 6) + aBytes[++nIdx] - 128 : nPart);
            }

            return sView;
        };

        Base64.strToUTF8Arr = function (sDOMStr) {
            var aBytes, nChr, nStrLen = sDOMStr.length, nArrLen = 0;

            for (var nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) {
                nChr = sDOMStr.charCodeAt(nMapIdx);
                nArrLen += nChr < 0x80 ? 1 : nChr < 0x800 ? 2 : nChr < 0x10000 ? 3 : nChr < 0x200000 ? 4 : nChr < 0x4000000 ? 5 : 6;
            }

            aBytes = new Uint8Array(nArrLen);

            for (var nIdx = 0, nChrIdx = 0; nIdx < nArrLen; nChrIdx++) {
                nChr = sDOMStr.charCodeAt(nChrIdx);
                if (nChr < 128) {
                    aBytes[nIdx++] = nChr;
                } else if (nChr < 0x800) {
                    aBytes[nIdx++] = 192 + (nChr >>> 6);
                    aBytes[nIdx++] = 128 + (nChr & 63);
                } else if (nChr < 0x10000) {
                    aBytes[nIdx++] = 224 + (nChr >>> 12);
                    aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
                    aBytes[nIdx++] = 128 + (nChr & 63);
                } else if (nChr < 0x200000) {
                    aBytes[nIdx++] = 240 + (nChr >>> 18);
                    aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
                    aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
                    aBytes[nIdx++] = 128 + (nChr & 63);
                } else if (nChr < 0x4000000) {
                    aBytes[nIdx++] = 248 + (nChr >>> 24);
                    aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
                    aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
                    aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
                    aBytes[nIdx++] = 128 + (nChr & 63);
                } else {
                    aBytes[nIdx++] = 252 + (nChr / 1073741824);
                    aBytes[nIdx++] = 128 + (nChr >>> 24 & 63);
                    aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
                    aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
                    aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
                    aBytes[nIdx++] = 128 + (nChr & 63);
                }
            }

            return aBytes;
        };
        return Base64;
    })();
    Nxt.Base64 = Base64;
})(Nxt || (Nxt = {}));
var Nxt;
(function (Nxt) {
    var Command = (function () {
        function Command(values) {
            this._bytes = [];
            this.append(values);
        }
        Object.defineProperty(Command.prototype, "bytes", {
            get: function () {
                var length = this._bytes.length;
                var bytes = [length + 2];
                bytes[0] = length & 0xff;
                bytes[1] = (length >> 8) & 0xff;
                bytes = bytes.concat(this._bytes);

                return bytes;
            },
            enumerable: true,
            configurable: true
        });

        Command.prototype.append = function (values) {
            this._bytes = this._bytes.concat(values);
        };
        Command.Types = { DirectReply: 0x00, SystemReply: 0x01, Direct: 0x80, System: 0x81 };
        Command.DirectOps = {
            StartProgram: 0x00,
            StopProgram: 0x01,
            PlaySound: 0x02,
            PlayTone: 0x03,
            SetOutputState: 0x04,
            SetInputMode: 0x05,
            GetOutputState: 0x06,
            GetInputValues: 0x07,
            ResetInputScaledValue: 0x08,
            MessageWrite: 0x09,
            ResetMotorPosition: 0x0A,
            GetBatteryLevel: 0x0B,
            StopSound: 0x0C,
            KeepAlive: 0x0D,
            LsGetStatus: 0x0E,
            LsWrite: 0x0F,
            LsRead: 0x10,
            GetProgram: 0x11,
            MessageRead: 0x13
        };
        Command.SystemOps = {
            OpenRead: 0x80,
            OpenWrite: 0x81,
            ReadFile: 0x82,
            WriteFile: 0x83,
            CloseHandle: 0x84,
            DeleteFile: 0x85,
            FindFirst: 0x86,
            FindNext: 0x87,
            GetFirmwareVersion: 0x88,
            OpenWriteLinear: 0x89,
            OpenReadLinear: 0x8A,
            OpenWriteData: 0x8B,
            OpenAppendData: 0x8C,
            Boot: 0x97,
            SetBrickName: 0x98,
            GetDeviceInfo: 0x9B,
            DeleteUserFlash: 0xA0,
            PollCommandLength: 0xA1,
            PollCommand: 0xA2,
            BluetoothFactoryReset: 0xA4,
            RequestFirstModule: 0x90,
            RequestNextModule: 0x91,
            CloseModuleHandle: 0x92,
            ReadIoMap: 0x94,
            WriteIoMap: 0x95
        };

        Command.Errors = {
            0x20: "Pending communication transaction in progress",
            0x40: "Specified mailbox queue is empty",
            0xBD: "Request failed (i.e. specified file not found)",
            0xBE: "Unknown command opcode",
            0xBF: "Insane packet",
            0xC0: "Data contains out-of-range values",
            0xDD: "Communication bus error",
            0xDE: "No free memory in communication buffer",
            0xDF: "Specified channel/connection is not valid",
            0xE0: "Specified channel/connection not configured or busy",
            0xEC: "No active program",
            0xED: "Illegal size specified",
            0xEE: "Illegal mailbox queue ID specified",
            0xEF: "Attempted to access invalid field of a structure",
            0xF0: "Bad input or output specified",
            0xFB: "Insufficient memory available",
            0xFF: "Bad arguments",
            0x81: "No more handles",
            0x82: "No space",
            0x83: "No more files",
            0x84: "End of file expected",
            0x85: "End of file",
            0x86: "Not a linear file",
            0x87: "File not found",
            0x88: "Handle all ready closed",
            0x89: "No linear space",
            0x8A: "Undefined error",
            0x8B: "File is busy",
            0x8C: "No write buffers",
            0x8D: "Append not possible",
            0x8E: "File is full",
            0x8F: "File exists",
            0x90: "Module not found",
            0x91: "Out of boundry",
            0x92: "Illegal file name",
            0x93: "Illegal handle"
        };
        return Command;
    })();
    Nxt.Command = Command;
})(Nxt || (Nxt = {}));
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
            console.log(BluetoothConnection.LOG_ID + ".writeBinary " + JSON.stringify(data));
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
            var bytes;
            if (data instanceof Nxt.Command) {
                bytes = data.bytes;
            } else {
                bytes = data;
            }

            console.log(BluetoothConnection.LOG_ID + ".write " + JSON.stringify(bytes));

            window.bluetoothSerial.write(new Uint8Array(bytes).buffer, success, error);
        };
        BluetoothConnection.prototype.read = function (success, error) {
            var _this = this;
            var _success = function (data) {
                var msg = Array.apply([], Nxt.Base64.decode(data));
                var msgLog = JSON.stringify(msg);

                if (msg.length < 5) {
                    _this.handleError("Reply was smaller than 5 bytes. " + msgLog, error);
                } else if (msg[2] != 2) {
                    _this.handleError("Reply was something other then a reply telegram. " + msgLog, error);
                } else if (msg[4] != 0) {
                    _this.handleError(Nxt.Command.Errors[msg[4]] + ". " + msgLog, error);
                } else {
                    console.log(BluetoothConnection.LOG_ID + ".read " + msgLog);
                    success(msg);
                }
            };

            window.bluetoothSerial.read(_success, error);
        };

        BluetoothConnection.prototype.handleError = function (msg, fail) {
            console.log(BluetoothConnection.LOG_ID + ".error " + msg);
            fail(msg);
        };
        BluetoothConnection.LOG_ID = "Nxt.Bluetooth";
        return BluetoothConnection;
    })();
    Nxt.BluetoothConnection = BluetoothConnection;
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
            var tacho = [];
            tacho[0] = this.tachoLimit & 0xff;
            tacho[1] = (this.tachoLimit >> 8) & 0xff;
            tacho[2] = (this.tachoLimit >> 16) & 0xff;
            tacho[3] = (this.tachoLimit >> 24) & 0xff;

            var cmd = new Nxt.Command([Nxt.Command.Types.Direct, Nxt.Command.DirectOps.SetOutputState, this._port, this.power, this.mode, this.regulation, this.turnRatio, this.runState, tacho[0], tacho[1], tacho[2], tacho[3]]);
            this._connection.write(cmd, function () {
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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Nxt;
(function (Nxt) {
    var Sensor = (function () {
        function Sensor() {
            this._type = Sensor.Types.None;
            this._initialzied = false;
            this.mode = Sensor.Modes.Raw;
            this.readDelay = 100;
            this.initDelay = 400;
            this.reading = null;
        }
        Sensor.prototype.init = function (success, fail) {
            var _this = this;
            if (!this._initialzied) {
                var cmd = new Nxt.Command([Nxt.Command.Types.Direct, Nxt.Command.DirectOps.SetInputMode, this._port, this._type, this.mode]);
                this._connection.write(cmd, function () {
                    setTimeout(function () {
                        success();
                    }, _this.initDelay);
                }, function (error) {
                    fail(error);
                });

                this._initialzied = true;
            } else {
                success();
            }
        };

        Sensor.prototype.reset = function () {
            var cmd = new Nxt.Command([Nxt.Command.Types.Direct, Nxt.Command.DirectOps.ResetInputScaledValue, this._port]);
            this._connection.write(cmd, function () {
            }, function (error) {
                alert(error);
            });
        };

        Sensor.prototype.read = function (key, success, fail) {
            var _this = this;
            var cmd = new Nxt.Command([Nxt.Command.Types.DirectReply, Nxt.Command.DirectOps.GetInputValues, this._port]);
            this._connection.write(cmd, function () {
                _this._read(success, fail);
            }, fail);
        };

        Sensor.prototype._read = function (success, fail) {
            var _this = this;
            setTimeout(function () {
                _this._connection.read(function (data) {
                    _this.reading = _this.createSensorReading(data);
                    console.log(Sensor.LOG_ID + ".read " + JSON.stringify(_this.reading));
                    success(_this.reading);
                }, fail);
            }, this.readDelay);
        };

        Sensor.prototype.createSensorReading = function (msg) {
            return new SensorReading(msg);
        };

        Sensor.prototype.write = function (key, value, success, fail) {
        };
        Sensor.LOG_ID = "Nxt.Sensor";

        Sensor.Types = { None: 0x00, Switch: 0x01, Temperature: 0x02, Reflection: 0x03, Angle: 0x04, LightActive: 0x05, LightInactive: 0x06, SoundDb: 0x07, SoundDba: 0x08, Custom: 0x09, Lowspeed: 0x0A, Lowspeed9v: 0x0B, NoOfSensorTypes: 0x0C };

        Sensor.Modes = { Raw: 0x00, Boolean: 0x20, Transition: 0x40, PeriodCounter: 0x60, PCTFullScale: 0x80, Celsius: 0xA0, Fahrenheit: 0xC0, AngleStep: 0xE0, SlopeMask: 0x1F, ModeMask: 0xE0 };
        return Sensor;
    })();
    Nxt.Sensor = Sensor;

    var SensorReadingBase = (function () {
        function SensorReadingBase(msg) {
            this.msg = msg;
        }
        return SensorReadingBase;
    })();
    Nxt.SensorReadingBase = SensorReadingBase;

    var SensorReading = (function (_super) {
        __extends(SensorReading, _super);
        function SensorReading(msg) {
            _super.call(this, msg);

            this.expectedLength = 18;

            if (msg.length != this.expectedLength) {
                return;
            }

            this.valid = (msg[6] == 1) ? true : false;
            this.raw = msg[10] | (msg[11] << 8);
            this.normalized = msg[12] | (msg[13] << 8);
            this.scaled = msg[14] | (msg[15] << 8);
        }
        return SensorReading;
    })(SensorReadingBase);
    Nxt.SensorReading = SensorReading;
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

        Brick.prototype.init = function (success, fail) {
            var _this = this;
            var _fail = function (error) {
                fail(error);
            };

            this._initPort(this.port1, function () {
                _this._initPort(_this.port2, function () {
                    _this._initPort(_this.port3, function () {
                        _this._initPort(_this.port4, function () {
                            success();
                        }, _fail);
                    }, _fail);
                }, _fail);
            }, _fail);
        };

        Brick.prototype._initPort = function (port, success, fail) {
            if (port != null) {
                port.init(success, fail);
            } else {
                success();
            }
        };

        Brick.prototype.connect = function (macAddress, success, failure) {
            var _this = this;
            this._connection.connect(macAddress, function () {
                _this.init(function () {
                    success();
                }, function (error) {
                    failure(error);
                });
            }, function (error) {
                _this._connected = false;
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

        Brick.prototype.playTone = function (frequency, duration) {
            if (typeof frequency === "undefined") { frequency = 523; }
            if (typeof duration === "undefined") { duration = 500; }
            var freq = [];
            freq[0] = frequency & 0xff;
            freq[1] = (frequency >> 8) & 0xff;

            var dur = [];
            dur[0] = duration & 0xff;
            dur[1] = (duration >> 8) & 0xff;

            var cmd = new Nxt.Command([Nxt.Command.Types.Direct, Nxt.Command.DirectOps.PlayTone, freq[0], freq[1], dur[0], dur[1]]);

            this._connection.write(cmd, function () {
            }, function (error) {
                alert(error);
            });
        };
        return Brick;
    })();
    Nxt.Brick = Brick;
})(Nxt || (Nxt = {}));
var Nxt;
(function (Nxt) {
    var I2CSensor = (function (_super) {
        __extends(I2CSensor, _super);
        function I2CSensor() {
            _super.call(this);
            this.address = 0x02;
            this.pollDelay = 100;
        }
        I2CSensor.prototype.read = function (key, success, fail) {
            var _this = this;
            var rxLength = key[1];

            this.write(key, null, function () {
                _this.ic2Poll(rxLength, function () {
                    _this.ic2Read(function () {
                        _this._read(success, fail);
                    }, fail);
                }, fail);
            }, fail);
        };

        I2CSensor.prototype.write = function (key, value, success, fail) {
            var data = [this.address, key[0]];
            if (value != null) {
                data.push(value);
            }
            this.ic2Write(data, key[1], success, fail);
        };

        I2CSensor.prototype.ic2Write = function (data, rxLength, success, fail) {
            var cmd = new Nxt.Command([Nxt.Command.Types.Direct, Nxt.Command.DirectOps.LsWrite, this._port, data.length, rxLength].concat((data)));
            this._connection.write(cmd, success, fail);
        };

        I2CSensor.prototype.ic2Read = function (success, fail) {
            var cmd = new Nxt.Command([Nxt.Command.Types.DirectReply, Nxt.Command.DirectOps.LsRead, this._port]);
            this._connection.write(cmd, success, fail);
        };

        I2CSensor.prototype.ic2Status = function (success, fail) {
            var cmd = new Nxt.Command([Nxt.Command.Types.DirectReply, Nxt.Command.DirectOps.LsGetStatus, this._port]);
            this._connection.write(cmd, success, fail);
        };

        I2CSensor.prototype.ic2Poll = function (rxLength, success, fail) {
            setTimeout(function () {
                success();
            }, this.pollDelay);
        };
        return I2CSensor;
    })(Nxt.Sensor);
    Nxt.I2CSensor = I2CSensor;

    var I2CSensorReading = (function (_super) {
        __extends(I2CSensorReading, _super);
        function I2CSensorReading(msg) {
            _super.call(this, msg);

            this.expectedLength = 22;
            this.data = msg.slice(6);
        }
        return I2CSensorReading;
    })(Nxt.SensorReadingBase);
    Nxt.I2CSensorReading = I2CSensorReading;
})(Nxt || (Nxt = {}));
var Nxt;
(function (Nxt) {
    var CompassSensor = (function (_super) {
        __extends(CompassSensor, _super);
        function CompassSensor() {
            _super.call(this);

            this._type = Nxt.Sensor.Types.Lowspeed9v;
            this.mode = Nxt.Sensor.Modes.Raw;
        }
        CompassSensor.prototype.createSensorReading = function (msg) {
            return new CompassSensorReading(msg);
        };
        CompassSensor.Registers = { Version: [0x00, 8], ProductId: [0x08, 8], SensorType: [0x10, 8], Command: [0x41, 1], Degree: [0x42, 2], DegreeHalf: [0x43, 2] };
        return CompassSensor;
    })(Nxt.I2CSensor);
    Nxt.CompassSensor = CompassSensor;

    var CompassSensorReading = (function (_super) {
        __extends(CompassSensorReading, _super);
        function CompassSensorReading(msg) {
            _super.call(this, msg);

            if (msg.length != this.expectedLength) {
                return;
            }

            this.degrees = this.data[0] * 2 + this.data[1];
        }
        return CompassSensorReading;
    })(Nxt.I2CSensorReading);
    Nxt.CompassSensorReading = CompassSensorReading;
})(Nxt || (Nxt = {}));
var Nxt;
(function (Nxt) {
    var SonarSensor = (function (_super) {
        __extends(SonarSensor, _super);
        function SonarSensor() {
            _super.call(this);

            this._type = Nxt.Sensor.Types.Lowspeed9v;
            this.mode = Nxt.Sensor.Modes.Raw;
        }
        SonarSensor.prototype.createSensorReading = function (msg) {
            return new SonarSensorReading(msg);
        };
        SonarSensor.Registers = {
            Version: [0x00, 8],
            ProductId: [0x08, 8],
            SensorType: [0x10, 8],
            FactoryZeroValue: [0x11, 1],
            FactoryScaleFactor: [0x12, 1],
            FactoryScaleDivisor: [0x13, 1],
            MeasurementUnits: [0x14, 7],
            Interval: [0x40, 1],
            Command: [0x41, 1],
            Result1: [0x42, 1],
            Result2: [0x43, 1],
            Result3: [0x44, 1],
            Result4: [0x45, 1],
            Result5: [0x46, 1],
            Result6: [0x47, 1],
            Result7: [0x48, 1],
            Result8: [0x49, 1],
            ZeroValue: [0x50, 1],
            ScaleFactor: [0x51, 1],
            ScaleDivisor: [0x52, 1]
        };
        return SonarSensor;
    })(Nxt.I2CSensor);
    Nxt.SonarSensor = SonarSensor;

    var SonarSensorReading = (function (_super) {
        __extends(SonarSensorReading, _super);
        function SonarSensorReading(msg) {
            _super.call(this, msg);

            if (msg.length != this.expectedLength) {
                return;
            }

            this.distance = this.data[0];
        }
        return SonarSensorReading;
    })(Nxt.I2CSensorReading);
    Nxt.SonarSensorReading = SonarSensorReading;
})(Nxt || (Nxt = {}));
var Nxt;
(function (Nxt) {
    var TouchSensor = (function (_super) {
        __extends(TouchSensor, _super);
        function TouchSensor() {
            _super.call(this);

            this._type = Nxt.Sensor.Types.Switch;
            this.mode = Nxt.Sensor.Modes.Boolean;
        }
        TouchSensor.prototype.createSensorReading = function (msg) {
            return new TouchSensorReading(msg);
        };
        return TouchSensor;
    })(Nxt.Sensor);
    Nxt.TouchSensor = TouchSensor;

    var TouchSensorReading = (function (_super) {
        __extends(TouchSensorReading, _super);
        function TouchSensorReading(msg) {
            _super.call(this, msg);

            if (msg.length != this.expectedLength) {
                return;
            }

            this.pressed = (this.raw == 1023) ? false : true;
        }
        return TouchSensorReading;
    })(Nxt.SensorReading);
    Nxt.TouchSensorReading = TouchSensorReading;
})(Nxt || (Nxt = {}));
//# sourceMappingURL=scripts.js.map
