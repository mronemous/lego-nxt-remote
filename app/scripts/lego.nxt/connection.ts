/// <reference path="base64.ts" />
/// <reference path="command.ts" />

module Nxt {

    declare var window;

    export interface IConnection {

        connect(macAddress: string, success, error): void;
        disconnect(success, error): void;
        write(data, success, error): void;
        read(success, error): void;
    }

    export class MockConnection implements IConnection {

        connect(macAddress: string, success, error) {
            setTimeout(success, 1000);
        }
        disconnect(success, error) {
            success();
        }
        write(data, success, error) {
            console.log(BluetoothConnection.LOG_ID + ".writeBinary " + JSON.stringify(data));
        }
        read(success, error) {
            //console.log(BluetoothConnection.LOG_ID + ".read ");
        }
    }

    export class BluetoothConnection implements IConnection {

        static LOG_ID: string = "Nxt.Bluetooth";

        constructor() {
            if(window.bluetoothSerial == null) {
                window.bluetoothSerial = new MockConnection();
            }
        }

        connect(macAddress: string, success, error) {

            window.bluetoothSerial.connect(macAddress, success, error);
        }
        disconnect(success, error) {
            window.bluetoothSerial.disconnect(success, error);
        }
        write(data, success, error) {

            var bytes: number[];
            if(data instanceof Command) {
                bytes = data.bytes;
            }
            else {
                bytes = data;
            }

            console.log(BluetoothConnection.LOG_ID + ".write " +  JSON.stringify(bytes));

            window.bluetoothSerial.write(new Uint8Array(bytes).buffer, success, error);
        }
        read(success, error) {

            var _success = (data) => {

                var msg = Array.apply( [], Base64.decode(data) );
                var msgLog = JSON.stringify(msg);

                if(msg.length < 5) {
                    this.handleError("Reply was smaller than 5 bytes. " + msgLog, error);
                }
                else if(msg[2] != 2) {
                    this.handleError("Reply was something other then a reply telegram. " + msgLog, error);
                }
                else if(msg[4] != 0) {
                    this.handleError(Command.Errors[msg[4]] + ". " + msgLog, error);
                }
                else {
                    console.log(BluetoothConnection.LOG_ID + ".read " +  msgLog);
                    success(msg);
                }
            };

            window.bluetoothSerial.read(_success, error);
        }

        handleError(msg: string, fail) {

            console.log(BluetoothConnection.LOG_ID + ".error " + msg);
            fail(msg);
        }
    }
}