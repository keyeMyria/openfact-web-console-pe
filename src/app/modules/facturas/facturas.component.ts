import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {CORE_DIRECTIVES} from '@angular/common';
import {DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';


@Component({
  moduleId: module.id,
  selector: 'app-facturas',
  templateUrl: 'facturas.component.html',
  styleUrls: ['facturas.component.css'],
  directives: [DROPDOWN_DIRECTIVES, CORE_DIRECTIVES]
})
export class FacturasComponent implements OnInit {
  public disabled:boolean = false;
  public status:{isopen:boolean} = {isopen: false};
  public items:Array<string> = ['The first choice!',
    'And another choice for you.', 'but wait! A third!'];
 
  constructor(private router: Router) { }

  ngOnInit() {
  }

  nuevo() {
    let link = ['/facturas/nuevo'];
    this.router.navigate(link);
  }

  editar() {
    let link = ['/facturas/editar', 2];
    this.router.navigate(link);
  }
  enviar() {
    let link = ['/facturas/enviar'];
    this.router.navigate(link);
  }
  importar() {
    let link = ['/facturas/importar'];
    this.router.navigate(link);
  }

  public toggled(open:boolean):void {
    console.log('Dropdown is now: ', open);
  }
  public toggleDropdown($event:MouseEvent):void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

}
