import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs';
import { ElementSchemaRegistry } from '@angular/compiler';

type TreeElement = {
  name: string,
  parent: string,
  children: TreeElement[];
}

export type Mapping = {
  start_from: number,
  start_text: string,
  start_circle_id?: number,
  end_circle_id?: number,
  end_of?: number,
  mapping_id?: number,
  end_text: string,
}

@Injectable({
  providedIn: 'root'
})


export class JsonSchemaService {
  currentMappingIndex: number = 0;
  deleteMappingSubject: Subject<Mapping> = new Subject<Mapping>();
  underlineMappingSubject: Subject<number> = new Subject<number>();
  underlineMappingIndex: number = -1;
  startMapping: BehaviorSubject<{ isStartFromSecond: boolean, start_id: number, startFieldLabel: string }> = new BehaviorSubject<{ start_id: number, isStartFromSecond: boolean, startFieldLabel: string }>({ start_id: 0, isStartFromSecond: false, startFieldLabel: '' });
  translateJson_first: BehaviorSubject<{ x: number, y: number }> = new BehaviorSubject<{ x: number, y: number }>({ x: 0, y: 0 });
  translateJson_second: BehaviorSubject<{ x: number, y: number }> = new BehaviorSubject<{ x: number, y: number }>({ x: 0, y: 0 });
  finishMapping: BehaviorSubject<{ isStartFromSecond?: boolean, finish_id: number, finishFieldLabel: string }> = new BehaviorSubject<{ finish_id: number, isStartFromSecond?: boolean, finishFieldLabel: string }>({ finish_id: 0, isStartFromSecond: false, finishFieldLabel: "" });
  isLineDrawing: boolean = false;
  startFrom: number = 0;
  mapTable: Mapping[] = [];

  setIsLineDrawing = (value: boolean) => {
    this.isLineDrawing = value;
  }

  setStartFrom = (value: number) => {
    this.startFrom = value;
  }

  setUnderlineMappingIndex(value: number) {
    this.underlineMappingIndex = value;
  }

  viewBoardDimensions = {
    width: 0,
    height: 0,
    margin: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  }
  //contains two jsons Hierchy that we got from server
  treeData: any = [{
    name: 'JSON 1 {}',
    parent: null,
    children: []
  },
  {
    name: 'JSON 2 {}',
    parent: null,
    children: []
  }];

  constructor() {}

  findMappingElemByMappingId(mappingId: number) {
    return this.mapTable.find(elem => {
      if (elem.mapping_id === mappingId) {
        return elem;
      }
    })
  }

  addMappingToList = (elem: Mapping) => {
    this.mapTable.push(elem)
  }

  deleteMappingFromList(elem: Mapping) {
    let tempIndex = this.mapTable.indexOf(elem);
    if (tempIndex !== -1) {
      this.mapTable.splice(tempIndex, 1);
    }
  }

  recursivePush(obj, tree, currentField?) {
    if (!obj) {
      return 0;
    }
    let current_Layer_keys: any = 0;
    if (typeof obj === 'string') {
      tree.children.push({ name: currentField, children: [] });
      return 0;
    }
    if (typeof obj === 'object' && !Array.isArray(obj)) {
      current_Layer_keys = Object.keys(obj);
      tree.children.push({ name: currentField, children: [] });
      let index = tree.children.findIndex(elem => elem.name === currentField);
      for (let i = 0; i < current_Layer_keys.length; i++) {
        if (!obj.length) {
          tree.children[index].children.push({ name: current_Layer_keys[i], children: [] });
          if (typeof obj[current_Layer_keys[i]] !== 'string' && Object.keys(obj[current_Layer_keys[i]]).length > 0) {
            for (let j = 0; j < Object.keys(obj[current_Layer_keys[i]]).length; j++) {
              let temp_j = Object.keys(obj[current_Layer_keys[i]])[j];
              if (typeof obj[current_Layer_keys[i]][temp_j] === 'object') {
                let index_j = tree.children[index].children.findIndex(elem => elem.name === current_Layer_keys[i]);
                this.recursivePush(obj[current_Layer_keys[i]][temp_j], tree.children[index].children[index_j], temp_j);
              } else {
                let index_j = tree.children[index].children.findIndex(elem => elem.name === current_Layer_keys[i]);
                tree.children[index].children[index_j].children.push({ name: Object.keys(obj[current_Layer_keys[i]])[j], children: [] });
              }
            }
          }
        }
      }
    } else if (Array.isArray(obj)) {
      tree.children.push({ name: currentField, children: [] });
      let index = tree.children.findIndex(elem => elem.name === currentField);
      for (let i = 0; i < obj.length; i++) {
        if (typeof obj[i] === 'object') {
          this.recursivePush(obj[i], tree.children[index], i);
        } else {
          tree.children[index].children.push({ name: obj[i], children: [] });
        }
      }
    }
  }

  parseSchema = (schema: any, isSecondJson?: boolean) => {
    let schema_keys = Object.keys(schema);
    for (let i = 0; i < schema_keys.length; i++) {
      this.treeData[isSecondJson ? 1 : 0].children.push({ name: schema_keys[i], children: [] });
      let index = this.treeData[isSecondJson ? 1 : 0].children.findIndex(elem => elem.name === schema_keys[i]);
      if (Object.keys(schema[schema_keys[i]]).length > 0) {
        for (let j = 0; j < Object.keys(schema[schema_keys[i]]).length; j++) {
          let temp = Object.keys(schema[schema_keys[i]])[j];
          this.recursivePush(schema[schema_keys[i]][temp], this.treeData[isSecondJson ? 1 : 0].children[index || 0], temp);
        }
      }
    }
  };
}


