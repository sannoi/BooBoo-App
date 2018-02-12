export let cfg = {
  baseUrl: 'https://lastmile.mideas.es',
  apiUrl: 'https://lastmile.mideas.es/api',
  tokenName: 'token',
  user: {
    register: '/apps/Mideas/register.json',
    login: '/apps/Mideas/login.json',
	formToken:'/apps/Mideas/formToken.json',
    refresh:'/apps/Mideas/login.json',
	list:'/usuarios/usuario/buscar.json'
  },
  orders: {
	  list: '/shop/pedido/buscar.json',
	  assign: '/shop/pedido/asociarProveedor.json',
	  info: '/shop/pedido/##ID##/info.json'
  }
};


