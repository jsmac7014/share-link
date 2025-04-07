module.exports = {
    servers: {
        one: {
            host: process.env.SERVER_HOST,
            username: 'ubuntu',
            pem: '/home/runner/.ssh/deploy_key',
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
            image: 'jungwoo-meteor-puppeteer',
            buildInstructions: [
                'FROM zodern/meteor:root',
                'RUN apt-get update && apt-get install -y \\',
                '  wget \\',
                '  ca-certificates \\',
                '  fonts-liberation \\',
                '  libappindicator3-1 \\',
                '  libasound2 \\',
                '  libatk-bridge2.0-0 \\',
                '  libatk1.0-0 \\',
                '  libcups2 \\',
                '  libdbus-1-3 \\',
                '  libgdk-pixbuf2.0-0 \\',
                '  libnspr4 \\',
                '  libnss3 \\',
                '  libx11-xcb1 \\',
                '  libxcomposite1 \\',
                '  libxdamage1 \\',
                '  libxrandr2 \\',
                '  xdg-utils \\',
                '  --no-install-recommends && rm -rf /var/lib/apt/lists/*',
                'ENV PUPPETEER_SKIP_DOWNLOAD=true'
            ]
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
