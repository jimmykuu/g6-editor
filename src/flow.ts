
const G6 = require("G6")

import GenNode from './genFlowNode';
// import BaseDom from './dom';
// import { mixin } from './util';

interface Drag {
  clientX: number;
  clientY: number;
}

class Flow extends G6.Net {
  private moduleName: string;
  private nodeMange: GenNode;
  private dragOrigin: Drag;
  private containers: any;
  private event: any;
  private dragginNode: boolean;
  private dragginCancas: boolean;
  private _cfg: any;
  constructor(cfg: any) {
    const { graph } = cfg;
    // super(Object.assign({}, graph, { plugins: [grid] }));
    //  g6降级v1版本，需删除container
    super(graph);
    this._cfg = graph;
    this.moduleName = 'Flow';
    this.nodeMange = new GenNode({});
    this.dragOrigin = null;
    this.dragginNode = false;
    this.dragginCancas = false;
    // mixin(this, BaseDom);
  }

  addEventListener() {
    const { containers } = this;
    containers.addEventListener('dragover', (ev: any) => { ev.preventDefault(); }, false);
    containers.addEventListener('drop', this.onDrop.bind(this), false);
    this.event.addListener('Itempannel@@dragitem', (ev: any) => {
      const { clientX, clientY } = ev;
      this.dragOrigin = { clientX, clientY };
    });
  }

  addEventTo(event: any) {
    this.event = event;
  }

  dragNode() {
    let node: any;
    let dx: number;
    let dy: number;
    this.on('node:dragstart', (ev: any) => {
      if (this.dragginCancas) return;
      this.dragginNode = true;
      const { item } = ev;
      const model = item.getModel();
      node = item;
      dx = model.x - ev.x;
      dy = model.y - ev.y;
    });
    this.on('node:drag', (ev: any) => {
      if (this.dragginCancas) return;
      this.update(node, {
        x: ev.x + dx,
        y: ev.y + dy,
      });
    });
    this.on('node:dragend', (ev: any) => {
      setTimeout(() => {
        this.dragginNode = false;
      }, 500)
      if (this.dragginCancas) return;
      node = undefined;
    });
  }
  //  g6 2.0拖拽，降级1.0.暂时不需要了
  // dragGraph() {
  //   let lastPoint: any;
  //   // this.on('dragstart', (ev: any) => {
  //   // });
  //   this.on('drag', (ev: any) => {
  //     if (this.dragginNode) return;
  //     this.dragginCancas = true;
  //     if (!ev.item) {
  //       if (lastPoint) {
  //         this.translate(ev.domX - lastPoint.x, ev.domY - lastPoint.y);
  //       }
  //       lastPoint = {
  //         x: ev.domX,
  //         y: ev.domY,
  //       };
  //     }
  //   });
  //   this.on('dragend', (ev: any) => {// eslint-disable-line
  //     setTimeout(() => {
  //       this.dragginCancas = false;
  //     }, 500)
  //     if (this.dragginNode) return;
  //     lastPoint = undefined;
  //   });
  // }

  on (type: string, func: any) {
    super.on(type, func)
  }

  onDrag() {
    this.dragNode();
    // this.dragGraph();
  }

  onDrop(ev: any) {
    ev.preventDefault();
    const clientX = ev.clientX;
    const clientY = ev.clientY;
    const shape = ev.dataTransfer.getData('shape');
    const extendId = ev.dataTransfer.getData('extendId');
    const node = this.nodeMange.extendModelCard(shape,
      { dragOrigin: this.dragOrigin, dragTarget: { clientX, clientY }, width: 184, height: 40 },
    extendId);
    this.updates('node', node);
  }

  findDom() {
    const { id: container } = this._cfg;
    this.containers = this.findDomById(container, null);
    this.addEventListener();
  }

  parse() {
    this.findDom();
  }

  findDomById(container: string, node: any) { //eslint-disable-line
    if (node) {
      return node.getElementById(container);
    }
    return document.getElementById(container);
  }

  findDomByClassName(container: string, node: any) {//eslint-disable-line
    if (node) {
      return node.getElementsByClassName(container);
    }
    return document.getElementsByClassName(container);
  }

  updates(type: string, node: any) {
    this.add(type, node);
    // this.render();
  }


  read(data: any) {
    this.source(data.nodes, data.edges);
    this.render();
    setTimeout(() => {
      this.onDrag();
    }, 50);
  }

  update(type: string, func: any) {
    super.update(type, func);
  }

  translate(x: number, y: number) {
    super.translate(x, y);
  }
}


Flow.registerNode = G6.registNode;
Flow.registerEdge = G6.registEdge;
Flow.registerGroup = G6.registGroup;
Flow.registerGuide = G6.registGuide;
Flow.registerBehaviour = G6.registBehaviour;
Flow.version = '0.1.0';

export default Flow;
