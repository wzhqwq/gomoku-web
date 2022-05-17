import * as $ from 'jquery';

export default class Collapse {
  private el: JQuery<HTMLDivElement>
  private inner: JQuery<HTMLDivElement>

  public set datasetCollapsed(value: boolean) {
    this.el[0].dataset.toggle = value ? 'collapse' : 'open'
  }
  public get datasetCollapsed(): boolean {
    return this.el[0].dataset.toggle === 'collapse'
  }

  constructor(selector: string) {
    this.el = $<HTMLDivElement>(selector)
    this.inner = this.el.find<HTMLDivElement>('.collapse-inner')
    if (!this.datasetCollapsed) this.open()
  }

  public collapse(): void {
    this.datasetCollapsed = true;
    this.el.height(0)
  }

  public open(): void {
    this.datasetCollapsed = false;
    this.el.height(this.inner[0].clientHeight)
  }
}