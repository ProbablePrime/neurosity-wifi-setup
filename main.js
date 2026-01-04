import Alpine from 'alpinejs'
import { Neurosity, WebBluetoothTransport } from "@neurosity/sdk";

import { createNeurosityAlpine } from './NeurosityAlpine';

export const bt = new WebBluetoothTransport({autoConnect: false});

export const neurosity = new Neurosity({
  autoSelectDevice: true,
  bluetoothTransport: bt,
  streamingMode: "bluetooth-with-wifi-fallback"
});

neurosity.bluetooth.logs().subscribe(msg => console.log(msg));

const neurosityStore = createNeurosityAlpine(neurosity);
Alpine.store('neurosity', neurosityStore);

window.Alpine = Alpine
window.neurosity = neurosity;
Alpine.start()
