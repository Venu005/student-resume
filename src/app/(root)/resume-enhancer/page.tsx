import AddResume from "@/components/AddResume";
import ShowResume from "@/components/ShowResume";

export default function page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-8 md:pt-32">
      <div className="container relative max-w-4xl mb-8">
        {" "}
        <div className="w-full flex justify-center">
          <AddResume />
        </div>
      </div>
      <div className="flex-1 w-full flex items-center justify-center -mt-24">
        {" "}
        <ShowResume />
      </div>
    </div>
  );
}
