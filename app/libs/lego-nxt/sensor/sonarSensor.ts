/// <reference path="sensor.ts" />
/// <reference path="i2cSensor.ts" />

module Nxt {

    export class SonarSensor extends I2CSensor {

        //Enums
        static Registers: { Version; ProductId; SensorType; FactoryZeroValue; FactoryScaleFactor; FactoryScaleDivisor; MeasurementUnits; Interval; Command; Result1; Result2; Result3; Result4; Result5; Result6; Result7; Result8; ZeroValue; ScaleFactor; ScaleDivisor }
            = { Version: [0x00, 8], ProductId: [0x08, 8], SensorType: [0x10, 8], FactoryZeroValue: [0x11, 1], FactoryScaleFactor: [0x12, 1],
            FactoryScaleDivisor: [0x13, 1], MeasurementUnits: [0x14, 7],
            Interval: [0x40, 1], Command: [0x41, 1], Result1: [0x42, 1], Result2: [0x43, 1], Result3: [0x44, 1], Result4: [0x45, 1], Result5: [0x46, 1],
            Result6: [0x47, 1], Result7: [0x48, 1], Result8: [0x49, 1], ZeroValue: [0x50, 1], ScaleFactor: [0x51, 1], ScaleDivisor: [0x52, 1] };

        //Fields

        constructor() {
            super();

            this._type = Sensor.Types.Lowspeed9v;
            this.mode = Sensor.Modes.Raw;
        }

        createSensorReading(msg: number[]) : SensorReadingBase {

            return new SonarSensorReading(msg);
        }
    }

    export class SonarSensorReading extends I2CSensorReading {

        constructor(msg: number[]) {
            super(msg);

            if(msg.length != this.expectedLength) { return; }

            this.distance = this.data[0];
        }

        public distance: number;
    }
}