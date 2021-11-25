// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as commander from "commander";
import path from 'path';
import { IConfigOptions } from "@crestron/ch5-utilities/build/@types/interfaces";
import { distributor } from "@crestron/ch5-utilities";
import { Ch5CliUtil } from "./Ch5CliUtil";

const inquirer = require('inquirer');

export class Ch5DeployCli {
  private readonly _cliUtil: Ch5CliUtil;

  public constructor() {
    this._cliUtil = new Ch5CliUtil();
  }

  public setupDeployCommand(program: commander.Command, projectName: string): void {
    program
      .command('deploy <archive>')
      .option("-H, --deviceHost <deviceHost>", "Device host or IP. Required.")
      .option("-t, --deviceType <deviceType>", "Device type, value in [touchscreen, controlsystem, web, mobile]. Required.", /^(touchscreen|controlsystem|web|mobile)$/i)
      .option("-d, --deviceDirectory <deviceDirectory>",
        "Device target deploy directory. Defaults to 'display' when deviceType is touchscreen, to 'HTML' when deviceType is controlsystem/web/mobile. Optional.")
      .option("-p, --prompt-for-credentials", "Prompt for credentials. Optional.")
      .option("-u, --identity-user <identityUser>", "Name of the user connecting to the device. Optional.")
      .option("-i, --identity-file <identityFile>", "Path to the private key. Optional.")
      .option("-q, --quiet [quiet]", "Don\'t display messages. Optional.")
      .option("-s, --slow-mode", "Uploads the project with an additional step to resolve sporadic \"Permission denied\" errors on upload. Optional.")
      .option("-vvv, --verbose [verbose]", "Verbose output. Optional.")
      .action(async (archive, options) => {
        try {
          await this.deploy(archive, {...options, projectName: options.projectName || projectName});
        } catch (e) {
          this._cliUtil.writeError(e);
        }
      });
  }

  private async deploy(archive: string, options: any): Promise<void> {
    this.validateDeployOptions(archive, options);

    let deviceType = this._cliUtil.getDeviceType(options.deviceType);

    const credentials = await this.getCredentials(options.promptForCredentials, options.identityUser, options.identityFile);

    let configOptions = {
      projectName: path.parse(archive).name,
      controlSystemHost: options.deviceHost,
      deviceType: deviceType,
      sftpDirectory: options.deviceDirectory,
      sftpUser: credentials.user,
      sftpPassword: credentials.password,
      privateKey: credentials.privateKey,
      passphrase: credentials.passphrase,
      outputLevel: this._cliUtil.getOutputLevel(options),
      slowMode: options.slowMode
    } as IConfigOptions;

    await distributor(archive, configOptions);
    process.exit(0); // required, takes too long to exit :|
  }

  private validateDeployOptions(archive: string, options: any): void {
    let missingArguments = [];
    let missingOptions = [];

    if (!archive) {
      missingArguments.push('archive');
    }

    if (!options.deviceHost) {
      missingOptions.push('deviceHost');
    }

    if (!options.deviceType) {
      missingOptions.push('deviceType');
    }

    if (options.identityUser && !options.identityFile) {
      missingOptions.push('identityFile');
    }

    /* coverity[check_after_deref] */
    if (options.slowMode && options?.deviceType !== 'touchscreen') {
      throw new Error('Slow mode only works for touchscreen devices!');
    }

    if (missingArguments.length == 0 && missingOptions.length == 0) {
      return;
    }

    const argumentsMessage = missingArguments.length > 0 ? `Missing arguments: ${missingArguments.join(', ')}.` : '';
    const optionsMessage = missingOptions.length > 0 ? `Missing options: ${missingOptions.join('. ')}.` : '';
    throw new Error(`${argumentsMessage} ${optionsMessage} Type 'ch5-cli deploy --help' for usage information.`)
  }

  private async getCredentials(promptForCredentials: boolean, identityUser: string, identityFile: string): Promise<any> {
    const { user, password } = this.getCredentialsFromEnvironmentVariables();

    // 11XX
    if (identityUser && identityFile) {
      // 111X; Use passphrase from user input
      if (promptForCredentials) {
        const userInput = await inquirer.prompt([
          {
            type: 'password',
            message: 'Enter passphrase for the private key (empty for no passphrase)',
            name: 'passphrase',
            mask: '*'
          }
        ]);
        return {
          user: identityUser,
          privateKey: identityFile,
          passphrase: userInput.passphrase,
        };
      }

      // 110X; Use passphrase from env var
      return {
        user: identityUser,
        privateKey: identityFile,
        passphrase: password
      };
    }

    // 01XX
    if (identityFile && !identityUser) {
      // 011X; Use user and password from user input
      if (promptForCredentials) {
        const userInput = await inquirer.prompt([
          {
            type: 'string',
            message: 'Enter user',
            name: 'user',
          },
          {
            type: 'password',
            message: 'Enter passphrase for the private key (empty for no passphrase)',
            name: 'passphrase',
            mask: '*'
          }
        ]);

        return {
          user: userInput.user,
          passphrase: userInput.passphrase,
          privateKey: identityFile
        };
      }

      // 0101; Use user and passphrase from env variables
      if (user !== undefined && password !== undefined) {
        return {
          user,
          passphrase: password,
          privateKey: identityFile
        };
      }

      // 0100; Use system user
      return {
        user: process.env.USER || process.env.USERNAME,
        privateKey: identityFile,
        passphrase: password
      };

    }

    // 001X; Use user and password from user input
    if (promptForCredentials) {
      return await inquirer.prompt([
        {
          type: 'string',
          message: 'Enter SFTP user',
          name: 'user',
        },
        {
          type: 'password',
          message: 'Enter SFTP password',
          name: 'password',
          mask: '*'
        }
      ]);
    }

    // 000X; Use env vars or default values
    return { user, password };
  }

  private getCredentialsFromEnvironmentVariables(): { user: string | undefined, password: string | undefined } {
    return {
      user: process.env["CH5CLI_DEPLOY_USER"],
      password: process.env["CH5CLI_DEPLOY_PW"]
    };
  }
}
