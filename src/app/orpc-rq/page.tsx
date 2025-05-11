import { AddPost } from "./add-post";
import { ORPCProvider } from "./orpc-provider";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <ORPCProvider>
          <h1>orpc + tanstack query</h1>
          <AddPost />
        </ORPCProvider>
      </main>
    </div>
  );
}
