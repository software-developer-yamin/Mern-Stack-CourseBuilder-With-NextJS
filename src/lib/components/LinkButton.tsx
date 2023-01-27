import { Button } from "@chakra-ui/react";
import Link from "next/link";

export const LinkButton = ({
  url = "/",
  title = "Home",
  onClose,
}: LinkButtonPropsType) => (
  <Link onClick={onClose} href={url}>
    <Button variant="ghost">{title}</Button>
  </Link>
);
