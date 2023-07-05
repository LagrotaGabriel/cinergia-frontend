import { TableTd } from 'src/app/modules/shared/models/TableTd';
import { PagamentoPageObject } from '../../assinaturas/models/pagamentos/PagamentoPageObject';
import { PagamentoService } from '../../services/pagamento.service';
import { ApexChartModel } from '../models/ApexChartModel';
import { EmpresaService } from './../../services/empresa.service';
import { DadosDashBoardEmpresa } from './../models/DadosDashBoardEmpresa';
import { Component, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexYAxis,
  ApexTooltip,
  ApexLegend,
  ApexMarkers
} from "ng-apexcharts";
import { TableTh } from 'src/app/modules/shared/models/TableTh';
import { fadeInOutAnimation } from 'src/app/shared/animations';
import { TransferenciaPageObject } from '../../transferencias/models/TransferenciaPageObject';
import { TransferenciaService } from '../../services/transferencia.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  toolTip: ApexTooltip;
  grid: ApexGrid;
  legend: ApexLegend;
  markers: ApexMarkers;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-visualizacao',
  templateUrl: './visualizacao.component.html',
  styleUrls: ['./visualizacao.component.scss'],
  animations: [fadeInOutAnimation]
})
export class VisualizacaoComponent {

  constructor(
    private empresaService: EmpresaService,
    private pagamentoService: PagamentoService,
    private transferenciaService: TransferenciaService) { }

  public dadosDashboardEmpresa: DadosDashBoardEmpresa;

  protected faturamentoLineApexChart: ApexChartModel;

  protected pagamentosRealizados: PagamentoPageObject;
  protected transferenciasRealizadas: TransferenciaPageObject;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  dadosGraficoFaturamento: Array<any> = [];
  dadosGraficoFaturamentoValorBruto = [];
  dadosGraficoFaturamentoValorTaxa = [];
  dadosGraficoFaturamentoValorLiquido = [];

  ngOnInit(): void {
    this.geraChartFaturamento();
  }

  ngAfterViewInit(): void {
    this.obtemTransacoesRealizadas();
    this.obtemTranferenciasRealizadas();
    this.obtemDadosDashBoardEmpresa();
    this.obtemDadosGraficoFaturamentoEmpresa();
  }

  obtemDadosDashBoardEmpresa() {
    this.empresaService.obtemDadosEstatisticosEmpresa().subscribe({
      next: (resposta => {
        this.dadosDashboardEmpresa = resposta;
      })
    })
  }

  obtemTranferenciasRealizadas() {
    this.transferenciaService.getTransferencias(this.transferenciasRealizadas).subscribe({
      next: (response) => {
        this.transferenciasRealizadas = response;
      }
    });
  }

  obtemTransacoesRealizadas() {
    this.pagamentoService.getPagamentosAprovados(this.pagamentosRealizados).subscribe({
      next: (response) => {
        this.pagamentosRealizados = response;
      }
    });
  }

  obtemDadosGraficoFaturamentoEmpresa() {
    this.empresaService.obtemDadosGraficoFaturamentoEmpresa().subscribe({
      next: (response) => {
        Object.keys(response).forEach(key => {
          var obj1 = response[key];
          Object.keys(obj1).forEach(key1 => {
            if (key1 == 'valorBruto') this.dadosGraficoFaturamentoValorBruto.push(obj1[key1])
            else if (key1 == 'valorTaxa') this.dadosGraficoFaturamentoValorTaxa.push(obj1[key1]);
            else if (key1 == 'valorLiquido') this.dadosGraficoFaturamentoValorLiquido.push(obj1[key1]);
            this.dadosGraficoFaturamento.push({ k: key, l: key1, m: obj1[key1] });
          })
        })
      },
      complete: () => {
        console.log(this.faturamentoLineApexChart.series);
        this.faturamentoLineApexChart.series = [
          {
            name: 'Faturamento bruto',
            color: '#4a47d1',
            data: this.dadosGraficoFaturamentoValorBruto
          },
          {
            name: 'Taxas',
            color: '#e83c78',
            data: this.dadosGraficoFaturamentoValorTaxa
          },
          {
            name: 'Faturamento líquido',
            color: '#1d97c7',
            data: this.dadosGraficoFaturamentoValorLiquido
          },
        ]
      }
    });
  }

  geraChartFaturamento() {
    this.faturamentoLineApexChart = {
      series: [
        {
          name: 'Faturamento bruto',
          color: '#4a47d1',
          data: []
        },
        {
          name: 'Taxas',
          color: '#e83c78',
          data: []
        },
        {
          name: 'Faturamento líquido',
          color: '#1d97c7',
          data: []
        },
      ],
      chart: {
        type: 'line',
        width: '100%',
        height: 300,
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 2,
          opacity: 0.2,
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        toolbar: {
          show: true,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
            customIcons: []
          },
        },
      },
      title: {
        text: undefined
      },
      xaxis: {
        type: 'category',
        categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        tickAmount: undefined,
        tickPlacement: 'on',
        min: 1,
        max: undefined,
        range: undefined,
        floating: false,
        decimalsInFloat: undefined,
        overwriteCategories: undefined,
        position: 'bottom',
        labels: {
          show: false,
          rotate: -45,
          rotateAlways: false,
          hideOverlappingLabels: true,
          showDuplicates: false,
          trim: false,
          minHeight: undefined,
          maxHeight: 120,
          style: {
            colors: [],
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-xaxis-label',
          },
          offsetX: 0,
          offsetY: 0,
          format: undefined,
          formatter: undefined,
          datetimeUTC: true,
          datetimeFormatter: {
            year: 'yyyy',
            month: "MMM 'yy",
            day: 'dd MMM',
            hour: 'HH:mm',
          },
        },
        group: {
          groups: [],
          style: {
            colors: [],
            fontSize: '12px',
            fontWeight: 400,
            fontFamily: undefined,
            cssClass: ''
          }
        },
        axisBorder: {
          show: false,
          color: '#78909C',
          offsetX: 0,
          offsetY: 0
        },
        axisTicks: {
          show: false,
          borderType: 'solid',
          color: '#78909C',
          height: 6,
          offsetX: 0,
          offsetY: 0
        },

        title: {
          text: undefined,
          offsetX: 0,
          offsetY: 0,
          style: {
            color: undefined,
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
            cssClass: 'apexcharts-xaxis-title',
          },
        },
        crosshairs: {
          show: false,
          width: 1,
          position: 'back',
          opacity: 0.9,
          stroke: {
            color: '#b6b6b6',
            width: 0,
            dashArray: 0,
          },
          fill: {
            type: 'solid',
            color: '#B1B9C4',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
          dropShadow: {
            enabled: false,
            top: 0,
            left: 0,
            blur: 1,
            opacity: 0.4,
          },
        },
        tooltip: {
          enabled: false,
          formatter: undefined,
          offsetY: 0,
        },
      },
      yaxis: {
        show: true,
        showAlways: true,
        showForNullSeries: true,
        seriesName: undefined,
        opposite: false,
        reversed: false,
        logarithmic: false,
        logBase: 10,
        min: undefined,
        forceNiceScale: true,
        floating: false,
        decimalsInFloat: 2,
        labels: {
          show: true,
          align: 'right',
          minWidth: 0,
          maxWidth: 160,
          style: {
            colors: [],
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-yaxis-label',
          },
          offsetX: 0,
          offsetY: 0,
          rotate: 0,
          formatter: (value) => { return 'R$ ' + value.toString() },
        },
        axisBorder: {
          show: false,
          color: '#78909C',
          offsetX: 0,
          offsetY: 0
        },
        axisTicks: {
          show: false,
          color: '#78909C',
          width: 6,
          offsetX: 0,
          offsetY: 0
        },
        title: {
          text: undefined,
          rotate: -90,
          offsetX: 0,
          offsetY: 0,
          style: {
            color: undefined,
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
            cssClass: 'apexcharts-yaxis-title',
          },
        },
        crosshairs: {
          show: false,
          position: 'back',
          stroke: {
            color: '#b6b6b6',
            width: 1,
            dashArray: 0,
          },
        },
        tooltip: {
          enabled: false,
          offsetX: 0,
        }
      },
      toolTip: {
        enabled: true,
        enabledOnSeries: undefined,
        shared: true,
        followCursor: false,
        intersect: false,
        inverseOrder: false,
        custom: undefined,
        fillSeriesColor: false,
        theme: 'light',
        style: {
          fontSize: '12px',
          fontFamily: undefined
        },
        onDatasetHover: {
          highlightDataSeries: false,
        },
        x: {
          show: true,
          format: 'dd MMM',
          formatter: undefined,
        },
        y: {
          formatter: undefined,
          title: {
            formatter: (seriesName) => seriesName,
          },
        },
        marker: {
          show: true,
        },
        fixed: {
          enabled: false,
          position: 'topRight',
          offsetX: 0,
          offsetY: 0,
        },
      },
      grid: {
        show: true,
        borderColor: '#252525',
        strokeDashArray: 0,
        position: 'back',
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
        row: {
          colors: undefined,
          opacity: 0.5
        },
        column: {
          colors: undefined,
          opacity: 0.5
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 10
        }
      },
      legend: {
        show: false,
        showForSingleSeries: false,
        showForNullSeries: false,
        showForZeroSeries: false,
        position: 'bottom',
        horizontalAlign: 'center',
        floating: false,
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial',
        fontWeight: 400,
        formatter: undefined,
        inverseOrder: false,
        width: undefined,
        height: undefined,
        tooltipHoverFormatter: undefined,
        customLegendItems: [],
        offsetX: 0,
        offsetY: 0,
        labels: {
          colors: undefined,
          useSeriesColors: false,
        },
        markers: {
          width: 12,
          height: 12,
          strokeWidth: 0,
          strokeColor: '#fff',
          fillColors: undefined,
          radius: 12,
          customHTML: undefined,
          onClick: undefined,
          offsetX: 0,
          offsetY: 0
        },
        itemMargin: {
          horizontal: 5,
          vertical: 0
        },
        onItemClick: {
          toggleDataSeries: false
        },
        onItemHover: {
          highlightDataSeries: true
        },
      },
      markers: {
        size: 3,
        colors: undefined,
        strokeWidth: 0,
        strokeOpacity: 1,
        strokeDashArray: 0,
        fillOpacity: 1,
        discrete: [],
        shape: "circle",
        radius: 2,
        offsetX: 0,
        offsetY: 0,
        onClick: undefined,
        onDblClick: undefined,
        showNullDataPoints: true,
        hover: {
          size: undefined,
          sizeOffset: 2
        }
      },
      stroke: {
        width: 2,
        curve: 'straight',
      }
    }

  }

  obtemThsTabelaTransferencias(): TableTh[] {
    let thsTabela: TableTh[] = []
    thsTabela.push(
      {
        campo: 'Descrição',
        hidden: null
      },
      {
        campo: 'Data',
        hidden: null
      },
      {
        campo: 'Valor',
        hidden: null
      },
      {
        campo: 'Forma de pgto.',
        hidden: null
      },
    );

    return thsTabela;
  }

  obtemTdsTabelaTransferencias(): TableTd[] {
    let tdsTabela: TableTd[] = []
    tdsTabela.push(
      {
        campo: 'descricao',
        hidden: null,
        maxLength: 30,
        type: 'string',
        titleCase: true,
        tableTdCustomClasses: [],
      },
      {
        campo: 'dataPagamento',
        hidden: null,
        maxLength: 18,
        type: 'date',
        titleCase: false,
        tableTdCustomClasses: []
      },
      {
        campo: 'valorBruto',
        hidden: null,
        maxLength: 14,
        type: 'money',
        titleCase: false,
        tableTdCustomClasses: []
      },
      {
        campo: 'formaPagamento',
        hidden: null,
        maxLength: 15,
        type: 'string',
        titleCase: false,
        tableTdCustomClasses: []
      }
    );

    return tdsTabela;
  }

  obtemThsTabelaTransacoes(): TableTh[] {
    let thsTabela: TableTh[] = []
    thsTabela.push(
      {
        campo: 'Descrição',
        hidden: null
      },
      {
        campo: 'Data',
        hidden: null
      },
      {
        campo: 'Valor',
        hidden: null
      },
      {
        campo: 'Forma de pgto.',
        hidden: null
      },
    );

    return thsTabela;
  }

  obtemTdsTabelaTransacoes(): TableTd[] {
    let tdsTabela: TableTd[] = []
    tdsTabela.push(
      {
        campo: 'descricao',
        hidden: null,
        maxLength: 30,
        type: 'string',
        titleCase: true,
        tableTdCustomClasses: [],
      },
      {
        campo: 'dataPagamento',
        hidden: null,
        maxLength: 18,
        type: 'date',
        titleCase: false,
        tableTdCustomClasses: []
      },
      {
        campo: 'valorBruto',
        hidden: null,
        maxLength: 14,
        type: 'money',
        titleCase: false,
        tableTdCustomClasses: []
      },
      {
        campo: 'formaPagamento',
        hidden: null,
        maxLength: 15,
        type: 'string',
        titleCase: false,
        tableTdCustomClasses: []
      }
    );

    return tdsTabela;
  }

}
