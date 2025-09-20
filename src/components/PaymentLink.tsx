"use client";

import { buttonVariants } from "./ui/button";
import { PaymentLinkProps } from "@/types";
import Link from "next/link";

const PaymentLink = ({ href, paymentLink, text }: PaymentLinkProps) => {
  const handleClick = () => {
    if (paymentLink) {
      console.log({ paymentLink });

      localStorage.setItem("stripePaymentLink", paymentLink);
    }
  };

  return (
    <Link href={href} onClick={handleClick} className={buttonVariants()}>
      {text}
    </Link>
  );
};

export default PaymentLink;
