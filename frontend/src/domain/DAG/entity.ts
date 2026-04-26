import type { NodeRelations } from "backend/src/domain/articleDAG/entity"
import { AppError, LinksCycleError } from "backend/src/domain/common/domainErrors"
import { UniqueLinkCollection } from "backend/src/domain/common/entity"

export class InappropriateLinkError extends AppError {}
export class NoNodeInGraphError extends AppError {}

type NodeSet<Node> = Set<Node>
type Layers<Node> = Array<NodeSet<Node>>
type LinkedNodes<Node> = Map<Node, NodeSet<Node>>

interface IDAG<Node> {
    getParents(node: Node): ReadonlySet<Node>;
    getChildren(node: Node): ReadonlySet<Node>;
    getAncestors(node: Node): ReadonlySet<Node>;
    getDescendants(node: Node): ReadonlySet<Node>;
    getLayers(): ReadonlyArray<ReadonlySet<Node>>;
    getSubGraph(articleIds: ReadonlySet<Node>): DAG<Node>;
    getNodesLayers(articleIds: ReadonlySet<Node>): Layers<Node>;
}
export class DAG<Node> implements IDAG<Node> {
    private readonly articleIds: NodeSet<Node> = new Set();
    private nodeParents: LinkedNodes<Node> = new Map();
    private nodeChildren: LinkedNodes<Node> = new Map();
    private nodeAncestors: LinkedNodes<Node> = new Map();
    private nodeDescendants: LinkedNodes<Node> = new Map();
    private readonly layersFromLastGeneration: Layers<Node> = [];
    constructor(
        nodes: NodeSet<Node>,
        private readonly links: NodeRelations<Node, unknown>
    ){
        nodes.forEach(node => {
            this.articleIds.add(node);
            this.nodeParents.set(node, new Set());
            this.nodeChildren.set(node, new Set());
            this.nodeAncestors.set(node, new Set());
            this.nodeDescendants.set(node, new Set());
        });
        links.values.forEach(link => {
            const parents = this.nodeParents.get(link.child)
            const children = this.nodeChildren.get(link.parent)
            if(!parents || !children){
                throw new InappropriateLinkError();
            }
            parents.add(link.parent);
            children.add(link.child);
        });
        this.assertNoCycles();
        this.setLayers();
        this.setAncestors();
        this.setDescendants();
    }


    private assertNoCycles() {
        const visited: NodeSet<Node> = new Set();
        const recStack: NodeSet<Node> = new Set();
    
        const dfs = (node: Node) => {
            if (recStack.has(node)) {
                throw new LinksCycleError<Node>([node]);
            }
            if (visited.has(node)) return;
            visited.add(node);
            recStack.add(node);

            const parents = this.getParents(node);
            for (const parent of parents) {
                dfs(parent);
            }

            recStack.delete(node);
        };
    
        for (const node of this.articleIds) {
            if (!visited.has(node)) {
                dfs(node);
            }
        }
    }
    private setLayers() {
        const outDegree = new Map<Node, number>();
    
        // 1️⃣ Инициализация: посчитаем количество детей (исходящих рёбер) для каждой вершины
        for (const [id, children] of this.nodeChildren.entries()) {
            outDegree.set(id, children.size);
        }
    
        // 2️⃣ Первый слой = листья (children.size === 0)
        let currentLayer: NodeSet<Node> = new Set();
        for (const [id, degree] of outDegree.entries()) {
            if (degree === 0) currentLayer.add(id);
        }
        let layerNumber = 0;
        this.layersFromLastGeneration[layerNumber] = currentLayer;
    
        // 3️⃣ Построение слоёв вверх
        while (currentLayer.size > 0) {
            const nextLayer: NodeSet<Node> = new Set();
    
            for (const nodeId of currentLayer) {
                const parents = this.getParents(nodeId);
    
                for (const parentId of parents) {
                    // Уменьшаем счётчик исходящих рёбер
                    const remaining = (outDegree.get(parentId) ?? 0) - 1;
                    outDegree.set(parentId, remaining);
    
                    // Если все дети посещены → добавляем в следующий слой
                    if (remaining === 0) nextLayer.add(parentId);
                }
            }
    
            if (nextLayer.size === 0) break;
    
            layerNumber++;
            this.layersFromLastGeneration[layerNumber] = nextLayer;
            currentLayer = nextLayer;
        }
    
    }
    
    private setAncestors() {
        const layers = this.layersFromLastGeneration
        for(const layer of layers){
            for(const articleId of layer){
                const parents = this.getParents(articleId);
                let ancestors: NodeSet<Node> = new Set(parents);
                for(const parent of parents){
                    const parentsAncestors = this.getAncestors(parent)
                    ancestors = ancestors.union(parentsAncestors);
                }
                this.nodeAncestors.set(articleId, ancestors);
            }
        }
    }
    private setDescendants() {
        const layersReversed = this.layersFromLastGeneration.reverse()
        for(const layer of layersReversed){
            for(const articleId of layer){
                const children = this.getChildren(articleId);
                let descendants: NodeSet<Node> = new Set(children);
                for(const child of children){
                    const childrenDescendants = this.getDescendants(child)
                    descendants = descendants.union(childrenDescendants);
                }
                this.nodeDescendants.set(articleId, descendants);
            }
        }
    }
    getParents(articleId: Node): ReadonlySet<Node> {
        const res = this.nodeParents.get(articleId)
        if(!res){
            throw new NoNodeInGraphError()
        }
        return res
    }
    getChildren(articleId: Node): ReadonlySet<Node> {
        const res = this.nodeChildren.get(articleId)
        if(!res){
            throw new NoNodeInGraphError()
        }
        return res
    }
    getAncestors(articleId: Node): ReadonlySet<Node> {
        const res = this.nodeAncestors.get(articleId)
        if(!res){
            throw new NoNodeInGraphError()
        }
        return res
    }
    getDescendants(articleId: Node): ReadonlySet<Node> {
        const res = this.nodeDescendants.get(articleId)
        if(!res){
            throw new NoNodeInGraphError()
        }
        return res
    }
    private getSubNodes(articleIds: ReadonlySet<Node>): NodeSet<Node> {
        let subNodeIds: NodeSet<Node> = new Set(articleIds);
        for (const id of articleIds) {
            const ancestors = this.getAncestors(id);
            subNodeIds = subNodeIds.union(ancestors);
        }
        return subNodeIds
    }
    getLayers(): ReadonlyArray<ReadonlySet<Node>> {
        return this.layersFromLastGeneration
    }
    getNodesLayers(articleIds: ReadonlySet<Node>): Layers<Node> {
        const subNodeIds: NodeSet<Node> = this.getSubNodes(articleIds);
        const layers: Layers<Node> = [];
        for(const layer of this.layersFromLastGeneration){
            const layerNodes: NodeSet<Node> = layer.intersection(subNodeIds);
            layers.push(layerNodes);
        }
        return layers
    }
    getSubGraph(articleIds: ReadonlySet<Node>): DAG<Node> {
        let subNodeIds: NodeSet<Node> = this.getSubNodes(articleIds);
        
        const subLinks = this.links.values.filter(link =>
            subNodeIds.has(link.child) && subNodeIds.has(link.parent)
        );
        
        return new DAG(subNodeIds, new UniqueLinkCollection(subLinks));
    }
}
