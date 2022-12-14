# Prog Rock Stable Viewer

Viewer of [Prog Rock Stable](https://github.com/lowfuel/progrock-stable)

![screenshot](https://user-images.githubusercontent.com/15027/191093774-4c8228b3-281c-426e-8b00-c371dd8ddea7.png)

View images created through Prog Rock Stable (PRS). Working towards generic stable diffusion viewer from the various SD output configurations.

- Updates view as you generate images
- Access settings via settings JSON for each image
- Run locally

Generally runs an express app that the front end queries for updates to files. The express server will query your local directories. Not currently designed to be distributed.

Note: Highly recommended to use `save_settings: true`, `--save_settings=true` so you can see the prompts and settings for each image in the viewer. Not tested without this enabled (might be fine though).

## Install

Download/clone this repo.

```
git clone https://github.com/rockerBOO/prs-viewer
cd prs-viewer
```

```
yarn install
```

## Usage

Runs as client/server via a browser

Note: Recommended to use development version but building it could probably also work.

Start up client:

```
yarn dev
```

Start up server:

```
yarn serve
```

Start up web socket server:

```
yarn wsserve
```

- Client runs on `http://127.0.0.1:5173` (should also be presented in the output of the yarn dev)
- Server runs on `http://localhost:3000` for serving json and settings and images
- Web socket server runs separately on `ws://localhost:8999` for file updates

## Configuration

You can configure the out directories and ports for the wsserver and httpserver to allow you to
run multiple servers on the same computer.

```sh
PRS_VIEWER_OUT=/home/mine/prs/out yarn serve
PRS_VIEWER_OUT=/home/mine/prs/out yarn wsserve
```

And/or set the port for the web socket server.

```sh
PRS_VIEWER_WSSERVE_PORT=8999
```

Or pass as arguments

```sh
yarn wsserve --out /path/to/my/outputs --port 8999
yarn serve --out /path/to/my/outputs --port 3000
```

And can set the frontend to use these new endpoints. Can also be hosted elsewhere and
have a static frontend (no need to run in development or make new builds when you change endpoints)

```
http://localhost:5173/analog?wshost=localhost:9000&httphost=localhost:3000
```

This sets the values on load, so if you reload you'll need these values set again. Ideally we save the configuration to
local storage, so it stays consistent but then requires an easy way to reset it if required.

## Controls

- `<esc>` close image modal
- click on empty space on modal to close

## Future

I plan on making this:

- More configurable
- Swapping color schemes
- Allowing different dimensions of images to be shown
- Better performance when showing a lot of images
- Allow both ws and http running on the same server code

## Thanks

Thanks to [lowfuel](https://github.com/lowfuel) for creating and spending time making PRS. Please [subscribe to their Patreon](https://www.patreon.com/jasonmhough?fan_landing=true) to help support them.

- [CompVis](https://github.com/CompVis/stable-diffusion)
- [Stability AI](https://stability.ai/)
- [Runway](https://runwayml.com/)
- [Neonsecret](https://github.com/neonsecret/stable-diffusion)
- [Basujindal](https://github.com/basujindal/stable-diffusion)
- [Katherine Crowson's k-diffusion implementation](https://github.com/crowsonkb/k-diffusion)
- [Karras et al.](https://arxiv.org/abs/2206.00364)
- And all the contributors and communicators of stable diffusion
