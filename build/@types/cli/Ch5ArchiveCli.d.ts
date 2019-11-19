import * as commander from "commander";
export declare class Ch5ArchiveCli {
    private readonly _cliUtil;
    constructor();
    setupArchiveCommand(program: commander.Command): void;
    private archive;
    private validateArchiveOptions;
    private extractKeyValuePairs;
}
