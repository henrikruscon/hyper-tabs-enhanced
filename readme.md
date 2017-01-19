# hyper-tabs-enhanced [![npm](https://img.shields.io/npm/v/hyper-tabs-enhanced.svg?maxAge=86400?style=flat-square)](https://www.npmjs.com/package/hyper-tabs-enhanced) [![npm](https://img.shields.io/npm/dm/hyper-tabs-enhanced.svg?maxAge=86400?style=flat-square)](https://www.npmjs.com/package/hyper-tabs-enhanced)

> Enhanced Tabs Plugin for [Hyper](https://hyper.is). Matches any theme.

![hyper-tabs-enhanced](https://cloud.githubusercontent.com/assets/1430576/22099107/46eaa79a-de2a-11e6-9cfd-4c345d1f543f.png)


## Install

Add following to your `~/.hyper.js` config.

```javascript
module.exports = {
  ...
  plugins: ['hyper-tabs-enhanced']
  ...
}
```


## Config

Add following to `~/.hyper.js`.

![hyper-tabs-enhanced-traffic](https://cloud.githubusercontent.com/assets/1430576/22099108/482fa182-de2a-11e6-8a65-90ffeb3a495b.png)
### Enable Custom Traffic Buttons
Default value is `false`

```javascript
module.exports = {
  config: {
    ...
      hyperTabs: {
        trafficButtons: true,
      }
    ...
  }
}
```

![hyper-tabs-enhanced-border](https://cloud.githubusercontent.com/assets/1430576/22099111/4d8526c0-de2a-11e6-91a4-c1880afea8f8.png)
### Enable Border
Default value is `false`

```javascript
module.exports = {
  config: {
    ...
      hyperTabs: {
        border: true,
      }
    ...
  }
}
```

![hyper-tabs-enhanced-icons](https://cloud.githubusercontent.com/assets/1430576/22099115/52b28dc2-de2a-11e6-92db-7acfe0c34e8b.png)
### Disable Tab Icons
Default value is `true`

```javascript
module.exports = {
  config: {
    ...
      hyperTabs: {
        tabIcons: false,
      }
    ...
  }
}
```

![hyper-tabs-enhanced-colored](https://cloud.githubusercontent.com/assets/1430576/22099121/567c0c9e-de2a-11e6-80c6-b3f189337112.png)
### Enable Colored Tab Icons
Default value is `false`

```javascript
module.exports = {
  config: {
    ...
      hyperTabs: {
        tabIconsColored: true,
      }
    ...
  }
}
```

![hyper-tabs-enhanced-activity](https://cloud.githubusercontent.com/assets/1430576/22099125/596b252a-de2a-11e6-8dff-3359eb90cb29.png)
### Change Activity Color
Expected value is `CSS colors`

```javascript
module.exports = {
  config: {
    ...
      hyperTabs: {
        activityColor: 'salmon',
      }
    ...
  }
}
```

### Disable Activity Pulse
Default value is `true`

```javascript
module.exports = {
  config: {
    ...
      hyperTabs: {
        activityPulse: false,
      }
    ...
  }
}
```


## Recommended Themes

* [hyper-chesterish](https://github.com/henrikdahl/hyper-chesterish)
* [hyper-oceans16](https://github.com/henrikdahl/hyper-oceans16)
* [hyper-hybrid-theme](https://github.com/alexfedoseev/hyper-hybrid-theme)
* [hyper-snazzy](https://github.com/sindresorhus/hyper-snazzy)


## License

MIT © Henrik
