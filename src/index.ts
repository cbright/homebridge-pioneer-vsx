import {
    AccessoryConfig,
    AccessoryPlugin,
    API,
    CharacteristicEventTypes,
    CharacteristicGetCallback,
    CharacteristicSetCallback,
    CharacteristicValue,
    DynamicPlatformPlugin,
    HAP,
    IndependentPlatformPlugin,
    Logging,
    PlatformAccessory,
    PlatformConfig,
    Service,
    UnknownContext
  } from "homebridge";
import { PlatformPlugin } from "homebridge/lib/api";
  import PioneerDiscover from "./PioneerDiscover";

  const PLUGIN_NAME = "homebridge-pioneer-vsx";
  
  /*
   * IMPORTANT NOTICE
   *
   * One thing you need to take care of is, that you never ever ever import anything directly from the "homebridge" module (or the "hap-nodejs" module).
   * The above import block may seem like, that we do exactly that, but actually those imports are only used for types and interfaces
   * and will disappear once the code is compiled to Javascript.
   * In fact you can check that by running `npm run build` and opening the compiled Javascript file in the `dist` folder.
   * You will notice that the file does not contain a `... = require("homebridge");` statement anywhere in the code.
   *
   * The contents of the above import statement MUST ONLY be used for type annotation or accessing things like CONST ENUMS,
   * which is a special case as they get replaced by the actual value and do not remain as a reference in the compiled code.
   * Meaning normal enums are bad, const enums can be used.
   *
   * You MUST NOT import anything else which remains as a reference in the code, as this will result in
   * a `... = require("homebridge");` to be compiled into the final Javascript code.
   * This typically leads to unexpected behavior at runtime, as in many cases it won't be able to find the module
   * or will import another instance of homebridge causing collisions.
   *
   * To mitigate this the {@link API | Homebridge API} exposes the whole suite of HAP-NodeJS inside the `hap` property
   * of the api object, which can be acquired for example in the initializer function. This reference can be stored
   * like this for example and used to access all exported variables and classes from HAP-NodeJS.
   */
  let hap: HAP;
  
  /*
   * Initializer function called when the plugin is loaded.
   */
  export = (api: API) => {
    hap = api.hap;
    api.registerPlatform("PioneerVSXPlugin", PioneerVsxPlugin);
  };
  
  class PioneerVsxPlugin implements DynamicPlatformPlugin {
  
    private readonly log: Logging;
    private readonly accessory: PlatformAccessory[] = [];
  
    constructor(log: Logging, config: PlatformConfig, api: API) {
      this.log = log;

      api.on("didFinishLaunching", () => {
        let informationService = new hap.Service.AccessoryInformation()
        .setCharacteristic(hap.Characteristic.Manufacturer, "Custom Manufacturer")
        .setCharacteristic(hap.Characteristic.Model, "Custom Model");
  
      this.services.push(informationService);

      let discoveryService = new PioneerDiscover(log);
      discoveryService.startDiscovery()
      .then(d => {
        log.debug(`${d.length} inputs returned`);
        for(let inpt of d){
          let srvc = new api.hap.Service.InputSource(inpt.name);
          srvc.setCharacteristic(hap.Characteristic.ConfiguredName,inpt.inputId)
          srvc.setCharacteristic(hap.Characteristic.Name,inpt.name)
          srvc.setCharacteristic(hap.Characteristic.IsConfigured, true);
          srvc.setCharacteristic(hap.Characteristic.CurrentVisibilityState, inpt.isVisible ? 1 : 0);

          this.services.push(srvc);
        }
      });
      });

      
      

    }

    configureAccessory(accessory: PlatformAccessory<UnknownContext>): void {
        
    }
  
    /*
     * This method is optional to implement. It is called when HomeKit ask to identify the accessory.
     * Typical this only ever happens at the pairing process.
     */
    identify(): void {
      this.log("Identify!");
    }
  
  }