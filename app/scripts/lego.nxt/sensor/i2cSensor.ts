/// <reference path="sensor.ts" />

module Nxt {

    export class I2CSensor extends Sensor {

        //Enums

        //Fields
        public address: number = 0x02;
        //TODO: Simulate fake polling util we can get I2C status to work.
        public pollDelay: number = 100;

        constructor() {
            super();
        }

        read(key: number[], success, fail) {

            var rxLength: number = key[1];

            this.write(key, null, () => {

                this.ic2Poll(rxLength, () => {

                        this.ic2Read(() => {

                                this._read(success, fail);
                            },
                            fail);
                    },
                    fail);
            },
            fail);

        }

        write(key: number[], value: number, success, fail) {

            var data: number[] = [this.address, key[0]];
            if(value != null) {
                data.push(value)
            }
            this.ic2Write(data, key[1], success, fail);
        }

        ic2Write(data: number[], rxLength: number, success, fail) {
            var cmd = new Command([Command.Types.Direct, Command.DirectOps.LsWrite, this._port, data.length, rxLength].concat((data)));
            this._connection.write(cmd, success, fail);
        }

        ic2Read(success, fail) {
            var cmd = new Command([Command.Types.DirectReply, Command.DirectOps.LsRead, this._port]);
            this._connection.write(cmd, success, fail);

        }

        ic2Status(success, fail) {
            var cmd = new Command([Command.Types.DirectReply, Command.DirectOps.LsGetStatus, this._port]);
            this._connection.write(cmd, success, fail);
        }

        ic2Poll(rxLength: number, success, fail) {

            setTimeout(() => {
                success();
            }, this.pollDelay);

            /*
            //TODO: When I use polling I am not able to read the final sensor result.
            //To resolve this the bluetooth native buffer may need to be adjusted.

            var timeout = 30*1000; //TODO: remove 30 after debugging is done.
            var pollTime = 0;
            var start = new Date();
            var duration = 0;

            var _success = (bytesReady) => {

                duration = new Date() - start;

                console.log("pollling... ready=" + bytesReady + " expected=" + rxLength);
                if(bytesReady < rxLength) {

                    if(duration >= timeout) {
                        fail("timeout");  //TODO: Error code
                    }
                    else {

                        setTimeout(() => {
                            this.readStatus(port, rxLength, _success, fail);
                        }, pollTime);
                    }
                }
                else {
                    success();
                }
            };
            _success(0);
            */
        }
    }

    export class I2CSensorReading extends SensorReadingBase{

        public data: number[];

        constructor(msg: number[]) {
            super(msg);

            this.expectedLength = 22;
            this.data = msg.slice(6);
        }
    }
}