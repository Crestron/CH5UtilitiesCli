// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import commander from "commander";
import chalk from 'chalk';
import { Ch5ArchiveCli } from "./Ch5ArchiveCli";
import { Ch5DeployCli } from "./Ch5DeployCli";

const clear = require('clear');
const packageJson = require('../../package.json');

const buildVersion = packageJson.version || 'VERSION_NOT_READ';

let shellProjectPackageJson: any = {};

try {
  shellProjectPackageJson = require('../../../../../package.json');
} catch (err) {}

export class Ch5Cli {
  private readonly _archiveCli: Ch5ArchiveCli;
  private readonly _deployCli: Ch5DeployCli;

  public constructor() {
    this._archiveCli = new Ch5ArchiveCli();
    this._deployCli = new Ch5DeployCli();
  }

  public run(): void {
    const program = new commander.Command();
    program
      .version(buildVersion)
      .description("CH5 utilities CLI");

    this._archiveCli.setupArchiveCommand(program, shellProjectPackageJson.name);
    this._deployCli.setupDeployCommand(program, shellProjectPackageJson.name);

    // error on unknown commands
    program.on('command:*', function () {
      console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
      process.exit(1);
    });

    program.parse(process.argv);

    if (!process.argv.slice(2).length) {
      clear();
      program.outputHelp();
    }
  }
}
