import { Component, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-visualizacao',
  templateUrl: './visualizacao.component.html',
  styleUrls: ['./visualizacao.component.scss']
})
export class VisualizacaoComponent {

  @ViewChild('grafico') grafico: any;
  canvas: any;
  ctx: any;

  ngAfterViewInit(): void {
    this.canvas = this.grafico.nativeElement;
    this.ctx = this.canvas.getContext('2d');

    this.chartGraficoLinha();
  }

  chartGraficoLinha() {
    let graficoLinha = new Chart(this.ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Valor líquido',
            data: [{ x: 'Dia 1', y: 100.00 }, { x: 'Dia 2', y: 9000.25 }, { x: 'Dia 3', y: 140.00 }, { x: 'Dia 4', y: 130.00 }, { x: 'Dia 5', y: 100.00 }],
            borderWidth: 2,
            borderColor: 'rgba(74, 71, 209, 1)',
            backgroundColor: 'rgba(74, 71, 209, 0.1)',
            hidden: false,
            fill: true
          },
        ]
      },
      options: {
        maintainAspectRatio: true,
        aspectRatio: 4,
        responsive: true,
        elements: {
          line: {
            tension: 0,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value: number, index, values) {
                if(value >= 1000){
                  return 'R$ ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                } else {
                  return 'R$ ' + value;
                }
              }
            }
          },
          x: {
            display: false,
          }
        },
        layout: {
          autoPadding: true
        },
        locale: 'pt-BR',
        plugins: {

        }
      }
    });

  }

}
