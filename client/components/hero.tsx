export default function Hero({ hideText }: { hideText?: boolean }) {
  return (
    <div>
      {!hideText && (
        <>
          <div className="mt-2 font-black text-left tracking-tight pl-8 pt-12">
            <h2 className="text-[40px]">Masks on,</h2>
            <h2 className="text-[40px]">Chat as Anonn</h2>
          </div>
          <div className="mt-1 pl-8 text-left text-base font-light tracking-tight">
            <h3>
              Anonn is an anonymous chat app. <br/> Share your link and start chatting
              with friends and<br/> foes, as Anonn of course.
            </h3>
          </div>
        </>
      )}
    </div>
  );
}
