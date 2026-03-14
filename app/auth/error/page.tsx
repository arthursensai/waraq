import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ErrorContent from "@/src/features/auth/components/ErrorContent";
import Link from "next/link";
import { Suspense } from "react";

const Page = ({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) => {
  return (
    <section className="flex min-h-svh w-full items-center justify-center">
      <Card className="w-full max-w-sm ">
        <CardHeader>
          <CardTitle>Sorry, something went wrong.</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense>
            <ErrorContent searchParams={searchParams} />
          </Suspense>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full" variant="link">
            <Link href="/dashboard">Go back to dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};

export default Page;
