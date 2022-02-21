import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AbiManager {
  abis: {name: string,abi: string}[] = [];
  constructor() { }
}
