import { createBrowserRouter } from "react-router-dom";
import ErrorBoundary from "../Components/ErrorBoundary";
import App from "../App";
import Home from "../Pages/Home";
import About from "../Pages/About";
import Collection from "../Pages/Collection";
import Cart from "../Pages/Cart";
import Login from "../Pages/Login";
import PlaceOrder from "../Pages/PlaceOrder";
import Product from "../Pages/Product";
import Order from "../Pages/Order";
import Contact from "../Pages/Contact";
import PageWrapper from "../Components/PageWrapper";
import Verify from "../Pages/Verify";
import Profile from "../Pages/Profile";
import Protectedroutes from "./Protectedroutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    ),
    children: [
      {
        path: "/",
        element: (
          <PageWrapper>
            <Home />
          </PageWrapper>
        ),
      },
      {
        path: "/about",
        element: (
          <PageWrapper>
            <About />
          </PageWrapper>
        ),
      },
      {
        path: "/collection",
        element: (
          <PageWrapper>
            <Collection />
          </PageWrapper>
        ),
      },
      {
        path: "/cart",
        element: (
          <PageWrapper>
            <Cart />
          </PageWrapper>
        ),
      },
      {
        path: "/login",
        element: (
          <PageWrapper>
            <Login />
          </PageWrapper>
        ),
      },
      {
        path: "/placeorder",
        element: (
          <PageWrapper>
            <PlaceOrder />
          </PageWrapper>
        ),
      },
      {
        path: "/product/:id",
        element: (
          <PageWrapper>
            <Product />
          </PageWrapper>
        ),
      },
      {
        path: "/order",
        element: (
          <PageWrapper>
            <Order />
          </PageWrapper>
        ),
      },
      {
        path: "/profile",
        element: (
          <Protectedroutes>
            <PageWrapper>
              <Profile />
            </PageWrapper>
          </Protectedroutes>
        ),
      },
      {
        path: "/contact",
        element: (
          <PageWrapper>
            <Contact />
          </PageWrapper>
        ),
      },
      {
        path: "/verify",
        element: (
          <PageWrapper>
            <Verify />
          </PageWrapper>
        ),
      },
    ],
  },
]);

export default router;
