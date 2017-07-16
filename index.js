// Require
const { remote } = require('electron');
const color = require('color');

// Config
exports.decorateConfig = (config) => {
    const backColor = color(config.backgroundColor);
    const isDark = backColor.dark();
    const colors = {
        highlight: isDark ? backColor.lighten(0.31).string() : backColor.darken(0.09).string(),
        highlightier: isDark ? backColor.lighten(0.43).string() : backColor.darken(0.09).string(),
        inactive: isDark ? backColor.desaturate(0.3).lightness(36).string() : backColor.desaturate(0.3).lightness(58).string(),
        back: isDark ? backColor.darken(0.2).string() : backColor.darken(0.05).string(),
    };

    // Define default colors
    const configColors = Object.assign({
        black: '#000000',
        red: '#ff0000',
        green: '#33ff00',
        yellow: '#ffff00',
        blue: '#0066ff',
        magenta: '#cc00ff',
        cyan: '#00ffff',
        white: '#d0d0d0',
        lightBlack: '#808080',
        lightRed: '#ff0000',
        lightGreen: '#33ff00',
        lightYellow: '#ffff00',
        lightBlue: '#0066ff',
        lightMagenta: '#cc00ff',
        lightCyan: '#00ffff',
        lightWhite: '#ffffff',
    }, config.colors);

    const hyperTabs = Object.assign({
        trafficButtons: false,
        border: false,
        activityColor: configColors.lightYellow,
        activityPulse: true,
        tabIcons: true,
        tabIconsColored: false,
        closeAlign: 'left',
    }, config.hyperTabs);

    const trafficButtonsCSS = `
        .tabs_list {
            margin-left: 77px;
        }
    `
    const trafficButtonsBorderCSS = `
        .tab_tab:first-of-type {
            border-left-width: 1px !important;
            border-bottom-width: 0 !important;
            border-left-color: ${colors.highlight} !important;
        }
        .tab_tab.tab_active:first-of-type {
            border-left-color: transparent !important;
        }
        .tab_tab.tab_active:first-of-type:before {
            left: -1px;
        }
    `
    const borderCSS = `
        .tabs_list {
            border-bottom: 1px solid ${colors.highlight};
        }
        .tab_tab {
            border-right-width: 1px;
            border-right-style: solid;
        }
        .tab_tab:last-of-type {
            border-right-width: 0 !important;
            padding-right: 1px;
        }
        .tab_tab.tab_active {
            border-color: ${colors.highlight} !important;
        }
        .tab_tab.tab_active:before {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: -1px;
            border-bottom: 1px solid ${config.backgroundColor};
        }
    `
    const pulseCSS = `
        .tab_tab.tab_hasActivity .tab_text {
            animation: pulse 3s ease-in-out infinite;
        }
        .tab_tab.tab_hasActivity:hover .tab_text {
            animation: none;
        }
        @keyframes pulse {
            0% {
                opacity: 1;
            }
            50% {
                opacity: 1;
            }
            75% {
                opacity: 0.4;
            }
            100% {
                opacity: 1;
            }
        }
    `
    const iconsCSS = `
        .tab_process {
            padding: 0 6px 0 20px;
        }
        .tab_process:before {
            content: '';
            position: absolute;
            left: 0;
            width: 14px;
            height: 100%;
            -webkit-mask-repeat: no-repeat;
            -webkit-mask-position: 0 center;
            background-color: ${colors.inactive};
            transition: background 150ms ease;
        }
        .tab_process.process_shell:before {
            left: 6px;
            -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjE0IiB2aWV3Qm94PSIwIDAgOCAxNCI+PHBvbHlnb24gZmlsbD0iIzAwMDAwMCIgZmlsbC1ydWxlPSJldmVub2RkIiBwb2ludHM9IjggNy42NSA0LjY5MSA1LjkxMiA3LjA5MiAwIDAgNi4zNDkgMy4xMTYgOC40NDMgLjkwOCAxNCIvPjwvc3ZnPg==');
            -webkit-mask-size: 8px 14px;
        }
        .tab_process.process_gulp:before {
            left: 8px;
            -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2IiBoZWlnaHQ9IjE0IiB2aWV3Qm94PSIwIDAgNiAxNCI+PHBhdGggZmlsbD0iIzAwMDAwMCIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNNS42MTg5MjUyMywwLjAxMDUwNjM3NTMgQzUuNjA1ODU0MSwwLjAyMTU4NzY5NzQgNS4yMzY5MTEwMSwwLjQyMzE3NDgxMiA0LjgwMTc2ODk5LDAuOTA1NDMzOTUyIEw0LjAxMTE3NjY1LDEuNzgwODU4NCBMMy42OTQ5Mzk3MSwzLjA3NzM3MzA5IEwyLjgxMjAwNjE5LDMuMDkzNzczNDUgQzEuMTcwMTA0MDIsMy4xMjk2NzY5MyAwLjIwMDMxMDc1NSwzLjI2ODQxNTA5IDAuMDIxMTA5ODI1MiwzLjQ5MjcwMTA1IEMtMC4wMTMwNDM3NjM4LDMuNTM0MzY2ODIgLTAuMDA3OTgzOTcyODMsMy41NDgxMDc2NiAwLjA1MjczMzUxODcsMy42MDM1MTQyNyBDMC40ODIzOTQxMDEsMy45OTEzNjA1NCAzLjg3MzcxODk5LDQuMTA0ODMzMjggNS40NDE4MzI1NCwzLjc4NjEzNDQ2IEM1Ljk5Nzk4NzksMy42NzI2NjE3MiA2LjE0MDA4MzcsMy41MzEyNjQwNSA1LjgzNzMzOTU0LDMuMzk1NjI4NjYgQzUuNjA3OTYyMzUsMy4yOTA1Nzc3MyA0Ljc2NzE5Mzc1LDMuMTQ2MDc3MjkgNC4zOTA2NjA5NywzLjE0NjA3NzI5IEM0LjI4Nzc3ODU2LDMuMTQ2MDc3MjkgNC4yNjQxNjYyLDMuMTM3NjU1NDggNC4yNjQxNjYyLDMuMDk2NDMyOTcgQzQuMjY0MTY2MiwzLjA3MTYxMDggNC4zMjE5MzIxNCwyLjgxNjc0MDQgNC4zOTA2NjA5NywyLjUzMzk0NTA1IEw0LjUxNDYyNTg1LDIuMDE4ODg1MiBMNS4yNTI1MTIwMywxLjE5ODg2NzM2IEM1LjY1ODU2MDI2LDAuNzQ3MTkyNjcyIDUuOTkyOTI4MTEsMC4zNTY2ODY4NzkgNS45OTg0MDk1NSwwLjMzNDUyNDIzNSBDNi4wMjQ5NzM0NSwwLjIwOTk3MDE3NCA1LjcxMTI2NjQxLC0wLjA1NTk4MTU1NzYgNS42MTg5MjUyMywwLjAxMDUwNjM3NTMgTDUuNjE4OTI1MjMsMC4wMTA1MDYzNzUzIFogTTAuNzA4ODE5NzQ3LDEwLjQ3NjU5MzUgQzAuNzg4MDg5ODA1LDEwLjU3NjMyNTQgMS4zNDkzMDQ5NSwxMC43NDUyMDQ4IDEuOTE4NTMxNDQsMTAuODM5NjE3NiBDMi4zNTMyNTE4MSwxMC45MTE0MjQ2IDMuNTkyMDU3MywxMC45MTE0MjQ2IDQuMDI2Nzc3NjcsMTAuODM5NjE3NiBDNC40MDA3ODA1NSwxMC43NzU3ODkyIDQuODA5MzU4NjcsMTAuNjc2MDU3MyA1LjAwNzExMjE3LDEwLjU5ODQ4ODEgQzUuMjg2MjQzOTcsMTAuNDkwMzM0NCA1LjI1MjA5MDM4LDEwLjYwOTU2OTQgNS40MTAyMDg4NSw5LjE3MTY1NzAyIEM1LjQ4NjUyNzM2LDguNDcwODc0MjEgNS42NDcxNzU3Myw2Ljk5MDQwOTU3IDUuNzg2NzQxNjMsNS42NDE1OTEwNCBDNS44ODk2MjQwNCw0LjYyNzg3MTY5IDUuOTczOTUzODksMy43OTM2Njk3NiA1Ljk2ODQ3MjQ1LDMuNzkxMDEwMjQgQzUuOTY1OTQyNTYsMy43ODU2OTEyIDUuODk3MjEzNzMsMy44MDc0MTA2IDUuODE1NDEzNzgsMy44Mzc5OTUwNCBDNS42MDk2NDg5NCwzLjkxMjkwNDc4IDUuMTY0Mzg3MzQsMy45OTMxMzM1NSA0LjYyOTMxNDQ1LDQuMDUxMTk5NjggQzQuMDQ5NTQ2NzMsNC4xMTE5MjUzMyAyLjA4NjM0Nzg0LDQuMTIwMzQ3MTMgMS41MTE2Mzk5MSw0LjA2NDk0MDUyIEMwLjk3NjU2NzAxOSw0LjAxMjE5MzQzIDAuNDYwMDQ2NjkxLDMuOTI2MjAyMzcgMC4yNDEyMTA3MzIsMy44NTE3MzU4OCBMMC4wNDg5Mzg2NzU1LDMuNzg3OTA3NDcgTDAuMDQ4OTM4Njc1NSwzLjg0ODYzMzExIEMwLjA0ODkzODY3NTUsMy44NDg2MzMxMSAwLjY4NTIwNzM4OSwxMC40NDY0NTIzIDAuNzA4ODE5NzQ3LDEwLjQ3NjU5MzUgWiBNMC44MzgyNjYwNjYsMTAuNzIzNDg1NCBDMC44MzgyNjYwNjYsMTAuNzI4ODA0NCAwLjkyMjU5NTkxNSwxMC44ODQzODYyIDEuMDIyOTQ4NDQsMTEuMDY3MDA2NCBMMS4yMTAxNjA3LDExLjQwMjEwNTUgTDEuMjg2NDc5MjIsMTIuNTE1NTU2OCBMMS4zNjU3NDkyNywxMy42MzIxMTA4IEwxLjQ0NTAxOTMzLDEzLjcwMzkxNzggQzEuNjQyNzcyODMsMTMuODgxMjE4OSAyLjExNzEyODIzLDEzLjk4MDk1MDggMi44NTUwMTQ0MSwxMy45OTc3OTQ0IEMzLjY5MzI1MzEyLDE0LjAxNzI5NzYgNC4zNDYzODc4LDEzLjkwNjQ4NDMgNC41NjAxNjM5NywxMy43MDM5MTc4IEw0LjY0NDQ5MzgyLDEzLjYyNjM0ODUgTDQuNzA1MjExMzEsMTIuNTAxODE2IEw0Ljc2NTkyODgsMTEuMzc5OTQyOSBMNC45MzcxMTg0LDExLjA2MzkwMzYgQzUuMDMxOTg5NDgsMTAuODkyMzY0NyA1LjEwODMwNzk5LDEwLjc0MjU0NTIgNS4xMDgzMDc5OSwxMC43MzE0NjM5IEM1LjEwODMwNzk5LDEwLjcyMzA0MjEgNS4wMjkwMzc5MywxMC43NDI1NDUyIDQuOTI5MTA3MDYsMTAuNzc4NDQ4NyBDNC41NzMyMzUxLDEwLjkwNTY2MjMgMy44ODAwNDM3MywxMS4wMTk1NzgzIDMuMjYzNTkyNTMsMTEuMDU1NDgxOCBDMi41Nzg0MTI1MSwxMS4wOTQ0ODggMS41MTYyNzgwNiwxMC45NTg0MDk0IDAuOTc4Njc1MjY1LDEwLjc2MjA0ODQgQzAuOTAyMzU2NzUxLDEwLjczNDEyMzQgMC44MzkxMDkzNjQsMTAuNzE3NzIzMSAwLjgzOTEwOTM2NCwxMC43MjMwNDIxIEwwLjgzODI2NjA2NiwxMC43MjM0ODU0IFoiLz48L3N2Zz4=');
            -webkit-mask-size: 6px 14px;
        }
        .tab_process.process_php:before {
            -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxMCIgdmlld0JveD0iMCAwIDE0IDEwIj48cGF0aCBmaWxsPSIjMDAwMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05LjQ0MzUwMDQsOC45NTc0MTg1NyBDOS4zNjEyODg0OCw4Ljc1MzM5MjIzIDkuMjgwMzcxNzMsOC41NDI0MTE2NiA5LjI3MDcxOTAzLDguMzM3MzY3NSBDOS4yNDg0OTI0MSw3Ljg2NTIyNjUgOS4yNjY3NjgxNCw2LjkyMDk0NCA5Ljg1MDgyOTcxLDYuNjY5MTM1NSBDMTAuNDM0ODkyOCw2LjQxNzMyNyAxMS4wMzU1MDIyLDUuODUwNzU3NSAxMS40Mjk2NTIxLDYuMjI4NDcwNSBDMTEuODIzODAyNCw2LjYwNjE4MzUgMTAuNDQ5NDY0Miw3LjM5MzA4NTUgMTAuNDUwNjk4OCw4LjA4NTU1OSBDMTAuNDUxOTM0NCw4Ljc3ODAzMyAxMS4wODE5MzE5LDkuNTAxOTgyNSAxMS4yMzg3NTIzLDkuNTAxOTgyNSBDMTEuMzk1NTcyOCw5LjUwMTk4MjUgMTIuMDQ1MzI3Miw5LjMxMzEyNjUgMTIuMDU4OTA5Nyw4LjkzNTQxMzUgQzEyLjA3MjQ5MzIsOC41NTc3MDA1IDExLjU0NTIzMDgsOC42ODM2MDUgMTEuNTI0NDg1OSw4LjI0MjkzOTUgQzExLjUwMzc0MSw3LjgwMjI3NDUgMTIuMzg0MTgxLDcuMjUxMzczNSAxMi44MzkzMDcxLDYuODU3OTkyIEMxMy4yNzYzMDQ5LDYuNDgwMjc5IDE0LjAzNzU2MTYsNS42NjE5MDEgMTMuOTU3NTQ1OSwzLjk2MjE5MyBDMTMuODc3NTI5NiwyLjI2MjQ4NSAxMi45MjUyNDcxLDAuNjg4NjgxIDEyLjA5OTQwOTEsMC40NjgzNDg1IEMxMS4yNzM1NzEsMC4yNDgwMTYgNy45MjU1MTg4MiwtMC45MTY1OTkgNy40MTUyOTc1NCwxLjU3MDAxMSBDNi45MDUwNzY3NSw0LjA1NjYyMTUgOC45ODIyNjcyMiw0Ljg3NDk5OTUgOS41MTEwMTA4NSw0Ljc4MDU3MSBDMTAuMDM5NzU0NSw0LjY4NjE0MyAxMC41NzM0MzcsMy4zNjQxNDc1IDEwLjU3MzQzNywzLjM2NDE0NzUgQzEwLjU3MzQzNywzLjM2NDE0NzUgMTAuMzkwNjg2MSw0LjgxMjA0NyA5LjczOTQ0OTk5LDQuOTY5NDI3NSBDOS4wODgyMTM4NCw1LjEyNjgwOCA3LjQ0NTQyNzkzLDQuODc0OTk5NSA2Ljk4MzExNjU0LDMuMDQ5Mzg3IEM2LjUyMDgwNDY1LDEuMjIzNzc0IDcuNDY5MzgxODgsMC43MjAxNTcgNi44MzQ2OTIxMywwLjU2Mjc3NyBDNS45ODkzMDk4NSwwLjM1MzE1MjUgMy43MzczMDUyMiwwLjA1OTE1OTUgMS45Nzg5NDI1OSwxLjM0OTY3ODUgQzAuMjIwNTc5NDU5LDIuNjQwMTk4IC0wLjMyMTAwNTMxLDUuMTI2ODA4IDAuMTM3NjAxMzA5LDQuODc0OTk5NSBDMC41OTYyMDc5MjksNC42MjMxOTEgMC43NzcyMjk5MjEsMy44MDQ4MTMgMC44OTk0NzYzMjcsNC40MDI4NTg1IEMxLjAyMTcyMTc0LDUuMDAwOTA0IDEuNTA1MjcyMjcsNS45NDUxODYgMS45MzA3ODY1OCw2LjMyMjg5OSBDMi4zNTYzMDA4OCw2LjcwMDYxMiAxLjc0MzA5NjQsOC45OTgzNjU1IDEuODU2NDUyMDYsOS40MDc1NTQ1IEMxLjk2OTgwNzIyLDkuODE2NzQzNSAyLjYzNDM3OTI1LDkuOTQyNjQ4IDMuMTM2MjA0NTEsOS45NDI2NDggQzMuMzcxODgxNiw5Ljk0MjY0OCAzLjc0NjI0MDA2LDkuOTQ5NTkwNDEgNC4wNjg4NTE3NCw5LjkyMTA4OTQ4IEM0LjAzMDU5NDIzLDkuNjYzNDU2MTEgNC4wODEwMDI5NCw5LjI0ODEwODM3IDQuMjI1OTQxMSw5LjA4MjAzMTUgQzQuMjg4MTkxMTgsOS4wMTA3MDIxMyA0LjM1NTI3ODM4LDguOTcwMDI3NDYgNC40MTgyMDI5LDguOTQ3ODQ5NzcgQzQuMjk2MTAzNTksOC42NTk3MjQxMSA0LjE3NDA2NjIyLDguMzI5NTUzMDIgNC4xNDIwNzY2MSw3Ljk5MTEzMSBDNC4wNzk1OTUyNiw3LjMzMDEzMzUgNC41Mzk2ODM1OSw3LjEwOTgwMSA0LjcyOTM0OTcxLDcuMTQxMjc3IEM0LjkxOTAxNjMzLDcuMTcyNzUzIDUuMDI1MjEwNTYsNy40NDUwNzE1IDUuODEwNTQ1NzksNy40NTYwMzggQzYuNTYzNDU1ODMsNy40NjY1NTIgNi41NTI5MTE0OSw3LjIzNTcwNSA2Ljg2ODAzMzU1LDcuMjY3MTgxIEM3LjE4MzE1NjExLDcuMjk4NjU3IDcuMzkzNTY3MTUsNy43NzA3OTggNy40MjAyMzkzOSw4LjMzNzM2NzUgQzcuNDQ2OTExMTMsOC45MDM5MzcgNy4yNDk1ODg4NSw5LjM3NjA3OCA3LjI2NDQwNjQzLDkuNjkwODM4NSBDNy4yNzQ1NTc5OSw5LjkwNjQ3NDY2IDguMzM5MDAwMjIsMTAuMDAzOTI4NyA5LjAzMjk2MDEsOS45MjI0NzczOSBDOS4wMDExMjA3Miw5LjY2Mzc0MTU4IDkuMDUyNzg3NjEsOS4yNjg0NDAxNSA5LjE5MzMwMzUyLDkuMTA3NDMwNSBDOS4yNzUxNTk1Miw5LjAxMzYzNTY1IDkuMzY1Mzc5NDEsOC45NzI4NDU5NyA5LjQ0MzUwMDQsOC45NTc0MTg1NyBaIE0xMy4xNzY5MzYzLDYuMTEzMDk2IEMxMy40MDExMzU1LDUuOTM4MDk2IDEyLjgyODE4MTgsNS41NjMwOTYgMTIuNjAzOTgyNSw1LjIxMzA5NiBDMTIuMzc5NzgzMiw0Ljg2MzA5NiAxMS45MzEzODQ3LDUuNDM4MDk2IDEyLjA1NTkzOTgsNS43ODgwOTYgQzEyLjE4MDQ5NSw2LjEzODA5NiAxMi45MDI5MTQ5LDYuMjM4MDk2IDEzLjE3NjkzNjMsNi4xMTMwOTYgWiBNMTIuNzQxNTU5NywzLjYzMDg2MzUgQzEyLjc0MTYwODYsMy43NDMzNDk0MiAxMi42ODE4Mzk4LDMuODQ3MzExNzEgMTIuNTg0Nzc4OSwzLjkwMzU2ODg1IEMxMi40ODc3MTgxLDMuOTU5ODI1OTkgMTIuMzY4MTIwMSwzLjk1OTgyNTk5IDEyLjI3MTA1OTIsMy45MDM1Njg4NSBDMTIuMTczOTk4NCwzLjg0NzMxMTcxIDEyLjExNDIyOTUsMy43NDMzNDk0MiAxMi4xMTQyNzg1LDMuNjMwODYzNSBDMTIuMTE0MjI5NSwzLjUxODM3NzU4IDEyLjE3Mzk5ODQsMy40MTQ0MTUyOSAxMi4yNzEwNTkyLDMuMzU4MTU4MTUgQzEyLjM2ODEyMDEsMy4zMDE5MDEwMSAxMi40ODc3MTgxLDMuMzAxOTAxMDEgMTIuNTg0Nzc4OSwzLjM1ODE1ODE1IEMxMi42ODE4Mzk4LDMuNDE0NDE1MjkgMTIuNzQxNjA4NiwzLjUxODM3NzU4IDEyLjc0MTU1OTcsMy42MzA4NjM1IEwxMi43NDE1NTk3LDMuNjMwODYzNSBaIiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAxMy45NDYgMCkiLz48L3N2Zz4=');
            -webkit-mask-size: 14px 10px;
        }
        .tab_process.process_node:before {
            -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDEyIDE0Ij48cGF0aCBmaWxsPSIjMDAwMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01Ljk5NzA0ODk2LDE0IEM1LjgxNjIzMDcyLDE0IDUuNjM1OTQ5MDMsMTMuOTUxMTQ0NiA1LjQ3NzEyOTQ0LDEzLjg1NjIwOTUgTDMuODIxMzI3OTcsMTIuODQyNDU5IEMzLjU3NDUxMzc1LDEyLjY5OTc3ODkgMy42OTUyMzgxLDEyLjY0ODcwMjggMy43NzY3OTQxLDEyLjYxOTI3ODUgQzQuMTA2MjM3NDIsMTIuNTAxMDI2MSA0LjE3MzMwNjUxLDEyLjQ3MzgyMjUgNC41MjQ3NDg0OSwxMi4yNjY3NDIgQzQuNTYxNzcwNjIsMTIuMjQ1NjQ1MyA0LjYxMDA2MDM2LDEyLjI1MzQxNzggNC42NDg2OTIxNSwxMi4yNzY3MzUyIEw1LjkyMDMyMTkzLDEzLjA1Nzg2NzEgQzUuOTY3MDAyMDEsMTMuMDg0NTE1NiA2LjAzMTM4ODMzLDEzLjA4NDUxNTYgNi4wNzQzMTI1NCwxMy4wNTc4NjcxIEwxMS4wMzI1OTU2LDEwLjA5NzExNjEgQzExLjA3ODczOTEsMTAuMDY5OTEyNSAxMS4xMDgyNDk1LDEwLjAxNDM5NDkgMTEuMTA4MjQ5NSw5Ljk1ODMyMjE4IEwxMS4xMDgyNDk1LDQuMDM3Mzc1MjEgQzExLjEwODI0OTUsMy45Nzk2MzY5NSAxMS4wNzg3MzkxLDMuOTI1MjI5NzUgMTEuMDMxNTIyNSwzLjg5NTgwNTQ1IEw2LjA3NTM4NTY1LDAuOTM3Mjc1MDggQzYuMDI5MjQyMTIsMC45MDk1MTYzMDMgNS45Njg2MTE2NywwLjkwOTUxNjMwMyA1LjkyMjQ2ODE0LDAuOTM3Mjc1MDggTDAuOTY3NDA0NDI3LDMuODk2OTE1OCBDMC45MTkxMTQ2ODgsMy45MjUyMjk3NSAwLjg4OTA2Nzc0LDMuOTgxMzAyNDggMC44ODkwNjc3NCw0LjAzNzM3NTIxIEwwLjg4OTA2Nzc0LDkuOTU4ODc3MzYgQzAuODg5MDY3NzQsMTAuMDE1NTA1MyAwLjkxOTExNDY4OCwxMC4wNjg4MDIxIDAuOTY2ODY3ODc0LDEwLjA5NjAwNTcgTDIuMzI1NDE5MTgsMTAuOTA3NjcyMyBDMy4wNjI2NDI1MiwxMS4yODkwNzc5IDMuNTEzODgzMywxMC44Mzk5NDA5IDMuNTEzODgzMywxMC4zODg1ODMyIEwzLjUxMzg4MzMsNC41NDI1ODQ5NCBDMy41MTM4ODMzLDQuNDU5ODYzNzggMy41NzgyNjk2Miw0LjM5NDkwODI1IDMuNjU4MjE1OTYsNC4zOTQ5MDgyNSBMNC4yODcwNTU2Nyw0LjM5NDkwODI1IEM0LjM2NTM5MjM1LDQuMzk0OTA4MjUgNC40MzAzMTUyMiw0LjQ1OTg2Mzc4IDQuNDMwMzE1MjIsNC41NDI1ODQ5NCBMNC40MzAzMTUyMiwxMC4zODg1ODMyIEM0LjQzMDMxNTIyLDExLjQwNjIxOTkgMy44OTQ4MzU2OCwxMS45OTAyNjQ2IDIuOTYyMzA3MTgsMTEuOTkwMjY0NiBDMi42NzU3ODgwNiwxMS45OTAyNjQ2IDIuNDQ5ODk5NCwxMS45OTAyNjQ2IDEuODE5OTg2NTksMTEuNjY4ODE4IEwwLjUxOTkxOTUxNywxMC44OTQzNDgxIEMwLjE5OTA2MTAzMywxMC43MDIyNTc0IDAsMTAuMzQzMDU4OCAwLDkuOTU4MzIyMTggTDAsNC4wMzczNzUyMSBDMCwzLjY1MjYzODU3IDAuMTk5MDYxMDMzLDMuMjkzOTk1MTggMC41MTk5MTk1MTcsMy4xMDI0NTk2MyBMNS40Nzg3MzkxLDAuMTM3ODIyMzI0IEM1Ljc5MjYyMjQsLTAuMDQ1OTQwNzc0NyA2LjIwOTUyMzgxLC0wLjA0NTk0MDc3NDcgNi41MjA3MjQzNSwwLjEzNzgyMjMyNCBMMTEuNDc5MDA3NCwzLjEwMjQ1OTYzIEMxMS44MDA0MDI0LDMuMjk0NTUwMzYgMTIsMy42NTMxOTM3NSAxMiw0LjAzNzM3NTIxIEwxMiw5Ljk1ODMyMjE4IEMxMiwxMC4zNDMwNTg4IDExLjgwMDQwMjQsMTAuNzAwNTkxOSAxMS40NzkwMDc0LDEwLjg5NDM0ODEgTDYuNTIwNzI0MzUsMTMuODU2MjA5NSBDNi4zNjE5MDQ3NiwxMy45NTExNDQ2IDYuMTgyMTU5NjIsMTQgNS45OTg2NTg2MiwxNCBMNS45OTcwNDg5NiwxNCBaIE03LjUyODkwNjc3LDkuOTIwNTcwMjQgQzUuMzU4NTUxMzEsOS45MjA1NzAyNCA0LjkwNDA5MTIxLDguODg5NjA5MyA0LjkwNDA5MTIxLDguMDI1MjAxIEM0LjkwNDA5MTIxLDcuOTQzMDM1MDMgNC45Njc0MDQ0Myw3Ljg3NzUyNDMxIDUuMDQ2ODE0MjIsNy44Nzc1MjQzMSBMNS42ODc5OTQ2Myw3Ljg3NzUyNDMxIEM1Ljc1OTM1NjE0LDcuODc3NTI0MzEgNS44MTk0NTAwMyw3LjkzMDgyMTE2IDUuODMwMTgxMDksOC4wMDI5OTM5OCBDNS45MjY3NjA1Niw4LjY3ODA4NzQyIDYuMjE0ODg5MzQsOS4wMTk1MjAzNyA3LjUyNzgzMzY3LDkuMDE5NTIwMzcgQzguNTcxOTY1MTIsOS4wMTk1MjAzNyA5LjAxNjc2NzI3LDguNzc0Njg3OTYgOS4wMTY3NjcyNyw4LjIwMTc0NjgyIEM5LjAxNjc2NzI3LDcuODcwODYyMjEgOC44OTEyMTM5NSw3LjYyNjAyOTggNy4yNjc2MDU2Myw3LjQ2MTE0MjY3IEM1LjkxMTIwMDU0LDcuMzIyMzQ4NzkgNS4wNzE0OTU2NCw3LjAxMjAwNTY3IDUuMDcxNDk1NjQsNS44ODk0NDA3NiBDNS4wNzE0OTU2NCw0Ljg1NDAzODQxIDUuOTE0OTU2NDEsNC4yMzY2ODMyMiA3LjMyODc3MjY0LDQuMjM2NjgzMjIgQzguOTE3NTA1MDMsNC4yMzY2ODMyMiA5LjcwMzAxODExLDQuODA2ODQ4NDkgOS44MDI4MTY5LDYuMDMxNTY1NjkgQzkuODA2NTcyNzcsNi4wNzMyMDM4NiA5Ljc5MjA4NTg1LDYuMTEzNzMxNjcgOS43NjQ3MjE2Niw2LjE0NTM3NjY4IEM5LjczNzM1NzQ4LDYuMTc1MzU2MTYgOS42OTk3OTg3OSw2LjE5MzEyMTc3IDkuNjU5NTU3MzQsNi4xOTMxMjE3NyBMOS4wMTU2OTQxNiw2LjE5MzEyMTc3IEM4Ljk0OTE2MTY0LDYuMTkzMTIxNzcgOC44OTA2Nzc0LDYuMTQ0MjY2MzMgOC44NzY3MjcwMyw2LjA3NzA5MDA5IEM4LjcyMjE5OTg3LDUuMzY2NDY1NDIgOC4zNDY2MTMwMSw1LjEzOTM5ODYzIDcuMzI4MjM2MDgsNS4xMzkzOTg2MyBDNi4xODc1MjUxNSw1LjEzOTM5ODYzIDYuMDU0OTk2NjUsNS41NTAyMjg1MSA2LjA1NDk5NjY1LDUuODU4MzUwOTMgQzYuMDU0OTk2NjUsNi4yMzE5ODQwNiA2LjIxMTY3MDAyLDYuMzQwNzk4NDYgNy43NTEwMzk1Nyw2LjU1MTIwOTk5IEM5LjI3NDg0OTA5LDYuNzU5NDAwODEgOS45OTkxOTUxNyw3LjA1NDc1NDE5IDkuOTk5MTk1MTcsOC4xNjIzMjkzNiBDOS45OTkxOTUxNyw5LjI4MDQ1Mjg2IDkuMDk4ODU5ODMsOS45MjA1NzAyNCA3LjUyNzgzMzY3LDkuOTIwNTcwMjQgTDcuNTI4OTA2NzcsOS45MjA1NzAyNCBaIi8+PC9zdmc+');
            -webkit-mask-size: 14px 14px;
        }
        .tab_process.process_npm:before {
            -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNiIgaGVpZ2h0PSIyOCIgdmlld0JveD0iMCAwIDI2IDI4Ij48cGF0aCBmaWxsPSIjMDAwMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMy4zNzAwMzgsMC41MDc5MTA1NzMgQzEzLjg2MTk2MTIsMC4yMjM4OTg1NjIgMTQuNjU4NzkwOSwwLjIyMzQ3Mzk2NSAxNS4xNTE0NDk2LDAuNTA3OTEwNTczIEwyNS43NTUxMzc0LDYuNjI5OTUyNTkgQzI2LjI0NzA2MDYsNi45MTM5NjQ2IDI2LjY0NTg0MzIsNy42MDM4MjcwOCAyNi42NDU4NDMyLDguMTcyNzAwMyBMMjYuNjQ1ODQzMiwyMC40MTY3ODQzIEMyNi42NDU4NDMyLDIwLjk4NDgwODMgMjYuMjQ3Nzk2LDIxLjY3NTA5NTQgMjUuNzU1MTM3NCwyMS45NTk1MzIgTDE1LjE1MTQ0OTYsMjguMDgxNTc0IEMxNC42NTk1MjYzLDI4LjM2NTU4NjEgMTMuODYyNjk2NiwyOC4zNjYwMTA3IDEzLjM3MDAzOCwyOC4wODE1NzQgTDIuNzY2MzUwMTUsMjEuOTU5NTMyIEMyLjI3NDQyNjkyLDIxLjY3NTUyIDEuODc1NjQ0MzUsMjAuOTg1NjU3NSAxLjg3NTY0NDM1LDIwLjQxNjc4NDMgTDEuODc1NjQ0MzUsOC4xNzI3MDAzIEMxLjg3NTY0NDM1LDcuNjA0Njc2MjggMi4yNzM2OTE1LDYuOTE0Mzg5MTkgMi43NjYzNTAxNSw2LjYyOTk1MjU5IEwxMy4zNzAwMzgsMC41MDc5MTA1NzMgWiBNMy42NjMzMzI0NCw4LjE3NjI2Mjg2IEMzLjY2MzI5NzQ1LDguMTc1MTI3MjcgMy42NjMyNzk0NywyMC40MTMxMyAzLjY2MzI3OTQ3LDIwLjQxMzEzIEMzLjY2MjI3ODUyLDIwLjQxMjU5MjUgMTQuMjYzODU1NSwyNi41MzM0MzY2IDE0LjI2Mzg1NTUsMjYuNTMzNDM2NiBDMTQuMjU5NzI0OCwyNi41MzIyMDc2IDI0Ljg2MTMxOTgsMjAuNDExMzk0NiAyNC44NjEzMTk4LDIwLjQxMTM5NDYgQzI0Ljg1ODE5MDEsMjAuNDE0MzU3NCAyNC44NTgyMDgxLDguMTcyNzAwMyAyNC44NTgyMDgxLDguMTcyNzAwMyBDMjQuODU5MjA5LDguMTc2ODkyMSAxNC4yNTc2MzIsMi4wNTYwNDggMTQuMjU3NjMyLDIuMDU2MDQ4IEMxNC4yNjE3NjI3LDIuMDU3Mjc3MDYgMy42NjMzMzI0NCw4LjE3NjI2Mjg2IDMuNjYzMzMyNDQsOC4xNzYyNjI4NiBaIE0yMi45NDM1NDI5LDkuNjk3OTY2MjggTDIyLjk0MzU0MjksMTguODc5MjA3NCBMMjAuOTAwNTMxNCwyMC4wMzc0MTQyIEwyMC45MDA1MzE0LDEzLjMwOTc3ODcgTDE4Ljg1NzUxOTgsMTQuNTA1NDc1IEwxOC44NTc1MTk4LDIxLjE5NTYyMDkgTDE0Ljc3MTQ5NjcsMjMuNTEyMDM0NCBMMTQuNzcxNDk2NywxNC41MzQzMDgyIEwyMi45NDM1NDI5LDkuNjk3OTY2MjggWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEpIi8+PC9zdmc+');
            -webkit-mask-size: 14px 14px;
        }
        .tab_process.process_yarn:before {
            left: 1px;
            -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNiIgaGVpZ2h0PSIyOCIgdmlld0JveD0iMCAwIDI2IDI4Ij48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMTIuMDAzNjgzOCwyLjk1NzQwMzgzIEMxMi4wMDM2ODM4LDIuOTU3NDAzODMgMTMuMTcyMTI3NCwtMC42MDQ2MDE5MjcgMTQuMjUwNjkwOSwwLjA4OTc2MzUxNTUgQzE0LjU4MzI0ODQsMC4zMDYxODkzMjQgMTUuNzc4NjU0NiwyLjk3NTQzOTEyIDE1Ljc3ODY1NDYsMi45NzU0MzkxMiBDMTUuNzc4NjU0NiwyLjk3NTQzOTEyIDE3LjA1NDk1NiwyLjIyNjk2Njk3IDE3LjE5ODc2MTQsMi41MDY1MTczNCBDMTguODYzMTY2NCw3LjU5NjM5NTYgMTcuMzMwMTU1OCwxMS4xODUyNDQgMTUuMTMxNTE2NCwxNC4wNDkyMTk4IEMxOC4wNTU3ODE1LDE2Ljc4ODk3MzcgMTguNTY0NTEzOCwxOS41OTYyNTA5IDE3Ljk5ODY5NzUsMjMuMTQ4MTE0NiBDMjAuNzQ5NjY5NSwyMy4xNTQwMTI2IDIyLjE2NTc4MDgsMjAuNDYzOTgxMSAyNS42NzQ0NzEsMjAuMjk4NTExNyBDMjcuMjQ3Mzc1NywyMC4yNzE0NiAyNy4zMjgyNjg0LDIyLjEyMDA5NTQgMjYuMTQxODQ4OCwyMi40MDg2NjE4IEMyMy43MDI2NzA0LDIyLjc1NDExMzYgMjEuMjk3MjMxNCwyNS40ODQxMTEgMTYuMzgwODUxOSwyNi44NzI0NDA1IEMxNS43NDY2MzUyLDI3Ljg0MDg0NzIgMTEuOTU3Njc3NCwyNy43MzI1NzcgOC45NzQ3MTczLDI3Ljk5OTY1NzYgQzUuODE4NjA0NzIsMjguMDMzMzI4MiA2LjYzMzk1MDQ0LDI1LjU2NzE3NTMgNy43NzAzMjE0NywyNS4xNTAwNTMgQzcuMDI5MjI0MjgsMjQuNzQ0OTUxOSA2Ljk5OTA0NTQ3LDI0LjM0MDkzNCA2Ljg1MzU0MywyNC4zODM1NDUxIEM2LjA2NDIzLDI4LjYwMTQxMiAzLjkxMTIwMTM5LDI3LjMxNjI2MjQgMi41OTMyMTY4NiwyNi45NTM2MDA2IEMxLjU3NzU2OTMsMjYuNDEyNTM1MSAyLjY2NTEyMTMxLDI1LjE0MTAzNDEgMi42NjUxMjEzMSwyNS4xNDEwMzQxIEMxLjY3NjQxMjMsMjUuNTY2MjcwOCAwLjg5NjAxMDA4NywyMy42OTE2MzM0IDEuMDExMzI0NywyMS44NDk1NjE5IEMxLjExOTE4MDc2LDIwLjM3OTY3MDEgMi43NTUwMDE3MywxOC45NTQ4Njc4IDIuNzU1MDAxNzMsMTguOTU0ODY3OCBDMi42NTc1MzkxOCwxNS4yODUwNzU4IDMuNzI1OTkwODIsMTIuODk3Nzc3NCA2LjU2NTkyNjM2LDEwLjg5MzAxMSBDNS41NzM2NjYzNCw5LjcyMDY1MTA4IDQuNDI5MDE4MjksNy44MzM5NDIzNCA1LjkzODcxNDM4LDUuNjM2MDc4NzEgQzcuOTAzODQyNjUsNS4wODU5MTA3IDguMjg1MzkxOTMsMi43NDgwMzIxNyAxMi4wMDM2ODM4LDIuOTU3NDAzODMgWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEpIi8+PC9zdmc+');
            -webkit-mask-size: 13px 14px;
        }
        .tab_process.process_vim:before, .tab_process.process_nvim:before {
            left: 2px;
            -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMSIgdmlld0JveD0iMCAwIDEyIDExIj48cGF0aCBmaWxsPSIjMDAwMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04LjkzODExMzk1LDQuMTk3MjIzNjEgQzguNzU4Nzc0ODEsNC4zNzM5NDczOSA4LjQ2MzI5MTk1LDQuNjY0NzkyODMgOC4yNzczNjEyNiw0Ljg0NzYwNTM4IEwyLjM1NjA1ODYzLDEwLjY2OTYwNDkgQzIuMTcwNDc0MTQsMTAuODUyMDc3MSAxLjgxNzc3MDg3LDExIDEuNTUyNzAzMTgsMTEgTDEuMTkyOTA2MzksMTEgQzAuOTM0ODA5OTIyLDExIDAuNzI1NTgxMzk1LDEwLjc5ODk2ODIgMC43MjU1ODEzOTUsMTAuNTM1NzY2MiBMMC43MjU1ODEzOTUsMS44MzkyMzM3NiBDMC43MjU1ODEzOTUsMS41ODI4NDQ1MyAwLjUyNzMxMzA5LDEuMzc1IDAuMjYxOTUxNTM1LDEuMzc1IEwwLjQ2MzYyOTg2LDEuMzc1IEMwLjIwNzU3NDE1OSwxLjM3NSAwLDEuMTYwMTU2MjUgMCwwLjkwOTQ4NzcyNCBMMCwwIEw0LjMzOTc1NTgyLDAgQzQuNTkzOTQxNjYsMCA0LjgsMC4yMTQ4NDM3NSA0LjgsMC40NjU1MTIyNzYgTDQuOCwwLjkwOTQ4NzcyNCBDNC44LDEuMTY2NTgzMDYgNC42MDE3MzE3LDEuMzc1IDQuMzM2MzcwMTQsMS4zNzUgTDQuNTM4MDQ4NDYsMS4zNzUgQzQuMjgxOTkyNzYsMS4zNzUgNC4wNzQ0MTg2LDEuNTc1MzIwNzIgNC4wNzQ0MTg2LDEuODMxODY4ODEgTDQuMDc0NDE4Niw0LjY0NDAzMzk1IEM0LjA3NDQxODYsNC44OTYzNTU2MyA0LjIxODAyMjkyLDQuOTU5MzkyNjggNC4zOTY3ODgyLDQuNzgzMjM0MzkgTDcuNTMzMDkxOTksMS42OTI2NjgzNyBDNy43MTExMzE4LDEuNTE3MjI0OTggNy42NDgwNjk0NCwxLjM3NSA3LjM5MzExNDkzLDEuMzc1IEw3LjY2MjM0NjY1LDEuMzc1IEM3LjQwNjk5OTY1LDEuMzc1IDcuMiwxLjE2MDE1NjI1IDcuMiwwLjkwOTQ4NzcyNCBMNy4yLDAuNDY1NTEyMjc2IEM3LjIsMC4yMDg0MTY5NDUgNy4zOTc3MDg0NCwwIDcuNjY0Njk5MzIsMCBMNy43NjA3MDU4OSwwIEM4LjAxNzM1MjI0LDAgOC40MzQ2MTQ3NywwIDguNjk1ODg2NDksMCBMMTAuOTQzNDcyMiwwIEMxMS4yMDMzMTE4LDAgMTEuNjI1NTI5NywwIDExLjg3NTcxNDYsMCBMMTEuNTM4MjM4OSwwIEMxMS43OTMyNjI1LDAgMTIsMC4yMDg0OTA3NTMgMTIsMC40NjYxNTIxOTEgTDEyLDAuMTExMzQ3ODA5IEMxMiwwLjM2ODc5NjU1NSAxMiwwLjc4MTQ3NTY1MiAxMiwxLjA0MDI1MjM4IEwxMiwwLjcxNzIzNzY4NiBDMTIsMC45NzI4MDg3NjggMTEuODU0NDgxNywxLjMyMzM4NjI1IDExLjY3NTI3NzgsMS40OTk5NzY3NyBMOC45MzgxMTM5NSw0LjE5NzIyMzYxIFoiLz48L3N2Zz4=');
            -webkit-mask-size: 12px 11px;
        }
        .tab_process.process_python:before {
            left: 1px;
            -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNiIgaGVpZ2h0PSIyNiIgdmlld0JveD0iMCAwIDI2IDI2Ij48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMTMuODQ1MTg3NSwxLjAwMDIxMjY2IEMxNC45MTcyNzc1LDAuOTk1Mjg1NTI5IDE2LjAzNTA4MzgsMS4wNzU4NjYzNSAxNy4xMTIzOTc2LDEuMjUzMjQwMSBDMTguODE0Mjc1MiwxLjUzMzc5MDU4IDIwLjI0ODA0MjIsMi43OTY1NDIzIDIwLjI0ODA0MjIsNC40Nzc1MzI1OCBMMjAuMjQ4MDQyMiwxMC4zODM5MTU4IEMyMC4yNDgwNDI5LDEyLjExNTkxNTggMTguODU2MDY3NywxMy41MzU5MTQ3IDE3LjExMjM5NzYsMTMuNTM1OTE0NyBMMTAuODQ4NDE3NSwxMy41MzU5MTQ3IEM4LjcyMTY1MDkxLDEzLjUzNTkxNTIgNi45MzA2ODkwNSwxNS4zNDE4MzA0IDYuOTMwNjg5MDUsMTcuMzg5MTYxMSBMNi45MzA2ODkwNSwyMC4yMjMwNjg0IEw0Ljc3NDQ3NjU0LDIwLjIyMzA2ODQgQzIuOTUxODY1NzYsMjAuMjIzMDY3OSAxLjg4NzI2OTI2LDE4LjkxNDYzNjUgMS40NDE0ODM2MSwxNy4wNzgyOTg4IEMwLjg0MDEzNzk5NCwxNC42MTEzMDExIDAuODY1Njc4MDk5LDEzLjEzNjk2MjEgMS40NDE0ODM2MSwxMC43NzQzMDEgQzEuOTQwNjcwMjgsOC43MTMwNTk2MSAzLjUzNjYwMDg4LDcuNjI5NTMxNDggNS4zNTkyMTIxNCw3LjYyOTUzMTQ4IEw3LjcxMjc3MjkxLDcuNjI5NTMxNDggTDEzLjk4NDA2MjIsNy42Mjk1MzE0OCBMMTMuOTg0MDYyMiw2Ljg0MTUzMTc1IEw3LjcxMjc3MjkxLDYuODQxNTMxNzUgTDcuNzEyNzcyOTEsNC40Nzc1MzI1OCBDNy43MTI3NzMxNCwyLjY4NzU2NzgxIDguMTk0NjAyOTksMS43MTY5NjA3NCAxMC44NDg0MTc1LDEuMjUzMjQwMSBDMTEuNzQ5Mjc1NSwxLjA5NTU3NDg1IDEyLjc3MzA5NzQsMS4wMDUxMzk4IDEzLjg0NTE4NzUsMS4wMDAyMTI2NiBaIE0xMC40NTM3MjEsMi45MDE1MzMxMiBDOS44MDM2MTc1OCwyLjkwMTUzMzEyIDkuMjc2OTQwMzksMy40MzMzMDA2NyA5LjI3Njk0MDYyLDQuMDg3MTQ3MzkgQzkuMjc2OTQwNjIsNC43Mzg2NzY1NSA5LjgwMzYxNzU4LDUuMjY1NTMyMDcgMTAuNDUzNzIxLDUuMjY1NTMyMyBDMTEuMTAxNTAyMSw1LjI2NTUzMjMgMTEuNjMwNTAwOSw0LjczODY3Njc4IDExLjYzMDUwMTQsNC4wODcxNDczOSBDMTEuNjMwNTAxNCwzLjQzMzMwMDQ0IDExLjEwMTUwMjEsMi45MDE1MzMxMiAxMC40NTM3MjEsMi45MDE1MzMxMiBaIE0yMS4wMzAxMjYxLDcuNjI5NTMxNDggTDIzLjM4MzY4NzgsNy42Mjk1MzE0OCBDMjUuMjA4NjE3MSw3LjYyOTUzMTQ4IDI2LjA2ODkwMTIsOC45Nzk2OTk1MiAyNi41MTkzMzAxLDEwLjc3NDMwMSBDMjcuMTQ2MjE4MSwxMy4yNjY4MDMyIDI3LjE3NDA3NzIsMTUuMTM1MzA1OCAyNi41MTkzMzAxLDE3LjA3ODI5ODggQzI1Ljg4NTQ3OSwxOC45NjU2NDQ1IDI1LjIwNjI5OTMsMjAuMjIzMDY4NCAyMy4zODM2ODc4LDIwLjIyMzA2ODQgTDIwLjI0ODA0MjIsMjAuMjIzMDY4NCBMMTMuOTg0MDYyMiwyMC4yMjMwNjg0IEwxMy45ODQwNjIyLDIxLjAxMTA2ODEgTDIwLjI0ODA0MjIsMjEuMDExMDY4MSBMMjAuMjQ4MDQyMiwyMy4zNzUwNjY2IEMyMC4yNDgwNDI5LDI1LjE2NTAyOTUgMTguNjkxMjE5OSwyNi4wNzQ5MzgxIDE3LjExMjM5NzYsMjYuNTI3MDY1NSBDMTQuNzM3MTk4NiwyNy4yMDg3MzcgMTIuODMzNTU1MywyNy4xMDQzOTgzIDEwLjg0ODQxNzUsMjYuNTI3MDY1NSBDOS4xOTA2NTQyMywyNi4wNDQ3OTY5IDcuNzEyNzcyOTEsMjUuMDU2MDU3MSA3LjcxMjc3MjkxLDIzLjM3NTA2NjYgTDcuNzEyNzcyOTEsMTcuNDY4Njg0IEM3LjcxMjc3MzE0LDE1Ljc2OTE0NTQgOS4xMzI2MDg0NiwxNC4zMTY2ODUxIDEwLjg0ODQxNzUsMTQuMzE2Njg1MSBMMTcuMTEyMzk3NiwxNC4zMTY2ODUxIEMxOS4xOTk2OTQzLDE0LjMxNjY4NDkgMjEuMDMwMTI2MSwxMi41MTkzNTI5IDIxLjAzMDEyNjEsMTAuMzgzOTE1OCBMMjEuMDMwMTI2MSw3LjYyOTUzMTQ4IFogTTE3LjUwNzA5NDEsMjIuNTg3MDY3NSBDMTYuODU5MzExNiwyMi41ODcwNjc1IDE2LjMzMDMxNDIsMjMuMTEzOTIzOCAxNi4zMzAzMTM3LDIzLjc2NTQ1MTggQzE2LjMzMDMxMzcsMjQuNDE5Mjk3OCAxNi44NTkzMTIzLDI0Ljk1MTA2NiAxNy41MDcwOTQxLDI0Ljk1MTA2NiBDMTguMTU3MTk3MywyNC45NTEwNjYgMTguNjgzODc0LDI0LjQxOTI5NzggMTguNjgzODc0NSwyMy43NjU0NTE4IEMxOC42ODM4NzQ1LDIzLjExMzkyMzggMTguMTU3MTk4LDIyLjU4NzA2ODIgMTcuNTA3MDk0MSwyMi41ODcwNjc1IFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xIC0xKSIvPjwvc3ZnPg==');
            -webkit-mask-size: 13px 13px;
        }
        .tab_process.process_mysql:before {
            -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgdmlld0JveD0iMCAwIDI4IDI4Ij48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMjAuNzE4NDI0MSwxNy40NjA3OTE4IEMyMC41MTAwNDIsMTcuMzQ5NTk5NCAyMC4xNDUwODI3LDE3LjI4NzI3ODIgMjAuMDA3NCwxNy4xMDE5MjAxIEMxOS42ODIwMzYyLDE2LjY2MzEzNTEgMTkuNTAyODU1LDE2LjEwNzQwNDcgMTkuMjUxOTQ5MiwxNS41OTYzNTMzIEMxNy4xMjY0MzE0LDExLjYwNTU2MSAxNy41MDQ3OTY1LDcuNzkzMTk1NzIgOS42OTczMzIzNCwyLjc1NTEyNjQ3IEM4LjU4MDMzMDg4LDIuMTk1NTYzNjQgNy41Nzk5NTM1OSwxLjkxNDE4NzA0IDUuOTczMjY1MiwxLjg3MTAyODUxIEMzLjM4MzI5MjkyLC0wLjIxNzQyMTk1MiAxLjI0MjcyMzMsLTAuNjE5NDA0MSAwLjYxNDE2NDI4MiwwLjk3ODYyOTU5NyBDMC4xMjI5NTk0MjQsMi4yNDU0NjQwMiAxLjM0OTEzNzExLDMuNDg3OTI5MDQgMS43ODczNTY0MSw0LjEyOTgxOTU3IEMyLjg2MDY2Nzg3LDUuNTI3MjI1NTUgMi44MzMxNzM3OCw1LjkzMzM5MjY0IDMuMDA0OTczMzYsNi42MDcwMTkxMiBDMy42NDEyODUyNSw5LjIwMzAzNjkgNC43OTU2NDI4LDEwLjYwNTE5NjggNS4wOTM2MjUyMywxMS4wNzk5NzE1IEM0LjgzNTA1OTUsMTEuNDYyNjgwNiA0LjgyMTIyNTQsMTIuMDU2OTI1NyA0LjY3NTg4MzY3LDEyLjU0MTc4ODIgQzMuODcwMDA5MDUsMTUuOTA5MzM3OCA0LjU3MzYzNzE0LDE5Ljk3NjAzMTMgNi43NjIzMDI5MiwyMC4yOTA4OTE2IEM4LjI0MTM3ODI1LDIwLjIyMDI2MjUgNy43MDM1MzIyOSwxOC4wOTY4Mzk0IDguMTUxMDA3MzEsMTcuMjU1NDcxNyBDOS4xNTM3MTU1LDE5LjkwNjIyNjYgMTAuMDkyNSwyMC4zODgwNDg0IDEyLjYzMDQ2NzYsMjIuNjQzMTQ2NyBDMTQuNDQwMTQxNywyNC4xOTI0MTQ1IDIzLjQ0MTk4NTIsMjcuNTA3NjIwNiAyNy41LDI4IEMyNy4yNTY0NzkyLDI3LjE5NjE5NjYgMjUuOTAwMDUzNSwyNS43ODQyOTAxIDI0Ljk2OTU5ODcsMjUuMDA0Njg5NSBDMjMuODQ2NzYxOSwyNC4wNjM4OTY5IDIzLjAzOTI1MDQsMjMuOTUxNTQyOSAyMi41OTM3OTcsMjMuMDM2NjYzOCBDMjMuMzU4MDUyOCwyMi44OTY3OTI0IDIzLjc0Mjg2MjMsMjIuNzI5MTM1IDI0LjQ1MjAzNDIsMjIuNjA4NzE1MSBDMjQuODU4MTU0OCwyMi41Mzk3NTQ5IDI1LjI4NDM3OTksMjIuNTc0NzAyMyAyNi41NzU1Njk0LDIyLjE1MjU2NDggTDI2LjU3NTU2OTQsMjEuOTc3NDk5IEMyNS41MjE1OTUyLDIwLjMyMTMxOTYgMjIuODA0OTEwNywxOC4zMDUzNTIyIDIwLjcxODQyNDEsMTcuNDYwNzkxOCBaIE03LjUxMTA1NTA2LDMuNDgyMjE1MjUgQzguMzA2MDA5NCw0LjIwMzk2Mzg3IDcuODk5NTg4MDQsNS40NzM2NTUzOSA3LjAzMTExMjc5LDUuOTU5NDE0NiBDNi43MjI1MjczOSw1LjI2MDgzMDkzIDYuNDc3MDgxOTMsNC41MjQ5OTI1OCA1LjkzODEyNDMzLDMuOTg5NzEwOCBDNS4zMzQ1MjA3NCwzLjYwMDE5NTQ2IDYuMDAxNDk5MzgsMi45NTYwOTI1NiA2LjYzMTM3NDQxLDMuMDcwNjI3NjggQzcuMDE4OTQyNzYsMi45OTA0MDk3MyA3LjExMTQ0Njc0LDMuMTcyNjE3NDYgNy41MTEwNTUwNiwzLjQ4MjIxNTI1IFoiLz48L3N2Zz4=');
            -webkit-mask-size: 14px 14px;
        }
        .tabs_title .tab_process:before, .tab_tab.tab_active .tab_process:before, .tab_tab:hover .tab_process:before {
            background-color: ${isDark ? 'white' : config.foregroundColor};
        }
        .tab_tab.tab_hasActivity .tab_process:before {
            background-color: ${hyperTabs.activityColor} !important;
        }
    `
    const iconsColoredCSS = `
        .tab_process:not(.process_shell):before {
            transition: none;
        }
        .tab_process.process_gulp:before, .tab_process.process_npm:before {
            background-color: ${configColors.red} !important;
        }
        .tab_process.process_yarn:before, .tab_process.process_php:before, .tab_process.process_mysql:before {
            background-color: ${configColors.blue} !important;
        }
        .tab_process.process_node:before, .tab_process.process_vim:before, .tab_process.process_nvim:before {
            background-color: ${configColors.green} !important;
        }
        .tab_process.process_python:before {
            background-color: ${configColors.yellow} !important;
        }
    `

    // Hide traffic buttons
    if (!hyperTabs.trafficButtons) {
        exports.decorateBrowserOptions = (defaults) => {
            return Object.assign({}, defaults, {
                titleBarStyle: '',
                transparent: true,
                frame: false,
            });
        };
    }

    return Object.assign({}, config, {
        css: `
            ${config.css || ''}
            .hyper_main {
                border: 0;
            }
            .header_header {
                top: 0;
                right: 0;
                left: 0;
            }
            .tabs_title {
                color: ${isDark ? 'white' : config.foregroundColor};
            }
            .tabs_list {
                margin-left: 0;
            }
            .tabs_borderShim {
                display: none;
            }
            .tab_tab {
                color: ${colors.inactive};
                border-color: transparent !important;
                background-color: ${colors.back};
                transition: background 150ms ease;
            }
            .tab_tab:hover {
                color: ${isDark ? 'white' : config.foregroundColor};
                background-color: ${colors.highlight};
            }
            .tab_tab:first-of-type {
                border-left-width: 0 !important;
                padding-left: 1px;
            }
            .tab_tab.tab_active {
                color: ${isDark ? 'white' : config.foregroundColor};
                background-color: transparent;
            }
            .tab_icon {
                top: 9px;
                ${hyperTabs.closeAlign === 'right' ? 'right: 9px;' : 'left: 9px;' }
                width: 16px;
                height: 16px;
                border-radius: 2px;
                transform: scale(0);
                transition: transform 150ms ease, background 150ms ease;
            }
            .tab_icon:before {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                background-color: ${isDark ? 'white' : config.foregroundColor};
                -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5IiBoZWlnaHQ9IjkiIHZpZXdCb3g9IjAgMCA5IDkiPjxwb2x5Z29uIGZpbGw9IiMwMDAwMDAiIGZpbGwtcnVsZT0iZXZlbm9kZCIgcG9pbnRzPSI0Ljk1IDQuMjQzIDguNDg1IC43MDcgNy43NzggMCA0LjI0MyAzLjUzNiAuNzA3IDAgMCAuNzA3IDMuNTM2IDQuMjQzIDAgNy43NzggLjcwNyA4LjQ4NSA0LjI0MyA0Ljk1IDcuNzc4IDguNDg1IDguNDg1IDcuNzc4Ii8+PC9zdmc+');
                -webkit-mask-repeat: no-repeat;
                -webkit-mask-size: 9px;
                -webkit-mask-position: center;
                transition: background 150ms ease;
            }
            .tab_icon:hover {
                background-color: ${colors.back};
            }
            .tab_tab:hover .tab_icon {
                transform: scale(1);
            }
            .tab_tab.tab_active .tab_icon:hover {
                background-color: ${colors.highlightier};
            }
            .tab_tab.tab_hasActivity .tab_text {
                color: ${hyperTabs.activityColor};
            }
            .tab_tab.tab_hasActivity .tab_icon:before {
                -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5IiBoZWlnaHQ9IjkiIHZpZXdCb3g9IjAgMCA5IDkiPjxjaXJjbGUgY3g9IjQuNSIgY3k9IjQuNSIgcj0iMy41IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiLz48L3N2Zz4=');
                -webkit-mask-size: 9px;
            }
            .tab_tab.tab_hasActivity .tab_icon:before, .tab_tab.tab_hasActivity .tab_icon:hover {
                background-color: ${hyperTabs.activityColor};
            }
            .tab_tab.tab_hasActivity .tab_icon:hover:before {
                background-color: ${isDark ? colors.back : config.foregroundColor};
            }
            .tab_process {
                max-width: 100%;
                position: relative;
                display: inline-block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .tab_shape {
                display: none;
            }
            ${hyperTabs.trafficButtons ? trafficButtonsCSS : ''}
            ${hyperTabs.trafficButtons && hyperTabs.border ? trafficButtonsBorderCSS : ''}
            ${hyperTabs.border ? borderCSS : ''}
            ${hyperTabs.activityPulse ? pulseCSS : ''}
            ${hyperTabs.tabIcons ? iconsCSS : ''}
            ${hyperTabs.tabIconsColored ? iconsColoredCSS : ''}
        `
    });
};

// Current process icon
const getIcon = (title) => {
    const process = title.match(/(?:[\s]+|^)(gulp|php|node|npm|yarn|vim|nvim|python|mysql)(?:[\s]+|$)/i);
    return process ? process[0].trim().toLowerCase() : 'shell';
};

// Tab process icons
exports.decorateTab = (Tab, { React }) => {
    return class extends Tab {
        render() {
            const icon = getIcon(this.props.text);
            this.props.text = React.createElement('span', { className: `tab_process process_${icon}` }, this.props.text);
            return React.createElement(Tab, Object.assign({}, this.props, {}));
        }
    }
};

exports.decorateTabs = (Tabs, { React }) => {
    return class extends Tabs {
        render() {
            if (this.props.tabs.length === 1 && typeof this.props.tabs[0].title === 'string') {
                const icon = getIcon(this.props.tabs[0].title);
                this.props.tabs[0].title = React.createElement('span', { className: `tab_process process_${icon}` }, this.props.tabs[0].title);
            }
            return React.createElement(Tabs, Object.assign({}, this.props, {}));
        }
    }
};
