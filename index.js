const Color = require('color');
const { filter } = require('fuzzaldrin');

// Config
exports.decorateConfig = (config) => {
    const foreColor = Color('#FFF');
    const backColor = Color(config.backgroundColor);
    const colors = {
        light: backColor.lighten(0.31).string(),
        lighter: backColor.lighten(0.43).string(),
        lightest: foreColor.fade(0.8).string(),
        dark: backColor.darken(0.16).string(),
    };

    const hyperTabs = Object.assign({
        border: false,
        activityColor: config.colors.lightYellow,
        activityPulse: true,
        tabIcons: true,
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
        .tab_tab.tab_active::before {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: -1px;
            border-bottom: 1px solid ${config.backgroundColor};
        }
        .tab_tab:last-child, .tab_tab.tab_active:last-child {
            border-right-width: 0 !important;
            padding-right: 1px;
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
            background-color: ${colors.lightest};
            -webkit-mask-repeat: no-repeat;
            -webkit-mask-position: 0 center;
            transition: background 150ms ease;
        }
        .tab_process.process_shell:before {
            left: 5px;
            -webkit-mask-image: url('${__dirname}/icons/process-shell.svg');
            -webkit-mask-size: 8px 14px;
        }
        .tab_process.process_gulp:before {
            left: 6px;
            -webkit-mask-image: url('${__dirname}/icons/process-gulp.svg');
            -webkit-mask-size: 6px 14px;
        }
        .tab_process.process_php:before {
            -webkit-mask-image: url('${__dirname}/icons/process-php.svg');
            -webkit-mask-size: 14px 10px;
        }
        .tab_process.process_node:before {
            -webkit-mask-image: url('${__dirname}/icons/process-node.svg');
            -webkit-mask-size: 14px 14px;
        }
        .tab_process.process_vim:before {
            left: 2px;
            -webkit-mask-image: url('${__dirname}/icons/process-vim.svg');
            -webkit-mask-size: 12px 11px;
        }
        .tabs_title .tab_process:before, .tab_tab.tab_active .tab_process:before, .tab_tab:hover .tab_process:before {
            background-color: white;
        }
        .tab_tab.tab_hasActivity .tab_process:before {
            background-color: ${hyperTabs.activityColor};
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
            .tab_first {
                border-left-width: 0 !important;
                padding-left: 1px;
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
                -webkit-mask-image: url('${__dirname}/icons/close.svg');
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
                -webkit-mask-image: url('${__dirname}/icons/close-activity.svg');
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
        `
    });
};

// Current process icon
const getIcon = (title) => {
    const process = filter(['shell', 'gulp', 'php', 'node', 'vim'], title.split(' ')[1], { maxResults: 1 });
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
