const Color = require('color');
const { filter } = require('fuzzaldrin');

// Config
exports.decorateConfig = (config) => {
    const backColor = Color(config.backgroundColor);
    const colors = {
        light: backColor.lighten(0.31).string(),
        lighter: backColor.lighten(0.43).string(),
        lightest: backColor.desaturate(0.3).lightness(35).string(),
        dark: backColor.darken(0.18).string(),
    };

    const hyperTabs = Object.assign({
        border: false,
        activityColor: config.colors.lightYellow,
        activityPulse: true,
        tabIcons: true,
        tabIconsColored: false,
    }, config.hyperTabs);

    const borderCSS = `
        .tabs_list {
            border-bottom: 1px solid ${colors.light};
        }
        .tab_tab {
            border-right-width: 1px;
            border-right-style: solid;
        }
        .tab_tab.tab_active {
            border-color: ${colors.light} !important;
        }
        .tab_tab:last-of-type {
            border-right-width: 0 !important;
            padding-right: 1px;
        }
        .tab_tab.tab_active::before {
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
            background-color: ${colors.lightest};
            transition: background 150ms ease;
        }
        .tab_process.process_shell:before {
            left: 5px;
            -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjE0IiB2aWV3Qm94PSIwIDAgOCAxNCI+PHBvbHlnb24gZmlsbD0iIzAwMDAwMCIgZmlsbC1ydWxlPSJldmVub2RkIiBwb2ludHM9IjggNy42NSA0LjY5MSA1LjkxMiA3LjA5MiAwIDAgNi4zNDkgMy4xMTYgOC40NDMgLjkwOCAxNCIvPjwvc3ZnPg==');
            -webkit-mask-size: 8px 14px;
        }
        .tab_process.process_gulp:before {
            left: 6px;
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
        .tab_process.process_vim:before, .tab_process.process_nvim:before {
            left: 2px;
            -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMSIgdmlld0JveD0iMCAwIDEyIDExIj48cGF0aCBmaWxsPSIjMDAwMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04LjkzODExMzk1LDQuMTk3MjIzNjEgQzguNzU4Nzc0ODEsNC4zNzM5NDczOSA4LjQ2MzI5MTk1LDQuNjY0NzkyODMgOC4yNzczNjEyNiw0Ljg0NzYwNTM4IEwyLjM1NjA1ODYzLDEwLjY2OTYwNDkgQzIuMTcwNDc0MTQsMTAuODUyMDc3MSAxLjgxNzc3MDg3LDExIDEuNTUyNzAzMTgsMTEgTDEuMTkyOTA2MzksMTEgQzAuOTM0ODA5OTIyLDExIDAuNzI1NTgxMzk1LDEwLjc5ODk2ODIgMC43MjU1ODEzOTUsMTAuNTM1NzY2MiBMMC43MjU1ODEzOTUsMS44MzkyMzM3NiBDMC43MjU1ODEzOTUsMS41ODI4NDQ1MyAwLjUyNzMxMzA5LDEuMzc1IDAuMjYxOTUxNTM1LDEuMzc1IEwwLjQ2MzYyOTg2LDEuMzc1IEMwLjIwNzU3NDE1OSwxLjM3NSAwLDEuMTYwMTU2MjUgMCwwLjkwOTQ4NzcyNCBMMCwwIEw0LjMzOTc1NTgyLDAgQzQuNTkzOTQxNjYsMCA0LjgsMC4yMTQ4NDM3NSA0LjgsMC40NjU1MTIyNzYgTDQuOCwwLjkwOTQ4NzcyNCBDNC44LDEuMTY2NTgzMDYgNC42MDE3MzE3LDEuMzc1IDQuMzM2MzcwMTQsMS4zNzUgTDQuNTM4MDQ4NDYsMS4zNzUgQzQuMjgxOTkyNzYsMS4zNzUgNC4wNzQ0MTg2LDEuNTc1MzIwNzIgNC4wNzQ0MTg2LDEuODMxODY4ODEgTDQuMDc0NDE4Niw0LjY0NDAzMzk1IEM0LjA3NDQxODYsNC44OTYzNTU2MyA0LjIxODAyMjkyLDQuOTU5MzkyNjggNC4zOTY3ODgyLDQuNzgzMjM0MzkgTDcuNTMzMDkxOTksMS42OTI2NjgzNyBDNy43MTExMzE4LDEuNTE3MjI0OTggNy42NDgwNjk0NCwxLjM3NSA3LjM5MzExNDkzLDEuMzc1IEw3LjY2MjM0NjY1LDEuMzc1IEM3LjQwNjk5OTY1LDEuMzc1IDcuMiwxLjE2MDE1NjI1IDcuMiwwLjkwOTQ4NzcyNCBMNy4yLDAuNDY1NTEyMjc2IEM3LjIsMC4yMDg0MTY5NDUgNy4zOTc3MDg0NCwwIDcuNjY0Njk5MzIsMCBMNy43NjA3MDU4OSwwIEM4LjAxNzM1MjI0LDAgOC40MzQ2MTQ3NywwIDguNjk1ODg2NDksMCBMMTAuOTQzNDcyMiwwIEMxMS4yMDMzMTE4LDAgMTEuNjI1NTI5NywwIDExLjg3NTcxNDYsMCBMMTEuNTM4MjM4OSwwIEMxMS43OTMyNjI1LDAgMTIsMC4yMDg0OTA3NTMgMTIsMC40NjYxNTIxOTEgTDEyLDAuMTExMzQ3ODA5IEMxMiwwLjM2ODc5NjU1NSAxMiwwLjc4MTQ3NTY1MiAxMiwxLjA0MDI1MjM4IEwxMiwwLjcxNzIzNzY4NiBDMTIsMC45NzI4MDg3NjggMTEuODU0NDgxNywxLjMyMzM4NjI1IDExLjY3NTI3NzgsMS40OTk5NzY3NyBMOC45MzgxMTM5NSw0LjE5NzIyMzYxIFoiLz48L3N2Zz4=');
            -webkit-mask-size: 12px 11px;
        }
        .tabs_title .tab_process:before, .tab_tab.tab_active .tab_process:before, .tab_tab:hover .tab_process:before {
            background-color: white;
        }
        .tab_tab.tab_hasActivity .tab_process:before {
            background-color: ${hyperTabs.activityColor} !important;
        }
    `
    const iconsColoredCSS = `
        .tab_process:not(.process_shell):before {
            transition: none;
        }
        .tab_process.process_gulp:before {
            background-color: ${config.colors.red} !important;
        }
        .tab_process.process_php:before {
            background-color: ${config.colors.blue} !important;
        }
        .tab_process.process_node:before {
            background-color: ${config.colors.green} !important;
        }
        .tab_process.process_vim:before, .tab_process.process_nvim:before {
            background-color: ${config.colors.green} !important;
        }
    `

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
            .tabs_list {
                margin-left: 0;
            }
            .tabs_borderShim {
                display: none;
            }
            .tab_tab {
                color: ${colors.lightest};
                border-color: transparent !important;
                background-color: ${colors.dark};
                transition: background 150ms ease;
            }
            .tab_tab:hover {
                color: white;
                background-color: ${colors.light};
            }
            .tab_tab:first-of-type {
                border-left-width: 0 !important;
                padding-left: 1px;
            }
            .tab_tab.tab_active {
                color: white;
                background-color: transparent;
            }
            .tab_icon {
                top: 9px;
                left: 9px;
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
                background-color: white;
                -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5IiBoZWlnaHQ9IjkiIHZpZXdCb3g9IjAgMCA5IDkiPjxwb2x5Z29uIGZpbGw9IiMwMDAwMDAiIGZpbGwtcnVsZT0iZXZlbm9kZCIgcG9pbnRzPSI0Ljk1IDQuMjQzIDguNDg1IC43MDcgNy43NzggMCA0LjI0MyAzLjUzNiAuNzA3IDAgMCAuNzA3IDMuNTM2IDQuMjQzIDAgNy43NzggLjcwNyA4LjQ4NSA0LjI0MyA0Ljk1IDcuNzc4IDguNDg1IDguNDg1IDcuNzc4Ii8+PC9zdmc+');
                -webkit-mask-repeat: no-repeat;
                -webkit-mask-size: 9px;
                -webkit-mask-position: center;
                transition: background 150ms ease;
            }
            .tab_icon:hover {
                background-color: ${colors.dark};
            }
            .tab_tab:hover .tab_icon {
                transform: scale(1);
            }
            .tab_tab.tab_active .tab_icon:hover {
                background-color: ${colors.lighter};
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
                background-color: ${colors.dark};
            }
            .tab_textInner {
                padding: 0 30px;
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
            ${hyperTabs.border ? borderCSS : ''}
            ${hyperTabs.activityPulse ? pulseCSS : ''}
            ${hyperTabs.tabIcons ? iconsCSS : ''}
            ${hyperTabs.tabIconsColored ? iconsColoredCSS : ''}
        `
    });
};

// Current process icon
const getIcon = (title) => {
    const process = filter(['shell', 'gulp', 'php', 'node', 'vim', 'nvim'], title.split(' ')[1] ? title.split(' ')[1] : title, { maxResults: 1 });
    return process.length === 0 ? 'shell' : process[0];
};

// Hide traffic buttons
exports.decorateBrowserOptions = (defaults) => {
    return Object.assign({}, defaults, {
        titleBarStyle: '',
        transparent: true,
        frame: false,
    });
};

// Tab process icons
exports.decorateTab = (Tab, { React }) => {
    return class extends Tab {
        render() {
            const icon = getIcon(this.props.text);
            this.props.text = React.createElement('span', { title: this.props.text, className: `tab_process process_${icon}` }, this.props.text);
            return React.createElement(Tab, Object.assign({}, this.props, {}));
        };
    };
};
exports.decorateTabs = (Tabs, { React }) => {
    return class extends Tabs {
        render() {
            if (this.props.tabs.length === 1 && typeof this.props.tabs[0].title === 'string') {
                const icon = getIcon(this.props.tabs[0].title);
                this.props.tabs[0].title = React.createElement('span', { title: this.props.tabs[0].title, className: `tab_process process_${icon}` }, this.props.tabs[0].title);
            }
            return React.createElement(Tabs, Object.assign({}, this.props, {}));
        }
    }
};
