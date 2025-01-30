import {Component, createEffect, onCleanup} from "solid-js";
import {ClassicPreset, GetSchemes, NodeEditor} from "rete";
import {AreaExtensions, AreaPlugin} from "rete-area-plugin";
import {ConnectionPlugin, Presets as ConnectionPresets,} from "rete-connection-plugin";
import {Presets, SolidArea2D, SolidPlugin} from "solid-rete-plugin";

type Schemes = GetSchemes<
    ClassicPreset.Node,
    ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;
type AreaExtra = SolidArea2D<Schemes>;

export const SimpleNodes: Component = () => {
    let containerRef: HTMLDivElement | undefined;

    createEffect(() => {
        if (!containerRef) return;

        // Initialize createEditor function with the container
        createEditor(containerRef).then((editorInstance) => {
            // Cleanup: Destroy the editor instance when the component unmounts
            onCleanup(() => {
                editorInstance.destroy();
            });
        });
    });

    return (
        <div ref={(el) => (containerRef = el)}
             style={{ width: "100%", height: "100vh", border: "1px solid #ccc" }}
        >
        </div>
    );
};

async function createEditor(container: HTMLElement) {
    const socket = new ClassicPreset.Socket("socket");

    const editor = new NodeEditor<Schemes>();
    const area = new AreaPlugin<Schemes, AreaExtra>(container);
    const connection = new ConnectionPlugin<Schemes, AreaExtra>();
    const render = new SolidPlugin<Schemes, AreaExtra>();

    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
        accumulating: AreaExtensions.accumulateOnCtrl(),
    });

    render.addPreset(Presets.classic.setup());

    connection.addPreset(ConnectionPresets.classic.setup());

    editor.use(area);
    area.use(connection);
    area.use(render);

    AreaExtensions.simpleNodesOrder(area);

    const a = new ClassicPreset.Node("A");
    a.addControl("a", new ClassicPreset.InputControl("text", { initial: "a" }));
    a.addOutput("a", new ClassicPreset.Output(socket));
    await editor.addNode(a);

    const b = new ClassicPreset.Node("B");
    b.addControl("b", new ClassicPreset.InputControl("text", { initial: "b" }));
    b.addInput("b", new ClassicPreset.Input(socket));
    await editor.addNode(b);

    await editor.addConnection(new ClassicPreset.Connection(a, "a", b, "b"));

    await area.translate(a.id, { x: 0, y: 0 });
    await area.translate(b.id, { x: 270, y: 0 });

    setTimeout(() => {
        // wait until nodes rendered because they don't have predefined width and height
        AreaExtensions.zoomAt(area, editor.getNodes());
    }, 10);

    // Return a cleanup function
    return {
        destroy: () => area.destroy(),
    };
}
