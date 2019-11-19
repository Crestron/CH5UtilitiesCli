"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var ch5_utilities_1 = require("@crazvansandu/ch5-utilities");
var Ch5CliUtil = /** @class */ (function () {
    function Ch5CliUtil() {
    }
    Ch5CliUtil.prototype.writeError = function (error) {
        console.log(chalk_1.default.red(error.name + ": " + error.message));
    };
    Ch5CliUtil.prototype.getOutputLevel = function (options) {
        if (options.quiet) {
            return ch5_utilities_1.OutputLevel.Quiet;
        }
        if (options.verbose) {
            return ch5_utilities_1.OutputLevel.Verbose;
        }
        return ch5_utilities_1.OutputLevel.Normal;
    };
    Ch5CliUtil.prototype.getDeviceType = function (deviceTypeInput) {
        switch (deviceTypeInput) {
            case 'touchscreen':
                return ch5_utilities_1.DeviceType.TouchScreen;
            case 'controlsystem':
                return ch5_utilities_1.DeviceType.ControlSystem;
            case 'web':
                return ch5_utilities_1.DeviceType.WebServer;
            default:
                throw new Error("Unknown device type " + deviceTypeInput);
        }
    };
    return Ch5CliUtil;
}());
exports.Ch5CliUtil = Ch5CliUtil;
