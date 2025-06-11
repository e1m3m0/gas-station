import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FloorPipe } from '../floor.pipe';


interface GasType {
  name: string;
  shortName: string;
}

interface PumpGasData {
  gasType: string;
  price: number;
  beginningVolume: number;
  endingVolume: number;
  volumeUsed: number;
  cost: number;
}

interface Pump {
  id: number;
  name: string;
  gasData: PumpGasData[];
}

@Component({
  selector: 'app-main-body',
  imports: [FormsModule, CommonModule, FloorPipe],
  templateUrl: './main-body.component.html',
  styleUrl: './main-body.component.css'
})
export class MainBodyComponent {
saveButtonText: string = 'Save Prices';
  selectedPumpId: number = 1;

  

  gasTypes: GasType[] = [
    { name: 'Gasolina Premium', shortName: 'Premium' },
    { name: 'Gasolina Regular', shortName: 'Regular' },
    { name: 'Diesel Optimo', shortName: 'Optimo' },
    { name: 'Diesel Regular', shortName: 'Diesel' }
  ];

  globalPrices: { [key: string]: number } = {
    'Gasolina Premium': 0,
    'Gasolina Regular': 0,
    'Diesel Optimo': 0,
    'Diesel Regular': 0
  };

  pumps: Pump[] = [];

  ngOnInit(): void {
    this.initializePumps();
    this.loadSavedPrices();
  }

  initializePumps(): void {

    let names=[
      "Metro No. 1 lado 1",
      "Metro No. 1 lado 2",
      "Metro No. 2 lado 1",
      "Metro No. 2 lado 2",
      "Metro No. 3 lado 1",
      "Metro No. 3 lado 2",
      "Metro No. 4 lado 1",
      "Metro No. 4 lado 4",
    ]
    for (let i = 0; i < names.length; i++) {
      const pump: Pump = {
        id: i,
        name: names[i],
        gasData: this.gasTypes.map(gasType => ({
          gasType: gasType.name,
          price: 0,
          beginningVolume: 0,
          endingVolume: 0,
          volumeUsed: 0,
          cost: 0
        }))
      };
      this.pumps.push(pump);
    }
  }

  get selectedPump(): Pump | undefined {
    return this.pumps.find(pump => pump.id === this.selectedPumpId);
  }

  selectPump(pumpId: number): void {
    this.selectedPumpId = pumpId;
  }

  getGasTypeByName(name: string): GasType | undefined {
    return this.gasTypes.find(gasType => gasType.name === name);
  }

  loadSavedPrices(): void {
    try {
      const savedPrices = localStorage.getItem('globalGasPrices');
      if (savedPrices) {
        const prices = JSON.parse(savedPrices);
        this.globalPrices = { ...this.globalPrices, ...prices };
        this.updateAllPumpPricesFromGlobal();
      }
    } catch (error) {
      console.log('Local storage not available - using default prices');
    }
  }

  savePrices(): void {
    try {
      localStorage.setItem('globalGasPrices', JSON.stringify(this.globalPrices));
      this.saveButtonText = 'Saved!';
      
      setTimeout(() => {
        this.saveButtonText = 'Save Prices';
      }, 2000);
    } catch (error) {
      console.log('Local storage not available - prices saved in session only');
      this.saveButtonText = 'Session Only';
      
      setTimeout(() => {
        this.saveButtonText = 'Save Prices';
      }, 2000);
    }
  }

  updateAllPumpPrices(gasTypeName: string): void {
    this.pumps.forEach(pump => {
      const gasData = pump.gasData.find(data => data.gasType === gasTypeName);
      if (gasData) {
        gasData.price = this.globalPrices[gasTypeName];
        this.calculateCost(pump.id, pump.gasData.indexOf(gasData));
      }
    });
  }

  updateAllPumpPricesFromGlobal(): void {
    this.gasTypes.forEach(gasType => {
      this.updateAllPumpPrices(gasType.name);
    });
  }

  calculateCost(pumpId: number, gasIndex: number): void {
    const pump = this.pumps.find(p => p.id === pumpId);
    if (!pump) return;

    const gasData = pump.gasData[gasIndex];
    gasData.volumeUsed = Math.max(0, gasData.endingVolume - gasData.beginningVolume);
    gasData.cost = gasData.volumeUsed * gasData.price;
  }

  getPumpTotalVolume(pumpId: number): number {
    const pump = this.pumps.find(p => p.id === pumpId);
    return pump ? pump.gasData.reduce((total, gas) => total + gas.volumeUsed, 0) : 0;
  }

  getPumpTotalCost(pumpId: number): number {
    const pump = this.pumps.find(p => p.id === pumpId);
    return pump ? pump.gasData.reduce((total, gas) => total + gas.cost, 0) : 0;
  }

  getGrandTotalVolume(): number {
    return this.pumps.reduce((total, pump) => total + this.getPumpTotalVolume(pump.id), 0);
  }

  getGrandTotalCost(): number {
    return this.pumps.reduce((total, pump) => total + this.getPumpTotalCost(pump.id), 0);
  }

  resetSelectedPump(): void {
    if (!this.selectedPump) return;
    
    this.selectedPump.gasData.forEach(gasData => {
      gasData.beginningVolume = 0;
      gasData.endingVolume = 0;
      gasData.volumeUsed = 0;
      gasData.cost = 0;
    });
  }

  resetAllPumps(): void {
    this.pumps.forEach(pump => {
      pump.gasData.forEach(gasData => {
        gasData.beginningVolume = 0;
        gasData.endingVolume = 0;
        gasData.volumeUsed = 0;
        gasData.cost = 0;
      });
    });
  }
}
