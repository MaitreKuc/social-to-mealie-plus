# Social Media to Mealie Plus

This is a fork of GerardPolloRebozado's project, with some improvements that I deemed necessary. However, all credit for the original work goes to him.

I added a database to store information about the variables and URLs that have already been processed, to prevent duplicate imports. This includes a web page for configuration and another web page to display the import history.

A better interface for performing bulk imports would also be helpful.


Have you found a recipe on social media and don’t want to write it out yourself? This tool lets you import recipes from videos directly into [Mealie](https://github.com/mealie-recipes/mealie).

**Tested social media platforms:**
- Instagram
- TikTok
- Facebook
- YouTube Shorts
- Pinterest

Other sites may work as well, since the tool uses `yt-dlp` to download videos. If you encounter issues with other websites, please open an issue.

> **Note:** If you receive a `BAD_RECIPE` error, it may be due to Mealie’s recipe parsing. If you find a better prompt or solution, feel free to open an issue or PR!

## Features

- Import posts into Mealie with a link and a click
- [iOS Shortcut](https://www.icloud.com/shortcuts/a66a809029904151a39d8d3b98fecae4) for easy importing

## Screenshot

![Screenshot of the web interface](./public/screenshot.png "Screenshot of the web interface")


## Requirements

- [Mealie 1.9.0+](https://github.com/mealie-recipes/mealie) with AI provider configured ([docs](https://docs.mealie.io/documentation/getting-started/installation/open-ai/))
- [Docker](https://docs.docker.com/engine/install/)

## Deployment

<details open>
    <summary>Docker Compose</summary>

1. Create a `docker-compose.yml` file based on the example below. Use environment variable substitution to keep your secrets out of version control. You can define your secrets in a `.env` file in the same directory.

    ```yml
    services:
      social-to-mealie:
        restart: unless-stopped
        image: ghcr.io/MaitreKuc/social-to-mealie-plus:latest
        container_name: social-to-mealie-plus
        volume:
          - /path/to/cookies.txt:\app\cookies.txt # Optional, but recommended for instagram id problem
        ports:
          - 4000:3000
        security_opt:
          - no-new-privileges:true
    ```


2. **Start the service with Docker Compose:**
   ```sh
   docker-compose up -d
   ```
</details>

<details open>
    <summary>Docker Run</summary>

```sh
docker run --restart unless-stopped --name social-to-mealie-plus \
  -v /path/to/cookies.txt:/app/cookies.txt
  -p 4000:3000 \
  --security-opt no-new-privileges:true \
  ghcr.io/MaitreKuc/social-to-mealie-plus:latest
```
</details>

## Environment Variables

All variables can be modified directly through the web interface; there's no need to pass them to Docker anymore.

| Variable         | Required | Description                                                      |
|------------------|----------|------------------------------------------------------------------|
| OPENAI_URL       | Yes      | URL for the OpenAI API                                           |
| OPENAI_API_KEY   | Yes      | API key for OpenAI                                               |
| WHISPER_MODEL    | Yes      | Whisper model to use                                             |
| MEALIE_URL       | Yes      | URL of your Mealie instance                                      |
| MEALIE_API_KEY   | Yes      | API key for Mealie                                               |
| USER_PROMPT      | No       | Custom prompt for recipe extraction                              |
| EXTRA_PROMPT     | No       | Additional instructions for AI, such as language translation     |
| COOKIES_PATH     | Maybe    | If you encounter cookie issues with yt-dlp                       |
