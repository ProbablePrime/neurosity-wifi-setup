# Neurosity Wifi Setup

Unfortunately the neurosity app, doesn't work on my phone:
![alt text](image.png)

My phone is quite new, so this is probably just a Google App Store thing. 

Some users in supported reported the same issue:
![alt text](image-1.png)

I was annoyed, so I wrote this app to fix this.

## How?
The regular neurosity client, exposes a set of [wifi related BT operations](https://github.com/neurosity/neurosity-sdk-js/blob/master/src/api/bluetooth/BluetoothClient.ts#L395).

This app uses those.


## Setup
1. Git Clone
2. npm install
3. npm run dev
4. Open the URL for the web server in **Chrome**(Other browsers untested)
5. Login with your neurosity account on the page.
6. Connect to BT using the button, select the crown in the Chrome popup once it appears.
7. Once connected, enter the SSID and password that you'd like it to connect to and press Connect Wifi

## Debugging
Open the web console, to double check stuff. You should see a success.

## TODO
1. Make this more user friendly, I'm an engineer, but this app is scary
    - Maybe: https://github.com/glhd/alpine-wizard
2. Wifi Management - Forget/add other networks
3. Deployment - something like neurositywifi.probableprime.co.uk.


## Technologies
1. Alpine JS
2. Vite



