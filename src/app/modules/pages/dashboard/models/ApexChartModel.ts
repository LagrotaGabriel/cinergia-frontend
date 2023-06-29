import {
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexFill,
    ApexGrid,
    ApexLegend,
    ApexMarkers,
    ApexNonAxisChartSeries,
    ApexPlotOptions,
    ApexStroke,
    ApexTitleSubtitle,
    ApexTooltip,
    ApexXAxis,
    ApexYAxis
}
    from "ng-apexcharts";

export class ApexChartModel {
    series?: ApexAxisChartSeries;
    chart?: ApexChart;
    plotOptions?: ApexPlotOptions;
    dataLabels?: ApexDataLabels;
    title?: ApexTitleSubtitle;
    xaxis?: ApexXAxis;
    yaxis?: ApexYAxis;
    toolTip?: ApexTooltip;
    grid?: ApexGrid;
    legend?: ApexLegend;
    markers?: ApexMarkers;
    stroke?: ApexStroke;
    fill?: ApexFill;
    labels?: string[];
    nonAxisSeries?: ApexNonAxisChartSeries;
}