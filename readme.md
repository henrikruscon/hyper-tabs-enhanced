# hyper-tabs-enhanced [![hyper](https://img.shields.io/badge/Hyper-v1.2.1-green.svg)](https://github.com/zeit/hyper/releases/tag/1.2.1) [![npm](https://img.shields.io/npm/v/hyper-tabs-enhanced.svg?maxAge=86400?style=flat-square)](https://www.npmjs.com/package/hyper-tabs-enhanced) [![npm](https://img.shields.io/npm/dt/hyper-tabs-enhanced.svg?maxAge=86400?style=flat-square)](https://www.npmjs.com/package/hyper-tabs-enhanced)

> Enhanced Tabs Plugin for [Hyper](https://hyper.is). Matches any theme.

![hyper-tabs-enhanced](https://cloud.githubusercontent.com/assets/1430576/22143133/35d9a170-def9-11e6-8d0f-047fb1c64e97.png)


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

![hyper-tabs-enhanced-traffic](https://cloud.githubusercontent.com/assets/1430576/22143132/3578212a-def9-11e6-9e97-6d635bb89db8.png)
### Enable Traffic Buttons
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

![hyper-tabs-enhanced-border](https://cloud.githubusercontent.com/assets/1430576/22143129/3508e06c-def9-11e6-973d-065a8e9b35f8.png)
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

![hyper-tabs-enhanced-icons](https://cloud.githubusercontent.com/assets/1430576/22143130/3511b6e2-def9-11e6-90cc-b68425f71557.png)
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

![hyper-tabs-enhanced-colored](https://cloud.githubusercontent.com/assets/1430576/22143128/35056cac-def9-11e6-8385-4fb572c5b08b.png)
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

![hyper-tabs-enhanced-activity](https://cloud.githubusercontent.com/assets/1430576/22143131/353d4f5a-def9-11e6-8b7b-6aa262b2c53b.png)
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

# Theme
* [hyper-chesterish](https://github.com/henrikdahl/hyper-chesterish)


## License

MIT © Henrik
