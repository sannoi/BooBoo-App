export let cfg = {
  baseUrl: 'https://lastmile.mideas.es',
  apiUrl: 'https://lastmile.mideas.es/api',
  configUrl: '/sistema/general/config.json',
  tokenName: 'token',
  sites: [
    {
      name: 'Last Mile',
      baseUrl: 'https://lastmile.mideas.es',
      apiUrl: 'https://lastmile.mideas.es/api',
      color: 'rgb(67, 167, 255)',
      logo: 'assets/img/booboo_ico.png',
      theme: 'blue-theme'
    },
    {
      name: 'Red de Optimización',
      baseUrl: 'https://www.booboo.eu',
      apiUrl: 'https://www.booboo.eu/api',
      color: 'rgb(255, 139, 187)',
      logo: 'assets/img/booboo_ico.png',
      theme: 'pink-theme'
    }
  ],
  extensions: {
    users: {
      active: true,
      provider: 'usersService',
      list: {
        use: true,
        component: 'DriversPage'
      },
      item_detail: {
        use: false
      }
    },
    messages: {
      active: true,
      provider: 'messagesService',
      list: {
        use: true,
        component: 'MessagesPage'
      },
      item_detail: {
        use: true,
        component: 'MessagesInfoPage'
      }
    },
    geolocation: {
      active: true,
      provider: 'locationService',
      list: {
        use: false
      },
      item_detail: {
        use: false
      }
    },
    notifications: {
      active: true,
      provider: 'notificationsService',
      list: {
        use: false
      },
      item_detail: {
        use: false
      }
    }
  },
  config_settings: {
    app: {
      geolocation: 'off',
      notifications: 'off'
    }
  },
  min_level_access_user: 2,
  system: {
    upload: '/sistema/archivo/upload.json'
  },
  user: {
    register: '/apps/Mideas/register.json',
    login: '/apps/Mideas/login.json',
    logout: '/apps/Mideas/logout.json',
    formToken: '/apps/Mideas/formToken.json',
    refresh: '/apps/Mideas/login.json',
    list: '/usuarios/usuario/buscar.json',
    info: '/usuarios/usuario/##ID##/info.json',
    geolocation: '/usuarios/usuario/saveGeolocation.json',
    save_firebase_token: '/usuarios/usuario/saveFirebaseToken.json',
    clear_firebase_token: '/usuarios/usuario/clearFirebaseToken.json'
  },
  orders: {
    list: '/shop/pedido/buscar.json',
    assign: '/shop/pedido/asociarProveedor.json',
    pickup: '/shop/pedido/recogerPedidoConductor.json',
    store: '/shop/pedido/almacenarPedidoConductor.json',
    complete: '/shop/pedido/completarPedidoConductor.json',
    add_document: '/shop/pedido/addDocumentOrder.json',
    info: '/shop/pedido/##ID##/info.json'
  },
  messages: {
    list: '/mensajes/mensaje/buscar.json',
    info: '/mensajes/mensaje/##ID##/info.json',
    response: '/mensajes/mensaje/nuevo.json',
    readed: '/mensajes/mensaje/mensajeLeido.json',
    checkNews: '/mensajes/mensaje/nuevosMensajes.json'
  }
};
