import { DeviceType, OutputLevel } from "@crazvansandu/ch5-utilities";
export declare class Ch5CliUtil {
    writeError(error: Error): void;
    getOutputLevel(options: any): OutputLevel;
    getDeviceType(deviceTypeInput: string): DeviceType;
}
