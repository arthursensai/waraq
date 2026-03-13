import { Skeleton } from "./ui/skeleton";

const LoadingScreen = () => {
  return (
    <div className="w-full h-full">
      <Skeleton className="h-full w-full" />
    </div>
  );
};

export default LoadingScreen;
