import { ProgrammableSwitchOutputState } from "hap-nodejs/dist/lib/definitions";
import {
    Logging,
} from "homebridge";
import PioneerTelnetClient from "./PioneerTelnetClient";

export = PioneerDiscover;

const inputToType = {
    '00': 0, // PHONO -> Characteristic.InputSourceType.OTHER
    '01': 0, // CD -> Characteristic.InputSourceType.OTHER
    '02': 2, // TUNER -> Characteristic.InputSourceType.TUNER
    '03': 0, // TAPE -> Characteristic.InputSourceType.OTHER
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
        for(var input in inputToType){
            this.log.debug(`attempting input ${input}`);
            let discoveredInput = await this.client.send(`?RGB${input}`);
            this.log.debug(`recieved ${discoveredInput}`);
        }

        return [];
    }


    // --------------------------- CUSTOM METHODS ---------------------------

    //   addAccessory(name: string) {
    //     this.log.info("Adding new accessory with name %s", name);

    //     // uuid must be generated from a unique but not changing data source, name should not be used in the most cases. But works in this specific example.
    //     const uuid = hap.uuid.generate(name);
    //     const accessory = new Accessory(name, uuid);

    //     accessory.addService(hap.Service.Lightbulb, "Test Light");

    //     this.configureAccessory(accessory); // abusing the configureAccessory here

    //     this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
    //   }

    //   removeAccessories() {
    //     // we don't have any special identifiers, we just remove all our accessories

    //     this.log.info("Removing all accessories");

    //     this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, this.accessories);
    //     this.accessories.splice(0, this.accessories.length); // clear out the array
    //   }

    //   createHttpService() {
    //     this.requestServer = http.createServer(this.handleRequest.bind(this));
    //     this.requestServer.listen(18081, () => this.log.info("Http server listening on 18081..."));
    //   }

    //   private handleRequest(request: IncomingMessage, response: ServerResponse) {
    //     if (request.url === "/add") {
    //       this.addAccessory(new Date().toISOString());
    //     } else if (request.url === "/remove") {
    //       this.removeAccessories();
    //     }

    //     response.writeHead(204); // 204 No content
    //     response.end();
    //   }

    // ----------------------------------------------------------------------
}