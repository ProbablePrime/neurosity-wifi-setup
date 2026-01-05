import { createObservableHelper } from './ObservableHelper'

const LOG_NETWORKS = false;
// Abstracts neurosity stuff from alpine
/**
 * @param {Neurosity} client
 */
export function createNeurosityAlpine(client) {
    var helper;
    return {
        client,

        email: '',
        password: '',

        ssid: '',
        wifiPassword: '',

        authenticated: false,
        user: null,
        state: '',
        bluetooth: false,

        init() {
            helper = createObservableHelper(this);

            // AUTH
            helper.subscribe(this.client.onAuthStateChanged(), 'user');
            helper.subscribe(this.client.onAuthStateChanged(), 'authenticated', user => user != null);

            // Connection state
            // *   // { streamingMode: "wifi-only", activeMode: "wifi", connected: true }
            helper.subscribe(this.client.streamingState(), 'state', state => `Mode: ${state.streamingMode}. activeMode: ${state.activeMode}, connected: ${state.connected}`);
            helper.subscribe(this.client.streamingState(), 'bluetooth', state => state.activeMode == 'bluetooth');

            // Disable by default due to security/console spam
            if (LOG_NETWORKS)
            {
                this.client.bluetooth.wifi.nearbyNetworks().subscribe(a => console.log(a)); 
            }
        },

        login() {
            return this.client.login({ email: this.email, password: this.password });
        },

        async hasDevice(deviceId) {
            var devices = await this.client.getDevices();
            var found = devices.some(device => device.deviceId);
            return found;
        },

        async claimDevice(deviceId) {
            this.client.claimDevice(deviceId);
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
        }
    };
}
