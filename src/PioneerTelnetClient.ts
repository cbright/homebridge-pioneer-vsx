import {
    Logging,
} from "homebridge";

import {
    Socket
} from "net"

export = PioneerTelnetClient;

class PioneerTelnetClient {

    private readonly log: Logging;

    constructor(log: Logging) {
        this.log = log;
        log.debug("Got Here.");

    }

    send(msg: string) {
        return new Promise<string>((resolve, reject) => {
            let socket = new Socket()
            socket.setTimeout(2000, () => socket.destroy());
            socket.once('connect', () => socket.setTimeout(0));
            socket.connect(23, "192.168.1.135", () => {
                this.log.debug("[Pioneer Telnet Client] connected");
                socket.write(msg + "\r");
            });

            socket.on("data", (d) => {
                let data = d
                    .toString()
                    .replace('\n', '')
                    .replace('\r', '');
                resolve(data);
                socket.end();
                resolve(data.toString());
            });

            socket.on('error', (err) => {
                reject(err);
            });
        });
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