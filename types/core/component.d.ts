import { Observable } from "../../rx";
import { Directive } from "../../src/core/directive";
import { Service } from "./service";
import { Constructable } from "../utils/constructable";

export type ChildDefinitionObject<T> = { selector: string, component: T };
export type RecordOrArray<T> = Record<string, T> | ChildDefinitionObject<T>[]

export type ComponentOptions = {
  children?:    RecordOrArray<Component>
  directives?:  RecordOrArray<Directive>
  style?:       string | string[]
  deepStyle?:   string | string[]
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
  appendDirective(
    selector: string,
    directive: Directive | Constructable<Directive> | (() => Directive)
  ): void;
  setChildren(children: RecordOrArray<Component>): void;
  setDirectives(directives: RecordOrArray<Directive>): void;
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
