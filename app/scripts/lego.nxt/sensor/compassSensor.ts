/// <reference path="sensor.ts" />
/// <reference path="i2cSensor.ts" />

module Nxt {

    export class CompassSensor extends I2CSensor {

        //Version = 0x00, ProductId = 0x08, SensorType = 0x10, Command = 0x41, Degree = 0x42, DegreeHalf = 0x43

        //Enums
        static Registers: { Version; ProductId; SensorType; Command; Degree; DegreeHalf }
            = { Version: [0x00, 8], ProductId: [0x08, 8], SensorType: [0x10, 8], Command: [0x41, 1], Degree: [0x42, 2], DegreeHalf: [0x43, 2] };

        //Fields

        constructor() {
            super();

            this._type = Sensor.Types.Lowspeed9v;
            this.mode = Sensor.Modes.Raw;
        }

        createSensorReading(msg: number[]) : SensorReadingBase {

            return new CompassSensorReading(msg);
        }
    }

    export class CompassSensorReading extends I2CSensorReading {

        constructor(msg: number[]) {
            super(msg);

            if(msg.length != this.expectedLength) { return; }

            this.degrees = this.data[0] * 2 + this.data[1];
        }

        public degrees: number;
    }
}