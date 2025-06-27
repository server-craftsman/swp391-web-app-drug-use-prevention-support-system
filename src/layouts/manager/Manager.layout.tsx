import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import SidebarLayout from "./Sidebar.layout";
import FooterLayout from "../main/Footer.layout";

const { Content, Footer } = Layout;

const ManagerLayout: React.FC = () => {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <SidebarLayout />
            <Layout style={{ marginLeft: "250px" }} className="lg:ml-[250px] md:ml-0 sm:ml-0">
                <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
                    <Outlet />
                </Content>
                <Footer className="p-0">
                    <FooterLayout />
                </Footer>
            </Layout>
        </Layout>
    );
};

export default ManagerLayout;
