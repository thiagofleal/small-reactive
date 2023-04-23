import { Observable } from "../../rx";
import { Service } from "./service";

export type ChildDefinitionObject = { selector: string, component: Component };

export type ComponentOptions = {
  children?:  Record<string, Component> | ChildDefinitionObject[]
  style?:     string | string[]
  deepStyle?: string | string[]
};

export class Component {
  constructor(opts?: ComponentOptions);

  get element(): HTMLElement;
  get children(): HTMLElement;

  render(): string;
  onShow(): void;
  onReload(): void;
  onConnect(): void;
  onDisconnect(): void;

  show(element: HTMLElement): void;
	useStyle(style: string): void;
	useDeepStyle(style: string): void;
  appendChild(selector: string, component: Component): void;
  setChilds(childs: Record<string, Component> | ChildDefinitionObject[]): void;
  observeChildren(ref: string): Observable<HTMLElement[]>;
  observeChildrenSelector(selector: string): Observable<HTMLElement[]>;
  observeChildrenComponents(ref: string): Observable<{
    element: HTMLElement,
    component: Component
  }>;
  childrenReference(refs: Record<string, string>): void;
  childReference(refs: Record<string, string>): void;
  eventEmitter(event: string): {
    emit: (data: any) => void
  };
  emit(event: string, data: any): void;
  inject<T extends Service>(classRef: Constructable<T>): T | undefined;
  reload(): void;
}
