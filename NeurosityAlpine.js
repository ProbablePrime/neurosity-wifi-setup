import { createObservableHelper } from './ObservableHelper';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const LOG_NETWORKS = false;
// Abstracts neurosity stuff from alpine
/**
 * @param {Neurosity} client
 * @param {Alpine} Alpine
 */
export function createNeurosityAlpine(client, Alpine) {
    var helper;
    return {
        client,

        email: '',
        password: '',
        authenticated: false,
        user: null,

        ssid: '',
        wifiPassword: '',
        wifiConnected: false,

        state: '',
        bluetooth: false,

        deviceId: '',
        deviceClaimed: false,

        done: false,

        init() {
            helper = createObservableHelper(this);

            // AUTH
            helper.subscribe(this.client.onAuthStateChanged(), 'user');
            helper.subscribe(this.client.onAuthStateChanged(), 'authenticated', user => user != null);

            // Connection state
            // *   // { streamingMode: "wifi-only", activeMode: "wifi", connected: true }
            helper.subscribe(this.client.streamingState(), 'state', state => `Mode: ${state.streamingMode}. activeMode: ${state.activeMode}, connected: ${state.connected}`);
            helper.subscribe(this.client.streamingState(), 'bluetooth', state => state.activeMode == 'bluetooth');

            Alpine.effect(async () => {
                if (this.bluetooth && this.deviceId === '') {
                    await sleep(1000); //TODO: there's a race condition on connection, because the SDK is already requesting this information
                    var id = await this.client.bluetooth.getDeviceId();
                    this.deviceId = id;
                } else if(!this.bluetooth) {
                    this.deviceId = '';
                }
            });

            Alpine.effect(async () => {
                if (this.deviceId === ''){
                    this.deviceClaimed = false;
                    return;
                }
                var res = await this.hasDevice(this.deviceId);

                this.deviceClaimed = res;
            });

            if (LOG_NETWORKS)
            {
                this.client.bluetooth.wifi.nearbyNetworks().subscribe(a => console.log(a)); 
            }
        },

        login() {
            return this.client.login({ email: this.email, password: this.password });
        },

        connect() {
            this.client.bluetooth.connect();
        },

        wifiConnect() {
            console.log(`SSID: ${this.ssid}, password: ${this.wifiPassword}`);
            return this.client.bluetooth.wifi.connect(this.ssid, this.wifiPassword);
        },

        get username() {
            if (this.authenticated)
                return this.user.email;
            else
                return "Not Signed in";
        },

        async hasDevice(deviceId) {
            var devices = await this.client.getDevices();
            return devices.some(device => device.deviceId === deviceId);
        },

        async claimDevice(deviceId) {
            return this.client.claimDevice(deviceId);
        },
        async releaseDevice(deviceId) {
            return this.client.releaseDevice(deviceId);
        }
    };
}
