export type LayoutType = {
    children: React.ReactNode
}

export type RouteProps = {
    href: string;
    label: string;
}

export enum PopularPlanType {
    NO = 0,
    YES = 1,
}

export type PricingProps = {
    title: string;
    popular: PopularPlanType;
    price: number;
    description: string;
    buttonText: string;
    benefitList: string[];
    href: string;
    billing: string;
}