import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})
export class ExcelVentasServices {
    constructor() { }
        public exportAsExcelFile(jsonPapeleria: any[],jsonRecargas: any[],jsonDulces: any[], excelFileName: string): void {
        const worksheetPapeleria: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonPapeleria);
        const worksheetRecargas: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonRecargas);
        const worksheetDulces: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonDulces);
        const workbook: XLSX.WorkBook = { 
            Sheets: { 'papeleria': worksheetPapeleria, 'recargas': worksheetRecargas,'dulces': worksheetDulces},
            SheetNames: ['papeleria', 'recargas', 'dulces'] 
        };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }
    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    }
}