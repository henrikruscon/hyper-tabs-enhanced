# hyper-tabs-enhanced [![npm](https://img.shields.io/npm/v/hyper-tabs-enhanced.svg?maxAge=86400?style=flat-square)](https://www.npmjs.com/package/hyper-tabs-enhanced) [![npm](https://img.shields.io/npm/dm/hyper-tabs-enhanced.svg?maxAge=86400?style=flat-square)](https://www.npmjs.com/package/hyper-tabs-enhanced)

> Enhanced Tabs Plugin for [Hyper](https://hyper.is). Matches any theme.

![](screen.png)


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

* [hyper-hybrid-theme](https://github.com/alexfedoseev/hyper-hybrid-theme)
* [hyper-chesterish](https://github.com/henrikdahl/hyper-chesterish)
* [hyper-oceans16](https://github.com/henrikdahl/hyper-oceans16)


## License

MIT © Henrik
