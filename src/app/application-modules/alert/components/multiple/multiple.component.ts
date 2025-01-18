import {MultipleData} from '../../model/multiple-data';
import {ContainerDirective} from './container.directive';
import {
  faPlusSquare,
  faMinusSquare,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import {FormArray, FormControl} from '@angular/forms';
import {SliderConfig} from '../../model/slider';
import {
  OnInit,
  Component,
  Input,
  TemplateRef,
  EventEmitter,
  Type,
  ViewChild,
  ComponentRef,
  EmbeddedViewRef,
} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatButtonModule} from '@angular/material/button';

export type DataBtn = {
  shown: boolean;
  clicked: EventEmitter<void>;
  icon: IconDefinition;
};

export type Created<T, U extends boolean> = {
  component: ComponentRef<MultipleData<T, U>>;
  addComponent: EmbeddedViewRef<unknown>;
  deleteComponent: EmbeddedViewRef<unknown>;
};

@Component({
  selector: 'app-multiple',
  templateUrl: './multiple.component.html',
  styleUrls: ['./multiple.component.scss'],
  standalone: true,
  imports: [ContainerDirective, MatButtonModule, FontAwesomeModule],
})
export class MultipleComponent<T, U extends boolean> implements OnInit {
  @Input({required: true})
  compo!: Type<MultipleData<T, U>>;

  @Input()
  configuration?: SliderConfig<U>;

  @Input({required: true})
  form!: FormArray<FormControl<T>>;

  @ViewChild(ContainerDirective, {static: true}) host!: ContainerDirective;

  @ViewChild('btn', {static: true}) btn!: TemplateRef<unknown>;

  createdList: Created<T, U>[] = [];

  ngOnInit(): void {
    this.host.viewContainerRef.clear();
    if (!this.form.length) {
      this.add();
    } else {
      Array.from(Array(this.form.length).keys()).forEach(i =>
        this.add(this.form.at(i), i === this.form.length - 1)
      );
    }
  }

  add(ctrl?: FormControl<T>, last?: boolean): void {
    const component = this.host.viewContainerRef.createComponent<
      MultipleData<T, U>
    >(this.compo);
    const dataAdd: DataBtn = {
      shown: false,
      clicked: new EventEmitter<void>(),
      icon: faPlusSquare,
    };
    const dataDelete: DataBtn = {
      shown: false,
      clicked: new EventEmitter<void>(),
      icon: faMinusSquare,
    };
    const addComponent = this.host.viewContainerRef.createEmbeddedView(
      this.btn,
      {
        $implicit: dataAdd,
      }
    );
    const deleteComponent = this.host.viewContainerRef.createEmbeddedView(
      this.btn,
      {
        $implicit: dataDelete,
      }
    );
    this.createdList.push({
      component,
      addComponent,
      deleteComponent,
    });
    if (this.configuration) {
      component.instance.configuration = {...this.configuration};
    }
    this.addListeners(component, dataAdd, dataDelete);
    if (ctrl) {
      component.instance.ctrl = ctrl;
      component.instance.initialValue = ctrl.value;
      dataAdd.shown = last ?? false;
      dataDelete.shown = !last ?? true;
    }
  }

  private addListeners(
    component: ComponentRef<MultipleData<T, U>>,
    dataAdd: DataBtn,
    dataDelete: DataBtn
  ): void {
    component.instance.selected.subscribe(s => {
      if (
        !this.createdList.find(c => c.component.instance === component.instance)
          ?.component.instance.ctrl
      ) {
        const ctrl = new FormControl<T>(s, {nonNullable: true});
        this.form?.push(ctrl);
        component.instance.ctrl = ctrl;
      }
      component.instance.ctrl.setValue(s);
    });
    component.instance.shownAddBtn.subscribe(s => (dataAdd.shown = s));
    component.instance.shownDeleteBtn.subscribe(s => (dataDelete.shown = s));
    dataAdd.clicked.subscribe(() => {
      component.instance.shownAddBtn.emit(false);
      component.instance.shownDeleteBtn.emit(true);
      this.add();
    });
    dataDelete.clicked?.subscribe(() => this.destroy(component));
  }

  destroy(ref: ComponentRef<MultipleData<T, U>>): void {
    const toDestroy = this.createdList.find(c => c.component === ref);
    this.createdList = this.createdList.filter(c => c.component !== ref);
    if (toDestroy) {
      this.form.removeAt(
        this.form.controls.indexOf(toDestroy?.component.instance.ctrl)
      );
      toDestroy?.addComponent.destroy();
      toDestroy?.deleteComponent.destroy();
    }
    ref.destroy();
  }
}
