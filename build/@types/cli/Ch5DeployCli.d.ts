import * as commander from "commander";
export declare class Ch5DeployCli {
    private readonly _cliUtil;
    constructor();
    setupDeployCommand(program: commander.Command): void;
    private deploy;
    private validateDeployOptions;
    private getUserAndPassword;
}
