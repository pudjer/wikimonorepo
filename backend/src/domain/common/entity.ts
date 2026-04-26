import { Equatable, UniqueCollection } from "../utils/collections";





export class Link<CHILD, LINKNAME, PARENT> implements Equatable<Link<CHILD, LINKNAME, PARENT>>{
    constructor(
        public readonly child: CHILD,
        public readonly name: LINKNAME,
        public readonly parent: PARENT
    ){}
    equals(link: Link<CHILD, LINKNAME, PARENT>): boolean {
        if(this.child !== link.child) return false;
        if(this.name !== link.name) return false;
        if(this.parent !== link.parent) return false;
        return true
    }
}

export class UniqueLinkCollection<LINK extends Link<unknown, unknown, unknown>> extends UniqueCollection<LINK>{}