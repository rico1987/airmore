import { InjectionToken } from '@angular/core';

export interface ModalConfig {
  amMask?: boolean;
  amMaskClosable?: boolean;
}

export const MODAL_DEFAULT_CONFIG = new InjectionToken<ModalConfig>('MODAL_DEFAULT_CONFIG');

export const MODAL_CONFIG = new InjectionToken<ModalConfig>('MODAL_CONFIG');

export const MODAL_DEFAULT_CONFIG_PROVIDER = {
  provide: MODAL_DEFAULT_CONFIG,
  useValue: {
    amMask: true,
    amMaskClosable: true,
  }
};