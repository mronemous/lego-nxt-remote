/// <reference path="sensor.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Nxt;
(function (Nxt) {
    var SonarSensor = (function (_super) {
        __extends(SonarSensor, _super);
        function SonarSensor() {
            _super.apply(this, arguments);
        }
        return SonarSensor;
    })(Nxt.Sensor);
    Nxt.SonarSensor = SonarSensor;
})(Nxt || (Nxt = {}));
//# sourceMappingURL=sonarSensor.js.map
