import { Component, Input, SimpleChanges, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { SelectBox } from '../models/SelectBox';
import { Util } from 'src/app/modules/utils/Util';
import { fadeInOutAnimation } from 'src/app/shared/animations';

@Component({
  selector: 'app-custom-select-box',
  templateUrl: './custom-select-box.component.html',
  styleUrls: ['./custom-select-box.component.scss'],
  animations: [fadeInOutAnimation]
})
export class CustomSelectBoxComponent {

  constructor(private changeDetector: ChangeDetectorRef) { }

  protected selectedBox: any;
  protected selectedBoxes: SelectBox[] = [];
  @Output() emissorDeBoxSelecionado = new EventEmitter<SelectBox>;
  @Output() emissorDeBoxesSelecionado = new EventEmitter<SelectBox[]>;

  @Input() selectBoxList: SelectBox[];
  @Input() titulo: string;
  @Input() multiSelection: boolean = false;

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnInit(): void {
    if (this.multiSelection) {
      this.selectedBoxes.push(this.selectBoxList[0]);
      this.emissorDeBoxesSelecionado.emit(this.selectedBoxes);
    }
    else {
      this.selectedBox = this.selectBoxList[0];
      this.emissorDeBoxSelecionado.emit(this.selectedBox);
    }
  }

  selecionaBox(box: SelectBox) {
    this.selectedBox = box;
    this.emissorDeBoxSelecionado.emit(this.selectedBox);
  }

  selecionaBoxes(box: SelectBox) {

    let boxAtivo = false;
    this.selectedBoxes.forEach(selectedBox => {
      if (selectedBox.value == box.value) {
        boxAtivo = this.verificaSeBoxEstaAtivo(box);
      }
    })

    if (boxAtivo) {
      let boxIndex: number;
      this.selectedBoxes.forEach((selectedBox, index) => {
        if (selectedBox.value == box.value) {
          boxIndex = index;
        }
      })
      this.selectedBoxes.splice(boxIndex, 1);
    }
    else this.selectedBoxes.push(box);

    this.emissorDeBoxesSelecionado.emit(this.selectedBoxes);
  }

  verificaSeBoxEstaAtivo(box: SelectBox): boolean {
    let jaPossui = false;
    this.selectedBoxes.forEach(selectedBox => {
      if (selectedBox.value == box.value) {
        jaPossui = true;
      }
    })
    return jaPossui;
  }
}
