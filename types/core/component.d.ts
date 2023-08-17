import { Observable } from "../../rx";
import { Directive } from "./directive";
import { Service } from "./service";
import { Constructable } from "../utils/constructable";

export type ChildrenDefinitionObject<T> = { selector: string, component: T };
export type DirectivesDefinitionObject<T> = { selector: string, directive: T };
export type ChildrenRecordOrArray<T> = Record<string, T> | ChildrenDefinitionObject<T>[]
export type DirectivesRecordOrArray<T> = Record<string, T> | DirectivesDefinitionObject<T>[]

export type ComponentOptions = {
  children?:    ChildrenRecordOrArray<Component | Constructable<Component> | (() => Component)>
  directives?:  DirectivesRecordOrArray<Directive | Constructable<Directive> | (() => Directive)>
  style?:       string | string[]
  deepStyle?:   string | string[]
};

export interface OnShow {
  onShow(): void;
}
export interface OnReload {
  onReload(): void;
}
export interface OnConnect {
  onConnect(): void;
}
export interface OnDisconnect {
  onDisconnect(): void;
}

export abstract class Component {
  constructor(opts?: ComponentOptions);

  get element(): HTMLElement | undefined;
  get content(): HTMLElement | undefined;
  get parent(): Component | undefined;

  getElementByRef<T = HTMLElement>(ref: string): T | undefined;
  getElementsByRef<T = HTMLElement>(ref: string): T[];

  abstract render(): string;

  showComponentInElement(element: HTMLElement): void;
	useStyle(style: string): void;
	useDeepStyle(style: string): void;
  appendChild(selector: string, component: Component): void;
  appendDirective(
    selector: string,
    directive: Directive | Constructable<Directive> | (() => Directive)
  ): void;
  setChildren(children: ChildrenRecordOrArray<Component>): void;
  setDirectives(directives: ChildrenRecordOrArray<Directive>): void;
  observeChildren(ref: string): Observable<HTMLElement[]>;
  observeChildrenSelector(selector: string): Observable<HTMLElement[]>;
  observeChildrenComponents(ref: string): Observable<{
    element: HTMLElement,
    component: Component
  }>;
  childrenReference(refs: Record<string, string>): void;
  childReference(refs: Record<string, string>): void;
  eventEmitter<T = any>(event: string): {
    emit: (data: T) => void
  };
  emit<T = any>(event: string, data: T): void;
  inject<T extends Service>(classRef: Constructable<T>): T | undefined;
  reload(): void;
}
