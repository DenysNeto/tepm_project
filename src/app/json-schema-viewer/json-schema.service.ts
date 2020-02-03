import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';


type TreeElement = {
  name: string,
  parent: string,
  children: TreeElement[];
}

type DrawableLine = {
  start_circle_id: number,
  end_circle_id: number,
  line_id: number,

}

enum MainObjectsName {
  Schema = 'Schema',
  Data = 'Data',
  Layout = 'Layout',

}

@Injectable({
  providedIn: 'root'
})


export class JsonSchemaService {



  initiateDrawLine: BehaviorSubject<{ x: number, y: number, isStartFromSecond: boolean, start_id: number }> = new BehaviorSubject<{ x: number, y: number, start_id: number, isStartFromSecond: boolean }>({ x: 0, y: 0, start_id: 0, isStartFromSecond: false })
  finishDrawLine: BehaviorSubject<{ x: number, y: number, isStartFromSecond?: boolean, finish_id: number }> = new BehaviorSubject<{ x: number, y: number, finish_id: number, isStartFromSecond?: boolean }>({ x: 0, y: 0, finish_id: 0, isStartFromSecond: false })
  isLineDrawing: boolean = false;
  startFrom: number = 0;
  drawableLinesArr: DrawableLine[] = [];

  setIsLineDrawing = (value: boolean) => {
    this.isLineDrawing = value;
  }

  setStartFrom = (value: number) => {
    this.startFrom = value;
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
    name: '{}',
    parent: null,
    children: []
  },
  {
    name: '{}',
    parent: null,
    children: []
  }];

  constructor() {
  }


  addLineToDrawable(elem: DrawableLine) {
    this.drawableLinesArr.push(elem)
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


  // addElementToTree(elem: TreeElement) {
  //   if (elem.parent === null) {
  //     this.treeData = elem.parent;
  //   } else if (elem.parent) {

  //   }

  // }


}


