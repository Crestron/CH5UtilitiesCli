// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { config } from "dotenv";

config();

let path = `${__dirname}/../../.env`;

config({ path });

export const BUILD_VERSION = process.env.BUILD_VERSION || '-';
