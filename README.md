# mini-haystack-ts

> A GitHub App built with [Probot](https://github.com/probot/probot) that listens to pull request and add a new label/commit to it as well as automate workflow.

## How it works

When a pull request (PR) is opened, the bot checks if the PR title contains the word "Hackstack". If it does, a "Haystack" label is added to the PR. It also calculates the average pull request size of the repository where the bot was installed and compares it with the current pull request size, subsequently adding a comparison comment to the PR. When a PR is closed, a comment is added automatically telling the user how long the PR took to be completed.

The mini-haystack-bot also runs a Github Action which sleeps 10 to 20 seconds randomly after a PR push workflow has been completed, as well as add a comment to the PR on how long it took the Github Action (CI) to run.

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

<!-- ## Docker

```sh
# 1. Build container
docker build -t mini-haystack-ts .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> mini-haystack-ts
``` -->

## Contributing

If you have suggestions for how mini-haystack-ts could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2021 Stephen Okpalaononuju <stephenokpala@gmail.com>
