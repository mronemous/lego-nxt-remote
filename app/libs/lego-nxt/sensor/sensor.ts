/// <reference path="../connection.ts" />
/// <reference path="../command.ts" />

module Nxt {

    export class Sensor {

        static LOG_ID: string = "Nxt.Sensor";

        //Enums
        static Types: { None; Switch; Temperature; Reflection; Angle; LightActive; LightInactive; SoundDb; SoundDba; Custom; Lowspeed; Lowspeed9v; NoOfSensorTypes;  }
        = { None: 0x00, Switch: 0x01, Temperature: 0x02, Reflection: 0x03, Angle: 0x04, LightActive: 0x05, LightInactive: 0x06, SoundDb: 0x07, SoundDba: 0x08, Custom: 0x09, Lowspeed: 0x0A, Lowspeed9v: 0x0B, NoOfSensorTypes: 0x0C };
        
        static Modes: { Raw; Boolean; Transition; PeriodCounter; PCTFullScale; Celsius; Fahrenheit; AngleStep; SlopeMask; ModeMask }
        = { Raw: 0x00, Boolean: 0x20, Transition: 0x40, PeriodCounter: 0x60, PCTFullScale: 0x80, Celsius: 0xA0, Fahrenheit: 0xC0, AngleStep: 0xE0, SlopeMask: 0x1F, ModeMask: 0xE0 };

        //Fields
        _port: number;
        _connection: IConnection;
        _type: number[] = Sensor.Types.None;
        _initialzied: boolean = false;

        public mode: number = Sensor.Modes.Raw;
        public readDelay: number = 100;
        public initDelay: number = 400;
        //Friendly name for the sensor.
        public name: String;
        //Last reading read.
        public reading: SensorReadingBase = null;

        constructor() {
        }

        init(success, fail) {

            if(!this._initialzied) {
                var cmd = new Command([Command.Types.Direct, Command.DirectOps.SetInputMode, this._port, this._type, this.mode]);
                this._connection.write(cmd, () => {
                    setTimeout(() => {
                        success();
                    }, this.initDelay);
                },
                (error) => {
                    fail(error);
                });

                this._initialzied = true;
            }
            else {
                success();
            }
        }

        reset() {
            var cmd = new Command([Command.Types.Direct, Command.DirectOps.ResetInputScaledValue, this._port]);
            this._connection.write(cmd, function() {}, function(error) { alert(error); });
        }

        read(key: number[], success, fail) {

            var cmd = new Command([Command.Types.DirectReply, Command.DirectOps.GetInputValues, this._port]);
            this._connection.write(cmd, () => {
                this._read(success, fail);
            },
            fail);
        }

        _read(success, fail) {
            setTimeout(() => {
                this._connection.read((data) => {

                        this.reading = this.createSensorReading(data);
                        console.log(Sensor.LOG_ID + ".read " + JSON.stringify(this.reading));
                        success(this.reading);
                    },
                    fail);
            }, this.readDelay);
        }

        //Adapt the binary message into an higher abstraction.
        createSensorReading(msg: number[]) : SensorReadingBase {

            return new SensorReading(msg);
        }

        write(key: number[], value: number, success, fail) {
            //No op for basic sensor
        }
    }

    export class SensorReadingBase {

        public msg: number[];
        public expectedLength: number;

        constructor(msg: number[]) {
            this.msg = msg;
        }
    }

    export class SensorReading extends SensorReadingBase{

        constructor(msg: number[]) {
            super(msg);

            this.expectedLength = 18;

            //NOTE: Calibrated is not used by NXT.

            if(msg.length != this.expectedLength) { return; }

            this.valid = (msg[6] == 1) ? true : false;
            this.raw = msg[10] | ( msg[11] << 8 );
            this.normalized = msg[12] | ( msg[13] << 8 );
            this.scaled = msg[14] | ( msg[15] << 8 );
        }

        public valid: boolean;

        //The device level raw data.
        public raw: number;

        //The type dependant data.
        public normalized: number;

        //The mode dependant data.
        public scaled: number;
    }
}