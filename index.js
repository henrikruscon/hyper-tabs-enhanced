// Require
const { remote } = require('electron');
const color = require('color');
let dirname = __dirname;

if (process.platform == 'win32') {
    dirname = dirname.replace(/\\/g, '/');
    console.log(dirname);
}
const iconAlias = {
    vim: ['nvim'],
    python: ['python3', 'python'],
    node: ['nodemon'],
    compile: ['cc', 'ccache', 'clang', 'gcc', 'gmake', 'make', 'xcodebuild',],
    docker: ['docker-compose'],
    http: ['wget', 'http'],
    shell: ['bash', 'zsh']
};

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
    
    const hyperTabs = Object.assign({
        trafficButtons: false,
        border: false,
        activityColor: config.colors.lightYellow,
        activityPulse: true,
        tabIcons: true,
        tabIconsColored: false,
    }, config.hyperTabs);
    
    const trafficButtonsCSS = `
        .tabs_list {
            margin-left: 74px;
        }
        .actions_nav {
            display: flex;
            position: fixed;
            top: 7px;
            left: 7px;
            z-index: 100;
            padding: 4px;
            pointer-events: auto;
        }
        .action_action {
            width: 12px;
            height: 12px;
            margin-left: 8px;
            background-color: ${isDark ? colors.inactive : colors.highlight};
            background-repeat: no-repeat;
            border-radius: 50%;
        }
        .action_action:first-of-type {
            margin-left: 0;
        }
        .action_close {
            background-position: 2px 2px;
        }
        .action_minimize {
            background-position: 2px 5px;
        }
        .action_fullscreen {
            background-position: 3px 3px;
        }
        .action_maximize {
            background-position: 2px 2px;
        }
        .actions_nav:hover .action_close {
            background-color: #FE6158;
        }
        .actions_nav:hover .action_minimize {
            background-color: #FFC130;
        }
        .actions_nav:hover .action_maximize {
            background-color: #29D043;
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
        .tab_process.process_atom:before {
            -webkit-mask-image: url('${dirname}/icons/atom.svg');
            -webkit-mask-size: 100% 50%;
        }
        .tab_process.process_shell:before {
            -webkit-mask-image: url('${dirname}/icons/shell.svg');
            -webkit-mask-size: 100% 50%;
        }
        .tab_process.process_bower:before {
            -webkit-mask-image: url('${dirname}/icons/bower.svg');
            -webkit-mask-size: 100% 50%;
        }
        .tab_process.process_coffee:before {
            -webkit-mask-image: url('${dirname}/icons/coffee.svg');
            -webkit-mask-size: 100% 50%;
        }
        .tab_process.process_npm:before {
            -webkit-mask-image: url('${dirname}/icons/npm.svg');
            -webkit-mask-size: 100% 50%;
        }
        .tab_process.process_perl:before {
            -webkit-mask-image: url('${dirname}/icons/perl.svg');
            -webkit-mask-size: 100% 50%;
        }
        .tab_process.process_composer:before {
            -webkit-mask-image: url('${dirname}/icons/composer.svg');
            -webkit-mask-size: 100% 50%;
        }
        .tab_process.process_node:before {
            -webkit-mask-image: url('${dirname}/icons/nodejs.svg');
            -webkit-mask-size: 100% 50%;
        }
        .tab_process.process_compile:before {
            -webkit-mask-image: url('${dirname}/icons/compile.svg');
            -webkit-mask-size: 100% 50%;
        }
        .tab_process.process_curl:before {
            -webkit-mask-image: url('${dirname}/icons/curl.svg');
            -webkit-mask-size: 100% 50%;
        }
        .tab_process.process_docker:before {
            -webkit-mask-image: url('${dirname}/icons/docker.svg');
            -webkit-mask-size: 100% 50%;
        }
        .tab_process.process_git:before {
            -webkit-mask-image: url('${dirname}/icons/git.svg');
            -webkit-mask-size: 100% 50%;
        }
        .tab_process.process_gulp:before {
            -webkit-mask-image: url('${dirname}/icons/gulp.svg');
            -webkit-mask-size: 100% 50%;
        }
        .tab_process.process_http:before {
            -webkit-mask-image: url('${dirname}/icons/http.svg');
            -webkit-mask-size: 100% 50%;
        }
        .tab_process.process_mysql:before {
            -webkit-mask-image: url('${dirname}/icons/mysql.svg');
            -webkit-mask-size: 100% 50%;
        }
        .tab_process.process_php:before {
            -webkit-mask-image: url('${dirname}/icons/php.svg');
            -webkit-mask-size: 100% 50%;
        }
        .tab_process.process_nano:before {
            -webkit-mask-image: url('${dirname}/icons/nano.svg');
            -webkit-mask-size: 100% 50%;
        }
        .tab_process.process_vim:before {
            -webkit-mask-image: url('${dirname}/icons/vim.svg');
            -webkit-mask-size: 100% 50%;
        }
        .tab_process.process_yarn:before {
            -webkit-mask-image: url('${dirname}/icons/yarn.svg');
            -webkit-mask-size: 100% 50%;
        }
        .tab_process.process_python:before {
            -webkit-mask-image: url('${dirname}/icons/python.svg');
            -webkit-mask-size: 100% 50%;
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
            background-color: ${config.colors.red} !important;
        }
        .tab_process.process_yarn:before, .tab_process.process_php:before, .tab_process.process_mysql:before {
            background-color: ${config.colors.blue} !important;
        }
        .tab_process.process_node:before, .tab_process.process_vim:before, .tab_process.process_nvim:before {
            background-color: ${config.colors.green} !important;
        }
        .tab_process.process_python:before {
            background-color: ${config.colors.yellow} !important;
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
            .actions_nav {
                display: none;
                pointer-events: none;
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


const getAliases = () => {
    const hyperTabs = window.config.getConfig().hyperTabs;
    const aliasesConfig = (hyperTabs && hyperTabs.iconAlias) ? hyperTabs.iconAlias : {};
    var aliasMap = {};
    Object.keys(iconAlias).forEach(function(origin) {
        iconAlias[origin].forEach(function(alias) {
            aliasMap[alias] = origin;
        });
    });
    Object.keys(aliasesConfig).forEach(function(origin) {
        aliasesConfig[origin].forEach(function(alias) {
            aliasMap[alias] = origin;
        });
    });
    return aliasMap;
};

// Current process icon
const getIcon = (title) => {
    const process = title.match(/(?:[\s]+|^)(gulp|php|node|bash|zsh|npm|composer|git|yarn|vim|cc|ccache|clang|gcc|gmake|make|docker-compose|docker|wget|http|xcodebuild|nvim|python|mysql)(?:[\s]+|$)/i);
    if(process) return process[0].trim().toLowerCase();
    
    const aliasMap = getAliases();
    const process_alias = title.match(new RegExp('(?:[\\s]+|^)(' + Object.keys(aliasMap).join('|') + ')(?:[\\s]+|$)', 'i'));
    console.log(new RegExp('(?:[\s]+|^)(' + Object.keys(aliasMap).join('|') + ')(?:[\s]+|$)', 'i'));
    return process_alias ? aliasMap[process_alias[0].trim().toLowerCase()] : 'shell';
};

// Hide default traffic buttons
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
        }
    }
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