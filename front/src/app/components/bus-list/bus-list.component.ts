import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BusService } from '../../services/bus.service';
import { Bus } from '../../models/bus.interface';

@Component({
  selector: 'app-bus-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bus-list.component.html',
  styleUrl: './bus-list.component.css'
})
export class BusListComponent implements OnInit {

  buses: Bus[] = [];

  constructor(private busService: BusService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.busService.listar().subscribe(resp => {
      this.buses = resp.data as Bus[];
    });
  }
}


