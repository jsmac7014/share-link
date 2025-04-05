module.exports = {
    servers: {
        one: {
            host: process.env.SERVER_HOST,
            username: 'ubuntu',
            pem: '/home/runner/.ssh/id_rsa',
        }
    },

    app: {
        name: 'linkly',
        path: '.',

        servers: {
            one: {},
        },

        buildOptions: {
            serverOnly: true,
        },

        env: {
            ROOT_URL: 'https://linkly.jungwoo.ovh',
            MONGO_URL: 'mongodb://mongodb/meteor',
            MONGO_OPLOG_URL: 'mongodb://mongodb/local',
        },

        docker: {
            image: 'zodern/meteor:root',
        },

        // Show progress bar while uploading bundle to server
        // You might need to disable it on CI servers
        enableUploadProgressBar: true
    },

    mongo: {
        version: '4.4.12',
        servers: {
            one: {}
        }
    },

    // (Optional)
    // Use the proxy to setup ssl or to route requests to the correct
    // app when there are several apps

    proxy: {
        domains: 'linkly.jungwoo.ovh',
        ssl: {
            // Enable Let's Encrypt
            letsEncryptEmail: 'jsmac7014@gmail.com',
            forceSSL: true,
        }
    }
};
