import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Plantation {
  id: string;
  name: string;
  cropType: string;
  latitude: number;
  longitude: number;
  status: 'ACTIVE' | 'PAUSED';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlantationDto {
  name: string;
  cropType: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlantationService {
  // Ajuste para a URL real da sua API NestJS
  private readonly API_URL = 'http://localhost:3000/plantations';

  constructor(private http: HttpClient) {}

  getPlantations(page: number = 1, limit: number = 50): Observable<{data: Plantation[], total: number}> {
    return this.http.get<{data: Plantation[], total: number}>(`${this.API_URL}?page=${page}&limit=${limit}`);
  }

  createPlantation(data: CreatePlantationDto): Observable<Plantation> {
    return this.http.post<Plantation>(this.API_URL, data);
  }

  forceEvaluation(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/evaluate`, {});
  }
}
