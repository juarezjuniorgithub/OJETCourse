requirejs.config({
    // Path mappings for the logical module names
    paths: {
        'knockout': 'libs/knockout/dist/knockout',
        'jquery': 'libs/jquery/dist/jquery.min',
        'jqueryui-amd': 'libs/jquery-ui/ui',
        'promise': 'libs/es6-promise/promise.min',
        'hammerjs': 'libs/hammerjs/hammer.min',
        'ojdnd': 'libs/oraclejet/dist/js/libs/dnd-polyfill/dnd-polyfill-1.0.0.min',
        'ojs': 'libs/oraclejet/dist/js/libs/oj/min',
        'ojL10n': 'libs/oraclejet/dist/js/libs/oj/ojL10n',
        'ojtranslations': 'libs/oraclejet/dist/js/libs/oj/resources',
        'text': 'libs/text/text',
        'signals': 'libs/js-signals/dist/signals.min'
    },
    // Shim configurations for modules that do not expose AMD
    shim: {
        'jquery': {
            exports: ['jQuery', '$']
        }
    },
// This section configures the i18n plugin. It is merging the Oracle JET built-in translation
// resources with a custom translation file.
// Any resource file added, must be placed under a directory named "nls". You can use a path mapping or you can define
// a path that is relative to the location of this main.js file.
    config: {
        ojL10n: {
            merge: {
                //'ojtranslations/nls/ojtranslations': 'resources/nls/myTranslations'
            }
        }
    }
});

require(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojrouter',
    'ojs/ojmodule', 'ojs/ojoffcanvas', 'ojs/ojnavigationlist', 'ojs/ojarraytabledatasource'],
        function (oj, ko, $)
        {

            var router = oj.Router.rootInstance;
            router.configure({
                'home': {label: 'Home', isDefault: true},
                'people': {label: 'People'}
            });

            function RootViewModel() {

                var self = this;

                self.router = router;

                var navData = [
                    {name: 'Home', id: 'home'},
                    {name: 'People', id: 'people'}
                ];
                self.navDataSource = new oj.ArrayTableDataSource(navData, {idAttribute: 'id'});
                var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
                self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
                self.navChange = function (event, ui) {
                    if (ui.option === 'selection' && ui.value !== self.router.stateId()) {
                        if (self.smScreen())
                            self.toggleDrawer();
                        self.router.go(ui.value);
                    }
                };

                self.drawerParams = {
                    displayMode: 'push',
                    selector: '#offcanvas',
                };
                // Called by navigation drawer toggle button and after selection of nav drawer item
                self.toggleDrawer = function () {
                    return oj.OffcanvasUtils.toggle(self.drawerParams);
                };
                // Close the drawer for medium and up screen sizes
                var mdQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
                self.mdScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);
                self.mdScreen.subscribe(function () {
                    oj.OffcanvasUtils.close(self.drawerParams);
                });

            }
            oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();
            oj.Router.sync().then(
                    function () {
                        ko.applyBindings(new RootViewModel(), document.getElementById('globalBody'));
                    },
                    function (error) {
                        oj.Logger.error('Error in root start: ' + error.message);
                    }
            );
        }
);

