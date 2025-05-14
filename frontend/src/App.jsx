import { Navigate, Route, Router, Routes } from "react-router";
import Home from "./Components/Home.jsx";
import LoginPage from "./Components/LoginPage.jsx";
import SignUpPage from "./Components/SignUpPage.jsx";
import NotificationsPage from "./Components/NotificationsPage.jsx";
import ChatPage from "./Components/ChatPage.jsx";
import CallPage from "./Components/CallPage.jsx";
import OnboardingPage from "./Components/OnboardingPage.jsx";
import { Toaster } from "react-hot-toast";
import PageLoader from './sec_Components/PageLoader.jsx';
import Layout from './sec_Components/Layout.jsx';
import { useThemeStore } from './Store/use.ThemeSelector.js';
import useAuthUser from "./hooks/useAuthuser.js";

const App = () => {
    const { isLoading, authUser } = useAuthUser();
    const isAuthenticated = Boolean(authUser);
    const isOnboarded = authUser?.isOnboarded;

    const { theme } = useThemeStore();

    if (isLoading) return <PageLoader />;

    return <div data-theme={theme}>
        <Routes>
            <Route
                path='/'
                element={
                    isAuthenticated && isOnboarded ? (
                        <Layout showSidebar={true}>
                            <Home />
                        </Layout>
                    ) : (
                        <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                    )
                }
            />
            <Route path='/login' element={!isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />} />
            <Route path='/signup' element={!isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />} />

            <Route path='/notifications' element={isAuthenticated && isOnboarded ? (
                <Layout showSidebar={true}>
                    <NotificationsPage />
                </Layout>
            ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )} />


            <Route path='/chat/:id' element={isAuthenticated && isOnboarded ? (
                <Layout showSidebar={false}>
                    <ChatPage />
                </Layout>

            ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )} />


            <Route path='/call/:id' element={isAuthenticated && isOnboarded ?
                (
                    <CallPage />
                ) :
                (
                    <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                )} />


            <Route path='/onboarding' element={isAuthenticated ? (
                !isOnboarded ? (
                    < OnboardingPage />
                ) : (
                    <Navigate to="/" />
                )
            ) : (
                <Navigate to="/login" />
            )} />
        </Routes>
        <Toaster />
    </div>
}

export default App