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

            var tacho = [];
            tacho[0] = this.tachoLimit & 0xff;
            tacho[1] = (this.tachoLimit >> 8) & 0xff;
            tacho[2] = (this.tachoLimit >> 16) & 0xff;
            tacho[3] = (this.tachoLimit >> 24) & 0xff;

            var cmd = new Command([Command.Types.Direct, Command.DirectOps.SetOutputState, this._port, this.power, this.mode, this.regulation, this.turnRatio, this.runState, tacho[0], tacho[1], tacho[2], tacho[3]]);
            this._connection.write(cmd, function() {}, function(error) { alert(error); })
        }

        /*
        //Read state from motor.
        read() {

        }
        */
    }

}

