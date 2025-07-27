import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { FinanzasServices } from '../services/finanzas.services';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    /**VARIABLES DEL FLUJO */
    promedio2023 = 0;
    promedio2024 = 0;

    constructor(
        private dialog: MatDialog,
        private _finanzas: FinanzasServices,
        private cdr: ChangeDetectorRef
    ) { }

    async ngOnInit(): Promise<void> {
        let response = [];
        this._finanzas.getFinanzas().subscribe((ventas: any) => {
            response = [];
            for (const item of ventas) {
                response.push(
                    item.payload.doc.data()
                );
            }

            response = response.sort(({ id: b }, { id: a }) => b - a);
            let data2023 = [];
            let promedio2023 = 0;

            let data2024 = [];
            let promedio2024 = 0;

            for (const item of response) {
                if (item.ingreso && item.tipo === 'PAPELERIA') {

                    let anio = item.fecha.substring((item.fecha.length - 4), item.fecha.length);
                    if (anio === '2023') {
                        promedio2023 = +promedio2023 + +item.cantidadVendida;
                        data2023.push({
                            country: item.fecha,
                            litres: item.cantidadVendida,
                            ...item
                        })
                    }

                    if (anio === '2024') {
                        promedio2024 = +promedio2024 + +item.cantidadVendida;
                        data2024.push({
                            country: item.fecha,
                            litres: item.cantidadVendida,
                            ...item
                        })
                    }
                }
            }
            
            this.getPromedio2023(promedio2023, data2023);

            this.getPromedio2024(promedio2024, data2024);
        });

    }

    getPromedio2024(promedio2024: any, data2024: any): void {
        this.promedio2024 = promedio2024 / data2024.length;

            let chart = am4core.create("chartdivnew", am4charts.XYChart);
            chart.data = data2024;

            let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "country";
            categoryAxis.title.text = "Countries";

            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.title.text = "Litres sold (M)";

            let series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = "litres";
            series.dataFields.categoryX = "country";

            series.name = "Sales";
            series.columns.template.tooltipText = "Series: {name}\nCategory: {categoryX}\nValue: {valueY}";
    }

    getPromedio2023(promedio2023: any, data2023: any): void {
        this.promedio2023 = promedio2023 / data2023.length;

            let chart = am4core.create("chartdiv", am4charts.XYChart);
            chart.data = data2023;
            /*chart.data = [{
                "country": "Lithuania",
                "litres": 501
            }, {
                "country": "Czechia",
                "litres": 301
            }, {
                "country": "Ireland",
                "litres": 201
            }, {
                "country": "Germany",
                "litres": 165
            }, {
                "country": "Australia",
                "litres": 139
            }, {
                "country": "Austria",
                "litres": 128
            }, {
                "country": "UK",
                "litres": 99
            }, {
                "country": "Belgium",
                "litres": 60
            }, {
                "country": "The Netherlands",
                "litres": 50
            }];*/

            let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "country";
            categoryAxis.title.text = "Countries";

            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.title.text = "Litres sold (M)";

            let series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = "litres";
            series.dataFields.categoryX = "country";

            series.name = "Sales";
            series.columns.template.tooltipText = "Series: {name}\nCategory: {categoryX}\nValue: {valueY}";
    }

}
