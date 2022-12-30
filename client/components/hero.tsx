export default function Hero({ hideText }: { hideText?: boolean }) {
  return (
    <div>
      <div className="bg-[url('/images/hero1.svg')] bg-auto bg-no-repeat bg-center h-96" />
      {!hideText && (
        <>
          <div className="text-3xl mt-2 font-black text-center tracking-tight">
            <h2>Masks on,</h2>
            <h2>Chat as Anonn</h2>
          </div>
          <div className="mt-1 text-center text-base font-light tracking-tight">
            <h3>Nobody would know its you,</h3>
            <h3 className="italic">I promise!</h3>
          </div>
        </>
      )}
    </div>
  );
}
