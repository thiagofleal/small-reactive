import { Component } from "./component";

export class Switch extends Component {
  get selected(): Component;
  get keys(): string[];

  setComponent(key: string, component: Component): void;
  select(key: string): void;
}
