import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AbiManager } from '../abi-manager.service';
import { CounterABI } from '../counter-abi';
import { OperatorABI } from '../operator-abi';
import { RaffleABI } from '../raffle-abi';

declare var Web3: any;
declare var web3: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.html',
})
export class HomeComponent implements OnInit {
  contracts: { [key: string]: any } = {};
  methods: any[] = [];
  values: { [key: string]: any } = {};

  address: string = '';
  // = '0xAF37342e003E90DCa134A3dF76C52aeEFC4bA39d';

  
  operatorABI = JSON.stringify(OperatorABI);
  counterABI = JSON.stringify(CounterABI);
  raffleABI = JSON.stringify(RaffleABI);

  alchemyKovan = new Web3(
    'https://eth-kovan.alchemyapi.io/v2/UmrlTq_9a6uDS-WQ6PNQsfyvroyHixvb'
  );
  metamask: any = new Web3((<any>window)['ethereum']);

  alchemySelectedContract: any;
  metamaskSelectedContract: any;

  ethereum = (<any>window)['ethereum'];

  chainChanged: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  accountsChanged: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);


  constructor(
    public manager: AbiManager,
    public changeDetector: ChangeDetectorRef
  ) {
    if(this.ethereum) {
    this.ethereum.on('chainChanged', (chainId: string) => {this.chainChanged.next(parseInt(chainId,16));});
    this.ethereum.on('accountsChanged', (accounts: string[]) => {this.accountsChanged.next(accounts);});

    this.ethereum.request({ method: 'eth_chainId' })
    .then((chain: string) => {
      this.chainChanged.next(parseInt(chain,16));
    });
    this.connect();
  }
  }

  pick(abi: string, address: string) {
    this.address = address;

    this.alchemySelectedContract = new this.alchemyKovan.eth.Contract(
      JSON.parse(abi),
      address
    );
    this.metamaskSelectedContract = new this.metamask.eth.Contract(
      JSON.parse(abi),
      address
    );

    console.log('selected Alchemy contract is',this.alchemySelectedContract);
    // this.withdrawable = new Promise((resolve, reject) => {
    //   this.selectedContract.methods
    //     .withdrawable()
    //     .call((err: string, result: string) => {
    //       if (err) {
    //         //console.log('withdrawable err', err);
    //         reject(err);
    //       } else {
    //         //console.log('Withdrawable result', result);
    //         resolve(result);
    //       }
    //     });
    // });
    this.methods = JSON.parse(abi);
  }

  run(methodName: string, form: any) {
    console.log("attempting to run",methodName);
    let activation: any;
    const args = Array.from(form).map((x: any) => x.value);

    if (
      this.methods.find((x) => x.name == methodName).stateMutability === 'view'
    ) {
      console.log("found a view method");
      activation = this.metamaskSelectedContract.methods[methodName](
        ...args
      ).call;
    } else {
      console.log("didn't find a view method");
      for (let i = 0; i < args.length; i++) {
        let methodABI = this.methods.find(
          (method) => method.name === methodName
        );
        if (methodABI) {
          console.log('found method', methodABI);
          if (methodABI.inputs[i].type === 'bytes') {
            args[i] = JSON.parse(args[i]);
          }
        }
      }
      console.log('about to call',methodName);
      activation = this.metamaskSelectedContract.methods[methodName](
        ...args
      ).send;
    }
    try {
    activation(
      { from: this.manager.requester },
      (err: string, result: string) => {
        console.log('run of', methodName, 'returned', result, err);
        // This promise exists so Angular Change Detection runs
        this.values[methodName] = result;
        this.changeDetector.detectChanges();
      }
    );
    } catch(err) {console.log('run failed',err)}
  }
  connect() {
    console.log(this.ethereum
    .request({ method: 'eth_requestAccounts' })
    .then((result: any) => {console.log('result of connect is',result);
    this.manager.requester = result[0];
  console.log("requester is now",result[0])}));
  }

  ngOnInit(): void {}
  ngAfterViewInit() {}
}
