export let cfg = {
  baseUrl: 'https://lastmile.mideas.es',
  apiUrl: 'https://lastmile.mideas.es/api',
  configUrl: '/sistema/general/config.json',
  tokenName: 'token',
  user: {
    register: '/apps/Mideas/register.json',
    login: '/apps/Mideas/login.json',
	  formToken:'/apps/Mideas/formToken.json',
    refresh:'/apps/Mideas/login.json',
	  list:'/usuarios/usuario/buscar.json',
    info: '/usuarios/usuario/##ID##/info.json',
    geolocation: '/usuarios/usuario/saveGeolocation.json'
  },
  orders: {
	  list: '/shop/pedido/buscar.json',
	  assign: '/shop/pedido/asociarProveedor.json',
    pickup: '/shop/pedido/recogerPedidoConductor.json',
    store: '/shop/pedido/almacenarPedidoConductor.json',
    add_document: '/shop/pedido/addDocumentOrder.json',
	  info: '/shop/pedido/##ID##/info.json'
  },
  messages: {
	  list: '/mensajes/mensaje/buscar.json',
	  info: '/mensajes/mensaje/##ID##/info.json',
    response: '/mensajes/mensaje/nuevo.json'
  }
};
