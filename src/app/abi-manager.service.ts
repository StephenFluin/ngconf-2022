import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AbiManager {
  abis: {name: string,abi: string}[] = [];
  requester: string = '0x2232BF442f759Dd6D03601192707BA25A6C17Cf1';

  constructor() {
    if(localStorage['operatorCachedABIs']) {
      this.abis = JSON.parse(localStorage['operatorCachedABIs']);
    }
   }
  add(newAbi: {name:string,abi:string}) {
    this.abis.push(newAbi);
    localStorage['operatorCachedABIs'] = JSON.stringify(this.abis);
  }
}
