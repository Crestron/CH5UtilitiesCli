// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import chalk from "chalk";
import { DeviceType, OutputLevel } from "@crestron/ch5-utilities";

const fs = require("fs");

export class Ch5CliUtil {
  public writeError(error: Error): void {
    console.log(chalk.red(`${error.name}: ${error.message}`));
  }

  public getOutputLevel(options: any): OutputLevel {
    if (options.quiet) {
      return OutputLevel.Quiet;
    }

    if (options.verbose) {
      return OutputLevel.Verbose;
    }

    return OutputLevel.Normal;
  }

  public readFileContentSync(path: string) {
    return fs.readFileSync(path, 'utf8');
  }

  public getShellProjectPackageJson() {
    let shellProjectPackageJson: any = {};
    try {
      shellProjectPackageJson = JSON.parse(this.readFileContentSync('./package.json'));
    } catch (err) {

    }
    return shellProjectPackageJson;
  }

  public getDeviceType(deviceTypeInput: string): DeviceType {
    switch (deviceTypeInput) {
      case 'touchscreen':
        return DeviceType.TouchScreen;
      case 'controlsystem':
        return DeviceType.ControlSystem;
      case 'web':
        return DeviceType.Web;
      case 'mobile':
        return DeviceType.Mobile;
      default:
        throw new Error(`Unknown device type ${deviceTypeInput}`);
    }
  }
}
