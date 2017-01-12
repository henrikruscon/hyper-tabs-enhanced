# hyper-tabs-enhanced [![npm](https://img.shields.io/npm/v/hyper-tabs-enhanced.svg?maxAge=86400?style=flat-square)](https://www.npmjs.com/package/hyper-tabs-enhanced) [![npm](https://img.shields.io/npm/dm/hyper-tabs-enhanced.svg?maxAge=86400?style=flat-square)](https://www.npmjs.com/package/hyper-tabs-enhanced)

> Enhanced Tabs Plugin for [Hyper](https://hyper.is). Matches any theme.

![hyper-tabs-enhanced](https://cloud.githubusercontent.com/assets/1430576/21888911/a9c16f16-d8c6-11e6-9f34-74c6a3b2dd76.png)


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

![hyper-tabs-enhanced-border](https://cloud.githubusercontent.com/assets/1430576/21888916/b002f926-d8c6-11e6-9580-7d767b243bce.png)
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

![hyper-tabs-enhanced-icons](https://cloud.githubusercontent.com/assets/1430576/21888912/ac83ff48-d8c6-11e6-9968-e2b1401124ae.png)
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

![hyper-tabs-enhanced-colored](https://cloud.githubusercontent.com/assets/1430576/21888915/ae0a8148-d8c6-11e6-9ab3-37c78d0ef988.png)
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

![hyper-tabs-enhanced-activity](https://cloud.githubusercontent.com/assets/1430576/21888917/b0de576e-d8c6-11e6-8b7a-7e0ad530eb7e.png)
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
* [hyper-loved](https://github.com/danielpintilei/hyper-loved)
* [hyper-snazzy](https://github.com/sindresorhus/hyper-snazzy)


## License

MIT © Henrik
