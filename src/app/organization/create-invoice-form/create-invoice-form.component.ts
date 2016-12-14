import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from "@angular/forms";
import { Observable } from "rxjs/Observable";

import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import createNumberMask from "text-mask-addons/dist/createNumberMask.js";

import { DataService } from "../../core/data/data.service";
import { AlertService } from "../../core/alert/alert.service";
import { Organization } from "../../core/models/organization.model";

const gravado = "GRAVADO";
const exonerado = "EXONERADO";
const inafecto = "INAFECTO";
const igv = 0.18;

@Component({
  selector: "of-create-invoice-form",
  templateUrl: "./create-invoice-form.component.html",
  styleUrls: ["./create-invoice-form.component.scss"]
})
export class CreateInvoiceFormComponent implements OnInit {

  form: FormGroup;
  working: boolean = false;

  tipoDocumento = [
    { denominacion: "BOLETA", valor: "01" },
    { denominacion: "FACTURA", valor: "02" }
  ];

  tipoDocumentoEntidad = [
    { abreviatura: "DNI", denominacion: "DOC.NACIONAL DE IDENTIDAD", valor: "1" },
    { abreviatura: "RUC", denominacion: "REGISTRO UNICO DE CONTRIBUYENTE", valor: "6" },
    { abreviatura: "VARIOS", denominacion: "VARIOS-VENTAS MENORES A S/.700.00 Y OTROS", valor: "-" },
    { abreviatura: "C.EXTRANJERIA", denominacion: "CARNET DE EXTRANJERIA", valor: "4" },
    { abreviatura: "PASS.", denominacion: "PASAPORT", valor: "7" },
    { abreviatura: "CED.DIPLOMATICA", denominacion: "CEDULA DIPLOMATICA DE IDENTIDAD", valor: "A" },
    { abreviatura: "NO DOMICILIADO", denominacion: "NO DOMICILIADO, SIN RUC(EXPORTACION)", valor: "0" }
  ];

  tipoDeIgv = [
    { denominacion: "Gravado - Operación Onerosa", afectaIgv: true, grupo: gravado, valor: "1" },
    { denominacion: "Gravado - Retiro por premio", afectaIgv: true, grupo: gravado, valor: "2" },
    { denominacion: "Gravado - Retiro por donación", afectaIgv: true, grupo: gravado, valor: "3" },
    { denominacion: "Gravado - Retiro", afectaIgv: true, grupo: gravado, valor: "4" },
    { denominacion: "Gravado - Retiro por publicidad", afectaIgv: true, grupo: gravado, valor: "5" },
    { denominacion: "Gravado - Bonificaciones", afectaIgv: true, grupo: gravado, valor: "6" },
    { denominacion: "Gravado – Retiro por entrega a trabajadores", afectaIgv: true, grupo: gravado, valor: "7" },
    { denominacion: "Exonerado - Operación Onerosa", afectaIgv: false, grupo: exonerado, valor: "8" },
    { denominacion: "Inafecto - Operación Onerosa", afectaIgv: false, grupo: inafecto, valor: "9" },
    { denominacion: "Inafecto - Retiro por Bonificación", afectaIgv: false, grupo: inafecto, valor: "10" },
    { denominacion: "Inafecto - Retiro", afectaIgv: false, grupo: inafecto, valor: "11" },
    { denominacion: "Inafecto - Retiro por Muestras Médicas", afectaIgv: false, grupo: inafecto, valor: "12" },
    { denominacion: "Inafecto - Retiro por Convenio Colectivo", afectaIgv: false, grupo: inafecto, valor: "13" },
    { denominacion: "Inafecto - Retiro por premio", afectaIgv: false, grupo: inafecto, valor: "14" },
    { denominacion: "Inafecto - Retiro por publicidad", afectaIgv: false, grupo: inafecto, valor: "15" },
    { denominacion: "Exportacion", afectaIgv: false, grupo: inafecto, valor: "16" }
  ];

  monedas = [
    { denominacion: "Nuevos Soles", valor: "PEN" }, // el primero sera usado por defecto
    { denominacion: "Dolares Americanos", valor: "USD" }
  ];

  numberMask = createNumberMask({
    prefix: "",
    suffix: "",
    allowDecimal: true
  });
  quantityMask = createNumberMask({
    prefix: "",
    suffix: "",
    allowDecimal: true,
    decimalLimit: 3
  });
  percentMask = createNumberMask({
    prefix: "",
    suffix: "",
    allowDecimal: true,
    thousandsSeparatorSymbol: ""
  });

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private dataService: DataService,
    private alertService: AlertService) {
    this.buildForm();
  }

  ngOnInit() {
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      tipo: [null, Validators.compose([Validators.required])],
      igv: [0, Validators.compose([Validators.required])],

      entidadTipoDeDocumento: [null, Validators.compose([Validators.required])],
      entidadNumeroDeDocumento: [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      entidadDenominacion: [null, Validators.compose([Validators.required, Validators.maxLength(150)])],
      entidadEmail: [null, Validators.compose([Validators.maxLength(150)])],

      moneda: [null, Validators.compose([Validators.required, Validators.maxLength(3)])],
      operacionGratuita: [false, Validators.compose([Validators.required])],

      enviarAutomaticamenteASunat: [true, Validators.compose([Validators.required])],
      enviarAutomaticamenteAlCliente: [true, Validators.compose([Validators.required])],

      observaciones: [null, Validators.compose([Validators.maxLength(150)])],

      totalGravado: [0, Validators.compose([Validators.required])],
      totalExonerado: [0, Validators.compose([Validators.required])],
      totalInafecto: [0, Validators.compose([Validators.required])],
      totalGratuito: [0, Validators.compose([Validators.required])],
      totalIgv: [0, Validators.compose([Validators.required])],

      detalle: this.formBuilder.array([])
    });

    this.addFormGlobalObservers();
    this.setDefaultFormValues();
  }

  // Geeter y Seeter
  get igv(): FormControl {
    return this.form.get("igv") as FormControl;
  }

  get detalle(): FormArray {
    return this.form.get("detalle") as FormArray;
  }

  // Carga valores por defecto del formulario principal
  setDefaultFormValues(): void {
    this.form.patchValue({
      tipo: this.tipoDocumento[0].valor,
      igv: igv * 100,
      entidadTipoDeDocumento: this.tipoDocumentoEntidad[0].valor,
      moneda: this.monedas[0].valor
    });
  }

  // Se activa al cambiar de moneda
  changeMoneda(value) {
    if (value == this.monedas[0].valor) {
      this.form.removeControl("tipoCambio");
    } else {
      this.form.addControl("tipoCambio", this.formBuilder.control(null, Validators.compose([Validators.required])));
    }
  }

  // Se activa al agregar un nuevo item al detalle del documento
  addDetalle(): void {
    let formGroup = this.formBuilder.group({
      descripcion: [null, Validators.compose([Validators.required, Validators.maxLength(150)])],
      cantidad: [null, Validators.compose([Validators.required])],
      tipoDeIgv: [null, Validators.compose([Validators.required])],
      valorUnitario: [null, Validators.compose([Validators.required])],
      subtotal: [null, Validators.compose([Validators.required])],
      total: [null, Validators.compose([Validators.required])]
    });

    formGroup.patchValue({
      tipoDeIgv: this.tipoDeIgv[0].valor
    });

    this.detalle.push(formGroup);
    this.refreshFormValues();
    this.addFormDetalleObservers(formGroup);
  }

  // Se activa al eliminar un detalle
  removeDetalle(index) {
    this.detalle.removeAt(index);
    this.refreshFormValues();
  }

  // Observers
  addFormGlobalObservers() {
    let formControls = [this.igv];
    formControls.forEach(formControl => {
      formControl.valueChanges.subscribe(formControlValue => {
        this.refreshFormValues();
      });
    });

    this.form.get("moneda").valueChanges.subscribe(value => this.changeMoneda(value));
  }

  addFormDetalleObservers(formGroup: FormGroup) {
    let formControls = [formGroup.get("cantidad"), formGroup.get("valorUnitario"), formGroup.get("tipoDeIgv")];
    formControls.forEach(formControl => {
      formControl.valueChanges.subscribe(formControlValue => {
        this.refreshFormValues();
      });
    });
  }

  // Actualizar calculos
  refreshFormValues(): void {
    if (!this.igv.valid) {
      return;
    }

    // Igv valor numerico
    let igvValue = this.form.get("igv").valid ? this.form.get("igv").value : undefined;
    if (!igvValue) return;
    if (typeof igvValue === "string") {
      igvValue = Number(igvValue.replace(/[^0-9.]/g, ""));
    }

    // Recorrido por cada detalle
    for (let i = 0; i < this.detalle.controls.length; i++) {
      let formGroup: FormGroup = this.detalle.controls[i] as FormGroup;

      let tipoDeIgv = this.tipoDeIgv.find(tipoDeIgv => tipoDeIgv.valor == formGroup.get("tipoDeIgv").value);
      if (!tipoDeIgv) continue;

      let cantidad = formGroup.get("cantidad").valid ? formGroup.get("cantidad").value : undefined;
      if (!cantidad) continue;
      if (typeof cantidad === "string") {
        cantidad = Number(cantidad.replace(/[^0-9.]/g, ""));
      }

      let valorUnitario = formGroup.get("valorUnitario").valid ? formGroup.get("valorUnitario").value : undefined;
      if (!valorUnitario) continue;
      if (typeof valorUnitario === "string") {
        valorUnitario = Number(valorUnitario.replace(/[^0-9.]/g, ""));
      }

      let subtotal = Math.round(cantidad * valorUnitario * 100) / 100;
      let total = !tipoDeIgv.afectaIgv ? Math.round(cantidad * valorUnitario * 100) / 100 : Math.round(cantidad * valorUnitario * (igvValue + 100)) / 100;

      formGroup.patchValue({
        subtotal: subtotal,
        total: total
      });
    }

    // Calculo de totales

    let totalExonerado = this.detalle.controls.filter(formGroup => {
      let tipoDeIgv = this.tipoDeIgv.find(tipoDeIgv => tipoDeIgv.valor == formGroup.get("tipoDeIgv").value);
      return tipoDeIgv.grupo == exonerado
    }).map(formGroup => formGroup.get("subtotal").value).reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    let totalGravado = this.detalle.controls.filter(formGroup => {
      let tipoDeIgv = this.tipoDeIgv.find(tipoDeIgv => tipoDeIgv.valor == formGroup.get("tipoDeIgv").value);
      return tipoDeIgv.grupo == gravado
    }).map(formGroup => formGroup.get("subtotal").value).reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    let totalInafecto = this.detalle.controls.filter(formGroup => {
      let tipoDeIgv = this.tipoDeIgv.find(tipoDeIgv => tipoDeIgv.valor == formGroup.get("tipoDeIgv").value);
      return tipoDeIgv.grupo == inafecto
    }).map(formGroup => formGroup.get("subtotal").value).reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    let totalIgv = this.detalle.controls.map(formGroup => {
      return (formGroup.get("total").value || 0) - (formGroup.get("subtotal").value || 0);
    }).reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    this.form.patchValue({
      totalGravado: totalGravado,
      totalExonerado: totalExonerado,
      totalInafecto: totalInafecto,
      totalIgv: totalIgv
    });
  }


  save(form: any): void {
    this.working = true;
    console.log(form);

    //let organizationCopy = Object.assign(this.organization || {}, form);

    /*this.dataService.organizations().create(organizationCopy).subscribe(
      result => {
        this.alertService.pop("success", "Success", "Success! The organization has been created.");
        this.router.navigate(["../"]);
      },
      error => {
        this.working = false;
        this.alertService.pop("error", "Error", "Organization could not be created.");
      }
    );*/
  }

}
