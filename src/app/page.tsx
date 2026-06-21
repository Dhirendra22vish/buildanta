import MaterialHelper from "@/components/MaterialHelper";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Background radial effects are defined in globals.css body style */}
      <main className="flex-1 flex flex-col justify-center py-10 md:py-16">
        <MaterialHelper />
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 border-t border-slate-900 bg-slate-950/40 backdrop-blur-sm text-center text-xs text-gray-500 font-semibold tracking-wide">
        &copy; {new Date().getFullYear()} Buildanta Material Helper. All rights reserved. Created for homebuilders in Kanpur, UP.
      </footer>
    </div>
  );
}
