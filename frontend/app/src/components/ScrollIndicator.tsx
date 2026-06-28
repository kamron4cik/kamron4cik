export default function ScrollIndicator() {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
      <span className="font-display text-xs font-normal tracking-[0.1em] uppercase text-white/50">
        SCROLL DOWN
      </span>
      <div className="w-4 h-4 border-r-2 border-b-2 rotate-45 animate-bounce-scroll" style={{ borderColor: 'rgba(167, 139, 250, 0.5)' }} />
    </div>
  );
}
