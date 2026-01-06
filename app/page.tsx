import Image from "next/image";
import Hero from "./sections/Hero";
import HeroDesktop from "./sections/HeroDesktop";
import SectionContact from "./sections/SectionContact";
import SectionContactDesktop from "./sections/SectionContactDesktop";
import SectionFive from "./sections/SectionFive";
import SectionFiveDesktop from "./sections/SectionFiveDesktop";
import SectionFour from "./sections/SectionFour";
import SectionFourDesktop from "./sections/SectionFourDesktop";
import SectionSeven from "./sections/SectionSeven";
import SectionSevenDesktop from "./sections/SectionSevenDesktop";
import SectionSix from "./sections/SectionSix";
import SectionSixDesktop from "./sections/SectionSixDesktop";
import SectionThree from "./sections/SectionThree";
import SectionThreeDesktop from "./sections/SectionThreeDesktop";
import SectionTwo from "./sections/SectionTwo";
import SectionTwoDesktop from "./sections/SectionTwoDesktop";
import { Images } from "./images";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <HeroDesktop />
      <div className="relative h-0 w-full z-[99] md:hidden">
        <Image
          src={Images.mobile.hero.ball}
          alt="Ball"
          width={136}
          height={126}
          className="
            absolute right-0 top-0 translate-x-1/3 -translate-y-1/2
            -rotate-45
          "
        />
      </div>
      <div className="relative h-0 w-full z-[99] hidden md:block">
        <Image
          src={Images.desktop.hero.circle}
          alt="Ball"
          width={230}
          height={230}
          className="
            absolute left-1/4 -bottom-30
          "
        />
      </div>
      <section id="alineadores">
        <SectionTwo />
        <div className="relative h-0 w-full z-[99] md:hidden">
          <Image
            src={Images.mobile.hero.ball}
            alt="Ball"
            width={136}
            height={126}
            className="
              absolute -left-8 -bottom-4
            "
          />
        </div>
        <SectionTwoDesktop />
        <div className="relative h-0 w-full z-[99] hidden md:block">
          <Image
            src={Images.desktop.hero.circle}
            alt="Ball"
            width={280}
            height={230}
            className="
              absolute -left-30 -bottom-14
            "
          />
        </div>
        <div className="relative h-0 w-full z-[99] hidden md:block">
          <Image
            src={Images.desktop.hero.circle}
            alt="Ball"
            width={200}
            height={200}
            className="
              absolute -right-30 -bottom-22
            "
          />
        </div>
      </section>
      <section id="hacemos">
        <SectionThree />
        <SectionThreeDesktop />
      </section>
      <SectionFour />
      <SectionFourDesktop />
      <SectionFive />
      <SectionFiveDesktop />
      <section id="nosotras">
        <SectionSix />
        <SectionSixDesktop />
      </section>
      <SectionSeven />
      <SectionSevenDesktop />
      <SectionContact />
      <SectionContactDesktop />
    </div>
  );
}
