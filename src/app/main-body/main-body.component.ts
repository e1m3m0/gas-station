import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface GasolineType {
  name: string;
  price: number;
  beginningVolume: number;
  endingVolume: number;
  volumeUsed: number;
  cost: number;
}
interface GasPrice {
  name: string;
  price: number;
}
@Component({
  selector: 'app-main-body',
  imports: [FormsModule, CommonModule],
  templateUrl: './main-body.component.html',
  styleUrl: './main-body.component.css'
})
export class MainBodyComponent {
 gasPrices: GasPrice[] = [
    { name: 'Regular', price: 0 },
    { name: 'Mid-Grade', price: 0 },
    { name: 'Premium', price: 0 },
    { name: 'Diesel', price: 0 }
  ];

  gasolineTypes: GasolineType[] = [
    {
      name: 'Regular (87 Octane)',
      price: 0,
      beginningVolume: 0,
      endingVolume: 0,
      volumeUsed: 0,
      cost: 0
    },
    {
      name: 'Mid-Grade (89 Octane)',
      price: 0,
      beginningVolume: 0,
      endingVolume: 0,
      volumeUsed: 0,
      cost: 0
    },
    {
      name: 'Premium (93 Octane)',
      price: 0,
      beginningVolume: 0,
      endingVolume: 0,
      volumeUsed: 0,
      cost: 0
    },
    {
      name: 'Diesel',
      price: 0,
      beginningVolume: 0,
      endingVolume: 0,
      volumeUsed: 0,
      cost: 0
    }
  ];

  updateGasPrices(): void {
    // Update gasoline types with prices from navbar
    this.gasolineTypes.forEach((gas, index) => {
      gas.price = this.gasPrices[index].price;
      this.calculateCost(index);
    });
  }

  calculateCost(index: number): void {
    const gas = this.gasolineTypes[index];
    
    // Calculate volume used (beginning volume minus ending volume)
    gas.volumeUsed = Math.max(0, gas.beginningVolume - gas.endingVolume);
    
    // Calculate cost (volume used times price per gallon)
    gas.cost = gas.volumeUsed * gas.price;
  }

  getTotalVolume(): number {
    return this.gasolineTypes.reduce((total, gas) => total + gas.volumeUsed, 0);
  }

  getTotalCost(): number {
    return this.gasolineTypes.reduce((total, gas) => total + gas.cost, 0);
  }

  resetPrices(): void {
    this.gasPrices.forEach(price => {
      price.price = 0;
    });
    this.updateGasPrices();
  }

  resetVolumes(): void {
    this.gasolineTypes.forEach(gas => {
      gas.beginningVolume = 0;
      gas.endingVolume = 0;
      gas.volumeUsed = 0;
      gas.cost = 0;
    });
  }
}
