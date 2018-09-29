
# turtleblog

&nbsp; *simple blog generator*

### turtleblog is based on three simple functions

1. **`turtle-read`** — read a source directory, return website metadata json
2. **`turtle-generate`** — compile pug, sass, and return website output json
3. **`turtle-write`** — save the website to disk

### turtleblog via command line

```bash
#!/bin/bash

# turtleblog tools pipe together

turtle-read | turtle-generate | turtle-write
 #          ^                 ^
 #    {metadata json}    {output json}

# there are two points where the tools pass json data,
# easy opportunity to transform that json yourself

# turtleblog is flexible, so you can tweak arguments and add transformers

turtle-read --source src           # load website source
  | turtle-transform-metadata-pass # (optional) transform metadata
  | turtle-generate                # compile pug, sass, etc
  | turtle-transform-output-pass   # (optional) transform output
  | turtle-write --dist dist       # write website to disk

# there are two types of transformers you can add
#  1. metadata transfomers change the json data before compilations occur
#  2. output transformers change the json before writing to disk

# turtle-read's default source directory is "source"
# turtle-write's default dist directory is "dist"

```

### turtleblog via node

```js
import {turtleRead, turtleGenerate, turtleWrite} from "turtleblog"

async function main() {

	// 1. read the website
	const websiteMetadata = await turtleRead({source: "src"})

	// 2. generate the website
	const websiteOutput = await turtleGenerate({websiteMetadata})

	// 3. write the website
	await turtleWrite({dist: "dist", websiteOutput})
}
```

### `turtle-read`'s expected website source directory structure

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

turtleblog exposes its typescript interfaces, so you extend turtleblog and make your own interoperable replacement tools

of course, you could wholly replace turtle-read, if you wanted to have control over your directory structure

also note you could wholly replace turtle-generate, for control over the compilation process

### pug locals

- all pages
	- `pageMetadata`
	- `websiteMetadata`

- articles
	- `articleMetadata`

- blog posts
	- `blogPostMetadata`

- blog index
	- `blogIndexMetadata`
