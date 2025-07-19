import { Skeleton } from "@/components/ui/skeleton";

const ChangePasswordSkeleton = () => {
  return (
    <div className="pt-10">
      <div className="px-[50px] pb-[32px] pt-[24px] border border-[#B6B6B6] rounded-md">
        <Skeleton className="h-6 w-40 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-[50px] w-full" />
            </div>
          ))}
        </div>

        <div className="pt-8 w-full flex items-center justify-end">
          <Skeleton className="h-[50px] w-[120px]" />
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordSkeleton;
