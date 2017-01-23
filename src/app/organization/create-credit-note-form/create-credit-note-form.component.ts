import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from "@angular/forms";
import { Response, URLSearchParams } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Subscription } from 'rxjs/Subscription';

import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

import { DataService } from "../../core/data/data.service";
import { AlertService } from "../../core/alert/alert.service";
import { Organization } from "../../core/models/organization.model";
import { Invoice } from "../../core/models/invoice.model";

import { CreateCreditNoteFormConfirmModalComponent } from "./create-credit-note-form-confirm-modal.component";

const gravado = "GRAVADO";
const exonerado = "EXONERADO";
const inafecto = "INAFECTO";
const igv = 0.18;

@Component({
  selector: 'of-create-credit-note-form',
  templateUrl: './create-credit-note-form.component.html',
  styleUrls: ['./create-credit-note-form.component.scss']
})
export class CreateCreditNoteFormComponent implements OnInit, OnDestroy {

  dataSubscription: Subscription;
  paramsSubscription: Subscription;
  formSubcriptions: Array<Subscription> = new Array<Subscription>();

  form: FormGroup;
  working: boolean = false;

  organization: Organization;
  invoice: Invoice;

  documentMask = [/[B|F|b|f]/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  numberMask = {
    allowDecimal: true
  };
  quantityMask = {
    allowDecimal: true,
    decimalLimit: 3
  };
  percentMask = {
    prefix: "% ",
    allowDecimal: true
  };

  tipoDeNotaDeCredito = [
    { denominacion: "ANULACION DE LA OPERACION", valor: "01" },
    { denominacion: "ANULACION POR ERROR EN EL RUC", valor: "02" },
    { denominacion: "CORRECCION POR ERROR EN LA DESCRIPCION", valor: "03" },
    { denominacion: "DESCUENTO GLOBAL", valor: "04" },
    { denominacion: "DESCUENTO POR ITEM", valor: "05" },
    { denominacion: "DEVOLUCION TOTAL", valor: "06" },
    { denominacion: "DEVOLUCION PARCIAL", valor: "07" },
    { denominacion: "BONIFICACION", valor: "08" },
    { denominacion: "DISMINUCION EN EL VALOR", valor: "09" }
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
    { denominacion: "Gravado - Operación Onerosa", afectaIgv: true, grupo: gravado, valor: "10" },
    { denominacion: "Gravado - Retiro por premio", afectaIgv: true, grupo: gravado, valor: "11" },
    { denominacion: "Gravado - Retiro por donación", afectaIgv: true, grupo: gravado, valor: "12" },
    { denominacion: "Gravado - Retiro", afectaIgv: true, grupo: gravado, valor: "13" },
    { denominacion: "Gravado - Retiro por publicidad", afectaIgv: true, grupo: gravado, valor: "14" },
    { denominacion: "Gravado - Bonificaciones", afectaIgv: true, grupo: gravado, valor: "15" },
    { denominacion: "Gravado – Retiro por entrega a trabajadores", afectaIgv: true, grupo: gravado, valor: "16" },
    { denominacion: "Exonerado - Operación Onerosa", afectaIgv: false, grupo: exonerado, valor: "20" },
    { denominacion: "Inafecto - Operación Onerosa", afectaIgv: false, grupo: inafecto, valor: "30" },
    { denominacion: "Inafecto - Retiro por Bonificación", afectaIgv: false, grupo: inafecto, valor: "31" },
    { denominacion: "Inafecto - Retiro", afectaIgv: false, grupo: inafecto, valor: "32" },
    { denominacion: "Inafecto - Retiro por Muestras Médicas", afectaIgv: false, grupo: inafecto, valor: "33" },
    { denominacion: "Inafecto - Retiro por Convenio Colectivo", afectaIgv: false, grupo: inafecto, valor: "34" },
    { denominacion: "Inafecto - Retiro por premio", afectaIgv: false, grupo: inafecto, valor: "35" },
    { denominacion: "Inafecto - Retiro por publicidad", afectaIgv: false, grupo: inafecto, valor: "36" },
    { denominacion: "Exportacion", afectaIgv: false, grupo: inafecto, valor: "40" }
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private dataService: DataService,
    private alertService: AlertService) {
  }

  ngOnInit() {
    this.buildForm();
    this.dataSubscription = this.activatedRoute.data.subscribe(data => {
      this.organization = data["organization"];
    });
    this.paramsSubscription = this.activatedRoute.params.subscribe(params => {
      let invoiceDocumentId = params["invoice"];
      this.findInvoiceByDocumentId(invoiceDocumentId);
    });
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
    this.paramsSubscription.unsubscribe();
    this.formSubcriptions.forEach(subscription => subscription.unsubscribe());
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      documentoQueSeModifica: [null, Validators.compose([Validators.required])],
      tipoDeNotaDeCredito: [null, Validators.compose([Validators.required])],
      igv: [null, Validators.compose([Validators.required])],

      entidadTipoDeDocumento: [null, Validators.compose([Validators.required])],
      entidadNumeroDeDocumento: [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      entidadDenominacion: [null, Validators.compose([Validators.required, Validators.maxLength(150)])],
      entidadEmail: [null, Validators.compose([Validators.maxLength(150)])],

      operacionGratuita: [false, Validators.compose([Validators.required])],
      moneda: [null, Validators.compose([Validators.required])],

      observaciones: [null, Validators.compose([Validators.maxLength(150)])],

      totalGravada: [null, Validators.compose([Validators.required])],
      totalExonerada: [null, Validators.compose([Validators.required])],
      totalInafecta: [null, Validators.compose([Validators.required])],
      totalGratuita: [null, Validators.compose([Validators.required])],
      totalIgv: [null, Validators.compose([Validators.required])],

      porcentajeDescuento: [null, Validators.compose([])],
      descuentoGlobal: [null, Validators.compose([Validators.required])],

      totalOtrosCargos: [null, Validators.compose([])],
      total: [null, Validators.compose([Validators.required])],

      enviarAutomaticamenteASunat: [true, Validators.compose([Validators.required])],
      enviarAutomaticamenteAlCliente: [true, Validators.compose([Validators.required])],

      detalle: this.formBuilder.array([], Validators.compose([]))
    });

    this.addFormGlobalObservers();
    this.setDefaultFormValues();
  }

  // Carga valores por defecto del formulario principal
  setDefaultFormValues(): void {
    this.form.patchValue({
      tipoDeNotaDeCredito: "",
      igv: igv * 100,
    });
  }

  // Se activa al agregar un nuevo item al detalle del documento
  addDetalle(): void {
    let formGroup = this.formBuilder.group({
      descripcion: [null, Validators.compose([Validators.required, Validators.maxLength(150)])],
      cantidad: [null, Validators.compose([Validators.required])],
      tipoDeIgv: [null, Validators.compose([Validators.required])],
      valorUnitario: [null, Validators.compose([Validators.required])],
      precioUnitario: [null, Validators.compose([Validators.required])],
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
    let formControls = [this.igv, this.porcentajeDescuento, this.totalOtrosCargos];
    formControls.forEach(formControl => {
      let subscription = formControl.valueChanges.subscribe(formControlValue => {
        this.refreshFormValues();
      });
      this.formSubcriptions.push(subscription);
    });
  }

  addFormDetalleObservers(formGroup: FormGroup) {
    let formControls = [this.getDetalleCantidad(formGroup), this.getDetalleValorUnitario(formGroup), this.getDetalleTipoDeIgv(formGroup)];
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
    let igvValue = this.igv.value;

    // Recorrido por cada detalle
    for (let i = 0; i < this.detalle.controls.length; i++) {
      let formGroup: FormGroup = this.detalle.controls[i] as FormGroup;

      if (!this.getDetalleTipoDeIgv(formGroup).valid || !this.getDetalleCantidad(formGroup).valid || !this.getDetalleValorUnitario(formGroup).valid) {
        continue;
      }

      let tipoDeIgv = this.tipoDeIgv.find(tipoDeIgv => tipoDeIgv.valor == this.getDetalleTipoDeIgv(formGroup).value);
      let cantidad = this.getDetalleCantidad(formGroup).value;
      let valorUnitario = this.getDetalleValorUnitario(formGroup).value;

      let subtotal = Math.round(cantidad * valorUnitario * 100) / 100;
      let total = !tipoDeIgv.afectaIgv ? Math.round(cantidad * valorUnitario * 100) / 100 : Math.round(cantidad * valorUnitario * (igvValue + 100)) / 100;
      let precioUnitario = Math.round(igvValue * valorUnitario * 100) / 100;

      formGroup.patchValue({
        subtotal: subtotal,
        total: total,
        precioUnitario: precioUnitario
      });
    }

    // Calculo de totales
    let porcentajeDescuento;

    let totalGratuita;
    let totalExonerada;
    let totalGravada;
    let totalInafecta;
    let totalIgv;

    let operacionGratuita = this.operacionGratuita.value;
    if (operacionGratuita) {
      totalGratuita = this.detalle.controls
        .map(formGroup => this.getDetalleTotal(formGroup as FormGroup).value || 0)
        .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

      porcentajeDescuento = 0;
      totalExonerada = 0;
      totalGravada = 0;
      totalInafecta = 0;
      totalIgv = 0;
    } else {
      totalGratuita = 0;

      porcentajeDescuento = this.porcentajeDescuento.value || 0;

      totalExonerada = this.detalle.controls.filter(formGroup => {
        let tipoDeIgv = this.tipoDeIgv.find(tipoDeIgv => tipoDeIgv.valor == this.getDetalleTipoDeIgv(formGroup as FormGroup).value);
        return tipoDeIgv.grupo == exonerado;
      }).map(formGroup => this.getDetalleSubtotal(formGroup as FormGroup).value || 0)
        .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

      totalGravada = this.detalle.controls.filter(formGroup => {
        let tipoDeIgv = this.tipoDeIgv.find(tipoDeIgv => tipoDeIgv.valor == this.getDetalleTipoDeIgv(formGroup as FormGroup).value);
        return tipoDeIgv.grupo == gravado;
      }).map(formGroup => this.getDetalleSubtotal(formGroup as FormGroup).value || 0)
        .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

      totalInafecta = this.detalle.controls.filter(formGroup => {
        let tipoDeIgv = this.tipoDeIgv.find(tipoDeIgv => tipoDeIgv.valor == this.getDetalleTipoDeIgv(formGroup as FormGroup).value);
        return tipoDeIgv.grupo == inafecto;
      }).map(formGroup => this.getDetalleSubtotal(formGroup as FormGroup).value || 0)
        .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

      totalIgv = this.detalle.controls.map(formGroup => {
        return (this.getDetalleTotal(formGroup as FormGroup).value || 0) - (this.getDetalleSubtotal(formGroup as FormGroup).value || 0);
      }).reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    }

    let totalGravadaConDescuento = Math.round(totalGravada * (100 - porcentajeDescuento)) / 100;
    let totalExoneradaConDescuento = Math.round(totalExonerada * (100 - porcentajeDescuento)) / 100;
    let totalInafectaConDescuento = Math.round(totalInafecta * (100 - porcentajeDescuento)) / 100;
    let totalIgvConDescuento = Math.round(totalIgv * (100 - porcentajeDescuento)) / 100;

    // Descuento global
    let descuentoGlobal = (totalGravada - totalGravadaConDescuento) + (totalExonerada - totalExoneradaConDescuento) + (totalInafecta - totalInafectaConDescuento);

    // Calculo del total
    let totalOtrosCargos = this.totalOtrosCargos.valid ? this.totalOtrosCargos.value : 0;
    let total = totalGravadaConDescuento + totalExoneradaConDescuento + totalInafectaConDescuento + totalIgvConDescuento + totalOtrosCargos;

    this.form.patchValue({
      totalGratuita: totalGratuita,
      totalGravada: totalGravadaConDescuento,
      totalExonerada: totalExoneradaConDescuento,
      totalInafecta: totalInafectaConDescuento,
      totalIgv: totalIgvConDescuento,
      descuentoGlobal: descuentoGlobal,
      total: total
    });
  }

  findInvoiceByDocumentId(documentId: string) {
    if (!documentId) {
      documentId = this.documentoQueSeModifica.value;
    }

    let queryParam: URLSearchParams = new URLSearchParams();
    queryParam.set("documentId", documentId);
    this.dataService.invoices().getAll(this.organization, queryParam).subscribe(response => {
      this.invoice = response[0];
      if (this.invoice) {
        this.form.patchValue({
          entidadTipoDeDocumento: this.invoice["customerAdditionalAccountId"],
          entidadNumeroDeDocumento: this.invoice["customerAssignedAccountId"],
          entidadDenominacion: this.invoice["customerRegistrationName"],
          entidadEmail: this.invoice["customerElectronicMail"],

          moneda: this.invoice["documentCurrencyCode"],

          documentoQueSeModifica: this.invoice["documentId"]
        });
      } else {
        this.alertService.pop("info", "Info", "Could not find Invoice.");
      }
    });
  }

  save(form: any): void {
    if (!form.detalle || form.detalle.length == 0) {
      this.alertService.pop("warning", "Warning", "Warning! Is required to add at least one line.");
      return;
    }

    const modalRef = this.modalService.open(CreateCreditNoteFormConfirmModalComponent)

    modalRef.componentInstance.totalExonerada = this.totalExonerada.value;
    modalRef.componentInstance.totalInafecta = this.totalInafecta.value;
    modalRef.componentInstance.totalGravada = this.totalGravada.value;
    modalRef.componentInstance.totalIgv = this.totalIgv.value;
    modalRef.componentInstance.totalGratuita = this.totalGratuita.value;
    modalRef.componentInstance.descuentoGlobal = this.descuentoGlobal.value;
    modalRef.componentInstance.totalOtrosCargos = this.totalOtrosCargos.value;
    modalRef.componentInstance.total = this.total.value;

    modalRef.result.then((redirect) => {
      this.working = true;
      this.dataService.organizationPeru().createCreditNote(this.organization, form).subscribe(
        response => {
          this.working = false;
          this.alertService.pop("success", "Success", "Success! The credit note has been created.");
          if (redirect) {
            this.router.navigate(["../"], { relativeTo: this.activatedRoute.parent });
          } else {
            this.buildForm();
          }
        },
        error => {
          this.working = false;
        }
      );
    }, (reason) => {
    });
  }

  cancel() {
    this.router.navigate(["../"], { relativeTo: this.activatedRoute.parent });
  }

  /**
   * Getter and Setter
  */
  get documentoQueSeModifica(): FormControl {
    return this.form.get("documentoQueSeModifica") as FormControl;
  }

  get moneda(): FormControl {
    return this.form.get("moneda") as FormControl;
  }

  get igv(): FormControl {
    return this.form.get("igv") as FormControl;
  }

  get operacionGratuita(): FormControl {
    return this.form.get("operacionGratuita") as FormControl;
  }

  get porcentajeDescuento(): FormControl {
    return this.form.get("porcentajeDescuento") as FormControl;
  }

  get detalle(): FormArray {
    return this.form.get("detalle") as FormArray;
  }

  get totalExonerada(): FormArray {
    return this.form.get("totalExonerada") as FormArray;
  }

  get totalInafecta(): FormArray {
    return this.form.get("totalInafecta") as FormArray;
  }

  get totalGravada(): FormArray {
    return this.form.get("totalGravada") as FormArray;
  }

  get totalIgv(): FormArray {
    return this.form.get("totalIgv") as FormArray;
  }

  get totalGratuita(): FormArray {
    return this.form.get("totalGratuita") as FormArray;
  }

  get descuentoGlobal(): FormArray {
    return this.form.get("descuentoGlobal") as FormArray;
  }

  get totalOtrosCargos(): FormArray {
    return this.form.get("totalOtrosCargos") as FormArray;
  }

  get total(): FormArray {
    return this.form.get("total") as FormArray;
  }

  getDetalleCantidad(formGroup: FormGroup) {
    return formGroup.get("cantidad");
  }

  getDetalleValorUnitario(formGroup: FormGroup) {
    return formGroup.get("valorUnitario");
  }

  getDetalleTipoDeIgv(formGroup: FormGroup) {
    return formGroup.get("tipoDeIgv");
  }

  getDetalleSubtotal(formGroup: FormGroup) {
    return formGroup.get("subtotal");
  }

  getDetalleTotal(formGroup: FormGroup) {
    return formGroup.get("total");
  }

}