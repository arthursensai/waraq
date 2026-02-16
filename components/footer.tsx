import { ThemeSwitcher } from "./theme-switcher";

const Footer = () => {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-4">
      <p>
        Created by{" "}
        <a
          href="https://www.instagram.com/sensai_arthur/"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          ARTHUR
        </a>
      </p>
      <ThemeSwitcher />
    </footer>
  );
};

export default Footer;