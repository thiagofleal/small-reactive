import { Observable } from "../../rx";

export class Component {
  constructor(props?: Record<string, any>);

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
  setChilds(childs: Record<string, Component> | { selector: string, component: Component }[]): void;
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
  reload(): void;
}
