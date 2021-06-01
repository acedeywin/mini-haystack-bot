# mini-haystack-ts

> A GitHub App built with [Probot](https://github.com/probot/probot) that A bot that listens to pull request and add a new label/commit to it as well as automate workflow.

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t mini-haystack-ts .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> mini-haystack-ts
```

## Contributing

If you have suggestions for how mini-haystack-ts could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2021 Stephen Okpalaononuju <stephenokpala@gmail.com>
