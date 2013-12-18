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
//# sourceMappingURL=connection.js.map
