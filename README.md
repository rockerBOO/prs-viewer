# Prog Rock Stable Viewer

Viewer of [Prog Rock Stable](https://github.com/lowfuel/progrock-stable)

![screenshot](https://user-images.githubusercontent.com/15027/191093774-4c8228b3-281c-426e-8b00-c371dd8ddea7.png)

View images created through Prog Rock Stable (PRS).

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
- Server runs on `http://localhost:3000`
- Web socket server runs separately on `http://localhost:8999`

## Configuration

Most things are hard coded in the code.

Change `index.js` and `wsserver.js` to the directory your out files are for the server. See `out_dir` in `prs` `settings.json` to set this directory.

```
const prsOut = "/mnt/900/builds/prs/out";
```

In various front end JS files there are references to `localhost:3000`, so change those if you want a different server address.

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
