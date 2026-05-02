import { ObservableProxy, type Callback, type ObjectsProperty } from "../observableProxy";
import { DeduplicatorPromisifier } from "./scheduler";
import { Wrapper } from "./wrapper";

export type ClearWatchers = () => void
export type ClientFunction = (dispose: ClearWatchers) => void

type Wrapped = () => void
type PerPropertyFunctions = Map<ObjectsProperty<object>, Set<Wrapped>>
type PerObjectProps = WeakMap<object, PerPropertyFunctions>

export class Autorun{

    private readonly object_props_functionss_map: PerObjectProps = new WeakMap()
    private readonly wrapper = new Wrapper()
    private readonly deduplicator = new DeduplicatorPromisifier()
    private readonly disposes = new WeakMap<Wrapped, Set<ClearWatchers>>()


    public autorun(func: ClientFunction): ClearWatchers {
        const disposable = () => {
            dispose()
            return func(dispose)
        }
        const wrapped = this.wrapper.wrap(disposable)
        this.deduplicator.schedule(wrapped)
        const dispose = this.getDispose(wrapped)
        return dispose
    }

    public reaction<F extends ()=>unknown>(tracking: F, reaction: ()=>void): {dispose: ClearWatchers, result: ReturnType<F>}{
        const wrapped = this.wrapper.wrap(tracking, reaction)
        const dispose = this.getDispose(reaction)
        return {dispose, result: wrapped() as ReturnType<F>}
    }


    public registerObject<T extends object>(object: T): T {
        return ObservableProxy(object, this.onRead, this.onChange) as T
    }
    private getDispose(reaction: (...args: unknown[])=>unknown): ClearWatchers {
        const dispose: ClearWatchers = () => {
            const disposes = this.disposes.get(reaction)
            if(!disposes) return
            disposes.forEach(f => f())
            this.disposes.delete(reaction)
        }
        return dispose
    }

    private onRead: Callback<object> = (object, property) => {
        const current = this.wrapper.getCurrentReaction()
        if(!current) return
        this.addReactionOnProp(object, property, current)
    }
    private onChange: Callback<object> = (object, property) => {
        const functions = this.getReactionOnProp(object, property)
        functions.forEach(f => this.deduplicator.schedule(f))
    }



    private getReactionOnProp(object: object, property: ObjectsProperty<object>): ReadonlySet<Wrapped>{
        return this.object_props_functionss_map.get(object)?.get(property) ?? new Set()
    }
    private addReactionOnProp(object: object, property: ObjectsProperty<object>, cont: Wrapped){
        let props = this.object_props_functionss_map.get(object)
        if(!props){
            props = new Map()
            this.object_props_functionss_map.set(object, props)
        }
        let functions = props.get(property)
        if(!functions){
            functions = new Set()
            props.set(property, functions)
        }
        functions.add(cont)

        let disposes = this.disposes.get(cont)
        if(!disposes){
            disposes = new Set()
            this.disposes.set(cont, disposes)
        }
        disposes.add(() => this.removeReactionOnProp(object, property, cont))
    }

    private removeReactionOnProp(object: object, property: ObjectsProperty<object>, cont: Wrapped){
        const props = this.object_props_functionss_map.get(object)
        if(!props) return
        const functions = props.get(property)
        if(!functions) return
        functions.delete(cont)
        if(functions.size === 0) props.delete(property)
        if(props.size === 0) this.object_props_functionss_map.delete(object)
    }

}