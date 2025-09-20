import { buttonVariants } from "@/components/ui/button";
import { PopularPlanType, PricingProps } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import Link from "next/link";
import {
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Card,
} from "@/components/ui/card";
import PaymentLink from "./PaymentLink";

const PricingCard = ({ pricing }: { pricing: PricingProps }) => {
  return (
    <Card
      key={pricing.title}
      className={
        pricing.popular === PopularPlanType.YES
          ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10"
          : ""
      }
    >
      <CardHeader>
        <CardTitle className="flex item-center justify-between">
          {pricing.title}

          {pricing.popular === PopularPlanType.YES ? (
            <Badge variant="secondary" className="text-sm text-primary">
              Most popular
            </Badge>
          ) : null}
        </CardTitle>

        <div>
          <span className="text-3xl font-bold">${pricing.price}</span>
          <span className="text-muted-foreground"> {pricing.billing}</span>
        </div>

        <CardDescription>{pricing.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <PaymentLink
          href={pricing.href} 
          text={pricing.buttonText}
          paymentLink={pricing.paymentLink}
        />
      </CardContent>

      <hr className="w-4/5 m-auto mb-4" />

      <CardFooter className="flex">
        <div className="space-y-4">
          {pricing.benefitList.map((benefit: string) => (
            <span key={benefit} className="flex">
              <Check className="text-purple-500" />{" "}
              <h3 className="ml-2">{benefit}</h3>
            </span>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
