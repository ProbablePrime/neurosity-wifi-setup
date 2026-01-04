import { createObservableHelper } from './ObservableHelper'

// Abstracts neurosity stuff from alpine
export function createNeurosityAlpine(client) {
    var helper 
    return {
        client,
        email: '',
        password: '',
        ssid: '',
        wifiPassword: '',
        authenticated: false,
        user: null,

        init() {
            helper = createObservableHelper(this);
            helper.subscribe(this.client.onAuthStateChanged(), 'user');
            helper.subscribe(this.client.onAuthStateChanged(), 'authenticated', user => user != null);
        },

        login() {
            return this.client.login({ email: this.email, password: this.password });
        },

        connect() {
            this.client.bluetooth.connect();
        },

        wifiConnect() {
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
