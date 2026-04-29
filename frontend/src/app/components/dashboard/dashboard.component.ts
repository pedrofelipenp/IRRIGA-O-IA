import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlantationService, Plantation } from '../../services/plantation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  plantations: Plantation[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private plantationService: PlantationService) {}

  ngOnInit(): void {
    this.loadPlantations();
  }

  loadPlantations(): void {
    this.loading = true;
    this.plantationService.getPlantations().subscribe({
      next: (response) => {
        this.plantations = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar hortas:', err);
        this.error = 'Não foi possível carregar as informações das hortas.';
        this.loading = false;
      }
    });
  }

  evaluateNow(): void {
    this.loading = true;
    this.plantationService.forceEvaluation().subscribe({
      next: (res) => {
        console.log(res.message);
        // Recarrega os dados para pegar os status atualizados
        this.loadPlantations();
      },
      error: (err) => {
        console.error('Erro ao reavaliar:', err);
        this.error = 'Erro ao forçar a reavaliação de rega.';
        this.loading = false;
      }
    });
  }
}
