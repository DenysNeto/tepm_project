import {Injectable} from '@angular/core';


type TreeElement = {
  name: string,
  parent: string,
  children: TreeElement[];
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

  // treeData = [
  //   {
  //     name: 'Top Level',
  //     parent: 'null',
  //     children: [
  //       {
  //         name: 'Level 2: A',
  //         parent: 'Top Level',
  //         children: [
  //           {
  //             'name': 'Daughter of A',
  //             'parent': 'Level 2: A'
  //           }
  //         ]
  //       },
  //     ]
  //   }
  // ];


  treeData: any = [{
    name: '{}',
    parent: null,
    children: []
  }];

  constructor() {
  }


  recursivePush(obj, tree, currentField?) {
    if (!obj) {
      return 0;
    }
    console.log('[c] bbb', obj);
    let current_Layer_keys: any = 0;

    if (typeof obj === 'string') {
      tree.children.push({name: currentField, children: []});
      return 0;
    }
    if (typeof obj === 'object' && !Array.isArray(obj)) {

      current_Layer_keys = Object.keys(obj);
      tree.children.push({name: currentField, children: []});
      console.log('popoVV', current_Layer_keys, current_Layer_keys.length);


      console.log('popoVV1', current_Layer_keys);
      let index = tree.children.findIndex(elem => elem.name === currentField);

      for (let i = 0; i < current_Layer_keys.length; i++) {
        console.log('popoVV2', current_Layer_keys[i]);
        if (!obj.length) {
          console.log('debug_0', current_Layer_keys[i]);
          tree.children[index].children.push({name: current_Layer_keys[i], children: []});
          if (typeof obj[current_Layer_keys[i]] !== 'string' && Object.keys(obj[current_Layer_keys[i]]).length > 0) {


            for (let j = 0; j < Object.keys(obj[current_Layer_keys[i]]).length; j++) {

              console.log('iop', obj[current_Layer_keys[i]]);
              let temp_j = Object.keys(obj[current_Layer_keys[i]])[j];

              if (typeof obj[current_Layer_keys[i]][temp_j] === 'object') {
                let index_j = tree.children[index].children.findIndex(elem => elem.name === current_Layer_keys[i]);
                console.log('debug_1', obj[current_Layer_keys[i]][temp_j]);
                this.recursivePush(obj[current_Layer_keys[i]][temp_j], tree.children[index].children[index_j], temp_j);
              } else {
                let index_j = tree.children[index].children.findIndex(elem => elem.name === current_Layer_keys[i]);
                console.log('debug_2', obj[current_Layer_keys[i]], Object.keys(obj[current_Layer_keys[i]])[j]);
                tree.children[index].children[index_j].children.push({name: Object.keys(obj[current_Layer_keys[i]])[j], children: []});
              }

              // console.log('[c] bla_o', obj[current_Layer_keys[i]][temp_j]);

              //this.recursivePush();

            }
          } else {
            console.log('[c] string1', obj[current_Layer_keys[i]]);
          }

        } else {
          console.log('[c] string[else]', obj.length);
          // for (let i = 0; i < obj.length; i++) {
          //
          //   if(true)
          //   {
          //     tree.children[index].children.push({name: i, children: []});
          //     // if (typeof obj[current_Layer_keys] !== 'string' && Object.keys(obj[current_Layer_keys[i]]).length > 0) {
          //     //   for (let j = 0; j < Object.keys(obj[current_Layer_keys[i]]).length; j++) {
          //     //     let temp_j = Object.keys(obj[current_Layer_keys[i]])[j];
          //     //     if (typeof obj[current_Layer_keys[i]][temp_j] === 'object') {
          //     //       let index_j = tree.children[index].children.findIndex(elem => elem.name === current_Layer_keys[i]);
          //     //       this.recursivePush(obj[current_Layer_keys[i]][temp_j], tree.children[index].children[index_j], temp_j);
          //     //     } else {
          //     //       let index_j = tree.children[index].children.findIndex(elem => elem.name === current_Layer_keys[i]);
          //     //       tree.children[index].children[index_j].children.push({name: Object.keys(obj[current_Layer_keys[i]])[j], children: []});
          //     //     }
          //     //
          //     //     // console.log('[c] bla_o', obj[current_Layer_keys[i]][temp_j]);
          //     //
          //     //     //this.recursivePush();
          //     //
          //     //   }
          //     // }
          //   }
          //
          //
          // }


          //console.log('iop');
        }
      }
    } else if (Array.isArray(obj)) {

      tree.children.push({name: currentField, children: []});
      console.log('[c] yuio', obj);
      let index = tree.children.findIndex(elem => elem.name === currentField);
      for (let i = 0; i < obj.length; i++) {

        //tree.children[index].children.push({name: i, children: []});

        if (typeof obj[i] === 'object') {

          //tree.children[index].children[i].children.push({name: i, children: []});


           console.log('iiu', obj[i]);
          this.recursivePush(obj[i], tree.children[index] , i);

        } else {
          tree.children[index].children.push({name: obj[i], children: []});
        }


        //
        // obj.forEach(elem =>{

        // } );


        // if (true ) {
        //   for (let j = 0; j < Object.keys(obj[current_Layer_keys[i]]).length; j++) {
        //     let temp_j = Object.keys(obj[current_Layer_keys[i]])[j];
        //     if (typeof obj[current_Layer_keys[i]][temp_j] === 'object') {
        //       let index_j = tree.children[index].children.findIndex(elem => elem.name === current_Layer_keys[i]);
        //       this.recursivePush(obj[current_Layer_keys[i]][temp_j], tree.children[index].children[index_j], temp_j);
        //     }
        //     else {
        //       let index_j = tree.children[index].children.findIndex(elem => elem.name === current_Layer_keys[i]);
        //       tree.children[index].children[index_j].children.push({name: Object.keys(obj[current_Layer_keys[i]])[j], children: []});
        //     }
        //
        //     // console.log('[c] bla_o', obj[current_Layer_keys[i]][temp_j]);
        //
        //     //this.recursivePush();
        //
        //   }
        // }


      }


    }


    // for (let i = 0; i < 1 || 0; i++) {
    //   if (typeof obj[current_Layer_keys[i]] === 'object') {
    //
    //
    //     if (obj[current_Layer_keys[i]].length > 0) {
    //       for (let j = 0; j < obj[current_Layer_keys[i]].length; j++) {
    //         console.log('tt', obj[current_Layer_keys[i]], 'tt1', obj[current_Layer_keys[i]][j]);
    //         tree.children.push({name: current_Layer_keys[i], children: []});
    //
    //         let index_tree = tree.children.findIndex(elem => elem.name === current_Layer_keys[i]);
    //         this.recursivePush(obj[current_Layer_keys[i]][j], tree.children[index_tree], current_Layer_keys[i][j]);
    //       }
    //     } else {
    //
    //       let index_tree_temp = tree && tree.children.findIndex(elem => elem.name === 'bla');
    //       tree && tree.children.push({name: currentField, children: []});
    //
    //
    //       //tree.children[index_tree_temp].children.push({name: current_Layer_keys[i], children: []});
    //
    //       let index_tree = tree && tree.children.findIndex(elem => elem.name === current_Layer_keys[i]);
    //       // let index = obj.children.findIndex(elem => elem.name === current_Layer_keys);
    //
    //
    //      // tree && this.recursivePush(obj[current_Layer_keys[i]], tree.children[index_tree], currentField);
    //     }
    //
    //
    //   }
    //
    //   else {
    //     tree && tree.children.push({name: obj[current_Layer_keys[i]], children: []});
    //   }
    //
    // }
    //schema_children.push( schema_children.push({name: key, type: 'array'});)

  }


  parseSchema = (schema: any) => {
    console.log('vvf', Object.keys(schema));
    let schema_keys = Object.keys(schema);
    for (let i = 0; i < schema_keys.length; i++) {
      this.treeData[0].children.push({name: schema_keys[i], children: []});
      let index = this.treeData[0].children.findIndex(elem => elem.name === schema_keys[i]);

      console.log('lop', Object.keys(schema[schema_keys[i]]).length);
      console.log('[c] schema_keys', schema[schema_keys[i]], Object.keys(schema[schema_keys[i]]));


      if (Object.keys(schema[schema_keys[i]]).length > 0) {
        console.log('www', Object.keys(schema[schema_keys[i]]));
        for (let j = 0; j < Object.keys(schema[schema_keys[i]]).length; j++) {
          let temp = Object.keys(schema[schema_keys[i]])[j];
          this.recursivePush(schema[schema_keys[i]][temp], this.treeData[0].children[index || 0], temp);
        }


        // let j = 0;
        // while (schema[schema_keys[i][j]]) {
        //   this.recursivePush(schema[schema_keys[i][j]], this.treeData[0].children[index || 0]);
        //   j++;
        // }

      }

      // else {
      //   console.log('[c] treeData cc', schema[schema_keys[i]]);
      //   this.recursivePush(schema[schema_keys[i]], this.treeData[0].children[index || 0]);
      //
      // }


    }


    // if (schema.schema) {
    //   this.treeData[0].children.push({name: MainObjectsName.Schema, parent: this.treeData[0].name, children: []});
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //   let temp = true;
    //   while (temp) {
    //     let schema_children = this.treeData[0].children[0].children;
    //     let current_Layer = schema.schema;
    //     let current_Layer_keys = Object.keys(current_Layer);
    //     for (let key = 0; key < current_Layer_keys.length; key++) {
    //       schema_children = this.treeData[0].children[0].children;
    //       current_Layer = schema.schema;
    //       if (current_Layer_keys[key] === 'type') {
    //         schema_children.push({name: 'type'});
    //
    //       } else {
    //         schema_children.push({name: current_Layer_keys[key], type: 'array', children: []});
    //
    //       }
    //
    //
    //       // ***** //
    //
    //       // else if (current_Layer['key'].type === 'object') {
    //       //   schema_children.push({name: key, type: 'array'});
    //       //   current_Layer = current_Layer['key'];
    //       //   schema_children.push({name: key, children: []});
    //       //   let current_index = schema_children.findIndex((elem => elem.name === key));
    //       //   schema_children = schema_children[current_index];
    //       //   for (let key of current_Layer) {
    //       //     if (current_Layer['key'].type === 'string' && key !== 'type') {
    //       //       schema_children.push({name: key});
    //       //
    //       //     } else if (current_Layer['key'].type === 'object') {
    //       //
    //       //       schema_children.push({name: key, type: 'array'});
    //       //       current_Layer = current_Layer['key'];
    //       //       schema_children.push({name: key, children: []});
    //       //       let current_index = schema_children.findIndex((elem => elem.name === key));
    //       //       schema_children = schema_children[current_index];
    //       //       for (let key of current_Layer) {
    //       //         if (current_Layer['key'].type === 'string' && key !== 'type') {
    //       //           schema_children.push({name: key});
    //       //
    //       //         }
    //       //       }
    //       //     }
    //       //
    //       //   }
    //       // }
    //
    //
    //     }
    //
    //     temp = false;
    //   }
    //
    // }
    // console.log('[c] ssss1', this.treeData);
  };


  addElementToTree(elem: TreeElement) {
    if (elem.parent === null) {
      this.treeData = elem.parent;
    } else if (elem.parent) {

    }

  }


}


