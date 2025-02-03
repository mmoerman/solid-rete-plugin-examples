import {Component, createSignal} from "solid-js";
import {styled} from "solid-styled-components";

import logo from './assets/logo.svg';
import styles from './styles/App.module.css';
import {SimpleNodes} from "./examples/SimpleNodes";
import {NodesWithMenus} from "./examples/NodesWithMenus";
import {NodesWithControls} from "./examples/NodesWithControls";
import {ReadonlyNodes} from "./examples/ReadonlyNodes";

// Styled layout components
const AppContainer = styled("div")`
    height: 100vh;
    display: flex;
    flex-direction: column;
`;

const Header = styled("header")`
    height: 8em;
    background-color: #282c34;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;

    .header-top {
        display: flex; /* Arrange span and image side by side */
        align-items: center; /* Center align vertically between span and image */
        gap: 1rem; /* Add space between the span and the image */
    }

    a {
        margin: 1rem; /* Ensure 2em margin around the anchor */
        color: #61dafb; /* Add a link color for proper visibility */
        text-decoration: none; /* Remove underline for styling purposes */

        &:hover {
            text-decoration: underline; /* Add underline on hover for better UX */
        }
    }
`;

const Layout = styled("div")`
    display: flex;
    flex: 1;
`;

const Sidebar = styled("nav")`
    width: 20%;
    min-width: 10em;
    background-color: #f4f4f4;
    padding: 10px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const SidebarLink = styled("a")`
    display: block;
    padding: 1rem;
    color: #333;
    text-decoration: none;
    transition: background-color 0.2s;

    &:hover {
        background-color: #ddd;
    }
`;

const MainCanvas = styled("main")`
    flex: 1;
    padding: 1em;
    background-color: #fff;
`;

const App: Component = () => {
    // Signal to handle which component to render in the main canvas
    const [currentComponent, setCurrentComponent] = createSignal<Component>(SimpleNodes);

    return (
        <AppContainer>
            {/* Header */}
            <Header>
                <div class='header-top'>
                    <span class={styles.title}>SolidJS Rete Plugin Examples</span>
                    <img src={logo} class={styles.logo} alt="logo"/>
                </div>
                <a href="https://retejs.org/examples">These examples are inspired by the Rete examples, for more click here</a>
            </Header>

            {/* Body Layout */}
            <Layout>
                {/* Sidebar */}
                <Sidebar>
                    {/* Navigation Links */}
                    <SidebarLink href="#" onClick={() => setCurrentComponent(() => SimpleNodes)}>
                        Simple Example
                    </SidebarLink>
                    <SidebarLink href="#" onClick={() => setCurrentComponent(() => ReadonlyNodes)}>
                        Readonly Example
                    </SidebarLink>
                    <SidebarLink href="#" onClick={() => setCurrentComponent(() => NodesWithMenus)}>
                        Example With Menus
                    </SidebarLink>
                    <SidebarLink href="#" onClick={() => setCurrentComponent(() => NodesWithControls)}>
                        Example With Button Control
                    </SidebarLink>
                </Sidebar>

                {/* Main Canvas */}
                <MainCanvas>
                    {currentComponent()({})}
                </MainCanvas>
            </Layout>
        </AppContainer>
    );
}

export default App;
