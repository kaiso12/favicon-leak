### Your browser history leaks via favicon. Check now!

Recently read this research [pdf](http://web.archive.org/web/20210210122008/https://www.cs.uic.edu/~polakis/papers/solomos-ndss21.pdf), after that I decided to look for more efficient ways to use F-Cache, than doing dozen of redirects.

I started looking for a way to test F-Cache via javascript. During the experiments, I found several ways to do this, but I will describe the most interesting one(in my opinion).

>Warning: this is not a cross-browser solution. At the moment, I've only tested it on desktop chrome.

You can check the leak here: https://favicon-leak.site/

**Important! This leak works in incognito too (this is how F-Cache works)!**

### How it works

// TODO

### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
