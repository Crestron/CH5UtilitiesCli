"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ch5_utilities_1 = require("@crazvansandu/ch5-utilities");
var Ch5CliUtil_1 = require("./Ch5CliUtil");
var inquirer = require('inquirer');
var Ch5DeployCli = /** @class */ (function () {
    function Ch5DeployCli() {
        this._cliUtil = new Ch5CliUtil_1.Ch5CliUtil();
    }
    Ch5DeployCli.prototype.setupDeployCommand = function (program) {
        var _this = this;
        program
            .command('deploy <archive>')
            .option("-H, --deviceHost <deviceHost>", "Device host or IP. Required.")
            .option("-t, --deviceType <deviceType>", "Device type, value in [touchscreen, controlsystem, web]. Required.", /^(touchscreen|controlsystem|web)$/i)
            .option("-d, --deviceDirectory <deviceDirectory>", "Device target deploy directory. Defaults to 'display' when deviceType is touchscreen, to 'HTML' when deviceType is controlsystem. Optional.")
            .option("-p, --prompt-for-credentials", "Prompt for credentials. Optional.")
            .option("-q, --quiet [quiet]", "Don\'t display messages. Optional.")
            .option("-vvv, --verbose [verbose]", "Verbose output. Optional.")
            .action(function (archive, options) { return __awaiter(_this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.deploy(archive, options)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        this._cliUtil.writeError(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    Ch5DeployCli.prototype.deploy = function (archive, options) {
        return __awaiter(this, void 0, void 0, function () {
            var deviceType, userAndPassword, configOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.validateDeployOptions(archive, options);
                        deviceType = this._cliUtil.getDeviceType(options.deviceType);
                        return [4 /*yield*/, this.getUserAndPassword(options.promptForCredentials)];
                    case 1:
                        userAndPassword = _a.sent();
                        configOptions = {
                            controlSystemHost: options.deviceHost,
                            deviceType: deviceType,
                            sftpDirectory: options.deviceDirectory,
                            sftpUser: userAndPassword.user,
                            sftpPassword: userAndPassword.password,
                            outputLevel: this._cliUtil.getOutputLevel(options)
                        };
                        return [4 /*yield*/, ch5_utilities_1.distributor(archive, configOptions)];
                    case 2:
                        _a.sent();
                        process.exit(0); // required, takes too long to exit :|
                        return [2 /*return*/];
                }
            });
        });
    };
    Ch5DeployCli.prototype.validateDeployOptions = function (archive, options) {
        var missingArguments = [];
        var missingOptions = [];
        if (!archive) {
            missingArguments.push('archive');
        }
        if (!options.deviceHost) {
            missingOptions.push('deviceHost');
        }
        if (!options.deviceType) {
            missingOptions.push('deviceType');
        }
        if (missingArguments.length == 0 && missingOptions.length == 0) {
            return;
        }
        var argumentsMessage = missingArguments.length > 0 ? "Missing arguments: " + missingArguments.join(', ') + "." : '';
        var optionsMessage = missingOptions.length > 0 ? "Missing options: " + missingOptions.join('. ') + "." : '';
        throw new Error(argumentsMessage + " " + optionsMessage + " Type 'ch5-cli deploy --help' for usage information.");
    };
    Ch5DeployCli.prototype.getUserAndPassword = function (promptForCredentials) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!promptForCredentials) {
                            return [2 /*return*/, {
                                    user: 'crestron',
                                    password: ''
                                }];
                        }
                        return [4 /*yield*/, inquirer.prompt([
                                {
                                    type: 'string',
                                    message: 'Enter SFTP user',
                                    name: 'user',
                                    default: 'crestron',
                                },
                                {
                                    type: 'password',
                                    message: 'Enter SFTP password',
                                    name: 'password',
                                    mask: '*',
                                    default: ''
                                }
                            ])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Ch5DeployCli;
}());
exports.Ch5DeployCli = Ch5DeployCli;
