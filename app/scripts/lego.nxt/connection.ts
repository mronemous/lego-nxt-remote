module Nxt {

    declare var window;

    export interface IConnection {

        connect(macAddress: string, success, error): void;
        disconnect(success, error): void;
        write(data, success, error): void;
        writeBinary(data, success, error): void;
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
            alert(data);
        }
        writeBinary(data, success, error) {
            alert(data);
        }
        read(success, error) {

        }
    }

    export class BluetoothConnection implements IConnection {

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
            window.bluetoothSerial.write(data, success, error);
        }
        writeBinary(data, success, error) {
            window.bluetoothSerial.writeBinary(data, success, error);
        }
        read(success, error) {
            window.bluetoothSerial.read(success, error);
        }
    }
}