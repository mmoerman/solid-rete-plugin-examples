import {ClassicPreset, GetSchemes, NodeEditor} from "rete";
import {AreaExtensions, AreaPlugin} from "rete-area-plugin";
import {ConnectionPlugin, Presets as ConnectionPresets} from "rete-connection-plugin";
import {Presets, SolidArea2D, SolidPlugin} from "solid-rete-plugin";
import {AutoArrangePlugin, Presets as ArrangePresets} from "rete-auto-arrange-plugin";
import {ContextMenuExtra, ContextMenuPlugin, Presets as ContextMenuPresets} from "rete-context-menu-plugin";
import {Component, createEffect, onCleanup} from "solid-js";

type Node = NodeA | NodeB;
type Schemes = GetSchemes<Node, Connection<Node, Node>>;
type AreaExtra = SolidArea2D<Schemes> | ContextMenuExtra;

class NodeA extends ClassicPreset.Node {
    height = 140;
    width = 200;

    constructor(socket: ClassicPreset.Socket) {
        super("NodeA");

        this.addControl("a", new ClassicPreset.InputControl("text", {}));
        this.addOutput("a", new ClassicPreset.Output(socket));
    }

    clone() {
        return new NodeA(new ClassicPreset.Socket("socket"))
    }
}

class NodeB extends ClassicPreset.Node {
    height = 140;
    width = 200;

    constructor(socket: ClassicPreset.Socket) {
        super("NodeB");

        this.addControl("b", new ClassicPreset.InputControl("text", {}));
        this.addInput("b", new ClassicPreset.Input(socket));
    }
}

class Connection<
    A extends Node,
    B extends Node
> extends ClassicPreset.Connection<A, B> {
}

export const NodesWithMenus: Component = () => {
    let containerRef: HTMLDivElement | undefined;
    let editorDestroy: (() => void) | undefined;

    onCleanup(() => {
        if (editorDestroy) {
            editorDestroy();
        }
    });

    createEffect(() => {
        if (!containerRef) return;

        // Initialize createEditor function with the container
        createEditor(containerRef).then((editorInstance) => {
            editorDestroy = () => editorInstance.destroy();
        });
    });

    return (
        <div
            ref={(el) => (containerRef = el)}
            style={{width: "100%", height: "100vh", border: "1px solid #ccc"}}
        ></div>
    );
};


export async function createEditor(container: HTMLElement) {
    const socket = new ClassicPreset.Socket("socket");

    const editor = new NodeEditor<Schemes>();
    const area = new AreaPlugin<Schemes, AreaExtra>(container);
    const connection = new ConnectionPlugin<Schemes, AreaExtra>();
    const render = new SolidPlugin<Schemes, AreaExtra>();
    const arrange = new AutoArrangePlugin<Schemes>();
    const contextMenu = new ContextMenuPlugin<Schemes>({
        items: ContextMenuPresets.classic.setup([
            ["NodeA", () => new NodeA(socket)],
            ["Extra", [["NodeB", () => new NodeB(socket)]]]
        ])
    });

    area.use(contextMenu);

    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
        accumulating: AreaExtensions.accumulateOnCtrl()
    });

    render.addPreset(Presets.contextMenu.setup());
    render.addPreset(Presets.classic.setup());

    connection.addPreset(ConnectionPresets.classic.setup());

    arrange.addPreset(ArrangePresets.classic.setup());

    editor.use(area);
    area.use(connection);
    area.use(render);
    area.use(arrange);

    AreaExtensions.simpleNodesOrder(area);

    const a = new NodeA(socket);
    const b = new NodeB(socket);

    await editor.addNode(a);
    await editor.addNode(b);

    await editor.addConnection(new ClassicPreset.Connection(a, "a", b, "b"));

    await arrange.layout();
    await AreaExtensions.zoomAt(area, editor.getNodes());

    return {
        destroy: () => area.destroy()
    };
}
