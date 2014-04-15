module Nxt {

    export class Command{

        //Enums
        static Types: { DirectReply; SystemReply; Direct; System; } = { DirectReply: 0x00, SystemReply: 0x01, Direct: 0x80, System: 0x81 };
        static DirectOps: { StartProgram; StopProgram; PlaySound; PlayTone; SetOutputState; SetInputMode; GetOutputState; GetInputValues; ResetInputScaledValue; MessageWrite; ResetMotorPosition; GetBatteryLevel; StopSound; KeepAlive; LsGetStatus; LsWrite; LsRead; GetProgram; MessageRead; }
        = { StartProgram: 0x00, StopProgram: 0x01, PlaySound: 0x02, PlayTone: 0x03, SetOutputState: 0x04, SetInputMode: 0x05, GetOutputState: 0x06, GetInputValues: 0x07, ResetInputScaledValue: 0x08, MessageWrite: 0x09,
            ResetMotorPosition: 0x0A, GetBatteryLevel: 0x0B, StopSound: 0x0C, KeepAlive: 0x0D, LsGetStatus: 0x0E, LsWrite: 0x0F, LsRead: 0x10, GetProgram: 0x11, MessageRead: 0x13 };
        static SystemOps: { OpenRead; OpenWrite; ReadFile; WriteFile; CloseHandle; DeleteFile; FindFirst; FindNext; GetFirmwareVersion; OpenWriteLinear; OpenReadLinear; OpenWriteData;
            OpenAppendData; Boot; SetBrickName; GetDeviceInfo; DeleteUserFlash; PollCommandLength; PollCommand; BluetoothFactoryReset; RequestFirstModule; RequestNextModule; CloseModuleHandle; ReadIoMap; WriteIoMap }
        = { OpenRead: 0x80, OpenWrite: 0x81, ReadFile: 0x82, WriteFile: 0x83, CloseHandle: 0x84, DeleteFile: 0x85, FindFirst: 0x86, FindNext: 0x87, GetFirmwareVersion: 0x88,
        OpenWriteLinear: 0x89, OpenReadLinear: 0x8A, OpenWriteData: 0x8B, OpenAppendData: 0x8C, Boot: 0x97, SetBrickName: 0x98, GetDeviceInfo: 0x9B, DeleteUserFlash: 0xA0,
        PollCommandLength: 0xA1, PollCommand: 0xA2, BluetoothFactoryReset: 0xA4, RequestFirstModule: 0x90, RequestNextModule: 0x91, CloseModuleHandle: 0x92, ReadIoMap: 0x94,
        WriteIoMap: 0x95 };

        static Errors: Object = {

        //Direct Commands
        0x20: "Pending communication transaction in progress",
        0x40: "Specified mailbox queue is empty",
        0xBD: "Request failed (i.e. specified file not found)",
        0xBE: "Unknown command opcode",
        0xBF: "Insane packet",
        0xC0: "Data contains out-of-range values",
        0xDD: "Communication bus error",
        0xDE: "No free memory in communication buffer",
        0xDF: "Specified channel/connection is not valid",
        0xE0: "Specified channel/connection not configured or busy",
        0xEC: "No active program",
        0xED: "Illegal size specified",
        0xEE: "Illegal mailbox queue ID specified",
        0xEF: "Attempted to access invalid field of a structure",
        0xF0: "Bad input or output specified",
        0xFB: "Insufficient memory available",
        0xFF: "Bad arguments",
        //System Commands
        0x81: "No more handles",
        0x82: "No space",
        0x83: "No more files",
        0x84: "End of file expected",
        0x85: "End of file",
        0x86: "Not a linear file",
        0x87: "File not found",
        0x88: "Handle all ready closed",
        0x89: "No linear space",
        0x8A: "Undefined error",
        0x8B: "File is busy",
        0x8C: "No write buffers",
        0x8D: "Append not possible",
        0x8E: "File is full",
        0x8F: "File exists",
        0x90: "Module not found",
        0x91: "Out of boundry",
        0x92: "Illegal file name",
        0x93: "Illegal handle"

        };
    
        //Fields
        private _bytes: number[];
        get bytes():number[] {
            //Inject the command length bytes.
            var length = this._bytes.length;
            var bytes = [length + 2];
            bytes[0] = length & 0xff;
            bytes[1] = (length >> 8) & 0xff;
            bytes = bytes.concat(this._bytes);

            return bytes;
        }

        constructor(values: number[]){
            this._bytes = [];
            this.append(values);

        }

        append(values: number[]) {

            this._bytes = this._bytes.concat(values);
        }
    }

}