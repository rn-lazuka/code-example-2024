(window as any).MODULE_ORIGIN = MODULE_DYNAMIC_ORIGIN ? window.location.origin : '';
(window as any).DISABLE_EXP_TOKEN_UPDATE_FOR_TENANTS = DISABLE_EXP_TOKEN_UPDATE_FOR_TENANTS ? 1 : 2;

import('./bootstrap');
export {};
