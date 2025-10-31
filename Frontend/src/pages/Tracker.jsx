const Tracker = () => {
  return (
    <div className="h-screen min-h-screen flex flex-col justify-between bg-white/80">
    <main className="flex-grow flex items-center justify-center p-10">
      <div className="h-full w-full bg-white rounded-sm flex items-center justify-center shadow-2xl">
        <h1 className="text-4xl">MAPS</h1>
      </div>
      <div className="h-full w-130 bg-white rounded-sm ml-10 flex items-center justify-center shadow-2xl">
        <h1 className="text-4xl">SIDE BAR</h1>
      </div>
    </main>
    </div>
  );
};

export default Tracker;