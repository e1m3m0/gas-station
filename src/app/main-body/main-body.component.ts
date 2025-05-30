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

@Component({
  selector: 'app-main-body',
  imports: [FormsModule, CommonModule],
  templateUrl: './main-body.component.html',
  styleUrl: './main-body.component.css'
})
export class MainBodyComponent {
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

  resetAll(): void {
    this.gasolineTypes.forEach(gas => {
      gas.price = 0;
      gas.beginningVolume = 0;
      gas.endingVolume = 0;
      gas.volumeUsed = 0;
      gas.cost = 0;
    });
  }
}
