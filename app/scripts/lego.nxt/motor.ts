/// <reference path="brick.ts" />
/// <reference path="connection.ts" />
/// <reference path="command.ts" />

module Nxt {

    export class Motor {

        //Enums
        static Modes: { Coast; On; Break; Regulated; } = { Coast: 0x00, On: 0x01, Break: 0x03, Regulated: 0x05};
        static Regulation: { None; Speed; Sync; } = { None: 0x00, Speed: 0x01, Sync: 0x02};
        static RunStates: { Idle; RampUp; Running; RampDown } = { Idle: 0x00, RampUp: 0x10, Running: 0x20, RampDown: 0x40};

        //Fields
        _port: number;
        _connection: IConnection;

        public mode: number = Motor.Modes.On;
        public power: number = 0;
        public regulation: number = Motor.Regulation.None;
        public turnRatio: number = 0;
        public runState: number = Motor.RunStates.Running;
        public tachoLimit: number = 0;

        constructor() {

        }

        //TODO: Implement reply
        //Write new state to motor.
        write(reply: boolean) {

            //TODO: Implement tacho-limit currently set to 0 (last 4 indices)
            var cmd = new Command([0x0C, 0x00, Command.Types.Direct, 0x04, this._port, this.power, this.mode, this.regulation, this.turnRatio, this.runState, 0, 0, 0, 0]);
            this._connection.writeBinary(cmd.toArrayBuffer(), function() {}, function(error) { alert(error); })
        }

        /*
        //Read state from motor.
        read() {

        }
        */
    }

}

