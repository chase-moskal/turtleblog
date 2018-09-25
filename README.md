
# turtleblog

&nbsp; *simple blog generator*

### turtleblog is made of three simple functions

1. **`turtle-read`** — read a source directory and generate a website as a json blob
2. **`turtle-transform-pass`** *(optional)* — add any number of transform plugins
3. **`turtle-write`** — save the whole website to disk, html and all

### turtleblog via command line

```bash
#!/bin/bash

# turtleblog tools are designed to be piped together

turtle-read --source src \   # load the website source
  | turtle-transform-pass \  # add any number of transforms
  | turtle-write --dist dist # save the website output

# of course the transforms are optional, so you can just do this

turtle-read | turtle-write

# turtle-read's default source directory is "source"
# turtle-write's default dist directory is "dist"
```

### turtleblog via node

```js
import {turtleRead, turtleTransformPass, turtleWrite} from "turtleblog"

async function main() {

	// 1. turtle-read the website
	let website = await turtleRead({source: "src"})

	// 2. turtle-transform the website (optional)
	website = await turtleTransformPass({website})

	// 3. turtle-write the website
	await turtleWrite({website, dist: "dist"})
}
```

### turtleblog out-of-the-box details

- `turtle-write` just writes files to disk, so it's pretty straight forward
- `turtle-transform-pass` doesn't do anything, it's just a placeholder example
- `turtle-read` is where the money is, it reads your source directory and decides how to actually generate the website
	- expects your source directory to adhere to a common structure (to be explained later)
	- compiles markdown posts
	- compiles html from pug layouts
	- compiles sass files
	- writes navigation and blog meta data
	- more detailed specifics of `turtle-read` coming soon

### `turtle-read` expected website source directory structure

```
{source-dir}/

  layouts/
    page.pug
    blog-index.pug
    blog-post.pug

  pages/
    {page-name}/  # standard page directory
      {section-name}.md  # sections are passed to pug layouts
      {section-name}.md
      ...{any other files are copied}
    cool-area/
      {page-name}/  # standard page directory
        {section-name}.md
        {section-name}.md

  blog/
    index/  # standard page directory
      {section-name}.md
      {section-name}.md
    posts/
      {year}/
        {month}/
          {day}/
            {page-name}/  # standard page directory
              {section-name}.md
              {section-name}.md
```

### roll your own turtle

turtleblog exposes its typescript interfaces, so you can extend `TurtleReader`, `TurtleTransformer`, and `TurtleWriter` to make your own replacement tools that interoperate with turtleblog
