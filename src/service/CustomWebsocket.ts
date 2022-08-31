import { Client } from "@stomp/stompjs";

/*
Skontant kako uraditi promes da se saceka konekcija pa onda da moze sub
*/
export default class CustomWebSocket {

    private static instance: CustomWebSocket;

    private client: Client;
    private ws: string = process.env.VUE_APP_WEBSOCKET;


    private constructor() {
        // connect to websocket when creating instance

            this.client = new Client({
                brokerURL: this.ws,
                connectHeaders: {},
                debug: function (str) {
                    console.log(str)
                },
                reconnectDelay: 30000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: () => {
                    console.log("Open custom websocket");
                },
            });

            this.client.activate()

    }

    public static getInstance(): CustomWebSocket {

        if (!CustomWebSocket.instance) {
            CustomWebSocket.instance = new CustomWebSocket()
        }

        return CustomWebSocket.instance;
    }

    public getClient(): Client {
        return this.client;
    }

    public async isConnected() : Promise<boolean> {
        return new Promise((resolve) => {
            resolve(this.client.connected);
        })
    }

}