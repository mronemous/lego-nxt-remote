/// <reference path="sensor.ts" />

module Nxt {

    export class TouchSensor extends Sensor {

        //Enums

        //Fields

        constructor() {
            super();

            this._type = Sensor.Types.Switch;
            this.mode = Sensor.Modes.Boolean;
        }

        createSensorReading(msg: number[]) : SensorReadingBase {

            return new TouchSensorReading(msg);
        }
    }

    export class TouchSensorReading extends SensorReading {

        constructor(msg: number[]) {
            super(msg);

            if(msg.length != this.expectedLength) { return; }

            this.pressed = (this.raw == 1023) ? false : true;
        }

        public pressed: boolean;
    }
}