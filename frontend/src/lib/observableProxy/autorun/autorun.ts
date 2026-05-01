import { ObservableProxy, type Callback, type ObjectsProperty } from "../observableProxy";
import { DeduplicatorPromisifier } from "./scheduler";
import { Wrapper } from "./wrapper";

type ClearWatchers = () => void
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
        const dispose: ClearWatchers = () => {
            const disposes = this.disposes.get(wrapped)
            if(!disposes) return
            disposes.forEach(f => f())
            this.disposes.delete(wrapped)
        }
        const disposable = () => {
            dispose()
            return func(dispose)
        }
        const wrapped = this.wrapper.wrap(disposable)
        this.deduplicator.schedule(wrapped)
        return dispose
    }


    public registerObject<T extends object>(object: T): T {
        return ObservableProxy(object, this.onRead, this.onChange) as T
    }

    private onRead: Callback<object> = (object, property) => {
        const current = this.wrapper.getCurrentFunction()
        if(!current) return
        this.addFunctionOnProp(object, property, current)
    }
    private onChange: Callback<object> = (object, property) => {
        const functions = this.getFunctionsOnProp(object, property)
        functions.forEach(f => this.deduplicator.schedule(f))
    }



    private getFunctionsOnProp(object: object, property: ObjectsProperty<object>): ReadonlySet<Wrapped>{
        return this.object_props_functionss_map.get(object)?.get(property) ?? new Set()
    }
    private addFunctionOnProp(object: object, property: ObjectsProperty<object>, cont: Wrapped){
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
        disposes.add(() => this.removeFunctionOnProp(object, property, cont))
    }

    private removeFunctionOnProp(object: object, property: ObjectsProperty<object>, cont: Wrapped){
        const props = this.object_props_functionss_map.get(object)
        if(!props) return
        const functions = props.get(property)
        if(!functions) return
        functions.delete(cont)
        if(functions.size === 0) props.delete(property)
        if(props.size === 0) this.object_props_functionss_map.delete(object)
    }

}