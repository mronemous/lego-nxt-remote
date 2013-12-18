/// <reference path="connection.ts" />
/// <reference path="motor.ts" />
/// <reference path="sensor.ts" />
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

        connect(macAddress: string, success, failure) {
            var me = this;

            this._connection.connect(macAddress, success, function(error) {
                me._connected = false;
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

        beep(frequency: number = 523, duration: number = 500) {

            //TODO: Implement frequency and duration (last 4 indices)
            var cmd = new Command([0x06, 0x00, Command.Types.Direct, 0x03, 0x0B, 0x02, 0xF4, 0x01]);

            this._connection.writeBinary(cmd.toArrayBuffer(), function() {}, function(error) { alert(error); });
        }
    }

}