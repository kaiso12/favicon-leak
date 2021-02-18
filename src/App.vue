<template>
  <div style="border: 1px solid #eee;background: white;">
    <div class="header">
      <div class="tab"><img style="vertical-align: top;" src="./assets/loader.gif"> Favicon Leak Test</div>
      <div style="" class="tab bg">
        <img style="vertical-align: top;width: 16px;height: 16px" src="https://github.githubassets.com/favicons/favicon.svg?tab">
        <a href="https://github.com/1chtulhu/favicon-leak" target="_blank">Github</a>
      </div>
    </div>
    <div id="app">

      <div style="font-size: 17px;border-bottom: 1px solid #eee;font-weight: bold;margin-bottom: 10px">
        Lets see, which favicons exists in your F-Cache
        <div style="font-size: 12px;color: gray">You can create new browser profile to start from empty F-Cache</div>
      </div>
      <div v-if="testDomain == -1" class="menu">
        <div><label><input v-model="speed" type="radio" :value="300"> Speed 1 (lower accuracy)</label></div>
        <div><label><input v-model="speed" type="radio" :value="600"> Speed 2 </label></div>
        <div><label><input v-model="speed" type="radio" :value="1000"> Speed 3</label></div>
        <div><label><input v-model="speed" type="radio" :value="2000"> Speed 4 (more accurate)</label></div>
        <div style="margin-top: 10px">
          <button @click="runTest" class="button">Start test ({{ domains.length }} sites)</button>
        </div>
      </div>
      <div v-else class="results">
        <div v-for="(urls, domain) in sites" :class="[getClass(domain)]" class="site">
          <span class="check wait">[?]</span>
          <span class="check yes">[yes]</span>
          <span class="check no">[no]</span>
          <span class="check err">[err]</span>
          <a style="color: #2c3e50" target="_blank" :href="'https://' + domain">{{ domain }}</a> <span style="font-size: 11px;color: gray">{{ urls[0] }}</span>
        </div>
      </div>
      <div v-if="completed" class="finish">
        <b>{{ sitesInCache.length }} favicons in your F-Cache!</b><br>
        <span style="color: gray;font-size: 14px">If some sites are not in F-Cache, try visiting them again and repeat this test (simply reload the page).</span>
      </div>
    </div>
  </div>
</template>

<script>
import sites from './sites'
export default {
  name: 'App',
  data() {
    return {
      action: '',
      sites,
      sitesInCache: [],
      sitesNotInCache: [],
      sitesWithErrors: [],
      testDomain: -1,
      testUrl: 0,
      speed: 1000,
      completed: false,
    }
  },
  computed: {
    domains() {
      return Object.keys(this.sites)
    },
    currentDomain() {
      return this.domains[this.testDomain];
    }
  },
  methods: {
    runTest() {
      this.testDomain = 0;
      this.testNext();
    },
    getClass(domain) {
      if (this.sitesInCache.indexOf(domain) != -1) {
        return 'in';
      } else if (this.sitesNotInCache.indexOf(domain) != -1) {
        return 'out';
      } else if (this.sitesWithErrors.indexOf(domain) != -1) {
        return 'error';
      } else if (domain == this.currentDomain) {
        return 'test';
      }
    },
    testNext() {
      let nextUrl = this.sites[this.currentDomain][this.testUrl];
      if (!nextUrl) {
        let nextDomain = this.domains[this.testDomain + 1];
        if (this.sites[this.currentDomain][this.testUrl + 1]) {
          this.testUrl++;
          return this.testNext();
        } else if (nextDomain && this.sites[nextDomain][0]) {
          this.testDomain++;
          this.testUrl = 0;
          return this.testNext();
        } else {
          this.completed = true;
        }
      } else {
        this.faviconDBCheck(nextUrl, (result) => {
          if (result.error) {
            this.sitesWithErrors.push(this.currentDomain);
          } else if (result.cache) {
            this.sitesInCache.push(this.currentDomain);
            this.testUrl = 99;
            this.testNext();
            return;
          } else {
            this.sitesNotInCache.push(this.currentDomain);
          }
          this.testUrl++;
          this.testNext();
        }, this.speed)
      }
    },
    faviconDBCheck(url, callback, downloadTimeoutMs) {
      let img = new Image();
      img.onload = function () {
        let img = new Image();
        img.src = url;
        // must be memory cache!
        if (img.complete && img.width + img.height) {
          let newLink = document.createElement('link');
          newLink.rel = 'shortcut icon';
          newLink.href = url;
          document.head.appendChild(newLink);
          setTimeout(function(){
            let img = new Image();
            img.src = url;
            let isInMemory = img.complete && img.width + img.height;
            newLink.parentNode.removeChild(newLink);
            if (isInMemory) {
              callback({cache:true})
            } else {
              // favicon not in cache
              callback({cache:false})
            }
          }, downloadTimeoutMs || 1000);
        } else {
          // test error, try once more (if want)
          callback({error:'test_image_slow_read'})
        }
      };
      img.onerror = function () {
        callback({error:'image_not_loaded'})
      }
      img.src = url;
    }
  }
}
</script>

<style>
  .finish {
    margin: 10px 0;
    color: green;
    border-top: 1px solid;
    padding-top: 10px;
  }
  .button {
    position: relative;
    display: block;
    width: 200px;
    height: 36px;
    border-radius: 18px;
    background-color: #1c89ff;
    border: solid 1px transparent;
    color: #fff;
    font-size: 18px;
    font-weight: 300;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
  }
  .header {
    background: #eee;
  }
  .tab {
    display: inline-block;
    background: white;
    padding: 10px;
    margin-left: 5px;
    margin-top: 5px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    font-weight: bold;
    font-family: monospace;
  }
  .tab.bg {
    margin-left: 0;
    background: #eee;
    font-weight: normal;
  }
  .tab a {
    color: #2c3e50;
    text-decoration: none;
  }
  h1 {
    text-align: center;
    text-decoration: underline;
    text-transform: uppercase;
    margin: 0;
  }
  #app {

    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    border-top: 1px solid #eee;
    margin-top: 5px;
    color: #2c3e50;
    padding: 20px;
  }
  .site {
    margin: 5px 0;
    padding: 5px;
  }

  .check {
    display: none;
  }
  .check.wait {
    display: inline;
  }
  .site.test {
    font-weight: bold;
  }
  .site.in .check.wait,.site.out .check.wait, .site.error .check.wait {
    display: none;
  }
  .site.in .check.yes, .site.out .check.no, .site.error .check.err {
    display: inline;
    font-weight: bold;
  }
  .site.in .check {
    color: green;
  }
  .site.out .check {
    color: black;
  }
  .site.error .check {
    color: red;
  }
</style>
