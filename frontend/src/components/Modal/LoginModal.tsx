import { useState } from "react";
import { X, Play, Music, Zap } from "lucide-react";
import LoginTab from "./LoginSignUpModal/LoginTab";
import SignUpTab from "./LoginSignUpModal/SignUpTab";

const LoginModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;


  const [showLoginTab, setShowLoginTab] = useState<Boolean | null>(true);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
    bg-black/70 backdrop-blur-sm p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col lg:flex-row
      w-full max-w-5xl max-h-[95dvh] lg:max-h-[85dvh]
      overflow-y-auto lg:overflow-hidden
      rounded-2xl bg-surface_1 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close login modal"
          className="absolute right-3 top-3 z-30
        flex h-9 w-9 items-center justify-center
        rounded-full bg-container text-text_label
        transition hover:scale-105 hover:bg-surface_1"
        >
          <X size={20} />
        </button>

        {/* Left Promotional Section */}
        <div
          className="flex w-full flex-col justify-center
        gap-5 bg-container p-5 sm:p-8 lg:w-1/2 lg:p-10"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/streamvibe-logo.png"
              alt="StreamVibe logo"
              className="h-14 w-14 sm:h-16 sm:w-16 object-contain"
            />

            <div>
              <h4 className="text-2xl sm:text-3xl font-bold text-text_primary">
                StreamVibe
              </h4>
              <p className="text-sm sm:text-base text-text_label">
                Video + Audio Stream
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl
            font-extrabold leading-tight text-text_primary"
            >
              Stream.
              <span className="text-purple-500"> Listen.</span>
              <br />
              Enjoy.
            </h1>

            <p className="max-w-md text-sm sm:text-base
          leading-relaxed text-text_label">
              Your ultimate destination for music, movies,
              shows and more. Discover entertainment without limits!
            </p>
          </div>

          {/* Features */}
          <ul className="flex flex-col gap-3 sm:gap-4">
            <li className="flex items-center gap-3 text-sm text-text_label">
              <span
                className="flex h-10 w-10 shrink-0 items-center
              justify-center rounded-xl bg-surface_1 text-purple-500"
              >
                <Play size={19} />
              </span>
              <span>Watch the latest movies and shows</span>
            </li>

            <li className="flex items-center gap-3 text-sm text-text_label">
              <span
                className="flex h-10 w-10 shrink-0 items-center
              justify-center rounded-xl bg-surface_1 text-purple-500"
              >
                <Music size={19} />
              </span>
              <span>Listen to your favorite music</span>
            </li>

            <li className="flex items-center gap-3 text-sm text-text_label">
              <span
                className="flex h-10 w-10 shrink-0 items-center
              justify-center rounded-xl bg-surface_1 text-purple-500"
              >
                <Zap size={19} />
              </span>
              <span>Enjoy seamless streaming experience</span>
            </li>
          </ul>
        </div>

        {/* Right Login Section */}
        <div
          className="flex w-full flex-col justify-center gap-10
        p-4 sm:p-6 lg:w-1/2 lg:p-8"
        >
          <div className="tab flex flex-row items-center">
            <button
              className={`p-2 text-text_primary text-lg w-1/2 border-b-2 ${showLoginTab ? "border-custom_purple" : "text_label"}`}
              onClick={() => { setShowLoginTab(true) }}
            >Login</button>
            <button
              className={`p-2 text-text_primary text-lg w-1/2 border-b-2 ${!showLoginTab ? "border-custom_purple" : "text_label"}`}
              onClick={() => { setShowLoginTab(false) }}
            >Sign Up</button>
          </div>
          {
            showLoginTab ?
              <LoginTab onClose={onClose} setShowLoginTab={setShowLoginTab}/>
              :
              <SignUpTab />
          }
        </div>
      </div>
    </div>
  );

};

export default LoginModal;