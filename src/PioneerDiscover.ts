import { ProgrammableSwitchOutputState } from "hap-nodejs/dist/lib/definitions";
import {
    Logging,
} from "homebridge";
import PioneerTelnetClient from "./PioneerTelnetClient";

export = PioneerDiscover;

//Todo make model specific
const inputToType: { [key: string]: number } = {
    '00': 0, // PHONO -> Characteristic.InputSourceType.OTHER
    '01': 0, // CD -> Characteristic.InputSourceType.OTHER
    '02': 2, // TUNER -> Characteristic.InputSourceType.TUNER
    //'03': 0, // TAPE -> Characteristic.InputSourceType.OTHER
    '04': 0, // DVD -> Characteristic.InputSourceType.OTHER
    '05': 3, // TV -> Characteristic.InputSourceType.HDMI
    '06': 3, // CBL/SAT -> Characteristic.InputSourceType.HDMI
    '10': 4, // VIDEO -> Characteristic.InputSourceType.COMPOSITE_VIDEO
    '12': 0, // MULTI CH IN -> Characteristic.InputSourceType.OTHER
    '13': 0, // USB-DAC -> Characteristic.InputSourceType.OTHER
    '14': 6, // VIDEOS2 -> Characteristic.InputSourceType.COMPONENT_VIDEO
    '15': 3, // DVR/BDR -> Characteristic.InputSourceType.HDMI
    '17': 9, // USB/iPod -> Characteristic.InputSourceType.USB
    '18': 2, // XM RADIO -> Characteristic.InputSourceType.TUNER
    '19': 3, // HDMI1 -> Characteristic.InputSourceType.HDMI
    '20': 3, // HDMI2 -> Characteristic.InputSourceType.HDMI
    '21': 3, // HDMI3 -> Characteristic.InputSourceType.HDMI
    '22': 3, // HDMI4 -> Characteristic.InputSourceType.HDMI
    '23': 3, // HDMI5 -> Characteristic.InputSourceType.HDMI
    '24': 3, // HDMI6 -> Characteristic.InputSourceType.HDMI
    '25': 3, // BD -> Characteristic.InputSourceType.HDMI
    '26': 10, // MEDIA GALLERY -> Characteristic.InputSourceType.APPLICATION
    '27': 0, // SIRIUS -> Characteristic.InputSourceType.OTHER
    '31': 3, // HDMI CYCLE -> Characteristic.InputSourceType.HDMI
    '33': 0, // ADAPTER -> Characteristic.InputSourceType.OTHER
    '34': 3, // HDMI7-> Characteristic.InputSourceType.HDMI
    '35': 3, // HDMI8-> Characteristic.InputSourceType.HDMI
    '38': 2, // NETRADIO -> Characteristic.InputSourceType.TUNER
    '40': 0, // SIRIUS -> Characteristic.InputSourceType.OTHER
    '41': 0, // PANDORA -> Characteristic.InputSourceType.OTHER
    '44': 0, // MEDIA SERVER -> Characteristic.InputSourceType.OTHER
    '45': 0, // FAVORITE -> Characteristic.InputSourceType.OTHER
    '48': 0, // MHL -> Characteristic.InputSourceType.OTHER
    '49': 0, // GAME -> Characteristic.InputSourceType.OTHER
    '57': 0 // SPOTIFY -> Characteristic.InputSourceType.OTHER
};

class PioneerDiscover {

    private readonly log: Logging;
    private readonly client: PioneerTelnetClient;

    constructor(log: Logging) {
        this.log = log;
        log.debug("Got Here.");

        this.client = new PioneerTelnetClient(log);
    }

    async startDiscovery() {
        this.log.info("Starting input discovery.")

        var inputs = [];

        for(var input in inputToType){
            this.log.debug(`attempting input ${input}`);
            let discoveredInput = await this.client.send(`?RGB${input}`);
            this.log.debug(`telnet client returned ${discoveredInput}`);

            if (discoveredInput.startsWith("RGB")){
                this.log.debug('Input recognized.');
                let inptId = discoveredInput.substring(0,5);
                let visibilityFlg = discoveredInput.substring(5,6);
                let displayName = discoveredInput.substring(6).trim();

                this.log.info(`input discovered: {inputId: ${inptId}, name: ${displayName}, visible: ${visibilityFlg} }`);

                inputs.push({
                    name: displayName,
                    inputId: inptId,
                    inputType: inputToType[input],
                    isVisible: visibilityFlg === "1" ? true : false,
                });

            } else if(discoveredInput === "E06"){
                this.log.debug('Invalid receiver input.');
            } else {
                this.log.warn('Unrecognized receiver output.');
            }
        }

        return inputs;
    }
}