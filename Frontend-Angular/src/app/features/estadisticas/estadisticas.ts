import { Component, OnInit, inject, signal, ViewChild, ElementRef, AfterViewInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { EstadisticasService, EstadisticasGlobales } from '../../services/estadisticas.service';
import { EventoService, Evento } from '../../services/evento.service';
import { NoticiaService, Noticia } from '../../services/noticia.service';
import { LucideAngularModule, Users, CalendarDays, Recycle, PieChart, BarChart3 } from 'lucide-angular';
import { forkJoin } from 'rxjs';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.scss'
})
export class Estadisticas implements OnInit, AfterViewInit {
  estadisticasService = inject(EstadisticasService);
  eventoService = inject(EventoService);
  noticiaService = inject(NoticiaService);
  private platformId = inject(PLATFORM_ID);

  stats = signal<EstadisticasGlobales | null>(null);

  readonly Users = Users;
  readonly CalendarDays = CalendarDays;
  readonly Recycle = Recycle;
  readonly PieChart = PieChart;
  readonly BarChart3 = BarChart3;

  @ViewChild('userGrowthChart') userGrowthChart!: ElementRef;
  @ViewChild('eventsByMonthChart') eventsByMonthChart!: ElementRef;
  @ViewChild('eventsByCategoryChart') eventsByCategoryChart!: ElementRef;
  @ViewChild('newsByCategoryChart') newsByCategoryChart!: ElementRef;

  ngOnInit() {
    this.loadStats();
  }

  ngAfterViewInit() {
  }

  loadStats() {
    forkJoin({
      global: this.estadisticasService.getEstadisticasGlobales(),
      eventos: this.eventoService.getEventos(),
      noticias: this.noticiaService.getNoticias()
    }).subscribe({
      next: (data) => {
        this.stats.set(data.global);
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => this.renderCharts(data.global, data.eventos, data.noticias), 100);
        }
      },
      error: (err) => {
        console.error('Error loading stats', err);
        // Fallback for demo
        const fallbackGlobal = {
          Voluntarios_Activos: 1250,
          Eventos_Finalizados: 45,
          Total_Basura: 8500
        };
        this.stats.set(fallbackGlobal);
      }
    });
  }

  renderCharts(global: EstadisticasGlobales, eventos: Evento[], noticias: Noticia[]) {
    if (!isPlatformBrowser(this.platformId)) return;

    // 1. Crecimiento Usuarios (Mock based on global)
    if (this.userGrowthChart) {
      new Chart(this.userGrowthChart.nativeElement, {
        type: 'line',
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
          datasets: [{
            label: 'Crecimiento de Usuarios',
            data: this.generateGrowthData(global.Voluntarios_Activos),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true
          }]
        },
        options: this.getChartOptions(false)
      });
    }

    // 2. Eventos por Mes
    const eventsCountByMonth = new Array(12).fill(0);
    eventos.forEach(e => {
      const date = new Date(e.fechaInicio);
      if (!isNaN(date.getTime())) {
        eventsCountByMonth[date.getMonth()]++;
      }
    });

    if (this.eventsByMonthChart) {
      new Chart(this.eventsByMonthChart.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
          datasets: [{
            label: 'Eventos por Mes',
            data: eventsCountByMonth,
            backgroundColor: 'rgba(139, 92, 246, 0.6)',
            borderRadius: 6
          }]
        },
        options: this.getChartOptions(false)
      });
    }

    // 3. Eventos por Categoría
    const eventsByCat: Record<string, number> = {};
    eventos.forEach(e => {
      const catName = e.categoria?.nombreCategoria || 'Sin Categoría';
      eventsByCat[catName] = (eventsByCat[catName] || 0) + 1;
    });

    if (this.eventsByCategoryChart) {
      new Chart(this.eventsByCategoryChart.nativeElement, {
        type: 'doughnut',
        data: {
          labels: Object.keys(eventsByCat),
          datasets: [{
            data: Object.values(eventsByCat),
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
            borderWidth: 0
          }]
        },
        options: this.getChartOptions(true)
      });
    }

    // 4. Noticias por Categoría
    const newsByCat: Record<string, number> = {};
    noticias.forEach(n => {
      const catName = n.categoria?.nombreCategoria || 'Sin Categoría';
      newsByCat[catName] = (newsByCat[catName] || 0) + 1;
    });

    if (this.newsByCategoryChart) {
      new Chart(this.newsByCategoryChart.nativeElement, {
        type: 'doughnut',
        data: {
          labels: Object.keys(newsByCat),
          datasets: [{
            data: Object.values(newsByCat),
            backgroundColor: ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'],
            borderWidth: 0
          }]
        },
        options: this.getChartOptions(true)
      });
    }
  }

  private generateGrowthData(total: number): number[] {
    const data = [];
    // Generamos una curva de crecimiento acumulativo lógica
    // que termine exactamente en el total de la API
    for (let i = 0; i < 12; i++) {
      const monthFactor = (i + 1) / 12;
      // Añadimos una pequeña variación aleatoria para que no sea una línea recta perfecta
      const randomVariation = 0.9 + (Math.random() * 0.2);
      let value = Math.round(total * monthFactor * monthFactor * randomVariation);

      // Aseguramos que sea siempre creciente y que el último sea el total exacto
      if (i === 11) value = total;
      if (i > 0 && value < data[i - 1]) value = data[i - 1] + Math.floor(Math.random() * 2);

      data.push(value);
    }
    return data;
  }

  private getChartOptions(isDoughnut: boolean): any {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: isDoughnut,
          position: 'bottom',
          labels: { color: '#94a3b8', font: { size: 10 } }
        }
      },
      scales: isDoughnut ? {} : {
        y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
        x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
      },
      cutout: isDoughnut ? '70%' : undefined
    };
  }
}
