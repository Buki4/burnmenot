export default function Loading() {
  return (
    <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-800 border-t-orange-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-4 border-slate-800 border-b-purple-500 rounded-full animate-spin-reverse"></div>
        </div>
      </div>
      <p className="text-slate-400 font-medium animate-pulse">Загрузка...</p>
    </div>
  );
}
