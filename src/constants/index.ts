import { PricingProps, RouteProps } from "@/types";

export const routeList: RouteProps[] = [
    {
        href: "/",
        label: "Home",
    },
    {
        href: "#team",
        label: "Team",
    },
    {
        href: "#testimonials",
        label: "Testimonials",
    },
];

export const pricingList: PricingProps[] = [
    {
        title: "Free",
        popular: 0,
        price: 0,
        description: "Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.",
        buttonText: "Get Started",
        benefitList: ["1 Team member", "2 GB Storage", "Upto 4 pages", "Community support", "lorem ipsum dolor"],
        href: "/api/auth/login",
        billing: "/month",
    },
    {
        title: "Premium",
        popular: 1,
        price: 10,
        description: "Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.",
        buttonText: "Buy Now",
        benefitList: ["4 Team member", "4 GB Storage", "Upto 6 pages", "Priority support", "lorem ipsum dolor"],
        href: "/api/auth/login",
        billing: "/month",
    },
    {
        title: "Enterprise",
        popular: 0,
        price: 99,
        description: "Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.",
        buttonText: "Buy Now",
        benefitList: ["10 Team member", "8 GB Storage", "Upto 10 pages", "Priority support", "lorem ipsum dolor"],
        href: "/api/auth/login",
        billing: "/year",
    },
];
