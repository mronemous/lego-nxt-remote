/// <reference path="connection.ts" />
/// <reference path="motor.ts" />
/// <reference path="sensor/sensor.ts" />
/// <reference path="command.ts" />

module Nxt {

    export class Brick{

        //Enums

        //Fields
        private _connection: IConnection = null;

        private _portA: Motor;
        get portA():Motor {
            return this._portA;
        }
        set portA(portA:Motor) {
            this._portA = portA;
            portA._connection = this._connection;
            portA._port = 0;
        }

        private _portB: Motor;
        get portB():Motor {
            return this._portB;
        }
        set portB(portB:Motor) {
            this._portB = portB;
            portB._connection = this._connection;
            portB._port = 1;
        }

        private _portC: Motor;
        get portC():Motor {
            return this._portC;
        }
        set portC(portC:Motor) {
            this._portC = portC;
            portC._connection = this._connection;
            portC._port = 2;
        }
        private _portABC: Motor;
        get portABC():Motor {
            return this._portABC;
        }
        set portABC(portABC:Motor) {
            this._portABC = portABC;
            portABC._connection = this._connection;
            portABC._port = 0xFF;
        }

        private _port1: Sensor;
        get port1():Sensor {
            return this._port1;
        }
        set port1(port1:Sensor) {
            this._port1 = port1;
            port1._connection = this._connection;
            port1._port = 0;
        }

        private _port2: Sensor;
        get port2():Sensor {
            return this._port2;
        }
        set port2(port2:Sensor) {
            this._port2 = port2;
            port2._connection = this._connection;
            port2._port = 1;
        }

        private _port3: Sensor;
        get port3():Sensor {
            return this._port3;
        }
        set port3(port3:Sensor) {
            this._port3 = port3;
            port3._connection = this._connection;
            port3._port = 2;
        }

        private _port4: Sensor;
        get port4():Sensor {
            return this._port4;
        }
        set port4(port4:Sensor) {
            this._port4 = port4;
            port4._connection = this._connection;
            port4._port = 3;
        }

        constructor(){
            this._connection = new BluetoothConnection();
        }

        private _connected: boolean;

        init(success, fail) {

            var _fail = (error) => { fail(error); }

            //TODO: Cleanup. Not 100% this has to be sequential.
            this._initPort(this.port1, () => {

                this._initPort(this.port2, () => {

                        this._initPort(this.port3, () => {

                                this._initPort(this.port4, () => {
                                        success();
                                    },
                                    _fail);
                            },
                            _fail);
                    },
                    _fail);
            },
            _fail);
        }

        _initPort(port, success, fail) {
            if(port != null) {
                port.init(success, fail);
            }
            else {
                success();
            }
        }

        connect(macAddress: string, success, failure) {

            this._connection.connect(macAddress, () => {

                    this.init(() => {
                        success();
                    },
                    (error) => {
                        failure(error)
                    });
                },
                (error) => {
                this._connected = false;
                failure(error);
            });
            this._connected = true;
        }

        disconnect(success, failure) {
            if(this.isConnected()) {
                this._connection.disconnect(success, failure);
                this._connected = false;
            }
        }

        isConnected() {
            return this._connected;
        }

        playTone(frequency: number = 523, duration: number = 500) {

            var freq = [];
            freq[0] = frequency & 0xff;
            freq[1] = (frequency >> 8) & 0xff;

            var dur = [];
            dur[0] = duration & 0xff;
            dur[1] = (duration >> 8) & 0xff;

            var cmd = new Command([Command.Types.Direct, Command.DirectOps.PlayTone, freq[0], freq[1], dur[0], dur[1]]);

            this._connection.write(cmd, function() {}, function(error) { alert(error); });
        }
    }

}