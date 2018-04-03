export let menu = {
  pages: [
    { title: 'page.profile', icon: 'desktop', component: 'ProfilePage', nav_params: { pageTitle: 'page.profile' } },
    { title: 'page.orders.list', icon: 'cube', component: 'ListMasterPage', nav_params: { pageTitle: 'page.orders.list' } },
    { title: 'page.orders.listNotAssigned', icon: 'share-alt', require_user_type: 'proveedor', component: 'ListMasterPage', nav_params: { pageTitle: 'page.orders.listNotAssigned', onlyNotAssigned: true } },
    { title: 'page.messages', icon: 'chatboxes', extension: 'messages', type: 'list', nav_params: { pageTitle: 'page.messages', pageType: 'all' } },
    { title: 'page.map', icon: 'map', component: 'MapPage', nav_params: { pageTitle: 'page.map' } },
    { title: 'page.settings', icon: 'cog', component: 'SettingsListPage', nav_params: { pageTitle: 'page.settings' } },
    { title: 'page.help', icon: 'help', component: 'HelpPage', nav_params: { pageTitle: 'page.help' } },
    { title: 'Solicitar envío', icon: 'cart', require_user_type: 'cliente', component: 'OrderNewPage', nav_params: { pageTitle: 'Solicitar envío' } },
    { title: 'page.logout', icon: 'exit', component: 'WelcomePage', method: 'logout' }
  ]
};
