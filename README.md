# Social media to Mealie

Found any recipe on a social media and don't want to manually write it yourself? use our tool to import any video from them in Mealie.
The only tested social media are:
- Instagram
- TikTok
- Facebook
- YouTube Shorts
- Pinterest

But it may work with others as it used yt-dlp to download the video, if you find any issues using other websites, please open an issue.
Currently, some post may give BAD_RECIPE error, with is a mealie issue parsing the recipe, I have still not found why 
sometimes works and sometimes not.
The prompt can be customized in the ENV, so if you find a better one, please open an issue or PR.

## Deployment

To deploy this just use the docker-compose.yml and populate all the environment variables

## Features

-   Import posts in Mealie with a link and the click of a button
-   Use this [ios shortcut](https://www.icloud.com/shortcuts/a66a809029904151a39d8d3b98fecae4) so you just need to click share button

## Screenshot

![Screenshot of teh web interface](./public/screenshot.png "Screenshot of the web interface")
