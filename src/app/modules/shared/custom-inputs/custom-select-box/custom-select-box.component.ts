import { Component, Input, SimpleChanges, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { SelectBox } from '../models/SelectBox';
import { Util } from 'src/app/modules/utils/Util';

@Component({
  selector: 'app-custom-select-box',
  templateUrl: './custom-select-box.component.html',
  styleUrls: ['./custom-select-box.component.scss']
})
export class CustomSelectBoxComponent {

  constructor(private changeDetector: ChangeDetectorRef) { }

  protected selectedBox: SelectBox;
  @Output() emissorDeBoxSelecionado = new EventEmitter<SelectBox>;

  @Input() selectBoxList: SelectBox[];
  @Input() titulo: string;

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnInit(): void {
    this.selectedBox = this.selectBoxList[0];
  }

  selecionaBox(box: SelectBox) {
    this.selectedBox = box;
    this.emissorDeBoxSelecionado.emit(this.selectedBox);
  }

}
