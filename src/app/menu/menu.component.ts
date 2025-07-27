import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, share, Subscription, timer } from 'rxjs';
import * as moment from 'moment/moment';

@Component({
    selector: 'menu-component',
    templateUrl: './menu.component.html',
    styleUrls: ['./.component.scss']
})
export class MenuComponent implements OnInit {
    
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
}
