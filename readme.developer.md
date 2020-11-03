# CH5 Utilities CLI

> Archiving and distribution utilities from the ch5-utilities library wrapped as CLI commands.

## Table of Contents

- [Background](#background)
- [Setup](#setup)
- [Commands](#commands)
- [Usage](#usage)
- [License](#license)

## Background

The purpose of the library is to expose the [ch5-utilities](./../ch5-utilities/readme.md) archive and distribute functionality as two commands: `archive` and `deploy`.

## Setup

Before going through these steps, make sure you have completed the setup section in [ch5-utilities](./../ch5-utilities/readme.md), since it is a dependency.

Install the required packages.
```
yarn install
```

Add the ch5-utilities library.
```
yarn link ch5-utilities
```

Build the library.
```
yarn build
```

Publish the ch5-utilities-cli library for local usage.
```
yarn link
```

## Commands

#### yarn publish:local

After the initial setup, you can use this command to rebuild and publish changes in the library.

## Usage

The cli contains two commands: archive and deploy. After following the steps from above, just write `ch5-cli` in the terminal, and hit enter - it will display the default message for options and commands.
For details about how to use the commands, you can write `ch5-cli archive --help` or `ch5-cli deploy --help` - this will display the options and what they mean.


First you would need to run the archive command to generate the ch5z file, then you need to run the deploy command giving the archive path ( relative or absolute ).
The deploy command will prompt you for the SFTP user and password,

## Authentication to Control System

There are multiple ways in which the user can provide credentials to the ch5-cli:

- default values
- environment variables (`CH5CLI_DEPLOY_USER` and `CH5CLI_DEPLOY_PW`)
- a public/private key pair

The truth table below demonstrates the behavior depending on the parameters that are passed:


|`-u` identityUser|`-i` identityFile |`-p` prompt for credentials      | env vars | Authenticate with|
| ----------- | ----------- |----------- | ----------- |----------- |
|0|0|0|0|Default values|
|0|0|0|1|Environment variables|
|0|0|1|X|User and password from user prompt|
|0|1|0|0|System username (`$USER` on unix, `%USERNAME%` on windows)|
|0|1|0|1|User and passphrase from environment variables|
|0|1|1|X|User and passphrase from user prompt|
|1|0|X|X|Invalid combination. Will display an error message|
|1|1|0|0|Provided identityUser and identityFile. If passphrase is required, an error message is shown|
|1|1|0|1|Passphrase from environment variable, if required|
|1|1|1|X|Passphrase from user prompt|

#### Examples

```
> ch5-cli archive --project-name angular-demo-app --directory-name dist/NgIseCh5Demo --output-directory output-test
>
>
> ch5-cli deploy output-test/angular-demo-app.ch5z --deviceHost 192.168.2.44 --deviceDirectory display --deviceType touchscreen
```

## License

Copyright (C) 2018 to the present, Crestron Electronics, Inc.
All rights reserved.
No part of this software may be reproduced in any form, machine
or natural, without the express written consent of Crestron Electronics.
Use of this source code is subject to the terms of the Crestron Software 
Development Tools License Agreement under which you licensed this source code.

If you did not accept the terms of the license agreement,
you are not authorized to use this software. For the terms of the license,
please see the license agreement between you and Crestron at http://www.crestron.com/sla.
